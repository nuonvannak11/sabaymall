"use client";

import { useTranslation } from "react-i18next";
import ItemCard from "@/components/ItemCard";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
}

export default function ProductSection({ products }: { products: Product[] }) {
  const { t } = useTranslation();
  if (!products || products.length === 0) {
    return (
      <section className="py-12 md:py-24 text-center">
        <p className="text-gray-500">{t("noProductsFound")}</p>
      </section>
    );
  }
  return (
    <section className="py-12 md:py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {products.map((item) => (
          <ItemCard
            key={item.id}
            name={t(`${item.name}`)}
            category={t(`${item.category}`)}
            price={String(item.price)}
            imageSrc={item.img}
            imageAlt={item.name}
          />
        ))}
      </div>

      <div className="text-center mt-16">
        <a href="#" className="btn btn-primary px-8">
          {t("exploreMore")}
        </a>
      </div>
    </section>
  );
}
