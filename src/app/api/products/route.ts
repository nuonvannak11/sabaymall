import { NextRequest, NextResponse } from "next/server";
import { productController } from "@/actions/controller/product_controller";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const category = searchParams.get("category");

  // If an ID is provided, fetch by ID. This is the most specific query.
  if (id) {
    const product = productController.getProductById(parseInt(id, 10));
    if (product) {
      return NextResponse.json({
        code: 1,
        message: "success",
        data: product,
      });
    } else {
      return NextResponse.json(
        { message: `Product with id ${id} not found` },
        { status: 404 }
      );
    }
  }

  // If only a category is provided, use the dedicated function.
  if (category && !name) {
    const products = productController.getProductByCategory(category);
    return NextResponse.json({
      code: 1,
      message: "success",
      data: products,
    });
  }

  // If name is provided (with or without category), use the name filter.
  if (name) {
    const products = productController.getProductByName(name, category || "");
    return NextResponse.json({
      code: 1,
      message: "success",
      data: products,
    });
  }

  // If no parameters are provided, return error.
  return NextResponse.json({
    code: 0,
    message: "missing param",
    data: [],
  });
}
