'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { produtosTestData, categoriasTestData } from '@/data/catalogoTestData';

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = produtosTestData.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Product not found</p>
        <button
          onClick={() => router.push('/catalogo/produtos')}
          className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Back to products
        </button>
      </div>
    );
  }

  const getCategoryName = (categoryId: string) => {
    const category = categoriasTestData.find(cat => cat.id === categoryId);
    return category?.nome || 'N/A';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Product Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View product information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/catalogo/produtos/${product.id}/editar`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 space-y-6">
          {/* Image */}
          {product.imagem && (
            <div className="w-full h-96 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <Image
                src={product.imagem}
                alt={product.nome}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Name
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.nome}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Status
              </label>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                product.disponivel
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {product.disponivel ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Description
            </label>
            <p className="text-gray-900 dark:text-white">{product.descricao}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Price
              </label>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(product.preco)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Category
              </label>
              <p className="text-lg text-gray-900 dark:text-white">{getCategoryName(product.categoriaId)}</p>
            </div>
          </div>

          {/* Ingredients */}
          {product.ingredientes && product.ingredientes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Ingredients
              </label>
              <div className="flex flex-wrap gap-2">
                {product.ingredientes.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutritional Information */}
          {product.informacoesNutricionais && (
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Nutritional Information
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Calories</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {product.informacoesNutricionais.calorias}
                    <span className="text-sm font-normal ml-1">kcal</span>
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">Protein</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {product.informacoesNutricionais.proteinas}
                    <span className="text-sm font-normal ml-1">g</span>
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
                    {product.informacoesNutricionais.carboidratos}
                    <span className="text-sm font-normal ml-1">g</span>
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Fat</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
                    {product.informacoesNutricionais.gorduras}
                    <span className="text-sm font-normal ml-1">g</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Created:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {new Date(product.dataCriacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {new Date(product.dataAtualizacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
