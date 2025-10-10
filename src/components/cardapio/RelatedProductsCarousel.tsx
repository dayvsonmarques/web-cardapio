"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/catalog";

interface RelatedProductsCarouselProps {
  products: Product[];
}

const RelatedProductsCarousel = ({ products }: RelatedProductsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  // Auto-slide a cada 3 segundos
  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getVisibleProducts = () => {
    if (products.length === 0) return [];
    
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % products.length;
      visible.push(products[index]);
    }
    return visible;
  };

  const visibleProducts = getVisibleProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500"
        >
          {visibleProducts.map((product) => (
            <Link
              key={product.id}
              href={`/cardapio/produto/${product.id}`}
              className="group relative overflow-hidden rounded-lg border border-stroke bg-white shadow-sm transition-all hover:shadow-md dark:border-stroke-dark dark:bg-gray-dark"
            >
              {/* Badge de Disponibilidade */}
              {!product.isAvailable && (
                <div className="absolute right-3 top-3 z-10 rounded-full bg-red px-3 py-1 text-sm font-medium text-white">
                  Indisponível
                </div>
              )}

              {/* Imagem */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-2 dark:bg-gray-800">
                {!imageErrors[product.id] ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleImageError(product.id)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-3 dark:bg-gray-800">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-600">
                        Imagem não disponível
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-4">
                {/* Nome e Preço */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-dark dark:text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <span className="whitespace-nowrap text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Indicadores */}
      <div className="mt-6 flex justify-center gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsCarousel;
