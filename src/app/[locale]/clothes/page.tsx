import React from "react";
import { productController } from "@/actions/controller/product_controller";
import { sliderController } from "@/actions/controller/slider_controller";
import Layout from "@/components/layout";

export default async function ClothesPage() {
  const products = await productController.getProductByCategory("clothes");
  console.log("Clothes products:", products);
  const sliders = await sliderController.getSliderByCategory("clothes");
  return <Layout products={products} sliders={sliders} />;
}
