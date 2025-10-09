"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/catalog";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product.isAvailable) {
      addItem(product, quantity);
      setQuantity(1);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-stroke bg-white shadow-sm transition-all hover:shadow-md dark:border-stroke-dark dark:bg-gray-dark">
      {/* Badge de Disponibilidade */}
      {!product.isAvailable && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-red px-3 py-1 text-sm font-medium text-white">
          Indisponível
        </div>
      )}

      {/* Imagem */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-2 dark:bg-gray-800">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
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

      {/* Conteúdo Clicável */}
      <Link href={`/cardapio/produto/${product.id}`} className="block">
        <div className="p-4 pb-2">
          {/* Nome e Preço */}
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              {product.name}
            </h3>
            <span className="ml-2 whitespace-nowrap text-lg font-bold text-primary">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {/* Descrição */}
          <p className="mb-3 line-clamp-2 text-sm text-body dark:text-gray-5">
            {product.description}
          </p>

          {/* Ingredientes */}
          {product.ingredients.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-body-secondary dark:text-gray-6">
                Ingredientes:
              </p>
              <p className="line-clamp-1 text-xs text-body dark:text-gray-5">
                {product.ingredients.join(", ")}
              </p>
            </div>
          )}
        </div>
      </Link>

      {/* Controles - Não clicável */}
      <div className="px-4 pb-4">
        {/* Informações Nutricionais */}
        <div className="mb-3 grid grid-cols-3 gap-2 border-t border-stroke pt-3 dark:border-stroke-dark">
          <div className="text-center">
            <p className="text-xs text-body-secondary dark:text-gray-6">
              Calorias
            </p>
            <p className="text-sm font-medium text-dark dark:text-white">
              {product.nutritionalInfo.calories}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-body-secondary dark:text-gray-6">
              Proteínas
            </p>
            <p className="text-sm font-medium text-dark dark:text-white">
              {product.nutritionalInfo.proteins}g
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-body-secondary dark:text-gray-6">
              Fibras
            </p>
            <p className="text-sm font-medium text-dark dark:text-white">
              {product.nutritionalInfo.fiber}g
            </p>
          </div>
        </div>

        {/* Controles de Quantidade e Adicionar */}
        {product.isAvailable && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center rounded-lg border border-stroke dark:border-stroke-dark">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleQuantityChange(Math.max(1, quantity - 1));
                }}
                className="px-3 py-1 text-body hover:bg-gray-2 dark:text-gray-5 dark:hover:bg-gray-800"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  handleQuantityChange(isNaN(val) || val < 1 ? 1 : val > 99 ? 99 : val);
                }}
                className="w-12 border-x border-stroke bg-transparent py-1 text-center dark:border-stroke-dark dark:text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleQuantityChange(Math.min(99, quantity + 1));
                }}
                className="px-3 py-1 text-body hover:bg-gray-2 dark:text-gray-5 dark:hover:bg-gray-800"
              >
                +
              </button>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="flex-1 rounded-xl border-2 border-primary bg-primary px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Adicionar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
