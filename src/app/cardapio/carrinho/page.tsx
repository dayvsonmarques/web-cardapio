"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CardapioHeader from "@/components/cardapio/CardapioHeader";

const CarrinhoPage = () => {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;
    updateQuantity(productId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CardapioHeader />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Seu carrinho está vazio
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Adicione produtos ao carrinho para continuar comprando.
            </p>
            <Link
              href="/cardapio/montar"
              className="mt-6 inline-block rounded-xl border-2 border-primary bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Explorar Produtos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CardapioHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meu Carrinho
          </h1>
          <button
            onClick={() => {
              if (confirm("Deseja realmente limpar o carrinho?")) {
                clearCart();
              }
            }}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Limpar carrinho
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex gap-4">
                    {/* Imagem */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {item.product.description}
                          </p>
                          <p className="mt-2 text-lg font-bold text-primary">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>

                        {/* Botão Remover */}
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Deseja remover "${item.product.name}" do carrinho?`
                              )
                            ) {
                              removeItem(item.product.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="Remover item"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Controles de Quantidade */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Quantidade:
                          </span>
                          <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-600">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) {
                                  handleUpdateQuantity(item.product.id, val);
                                }
                              }}
                              className="w-16 border-x border-gray-300 bg-transparent py-1 text-center dark:border-gray-600 dark:text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.quantity >= 99}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Subtotal
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Continuar Comprando */}
            <div className="mt-6">
              <Link
                href="/cardapio/montar"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continuar comprando
              </Link>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 border-b border-gray-200 pb-4 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal ({items.length} {items.length === 1 ? "item" : "itens"})
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-primary">{formatPrice(getTotalPrice())}</span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => router.push("/cardapio/checkout")}
                  className="w-full rounded-xl border-2 border-primary bg-primary py-3 text-center font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  Finalizar Pedido
                </button>

                <Link
                  href="/cardapio/montar"
                  className="block w-full rounded-lg border-2 border-gray-300 bg-white py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Adicionar Mais Itens
                </Link>
              </div>

              {/* Informações Adicionais */}
              <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Frete:</strong> Será calculado no checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrinhoPage;
