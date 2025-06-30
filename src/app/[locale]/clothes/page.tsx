import React from "react";
import { productController } from "@/actions/controller/product_controller";
import { sliderController } from "@/actions/controller/slider_controller";
import Layout from "@/components/layout";

export default async function ClothesPage() {
  const products = productController.getProductByCategory("clothes");
  const sliders = sliderController.getSliderByCategory("clothes");
  await Promise.all([products, sliders]);
  return <Layout products={products} sliders={sliders} />;
}
