"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

// Pequena tolerância para o ponteiro atravessar a folga entre o ícone e o
// dropdown sem que ele feche antes de dar tempo de clicar.
const CLOSE_DELAY_MS = 200;

const CartMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelScheduledClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    cancelScheduledClose();
    setIsOpen(true);
  };

  const scheduleClose = () => {
    cancelScheduledClose();
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => cancelScheduledClose, []);

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
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
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
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow-sm">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Dropdown do Carrinho — o pt-2 é uma faixa transparente que "faz ponte"
            sobre a folga até o ícone, mantendo o hover contínuo. */}
        {isOpen && (
          <div className="absolute right-0 top-full z-50 w-96 pt-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              Carrinho ({totalItems})
            </h3>

            {items.length === 0 ? (
              <p className="py-4 text-center text-base text-gray-500 dark:text-gray-400">
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
                          <p className="text-base text-gray-600 dark:text-gray-400">
                            {formatPrice(item.product.price)} x {item.quantity}
                          </p>
                          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
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
                      className="flex-1 rounded-lg border-2 border-gray-300 bg-white py-2 text-center text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Ver Carrinho
                    </Link>
                    <Link
                      href="/cardapio/checkout"
                      className="flex-1 rounded-xl border-2 border-gray-300 bg-white py-2 text-center text-base font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                      Finalizar
                    </Link>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Erro ao usar CartMenu:", error);
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

export default CartMenu;
