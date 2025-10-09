"use client";

import { useState, useMemo } from "react";
import CardapioHeader from "@/components/cardapio/CardapioHeader";
import CardapioFooter from "@/components/cardapio/CardapioFooter";
import CategoryFilter from "@/components/cardapio/CategoryFilter";
import ProductCard from "@/components/cardapio/ProductCard";
import { categoriesTestData, productsTestData } from "@/data/catalogTestData";

const CardapioPage = () => {
  // Inicializar com a primeira categoria ativa
  const firstActiveCategory = categoriesTestData.find((cat) => cat.isActive);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    firstActiveCategory?.id || "1",
  );

  // Filtrar produtos pela categoria selecionada
  const filteredProducts = useMemo(() => {
    return productsTestData.filter(
      (product) => product.categoryId === selectedCategoryId,
    );
  }, [selectedCategoryId]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-2 dark:bg-dark">
      {/* Header customizado */}
      <CardapioHeader />

      {/* Conteúdo principal */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 font-['Space_Grotesk'] text-5xl font-bold text-dark dark:text-white md:text-6xl">
              Cardápio
            </h1>
            <p className="text-lg text-body dark:text-gray-5">
              Conheça nossos deliciosos pratos e bebidas
            </p>
          </div>

          {/* Seção Monte seu Pedido */}
          <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
            <div className="grid gap-6 p-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="mb-3 text-3xl font-bold text-dark dark:text-white">
                  Monte seu Pedido
                </h2>
                <p className="mb-6 text-body dark:text-gray-5">
                  Escolha seus produtos favoritos, personalize as quantidades e finalize seu pedido de forma rápida e prática.
                </p>
                <a
                  href="/cardapio/montar"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
                >
                  Montar Pedido
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center">
                  <svg
                    className="h-48 w-48 text-primary/20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filtro de Categorias */}
          <CategoryFilter
            categories={categoriesTestData}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          {/* Grid de Produtos */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-body dark:text-gray-5">
                Nenhum produto encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer customizado */}
      <CardapioFooter />
    </div>
  );
};

export default CardapioPage;
