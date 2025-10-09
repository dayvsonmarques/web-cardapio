"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ListIcon, CloseIcon } from "@/icons";
import { useCart } from "@/context/CartContext";

const CartIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  try {
    const cart = useCart();
    const { items, getTotalItems, getTotalPrice } = cart;
    const totalItems = getTotalItems();

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    };

    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link
          href="/cardapio/carrinho"
          className="relative flex items-center justify-center p-2 text-gray-900 transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
          title="Ver Carrinho"
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

        {/* Dropdown do Carrinho */}
        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              Carrinho ({totalItems})
            </h3>

            {items.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Seu carrinho está vazio
              </p>
            ) : (
              <>
                <div className="mb-4 max-h-80 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatPrice(item.product.price)} x {item.quantity}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="mb-3 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/cardapio/carrinho"
                      className="flex-1 rounded-lg border-2 border-gray-300 bg-white py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Ver Carrinho
                    </Link>
                    <Link
                      href="/cardapio/checkout"
                      className="flex-1 rounded-xl border-2 border-primary bg-primary py-2 text-center text-sm font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                      Finalizar
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Erro ao usar CartIcon:', error);
    return (
      <div className="relative">
        <Link
          href="/cardapio"
          className="relative flex items-center justify-center p-2 text-gray-900 transition-colors hover:text-primary dark:text-white dark:hover:text-primary"
          title="Cardápio"
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
      </div>
    );
  }
};

const CardapioHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Cardápio", href: "/cardapio" },
    { name: "Área do Cliente", href: "/cardapio/area-cliente" },
    { name: "Contato", href: "/#contato" },
  ];

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
              href="/cardapio"
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
