'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProdutoForm } from '@/types/catalogo';
import { produtosTestData, categoriasTestData } from '@/data/catalogoTestData';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = produtosTestData.find(p => p.id === productId);

  const [formData, setFormData] = useState<ProdutoForm>({
    nome: '',
    descricao: '',
    preco: 0,
    categoriaId: '',
    disponivel: true,
    ingredientes: [],
    informacoesNutricionais: {
      calorias: undefined,
      proteinas: undefined,
      carboidratos: undefined,
      gorduras: undefined,
    },
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        categoriaId: product.categoriaId,
        imagem: product.imagem,
        disponivel: product.disponivel,
        ingredientes: product.ingredientes,
        informacoesNutricionais: product.informacoesNutricionais,
      });
      if (product.imagem) {
        setImagePreview(product.imagem);
      }
    }
  }, [product]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Update image preview
    if (name === 'imagem') {
      setImagePreview(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating product:', productId, formData);
    // TODO: Integrate with API
    // After successful update, redirect to view page
    router.push(`/catalogo/produtos/${productId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
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
            Edit Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update product information
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Preview
              </label>
              <div className="w-full h-64 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  name="categoriaId"
                  value={formData.categoriaId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categoriasTestData.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imagem"
                  value={formData.imagem || ''}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="disponivel"
                    checked={formData.disponivel}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available
                  </span>
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ingredients (comma separated)
                </label>
                <textarea
                  name="ingredientes"
                  value={formData.ingredientes?.join(', ') || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      ingredientes: value ? value.split(',').map(i => i.trim()) : []
                    }));
                  }}
                  rows={3}
                  placeholder="Tomato, Cheese, Basil"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nutritional Information
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Calories (kcal)
                    </label>
                    <input
                      type="number"
                      name="calorias"
                      value={formData.informacoesNutricionais?.calorias || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          informacoesNutricionais: {
                            ...prev.informacoesNutricionais,
                            calorias: e.target.value ? Number(e.target.value) : undefined
                          }
                        }));
                      }}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      name="proteinas"
                      value={formData.informacoesNutricionais?.proteinas || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          informacoesNutricionais: {
                            ...prev.informacoesNutricionais,
                            proteinas: e.target.value ? Number(e.target.value) : undefined
                          }
                        }));
                      }}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      name="carboidratos"
                      value={formData.informacoesNutricionais?.carboidratos || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          informacoesNutricionais: {
                            ...prev.informacoesNutricionais,
                            carboidratos: e.target.value ? Number(e.target.value) : undefined
                          }
                        }));
                      }}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      name="gorduras"
                      value={formData.informacoesNutricionais?.gorduras || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          informacoesNutricionais: {
                            ...prev.informacoesNutricionais,
                            gorduras: e.target.value ? Number(e.target.value) : undefined
                          }
                        }));
                      }}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
