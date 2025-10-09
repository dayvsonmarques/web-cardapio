"use client";

import { useState, useMemo } from "react";
import CardapioHeader from "@/components/cardapio/CardapioHeader";
import CardapioFooter from "@/components/cardapio/CardapioFooter";
import ProductCard from "@/components/cardapio/ProductCard";
import { categoriesTestData, productsTestData } from "@/data/catalogTestData";

const CardapioPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const activeCategories = categoriesTestData.filter(cat => cat.isActive);

  // Filtrar produtos pela categoria selecionada e busca
  const filteredProducts = useMemo(() => {
    return productsTestData.filter((product) => {
      const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && product.isAvailable;
    });
  }, [selectedCategoryId, searchTerm]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-2 dark:bg-dark">
      {/* Header customizado */}
      <CardapioHeader />

      {/* Conteúdo principal */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 font-['Space_Grotesk'] text-4xl font-bold text-dark dark:text-white md:text-5xl">
              Cardápio
            </h1>
            <p className="text-lg text-body dark:text-gray-5">
              Escolha seus produtos favoritos e adicione ao carrinho
            </p>
          </div>

          {/* Busca */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-gray-dark dark:text-white"
            />
          </div>

          {/* Filtro de Categorias */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategoryId === null
                  ? "bg-primary text-black shadow-md"
                  : "bg-white text-body hover:bg-gray-2 dark:bg-gray-dark dark:text-gray-5 dark:hover:bg-gray-800"
              }`}
            >
              Todos
            </button>
            {activeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategoryId === category.id
                    ? "bg-primary text-black shadow-md"
                    : "bg-white text-body hover:bg-gray-2 dark:bg-gray-dark dark:text-gray-5 dark:hover:bg-gray-800"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

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
                Nenhum produto encontrado.
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
