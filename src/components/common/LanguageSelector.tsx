"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser, type Language } from "@/context/UserContext";
import { useTranslations } from "@/hooks/useTranslations";

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useUser();
  const { t } = useTranslations();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    closeDropdown();
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getCurrentLanguageFlag = () => {
    return language === "pt" ? "🇧🇷" : "🇺🇸";
  };

  // Simplified dropdown without external Dropdown component
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center gap-2 text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 px-3 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        title={t("language")}
      >
        <span className="text-lg">{getCurrentLanguageFlag()}</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="16"
          height="16"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 flex w-[180px] flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50">
          <div className="pb-2 mb-2 border-b border-gray-200 dark:border-gray-800">
            <span className="block px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {t("language")}
            </span>
          </div>

          <button
            onClick={() => handleLanguageChange("pt")}
            className={`flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-sm transition-colors w-full text-left ${
              language === "pt"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            }`}
          >
            <span className="text-lg">🇧🇷</span>
            {t("portuguese")}
            {language === "pt" && (
              <svg
                className="ml-auto w-4 h-4 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <button
            onClick={() => handleLanguageChange("en")}
            className={`flex items-center gap-3 px-3 py-2 font-medium rounded-lg text-sm transition-colors w-full text-left ${
              language === "en"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            }`}
          >
            <span className="text-lg">🇺🇸</span>
            {t("english")}
            {language === "en" && (
              <svg
                className="ml-auto w-4 h-4 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};