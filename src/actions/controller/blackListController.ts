import { promises as fs } from "fs";
import path from "path";
import type { BlacklistIpProps } from "@/types";
import { getNextId } from "@/utils";
import { isDev } from "@/lib/utls";

const path_file = "src/actions/models/black_list_ip.js";
const DATA_FILE = path.resolve(process.cwd(), path_file);
const TMP_FILE = DATA_FILE + ".tmp";
const EXPORT_REGEX = /export\s+const\s+blackListIPs\s*=\s*(\[[\s\S]*?\]);/;

class BlackListStore {
  private list: BlacklistIpProps[] = [];
  private idMap = new Map<number, BlacklistIpProps>();
  private ipMap = new Map<string, Set<BlacklistIpProps>>();
  private saveScheduled = false;
  private saving = false;
  private debounceMs = 500;
  private initialized = false;

  constructor() {
    this.init().catch((err) => {
      if (isDev()) {
        console.error("Failed to initialize blacklist store:", err);
      }
      this.list = [];
    });
  }

  private async init() {
    await this.loadList();
    this.buildIndexes();
    this.initialized = true;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  private async loadList(): Promise<void> {
    let src: string;
    try {
      src = await fs.readFile(DATA_FILE, "utf-8");
    } catch (err: any) {
      if (err.code === "ENOENT") {
        this.list = [];
        return;
      }
      throw err;
    }
    const match = src.match(EXPORT_REGEX);
    if (!match) {
      throw new Error(`Invalid data file format at ${DATA_FILE}`);
    }

    try {
      this.list = JSON.parse(match[1]) as BlacklistIpProps[];
    } catch (jsonErr) {
      if (isDev()) {
        console.warn(`JSON parsing failed, trying eval: ${jsonErr}`);
      }
      try {
        this.list = eval(`(${match[1]})`) as BlacklistIpProps[];
      } catch (evalErr) {
        if (isDev()) {
          console.error(`Failed to parse blacklist data: ${evalErr}`);
        }
        this.list = [];
      }
    }
  }

  private buildIndexes() {
    this.idMap.clear();
    this.ipMap.clear();
    for (const entry of this.list) {
      this.idMap.set(entry.id, entry);
      const bucket = this.ipMap.get(entry.ip) ?? new Set();
      bucket.add(entry);
      this.ipMap.set(entry.ip, bucket);
    }
  }

  private async persist(): Promise<void> {
    if (this.saving) return;
    this.saving = true;
    try {
      const arrayLit = JSON.stringify(this.list, null, 2);
      const contents =
        `// GENERATED—do not edit by hand\n` +
        `export const blackListIPs = ${arrayLit};\n`;
      await fs.writeFile(TMP_FILE, contents, "utf-8");
      await fs.rename(TMP_FILE, DATA_FILE);
    } catch (err) {
    } finally {
      this.saving = false;
    }
  }

  private scheduleSave() {
    if (this.saveScheduled) return;
    this.saveScheduled = true;
    setTimeout(async () => {
      await this.persist();
      this.saveScheduled = false;
    }, this.debounceMs);
  }

  public async getByIpAsync(ip: string): Promise<BlacklistIpProps[]> {
    await this.ensureInitialized();
    return this.ipMap.has(ip) ? Array.from(this.ipMap.get(ip)!) : [];
  }

  public async getAllAsync(): Promise<BlacklistIpProps[]> {
    await this.ensureInitialized();
    return [...this.list];
  }

  public async getByIdAsync(id: number): Promise<BlacklistIpProps | null> {
    await this.ensureInitialized();
    return this.idMap.get(id) || null;
  }

  public async isBlacklistedAsync(ip: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.ipMap.has(ip);
  }

  public async insert(
    data: Omit<BlacklistIpProps, "id" | "createdAt">
  ): Promise<BlacklistIpProps> {
    await this.ensureInitialized();
    const id = getNextId(this.list);
    const entry: BlacklistIpProps = {
      id,
      ip: data.ip,
      reason: data.reason,
      country: data.country ?? "Unknown",
      blocked_requests: data.blocked_requests ?? 0,
      user_agent: data.user_agent ?? "Unknown",
      createdAt: new Date().toISOString(),
    };

    this.list.push(entry);
    this.idMap.set(id, entry);
    const bucket = this.ipMap.get(entry.ip) ?? new Set();
    bucket.add(entry);
    this.ipMap.set(entry.ip, bucket);
    this.scheduleSave();
    return entry;
  }

  public async edit(
    id: number,
    fields: Partial<BlacklistIpProps>
  ): Promise<BlacklistIpProps | null> {
    await this.ensureInitialized();
    const entry = this.idMap.get(id);
    if (!entry) return null;
    if (fields.ip && fields.ip !== entry.ip) {
      this.ipMap.get(entry.ip)?.delete(entry);
      const newBucket = this.ipMap.get(fields.ip) ?? new Set();
      newBucket.add(entry);
      this.ipMap.set(fields.ip, newBucket);
    }

    Object.assign(entry, fields);
    this.scheduleSave();
    return entry;
  }

  public async delete(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const entry = this.idMap.get(id);
    if (!entry) return false;

    this.list = this.list.filter((e) => e.id !== id);
    this.idMap.delete(id);
    const bucket = this.ipMap.get(entry.ip);
    bucket?.delete(entry);
    if (bucket && bucket.size === 0) {
      this.ipMap.delete(entry.ip);
    }

    this.scheduleSave();
    return true;
  }
}

export const blackListController = new BlackListStore();
