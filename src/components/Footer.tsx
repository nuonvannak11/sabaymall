"use client";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full py-6 px-2 sm:px-4  dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-800 transition-colors duration-300">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="dark:text-white text-gray-800">{t("Phone Number")}0964423081</span>
          <a
            target="_blank"
            href="#"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 hover:underline w-max h-max no-underline p-0 dark:text-blue-400 text-blue-700"
          >
            <svg
              className="w-4 h-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 2 24 20"
            >
              <path
                fill="#039be5"
                d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z"
              ></path>
            </svg>
            Telegram ({t("Click here")})
          </a>
        </div>
        <span className="block mt-2 md:mt-0 dark:text-gray-300 text-gray-700">
          {t("Copyring")}© 2025, Sabay Mall Shop
        </span>
        <div className="flex items-center gap-2 justify-center md:justify-end mt-2 md:mt-0">
          <span className="dark:text-gray-200 text-gray-700">{t("We accept")}៖</span>
          <img
            alt="Jandt-logo"
            loading="lazy"
            width="40"
            height="15"
            decoding="async"
            className="bg-transparent"
            style={{ color: "transparent" }}
            src="/assets/icon/j&t.png"
          />
          <img
            alt="Jandt-logo"
            loading="lazy"
            width="40"
            height="15"
            decoding="async"
            className="bg-transparent"
            style={{ color: "transparent" }}
            src="/assets/icon/vet.png"
          />
          <img
            alt="Bakong-logo"
            loading="lazy"
            width="40"
            height="23"
            decoding="async"
            style={{ color: "transparent" }}
            src="/assets/icon/bakong.svg"
          />
        </div>
      </div>
    </footer>
  );
}
