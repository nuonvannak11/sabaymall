import { productController } from "@/actions/controller/product_controller";
import type { NextApiRequest, NextApiResponse } from "next";

// Placeholder session check function
function getSession(req: NextApiRequest) {
  return null; // Change this to real session logic
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized: No session" });
  }

  const { id, category } = req.query;
  const productId = id ? parseInt(id as string, 10) : undefined;
  const body = req.body;

  if (req.method === "POST") {
    const newProduct = productController.insertProduct(body);
    res.status(201).json(newProduct);
  } else if (req.method === "PUT") {
    if (productId === undefined) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const updated = productController.editProduct(productId, body, category as string);
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else if (req.method === "DELETE") {
    if (productId === undefined) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const deleted = productController.deleteProduct(productId, category as string);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
