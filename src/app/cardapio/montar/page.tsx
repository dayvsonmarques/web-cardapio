"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { productsTestData, categoriesTestData } from "@/data/catalogTestData";
import { useCart } from "@/context/CartContext";
import CardapioHeader from "@/components/cardapio/CardapioHeader";

const MontarPedidoPage = () => {
  const cart = useCart();
  const { items, addItem, updateQuantity, removeItem, getTotalPrice, getTotalItems } = cart;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  console.log('MontarPedidoPage renderizado, items:', items.length);

  useEffect(() => {
    console.log('Items do carrinho atualizados:', items);
  }, [items]);

  const activeCategories = categoriesTestData.filter(cat => cat.isActive);

  const filteredProducts = useMemo(() => {
    return productsTestData.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && product.isAvailable;
    });
  }, [selectedCategory, searchTerm]);

  const handleQuantityChange = (productId: string, value: number) => {
    if (value >= 0) {
      setQuantities(prev => ({ ...prev, [productId]: value }));
    }
  };

  const handleAddToCart = (productId: string) => {
    const product = productsTestData.find(p => p.id === productId);
    const quantity = quantities[productId] || 1;
    
    if (product && quantity > 0) {
      console.log('Adicionando ao carrinho:', product.name, 'Qtd:', quantity);
      addItem(product, quantity);
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CardapioHeader />
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Monte seu Pedido
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Escolha seus produtos favoritos e adicione ao carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Products Section */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Todos
              </button>
              {activeCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredProducts.map((product) => {
                const quantity = quantities[product.id] || 1;
                const category = categoriesTestData.find(c => c.id === product.categoryId);
                
                return (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {category?.name}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-600">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuantityChange(product.id, Math.max(1, quantity - 1));
                            }}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
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
                              handleQuantityChange(product.id, isNaN(val) || val < 1 ? 1 : val > 99 ? 99 : val);
                            }}
                            className="w-12 border-x border-gray-300 bg-transparent py-1 text-center dark:border-gray-600 dark:text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuantityChange(product.id, Math.min(99, quantity + 1));
                            }}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product.id);
                          }}
                          className="rounded-xl border-2 border-primary bg-primary px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhum produto encontrado
                </p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Carrinho ({getTotalItems()})
              </h2>

              {items.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Seu carrinho está vazio
                </p>
              ) : (
                <>
                  <div className="mb-4 max-h-96 space-y-3 overflow-y-auto">
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatPrice(item.product.price)} x {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="mb-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total:</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <Link
                      href="/cardapio/checkout"
                      className="block w-full rounded-xl border-2 border-primary bg-primary py-3 text-center font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                      Finalizar
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MontarPedidoPage;
