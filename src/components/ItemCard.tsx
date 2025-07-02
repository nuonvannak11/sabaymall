"use client";
import { useTranslation } from "react-i18next";
import { ItemCardProps } from "@/types/index";

export default function ItemCard({
  id,
  name,
  status,
  category,
  price,
  total,
  imageSrc,
  imageAlt,
}: ItemCardProps) {
  const { t } = useTranslation();
  const addCard = (id: number, category: string) => () => {
    console.log(`Adding item with id: ${id} and category: ${category}`);
  };

  return (
    <div className="food-card mb-5 dark:bg-b-normal dark:text-t-text cursor-pointer">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-28 h-28 mx-auto rounded-full -mt-12 mb-4 object-cover border-4 border-white"
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-red-300 text-xl font-extrabold">{price}$</p>
      </div>
      <div className="flex justify-center items-center mt-4">
        {total > 0 ? (
          <button
            onClick={addCard(id, category)}
            className="inline-flex items-center bg-pink-300 dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-black dark:text-white rounded-full p-1 sm:p-1.5 cursor-pointer shadow-none dark:shadow-glow-dark hover:dark:shadow-glow-dark-hover transition-all duration-300 ease-in-out">
            <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-black dark:bg-white rounded-full">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white dark:text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </span>
            <span className="pl-2 sm:pl-4 pr-2 sm:pr-6 text-sm sm:text-base font-bold tracking-wider">
              {t("Add to cart")}
            </span>
          </button>
        ) : (
          <button
            disabled
            className="inline-flex items-center bg-gray-200 dark:bg-zinc-700 text-gray-400 rounded-full p-1 sm:p-1.5 cursor-not-allowed shadow-none transition-all duration-300 ease-in-out">
            <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-black dark:bg-white rounded-full">
              <svg
                className=" text-white dark:text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.7071 4.69719C19.0976 4.30667 19.7308 4.30667 20.1213 4.69719L28.6066 13.1825C28.9971 13.573 28.9971 14.2062 28.6066 14.5967C28.216 14.9872 27.5829 14.9872 27.1924 14.5967L18.7071 6.1114C18.3166 5.72088 18.3166 5.08771 18.7071 4.69719Z"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M28.7071 4.7068C29.0976 5.09733 29.0976 5.73049 28.7071 6.12102L20.2218 14.6063C19.8313 14.9968 19.1981 14.9968 18.8076 14.6063C18.4171 14.2158 18.4171 13.5826 18.8076 13.1921L27.2929 4.7068C27.6834 4.31628 28.3166 4.31628 28.7071 4.7068Z"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24.3162 15.0513C24.111 14.9829 23.8891 14.9829 23.6838 15.0513L8.86851 19.9889C8.64603 20.063 8.463 20.2102 8.34247 20.3985L4.39805 25.4613C4.1985 25.7175 4.13573 26.0545 4.2297 26.3653C4.32367 26.6761 4.56269 26.922 4.87072 27.0246L8.19325 28.1319L8.19595 36.7634C8.19636 38.0544 9.02257 39.2003 10.2473 39.6085L23.6291 44.0691C23.7475 44.1164 23.8738 44.1406 24.0009 44.1405C24.1293 44.141 24.2569 44.1168 24.3765 44.069L37.7577 39.6086C38.9827 39.2003 39.8089 38.054 39.809 36.7628L39.8096 28.1328L43.1346 27.0246C43.4427 26.922 43.6817 26.6761 43.7757 26.3653C43.8696 26.0545 43.8069 25.7175 43.6073 25.4613L39.6117 20.3327C39.4927 20.176 39.3274 20.0542 39.1315 19.9889L24.3162 15.0513ZM9.54341 22.1112L22.346 26.378L19.6478 29.8413L6.8452 25.5745L9.54341 22.1112ZM24.0025 24.8203L35.6526 20.9376L24 17.0541L12.35 20.9367L24.0025 24.8203ZM10.196 36.7628L10.1935 28.7986L19.686 31.9622C20.088 32.0962 20.5307 31.9623 20.7911 31.6281L23.0003 28.7924L23.0001 41.7513L10.8797 37.7112C10.4715 37.5751 10.1961 37.1931 10.196 36.7628ZM37.8095 28.7993L28.3193 31.9622C27.9174 32.0962 27.4747 31.9623 27.2143 31.6281L25.0013 28.7876L25.0049 41.7514L37.1252 37.7113C37.5336 37.5752 37.809 37.1931 37.809 36.7627L37.8095 28.7993ZM28.3576 29.8413L25.6583 26.3767L38.4609 22.1099L41.1602 25.5745L28.3576 29.8413Z"
                />
              </svg>
            </span>
            <span className="pl-2 sm:pl-4 pr-2 sm:pr-6 text-sm sm:text-base font-bold tracking-wider">
              {t("Out of stock")}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
