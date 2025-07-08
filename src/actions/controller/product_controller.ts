import { promises as fs } from "fs";
import path from "path";
import { ProductProps } from "@/types";
import { getNextId } from "@/utils";
import { isDev } from "@/lib/utls";

const path_file = "src/actions/models/products.js";
const DATA_FILE = path.resolve(process.cwd(), path_file);
const TMP_FILE = DATA_FILE + ".tmp";
const EXPORT_REGEX = /export\s+const\s+products\s*=\s*(\[[\s\S]*?\]);/;

class ProductStore {
  private list: ProductProps[] = [];
  private saveScheduled = false;
  private saving = false;
  private debounceMs = 500;
  private initialized = false;

  constructor() {
    this.init().catch((err) => {
      if (isDev()) {
        console.error("Failed to initialize product store:", err);
      }
      this.list = [];
    });
  }

  private async init() {
    await this.loadList();
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
      this.list = JSON.parse(match[1]) as ProductProps[];
    } catch (jsonErr) {
      if (isDev()) {
        console.warn(`JSON parsing failed, trying eval: ${jsonErr}`);
      }
      try {
        this.list = eval(`(${match[1]})`) as ProductProps[];
      } catch (evalErr) {
        if (isDev()) {
          console.error(`Failed to parse product data: ${evalErr}`);
        }
        this.list = [];
      }
    }
  }

  private async persist(): Promise<void> {
    if (this.saving) return;
    this.saving = true;
    try {
      const arrayLit = JSON.stringify(this.list, null, 2);
      const contents =
        `// GENERATED—do not edit by hand\n` +
        `export const products = ${arrayLit};\n`;
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

  public async getAllAsync(): Promise<ProductProps[]> {
    await this.ensureInitialized();
    return [...this.list];
  }

  public async getProductByCategory(category: string): Promise<ProductProps[]> {
    await this.ensureInitialized();
    return this.list.filter((p) => p.category === category);
  }

  public async getByIdAsync(id: number): Promise<ProductProps | null> {
    await this.ensureInitialized();
    return this.list.find((p) => p.id === id) || null;
  }

  public async insert(
    data: Omit<ProductProps, "id" | "createdAt">
  ): Promise<ProductProps> {
    await this.ensureInitialized();
    const id = getNextId(this.list);
    const entry: ProductProps = {
      id,
      name: data.name,
      category: data.category,
      status: data.status,
      img: data.img,
      price: data.price,
      total: data.total,
      description: data.description,
      createdAt: new Date().toISOString(),
    };
    this.list.push(entry);
    this.scheduleSave();
    return entry;
  }

  public async edit(
    id: number,
    fields: Partial<ProductProps>
  ): Promise<ProductProps | null> {
    await this.ensureInitialized();
    const entry = this.list.find((p) => p.id === id);
    if (!entry) return null;
    Object.assign(entry, fields);
    this.scheduleSave();
    return entry;
  }

  public async delete(id: number): Promise<boolean> {
    await this.ensureInitialized();
    const entry = this.list.find((p) => p.id === id);
    if (!entry) return false;
    this.list = this.list.filter((e) => e.id !== id);
    this.scheduleSave();
    return true;
  }
}

export const productController = new ProductStore();
