'use client';

import { useState, useMemo } from 'react';
import { Produto, ProdutoForm } from '@/types/catalogo';
import { produtosTestData, categoriasTestData } from '@/data/catalogoTestData';
import Image from 'next/image';

type ModalMode = 'view' | 'create' | 'edit' | 'delete' | null;

export default function ProductsPage() {
  const [products, setProducts] = useState<Produto[]>(produtosTestData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('all');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [formData, setFormData] = useState<ProdutoForm>({
    nome: '',
    descricao: '',
    preco: 0,
    categoriaId: '',
    imagem: '',
    disponivel: true,
    ingredientes: [],
    informacoesNutricionais: {
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0,
    }
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = !filterCategory || product.categoriaId === filterCategory;
      
      const matchAvailable = filterAvailable === 'all' ||
                             (filterAvailable === 'true' && product.disponivel) ||
                             (filterAvailable === 'false' && !product.disponivel);

      return matchSearch && matchCategory && matchAvailable;
    });
  }, [products, searchTerm, filterCategory, filterAvailable]);

  const getCategoryName = (categoryId: string) => {
    const category = categoriasTestData.find(cat => cat.id === categoryId);
    return category?.nome || 'Unknown';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const stats = {
    total: products.length,
    available: products.filter(p => p.disponivel).length,
    unavailable: products.filter(p => !p.disponivel).length,
    avgPrice: products.reduce((sum, p) => sum + p.preco, 0) / products.length
  };

  const openModal = (mode: ModalMode, product?: Produto) => {
    setModalMode(mode);
    if (product) {
      setSelectedProduct(product);
      if (mode === 'edit') {
        setFormData({
          nome: product.nome,
          descricao: product.descricao,
          preco: product.preco,
          categoriaId: product.categoriaId,
          imagem: product.imagem || '',
          disponivel: product.disponivel,
          ingredientes: product.ingredientes || [],
          informacoesNutricionais: product.informacoesNutricionais || {
            calorias: 0,
            proteinas: 0,
            carboidratos: 0,
            gorduras: 0,
          }
        });
      }
    } else {
      setSelectedProduct(null);
      setFormData({
        nome: '',
        descricao: '',
        preco: 0,
        categoriaId: '',
        imagem: '',
        disponivel: true,
        ingredientes: [],
        informacoesNutricionais: {
          calorias: 0,
          proteinas: 0,
          carboidratos: 0,
          gorduras: 0,
        }
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      const newProduct: Produto = {
        ...formData,
        id: String(Date.now()),
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      };
      setProducts(prev => [...prev, newProduct]);
    } else if (modalMode === 'edit' && selectedProduct) {
      setProducts(prev => prev.map(p =>
        p.id === selectedProduct.id
          ? { ...p, ...formData, dataAtualizacao: new Date() }
          : p
      ));
    }
    closeModal();
  };

  const handleDelete = () => {
    if (selectedProduct) {
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      closeModal();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Manage Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all products in the catalog
          </p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 mb-1">Available</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.available}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 mb-1">Unavailable</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.unavailable}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Average Price</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{formatPrice(stats.avgPrice)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categoriasTestData.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Availability
            </label>
            <select
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.imagem ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={product.imagem}
                          alt={product.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.nome}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {product.descricao}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {getCategoryName(product.categoriaId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(product.preco)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.disponivel
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {product.disponivel ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openModal('view', product)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => openModal('edit', product)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => openModal('delete', product)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No products found
            </p>
          </div>
        )}
      </div>

      {/* View Product Modal */}
      {modalMode === 'view' && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Product Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedProduct.imagem && (
                <div className="w-full h-64 relative rounded-lg overflow-hidden">
                  <Image
                    src={selectedProduct.imagem}
                    alt={selectedProduct.nome}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <p className="text-gray-900 dark:text-white">{selectedProduct.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <p className="text-gray-900 dark:text-white">{selectedProduct.descricao}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <p className="text-gray-900 dark:text-white">{formatPrice(selectedProduct.preco)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <p className="text-gray-900 dark:text-white">{getCategoryName(selectedProduct.categoriaId)}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedProduct.disponivel
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {selectedProduct.disponivel ? 'Available' : 'Unavailable'}
                </span>
              </div>
              {selectedProduct.ingredientes && selectedProduct.ingredientes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ingredients
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedProduct.ingredientes.join(', ')}</p>
                </div>
              )}
              {selectedProduct.informacoesNutricionais && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nutritional Information
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-gray-600 dark:text-gray-400">Calories:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedProduct.informacoesNutricionais.calorias} kcal</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-gray-600 dark:text-gray-400">Protein:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedProduct.informacoesNutricionais.proteinas}g</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-gray-600 dark:text-gray-400">Carbs:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedProduct.informacoesNutricionais.carboidratos}g</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-gray-600 dark:text-gray-400">Fat:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedProduct.informacoesNutricionais.gorduras}g</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => openModal('edit', selectedProduct)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Product Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  name="ingredientes"
                  value={formData.ingredientes?.join(', ') || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      ingredientes: value ? value.split(',').map(i => i.trim()) : []
                    }));
                  }}
                  placeholder="Tomato, Cheese, Basil"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nutritional Information
                </label>
                <div className="grid grid-cols-2 gap-3">
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

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'delete' && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Delete Product
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete <strong>{selectedProduct.nome}</strong>?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
