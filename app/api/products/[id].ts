import { productController } from "@/actions/controller/product_controller";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, category },
    method,
  } = req;

  const productId = parseInt(id as string, 10);

  if (method === "GET") {
    const product = productController.getProductById(productId, category as string);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
