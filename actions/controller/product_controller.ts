import { products } from '@/actions/data/products';

// Helper to generate new unique IDs
function getNextId() {
  return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

export const productController = {
  // Get product by ID, optionally filter by category
  getProductById(id: number, category?: string) {
    let filtered = [...products].reverse(); // Reverse to get newest first
    if (category) {
      filtered = filtered.filter((p: any) => p.category === category);
    }
    return filtered.find((p: any) => p.id === id) || null;
  },

  // Get product by name (case-insensitive), optionally filter by category
  getProductByName(name: string, category?: string) {
    let filtered = [...products].reverse(); // Reverse to get newest first
    if (category) {
      filtered = filtered.filter((p: any) => p.category === category);
    }
    return filtered.filter((p: any) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  },

  // Insert a new product
  insertProduct(product: any) {
    const newProduct = {
      ...product,
      id: getNextId(),
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    return newProduct;
  },

  // Edit a product by ID, optionally filter by category
  editProduct(id: number, updatedFields: any, category?: string) {
    let filtered = products;
    if (category) {
      filtered = filtered.filter((p: any) => p.category === category);
    }
    const index = products.findIndex(
      (p: any) => p.id === id && (!category || p.category === category)
    );
    if (index === -1) return null;
    products[index] = { ...products[index], ...updatedFields };
    return products[index];
  },

  // Delete a product by ID, optionally filter by category
  deleteProduct(id: number, category?: string) {
    const index = products.findIndex(
      (p: any) => p.id === id && (!category || p.category === category)
    );
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  }
};
