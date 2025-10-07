"use client";

import { useState, useMemo } from "react";
import CardapioHeader from "@/components/cardapio/CardapioHeader";
import CardapioFooter from "@/components/cardapio/CardapioFooter";
import CategoryFilter from "@/components/cardapio/CategoryFilter";
import ProductCard from "@/components/cardapio/ProductCard";
import { categoriesTestData, productsTestData } from "@/data/catalogTestData";

const CardapioPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Filtrar produtos pela categoria selecionada
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === null) {
      return productsTestData;
    }
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
