"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ListIcon, CloseIcon } from "@/icons";

const CardapioHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Cardápio", href: "/cardapio" },
    { name: "Área do Cliente", href: "/auth/signin" },
    { name: "Contato", href: "/#contato" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu Button - Left Side */}
          <button
            type="button"
            className="lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <ListIcon className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-12">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-dark transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logo - Right Side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="ml-2 text-xl font-bold text-dark dark:text-white">
                Cardápio
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stroke dark:border-stroke-dark">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-dark transition-colors hover:bg-gray-100 hover:text-primary dark:text-white dark:hover:bg-gray-800 dark:hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default CardapioHeader;
