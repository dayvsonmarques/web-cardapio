"use client";

import Image from "next/image";
import { Product } from "@/types/catalog";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
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
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4">
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

        {/* Informações Nutricionais */}
        <div className="grid grid-cols-3 gap-2 border-t border-stroke pt-3 dark:border-stroke-dark">
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
      </div>
    </div>
  );
};

export default ProductCard;
