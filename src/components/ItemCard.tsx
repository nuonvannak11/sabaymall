"use client";
import { useTranslation } from "react-i18next";
import { ItemCardProps } from "@/types/index";

export default function ItemCard({
  id,
  name,
  status,
  category,
  price,
  imageSrc,
  imageAlt,
}: ItemCardProps) {
  const { t } = useTranslation();
  return (
    <div className="food-card mb-5 dark:bg-b-normal dark:text-t-text">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-28 h-28 mx-auto rounded-full -mt-12 mb-4 object-cover border-4 border-white"
      />
      <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">{name}</h3>
      <h4 className="text-sm font-bold">{t(status)}</h4>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-red-300 text-xl font-extrabold">{price}$</p>
        <button className="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors">
          +
        </button>
      </div>
    </div>
  );
}
