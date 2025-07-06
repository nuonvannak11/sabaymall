import React from "react";
import Header from "@/components/Header";
import Slider from "@/components/Slider";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import { LayoutProps } from "@/types/index";
import { isEmpty } from "lodash";
import LoginFormModal from "@/components/LoginForm";
import {auth} from "@/auth";

export default async function Layout({ sliders, products }: LayoutProps) {
  const session = await auth();
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Header />
      <Slider sliders={sliders} />
      <ProductSection products={products} />
      <Footer />
      {isEmpty(session) && <LoginFormModal />}
    </div>
  );
}
