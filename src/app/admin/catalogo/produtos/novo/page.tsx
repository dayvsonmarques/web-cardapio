'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProductFormData } from '@/types/catalog';
import { categoriesTestData } from '@/data/catalogTestData';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
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
    console.log('Creating product:', formData);
    // TODO: Integrate with API
    // After successful creation, redirect to products list
    router.push('/catalogo/produtos');
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
            Add New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details to create a new product
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
                  value={formData.name}
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
                  value={formData.description}
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
                  value={formData.price}
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
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categoriesTestData.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
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
                  value={formData.image || ''}
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
                    checked={formData.isAvailable}
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
                  value={formData.ingredients?.join(', ') || ''}
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
                      value={formData.informacoesNutricionais?.calories || ''}
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
                      value={formData.informacoesNutricionais?.proteins || ''}
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
                      value={formData.informacoesNutricionais?.carbohydrates || ''}
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
                      value={formData.informacoesNutricionais?.fats || ''}
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
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
