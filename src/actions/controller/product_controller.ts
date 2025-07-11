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

  private async persist(listSnapshot: ProductProps[]): Promise<void> {
    if (this.saving) return;
    this.saving = true;
    try {
      const arrayLit = JSON.stringify(listSnapshot, null, 2);
      const contents =
        `// GENERATED—do not edit by hand\n` +
        `export const products = ${arrayLit};\n`;
      await fs.writeFile(TMP_FILE, contents, "utf-8");
      await fs.rename(TMP_FILE, DATA_FILE);
    } catch (err: any) {
      if (isDev()) {
        console.error("Failed to persist product store:", err);
      }
    } finally {
      this.saving = false;
    }
  }

  private scheduleSave() {
    if (this.saveScheduled) return;
    this.saveScheduled = true;

    const snapshot = this.list.slice();
    setTimeout(async () => {
      await this.persist(snapshot);
      this.saveScheduled = false;
    }, this.debounceMs);
  }

  private async withFreshList<T>(fn: () => T | Promise<T>): Promise<T> {
    this.initialized = false;
    await this.loadList();
    console.log("Product list reloaded:", this.list.length, "items");
    try {
      return await fn();
    } finally {
      this.list = [];
      this.initialized = false;
    }
  }

  public async getAllAsync(): Promise<ProductProps[]> {
    return this.withFreshList(() => this.list.slice().reverse());
  }

  public async getProductByCategory(category: string): Promise<ProductProps[]> {
    const lowerCat = category.trim().toLowerCase();
    console.log(`Fetching products for category: ${lowerCat}`);
    console.log("Current product list:", this.list);

    return this.withFreshList(() =>
      this.list
        .filter((p) => p.category.trim().toLowerCase() === lowerCat)
        .reverse()
    );
  }

  public async getByIdAsync(id: number): Promise<ProductProps | null> {
    return this.withFreshList(() =>
      Promise.resolve(this.list.find((p) => p.id === id) || null)
    );
  }

  public async searchAsync(
    searchText: string,
    category?: string
  ): Promise<ProductProps[]> {
    if (!searchText) {
      return [];
    }
    const lower = searchText.toLowerCase();
    return this.withFreshList(() => {
      const base = category
        ? this.list.filter((p) => p.category === category)
        : this.list;
      return base.filter((p) => p.name.toLowerCase().includes(lower)).reverse();
    });
  }

  public async insert(
    data: Omit<ProductProps, "id" | "createdAt">
  ): Promise<ProductProps> {
    return this.withFreshList(async () => {
      const id = getNextId(this.list);
      const entry: ProductProps = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
      };
      this.list.push(entry);
      this.scheduleSave();
      return entry;
    });
  }

  public async edit(
    id: number,
    fields: Partial<ProductProps>
  ): Promise<ProductProps | null> {
    return this.withFreshList(async () => {
      const e = this.list.find((p) => p.id === id);
      if (!e) return null;
      Object.assign(e, fields);
      this.scheduleSave();
      return e;
    });
  }

  public async delete(id: number): Promise<boolean> {
    return this.withFreshList(async () => {
      const found = this.list.find((p) => p.id === id);
      if (!found) return false;
      this.list = this.list.filter((p) => p.id !== id);
      this.scheduleSave();
      return true;
    });
  }
}

export const productController = new ProductStore();
