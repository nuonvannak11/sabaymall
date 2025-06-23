"use client";

import { useState, useRef, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getThemeFromCookie } from "@/utils/index";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const [theme, setTheme] = useState(getThemeFromCookie());
  const [mounted, setMounted] = useState(false);
  const username = "ter";

  useEffect(() => {
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

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.remove("light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add(newTheme);
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
  };

  return (
    <header className="dark:text-t-text py-6 flex justify-between items-center relative">
      <div className="flex items-center gap-4">
        <Link href="/" className="w-full flex justify-center">
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
        {/* Search Container */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={toggleSearch}
            className={`p-2 rounded-full transition-all duration-300 ${
              isSearchOpen
                ? "bg-brand-red text-white shadow-lg"
                : "text-gray-500 hover:text-brand-red hover:bg-gray-100"
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
                placeholder="Search products..."
                className="w-64 px-4 py-2 pr-12 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-brand-red shadow-lg text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 p-1 text-brand-red hover:text-brand-red-dark transition-colors">
                <i className="fa-solid fa-magnifying-glass text-lg"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Dark/Light Mode Toggle Button */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-[5px] rounded-full border border-gray-300 bg-white dark:bg-b-normal text-gray-600 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all dark:border-sky-100 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_7px_#08f,0_0_7px_#08f]"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }>
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 4.95l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                />
              </svg>
            )}
          </button>
        )}

        {username ? (
          <Link
            href="/profile"
            className="flex items-center ml-2 group rounded-full dark:border-sky-100 dark:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_7px_#08f,0_0_7px_#08f]">
            <Image
              width="30"
              height="30"
              src="/assets/users/images.jpg"
              alt="User Avatar"
              className="w-[32px] h-[32px] rounded-full border border-gray-300 group-hover:border-brand-red transition-all"
            />
          </Link>
        ) : (
          <Link
            href="/login"
            className="ml-2 px-4 py-1 rounded-3xl bg-brand-red text-white font-semibold hover:bg-brand-red-dark transition">
            {t("Login")}
          </Link>
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"></div>
      )}

      {/* Mobile Menu Sidebar */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-xl">Sabay Mall</h2>
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

          <nav className="flex flex-col space-y-4 flex-grow">
            <Link
              href="/"
              className="text-gray-800 hover:text-brand-red font-semibold py-2 border-b border-gray-100">
              {t("Home")}
            </Link>
            <Link
              href="/clothes"
              className="text-gray-500 hover:text-brand-red py-2 border-b border-gray-100">
              {t("Cloths")}
            </Link>
            <Link
              href="/incense"
              className="text-gray-500 hover:text-brand-red py-2 border-b border-gray-100">
              {t("Incense")}
            </Link>
            <Link
              href="/electronics"
              className="text-gray-500 hover:text-brand-red py-2 border-b border-gray-100">
              {t("Electronics")}
            </Link>
            <Link
              href="/contact"
              className="text-gray-500 hover:text-brand-red py-2 border-b border-gray-100">
              {t("Contact")}
            </Link>
          </nav>

          {/* Language Switcher at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
