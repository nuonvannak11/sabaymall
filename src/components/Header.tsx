"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import _ from "lodash";

const LanguageSwitcher = dynamic(
  () => import("@/components/button/LanguageSwitcher"),
  {
    ssr: false,
  }
);
const Theme = dynamic(() => import("@/components/button/Theme"), {
  ssr: false,
});

interface HeaderProps {
  action?: () => void;
}

export default function Header({ action }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  return (
    <header className="dark:text-t-text py-6 flex justify-between items-center relative">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="dark:text-pink-400 w-full flex justify-center">
          <h1 className="font-bold">Sabay Mall</h1>
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className="text-gray-800 hover:text-brand-red font-semibold">
          {t("Home")}
        </Link>
        <Link href="/clothes" className="text-gray-500 hover:text-brand-red">
          {t("Cloths")}
        </Link>
        <Link href="/incense" className="text-gray-500 hover:text-brand-red">
          {t("Incense")}
        </Link>
        <Link
          href="/electronics"
          className="text-gray-500 hover:text-brand-red">
          {t("Electronics")}
        </Link>
        <Link href="/contact" className="text-gray-500 hover:text-brand-red">
          {t("Contact")}
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={searchRef}>
          <button
            onClick={toggleSearch}
            className={`p-2 rounded-full transition-all duration-300 ${
              isSearchOpen
                ? " text-white"
                : "text-gray-500 hover:text-brand-red"
            }`}>
            <i className="dark:text-white fa-solid fa-magnifying-glass text-xl"></i>
          </button>
          <div
            className={`absolute right-0 top-0 transition-all duration-300 ease-in-out ${
              isSearchOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4 pointer-events-none"
            }`}>
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Search products...")}
                className="dark:bg-b-normal dark:border-sky-100 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_7px_#08f,0_0_7px_#08f] w-48 sm:w-64 px-4 py-2 pr-12 bg-white border border-gray-200 rounded-full focus:outline-none shadow-lg text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 p-1 text-brand-red hover:text-brand-red-dark transition-colors">
                <i className="mt-[8px] fa-solid fa-magnifying-glass text-lg"></i>
              </button>
            </form>
          </div>
        </div>
        <div className="flex items-center justify-center flex-row">
          <Theme />
        </div>
        {user && !_.isEmpty(user) ? (
          <Link
            href="/center"
            className="flex items-center ml-2 group rounded-full dark:border-sky-100 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_7px_#08f,0_0_7px_#08f]">
            <Image
              width="30"
              height="30"
              src={
                user?.image && user.image !== "null"
                  ? `/assets/users/${user.image}`
                  : "/assets/users/images.jpg"
              }
              alt="User Avatar"
              className="w-[32px] h-[32px] rounded-full border border-gray-300 group-hover:border-brand-red transition-all"
            />
          </Link>
        ) : (
          <button
            className="ml-2 px-4 py-1 rounded-3xl bg-brand-red text-white font-semibold hover:bg-brand-red-dark transition"
            onClick={() => action?.()}>
            {t("Login")}
          </button>
        )}
        {/* Mobile Menu Button */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="bg-white dark:bg-b-normal p-[5px] rounded-full shadow-sm md:hidden z-50 dark:border-sky-100 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_7px_#08f,0_0_7px_#08f]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-menu">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>
      )}
      <div
        ref={menuRef}
        className={`dark:bg-b-bg fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="dark:text-pink-400 font-bold text-xl">Sabay Mall</h2>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="dark:text-white text-gray-500 flex flex-col space-y-4 flex-grow">
            <Link
              href="/"
              className="dark:border-none hover:text-brand-red font-semibold py-2 border-b border-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-house w-5 h-5"></i>
              {t("Home")}
            </Link>
            <Link
              href="/clothes"
              className="dark:border-none hover:text-brand-red py-2 border-b border-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-shirt w-5 h-5"></i>
              {t("Cloths")}
            </Link>
            <Link
              href="/incense"
              className="dark:border-none hover:text-brand-red py-2 border-b border-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-fire w-5 h-5"></i>
              {t("Incense")}
            </Link>
            <Link
              href="/electronics"
              className="dark:border-none hover:text-brand-red py-2 border-b border-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-tv w-5 h-5"></i>
              {t("Electronics")}
            </Link>
            <Link
              href="/contact"
              className="dark:border-none hover:text-brand-red py-2 border-b border-gray-100 flex items-center gap-2">
              <i className="fa-solid fa-envelope w-5 h-5"></i>
              {t("Contact")}
            </Link>
          </nav>
          <div className="mt-auto pt-4 border-t border-gray-100">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
