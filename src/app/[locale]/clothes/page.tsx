import React from 'react';
import { productController } from '@/actions/controller/product_controller';
import { sliderController } from '@/actions/controller/slider_controller';
import Header from '@/components/Header';
import Slider from '@/components/Slider';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';

export default async function ClothesPage() {
  const products =  productController.getProductByCategory('clothes');
  const sliders =  sliderController.getSliderByCategory('clothes');
  await Promise.all([products, sliders]);

  return (
    <div className="container mx-auto px-4 sm:px-1 lg:px-2 dark:bg-b-bg">
      <Header />
      <Slider sliders={sliders} />
      <ProductSection products={products} />
      <Footer />
    </div>
  )
}
