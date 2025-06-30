"use client";

import React from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Slider from "@/components/Slider";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import { LayoutProps } from "@/types/index";

const LoginFormModal = dynamic(() => import("@/components/LoginForm"), {
  ssr: false,
});

export default function Layout({ sliders, products }: LayoutProps) {
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Header action={() => setLoginModalOpen(true)} />
      <Slider sliders={sliders} />
      <ProductSection products={products} />
      <Footer />
      <LoginFormModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
