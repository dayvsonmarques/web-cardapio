"use client";

import { useState } from "react";
import { Product } from "@/types/catalog";

interface ProductInfoTabsProps {
  product: Product;
}

const ProductInfoTabs = ({ product }: ProductInfoTabsProps) => {
  const [activeTab, setActiveTab] = useState<"ingredients" | "nutritional" | "additional">("ingredients");

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stroke dark:border-stroke-dark">
        <button
          onClick={() => setActiveTab("ingredients")}
          className={`relative px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === "ingredients"
              ? "text-primary"
              : "text-body hover:text-dark dark:text-gray-5 dark:hover:text-white"
          }`}
        >
          Ingredientes
          {activeTab === "ingredients" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("nutritional")}
          className={`relative px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === "nutritional"
              ? "text-primary"
              : "text-body hover:text-dark dark:text-gray-5 dark:hover:text-white"
          }`}
        >
          Informações Nutricionais
          {activeTab === "nutritional" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("additional")}
          className={`relative px-6 py-3 text-sm font-semibold transition-all ${
            activeTab === "additional"
              ? "text-primary"
              : "text-body hover:text-dark dark:text-gray-5 dark:hover:text-white"
          }`}
        >
          Informações Adicionais
          {activeTab === "additional" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Ingredientes Tab */}
        {activeTab === "ingredients" && product.ingredients.length > 0 && (
          <div className="rounded-xl border border-stroke bg-white p-6 dark:border-stroke-dark dark:bg-gray-dark">
            <h3 className="mb-4 flex items-center text-xl font-semibold text-dark dark:text-white">
              <svg
                className="mr-2 h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Ingredientes
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {product.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center rounded-lg bg-gray-2 p-3 text-body dark:bg-gray-800 dark:text-gray-5"
                >
                  <svg
                    className="mr-3 h-5 w-5 flex-shrink-0 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Informações Nutricionais Tab */}
        {activeTab === "nutritional" && (
          <div className="rounded-xl border border-stroke bg-white p-6 dark:border-stroke-dark dark:bg-gray-dark">
            <h3 className="mb-4 flex items-center text-xl font-semibold text-dark dark:text-white">
              <svg
                className="mr-2 h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Informações Nutricionais
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-lg bg-gray-2 p-4 text-center dark:bg-gray-800">
                <p className="mb-1 text-3xl font-bold text-primary">
                  {product.nutritionalInfo.calories}
                </p>
                <p className="text-sm font-medium text-body-secondary dark:text-gray-6">
                  Calorias
                </p>
                <p className="mt-1 text-xs text-body-secondary dark:text-gray-6">
                  kcal
                </p>
              </div>
              <div className="rounded-lg bg-gray-2 p-4 text-center dark:bg-gray-800">
                <p className="mb-1 text-3xl font-bold text-primary">
                  {product.nutritionalInfo.proteins}
                </p>
                <p className="text-sm font-medium text-body-secondary dark:text-gray-6">
                  Proteínas
                </p>
                <p className="mt-1 text-xs text-body-secondary dark:text-gray-6">
                  gramas
                </p>
              </div>
              <div className="rounded-lg bg-gray-2 p-4 text-center dark:bg-gray-800">
                <p className="mb-1 text-3xl font-bold text-primary">
                  {product.nutritionalInfo.carbohydrates}
                </p>
                <p className="text-sm font-medium text-body-secondary dark:text-gray-6">
                  Carboidratos
                </p>
                <p className="mt-1 text-xs text-body-secondary dark:text-gray-6">
                  gramas
                </p>
              </div>
              <div className="rounded-lg bg-gray-2 p-4 text-center dark:bg-gray-800">
                <p className="mb-1 text-3xl font-bold text-primary">
                  {product.nutritionalInfo.fats}
                </p>
                <p className="text-sm font-medium text-body-secondary dark:text-gray-6">
                  Gorduras
                </p>
                <p className="mt-1 text-xs text-body-secondary dark:text-gray-6">
                  gramas
                </p>
              </div>
              <div className="rounded-lg bg-gray-2 p-4 text-center dark:bg-gray-800">
                <p className="mb-1 text-3xl font-bold text-primary">
                  {product.nutritionalInfo.fiber}
                </p>
                <p className="text-sm font-medium text-body-secondary dark:text-gray-6">
                  Fibras
                </p>
                <p className="mt-1 text-xs text-body-secondary dark:text-gray-6">
                  gramas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informações Adicionais Tab */}
        {activeTab === "additional" && (
          <div className="rounded-xl border border-stroke bg-white p-6 dark:border-stroke-dark dark:bg-gray-dark">
            <h3 className="mb-4 flex items-center text-xl font-semibold text-dark dark:text-white">
              <svg
                className="mr-2 h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Informações Adicionais
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <svg
                  className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-dark dark:text-white">Disponibilidade</p>
                  <p className="text-sm text-body dark:text-gray-5">
                    {product.isAvailable ? "Produto disponível no momento" : "Produto indisponível"}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <svg
                  className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-dark dark:text-white">Pedidos</p>
                  <p className="text-sm text-body dark:text-gray-5">
                    Adicione ao carrinho e finalize seu pedido
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <svg
                  className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-dark dark:text-white">Código do Produto</p>
                  <p className="text-sm text-body dark:text-gray-5">
                    #{product.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfoTabs;
