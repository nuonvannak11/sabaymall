"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";

const languages = [
  { code: "en", name: "EN", flag: "/assets/flage/en.png" },
  { code: "kh", name: "KH", flag: "/assets/flage/kh.png" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = i18n.language;

  // Check available space and set dropdown position
  const checkPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const dropdownHeight = 80; // Approximate dropdown height

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check position when opening dropdown
  const handleToggle = () => {
    if (!isOpen) {
      checkPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleChangeLanguage = (lang: string) => {
    if (lang === currentLocale) return;
    i18n.changeLanguage(lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;
    const segments = pathname.split("/");
    segments[1] = lang;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Language Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center justify-center w-12 h-10 rounded-lg border-2 border-gray-300 bg-white text-gray-600 hover:border-brand-red hover:text-brand-red transition-all duration-200"
        title={currentLanguage.code === "en" ? "English" : "ខ្មែរ"}>
        <Image
          src={currentLanguage.flag}
          alt={`${currentLanguage.name} flag`}
          width={16}
          height={12}
          className="mr-1"
        />
        <span className="text-sm font-semibold">{currentLanguage.name}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[120px] ${
            dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`flex items-center w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                currentLocale === lang.code
                  ? "bg-brand-red text-white pointer-events-none"
                  : "text-gray-600"
              } ${lang.code === languages[0].code ? "rounded-t-lg" : ""} ${
                lang.code === languages[languages.length - 1].code
                  ? "rounded-b-lg"
                  : ""
              }`}
              disabled={currentLocale === lang.code}>
              <Image
                src={lang.flag}
                alt={`${lang.name} flag`}
                width={16}
                height={12}
                className="mr-2"
              />
              <span className="text-sm font-semibold">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
