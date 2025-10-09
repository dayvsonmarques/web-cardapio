"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CardapioHeader from "@/components/cardapio/CardapioHeader";
import CardapioFooter from "@/components/cardapio/CardapioFooter";
import ProductCard from "@/components/cardapio/ProductCard";
import { productsTestData, categoriesTestData } from "@/data/catalogTestData";
import { useCart } from "@/context/CartContext";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  
  const productId = params.id as string;
  const product = productsTestData.find(p => p.id === productId);
  
  // Produtos relacionados da mesma categoria
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return productsTestData
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id && p.isAvailable)
      .slice(0, 4);
  }, [product]);
  
  const category = product ? categoriesTestData.find(c => c.id === product.categoryId) : null;

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product && product.isAvailable) {
      addItem(product, quantity);
      setQuantity(1);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-2 dark:bg-dark">
        <CardapioHeader />
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Produto não encontrado
          </h1>
          <p className="mt-4 text-body dark:text-gray-5">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Link
            href="/cardapio"
            className="mt-6 inline-block rounded-xl border-2 border-primary bg-primary px-6 py-3 font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Voltar para o Cardápio
          </Link>
        </div>
        <CardapioFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-2 dark:bg-dark">
      <CardapioHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center space-x-2 text-sm">
            <Link 
              href="/cardapio" 
              className="text-body hover:text-primary dark:text-gray-5 dark:hover:text-primary"
            >
              Cardápio
            </Link>
            <span className="text-body dark:text-gray-5">/</span>
            {category && (
              <>
                <span className="text-body dark:text-gray-5">{category.name}</span>
                <span className="text-body dark:text-gray-5">/</span>
              </>
            )}
            <span className="text-dark dark:text-white">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-3 dark:bg-gray-800">
              {!imageError ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600"
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
                    <p className="mt-4 text-body dark:text-gray-5">
                      Imagem não disponível
                    </p>
                  </div>
                </div>
              )}
              
              {!product.isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-full bg-red px-6 py-2 text-lg font-bold text-white">
                    Indisponível
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category Badge */}
              {category && (
                <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary dark:bg-primary/20">
                  {category.name}
                </span>
              )}

              {/* Title and Price */}
              <h1 className="mb-4 text-4xl font-bold text-dark dark:text-white">
                {product.name}
              </h1>
              <p className="mb-6 text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>

              {/* Description */}
              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                  Descrição
                </h2>
                <p className="text-body dark:text-gray-5">
                  {product.description}
                </p>
              </div>

              {/* Ingredients */}
              {product.ingredients.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                    Ingredientes
                  </h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <li 
                        key={index}
                        className="flex items-center text-sm text-body dark:text-gray-5"
                      >
                        <svg 
                          className="mr-2 h-4 w-4 text-primary" 
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

              {/* Nutritional Info */}
              <div className="mb-8 rounded-xl border border-stroke bg-white p-6 dark:border-stroke-dark dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
                  Informações Nutricionais
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {product.nutritionalInfo.calories}
                    </p>
                    <p className="text-xs text-body-secondary dark:text-gray-6">
                      Calorias
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {product.nutritionalInfo.proteins}g
                    </p>
                    <p className="text-xs text-body-secondary dark:text-gray-6">
                      Proteínas
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {product.nutritionalInfo.carbohydrates}g
                    </p>
                    <p className="text-xs text-body-secondary dark:text-gray-6">
                      Carboidratos
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {product.nutritionalInfo.fats}g
                    </p>
                    <p className="text-xs text-body-secondary dark:text-gray-6">
                      Gorduras
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {product.nutritionalInfo.fiber}g
                    </p>
                    <p className="text-xs text-body-secondary dark:text-gray-6">
                      Fibras
                    </p>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              {product.isAvailable && (
                <div className="mt-auto">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-sm font-medium text-dark dark:text-white">
                      Quantidade:
                    </span>
                    <div className="flex items-center rounded-lg border border-stroke dark:border-stroke-dark">
                      <button
                        onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-body hover:bg-gray-2 dark:text-gray-5 dark:hover:bg-gray-800"
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
                        className="w-16 border-x border-stroke bg-transparent py-2 text-center dark:border-stroke-dark dark:text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => handleQuantityChange(Math.min(99, quantity + 1))}
                        className="px-4 py-2 text-body hover:bg-gray-2 dark:text-gray-5 dark:hover:bg-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 rounded-xl border-2 border-primary bg-primary px-6 py-4 text-lg font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                      Adicionar ao Carrinho
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart();
                        router.push("/cardapio/carrinho");
                      }}
                      className="rounded-xl border-2 border-primary bg-transparent px-6 py-4 text-lg font-semibold text-primary transition-all hover:bg-primary/10"
                    >
                      Comprar Agora
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                Produtos Relacionados
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <CardapioFooter />
    </div>
  );
};

export default ProductDetailPage;
