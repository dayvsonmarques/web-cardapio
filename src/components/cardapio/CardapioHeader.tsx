"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ListIcon, CloseIcon } from "@/icons";
import { useCart } from "@/context/CartContext";

const CartIcon = () => {
  console.log('CartIcon: Iniciando render');
  
  try {
    const cart = useCart();
    console.log('CartIcon: useCart retornou:', cart);
    
    const totalItems = cart.getTotalItems();
    console.log('CartIcon: totalItems =', totalItems);

    return (
      <Link
        href="/cardapio/montar"
        className="relative flex items-center justify-center p-2 text-gray-900 transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
        title="Montar Pedido"
      >
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm">
            {totalItems}
          </span>
        )}
      </Link>
    );
  } catch (error) {
    console.error('Erro ao usar CartIcon:', error);
    return (
      <Link
        href="/cardapio/montar"
        className="relative flex items-center justify-center p-2 text-gray-900 transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
        title="Montar Pedido"
      >
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </Link>
    );
  }
};

const CardapioHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Cardápio", href: "/cardapio" },
    { name: "Área do Cliente", href: "/auth/signin" },
    { name: "Contato", href: "/#contato" },
  ];

  console.log('CardapioHeader renderizando');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Left Side */}
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

          {/* Desktop Navigation - Right Side */}
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex lg:gap-x-8">
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

            {/* Cart Icon - Always Visible */}
            <CartIcon />

            {/* Mobile Menu Button */}
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
            <Link
              href="/cardapio/montar"
              className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-base font-medium text-white hover:bg-primary/90"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Montar Pedido
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default CardapioHeader;
