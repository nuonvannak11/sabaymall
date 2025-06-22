import { productController } from "@/actions/controller/product_controller";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { category, name } = req.query;
    let data;
    if (name) {
      data = productController.getProductByName(name as string, category as string);
    } else {
      data = category
        ? productController.getProductByName("", category as string)
        : [...productController.getProductByName("")];
    }
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
