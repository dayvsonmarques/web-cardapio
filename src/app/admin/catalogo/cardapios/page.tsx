"use client";

import React, { useState, useMemo } from 'react';
import { menusTestData, productsTestData } from '@/data/catalogTestData';
import { Menu } from '@/types/catalog';
import { useTranslations } from '@/hooks/useTranslations';

const CardapiosPage: React.FC = () => {
  const { t } = useTranslations();
  const [cardapios] = useState<Menu[]>(menusTestData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const cardapiosFiltrados = useMemo(() => {
    return cardapios.filter(cardapio => {
      const matchSearch = cardapio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cardapio.description && cardapio.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = filterStatus === 'all' || 
                         (filterStatus === 'true' && cardapio.isActive) ||
                         (filterStatus === 'false' && !cardapio.isActive);
      
      return matchSearch && matchStatus;
    });
  }, [cardapios, searchTerm, filterStatus]);

  const formatData = (data: Date | undefined) => {
    if (!data) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR').format(data);
  };

  const getProdutoNome = (produtoId: string) => {
    const produto = productsTestData.find(p => p.id === produtoId);
    return produto ? produto.name : 'Produto não encontrado';
  };

  const isCardapioAtivo = (cardapio: Menu) => {
    if (!cardapio.isActive) return false;
    
    const hoje = new Date();
    const inicio = cardapio.startDate;
    const fim = cardapio.endDate;
    
    if (inicio && hoje < inicio) return false;
    if (fim && hoje > fim) return false;
    
    return true;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('manageMenus')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('viewAndManageMenus')}
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('name')}
            </label>
            <input
              type="text"
              placeholder={t('searchMenus')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtro por Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('status')}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="true">{t('active')}</option>
              <option value="false">{t('inactive')}</option>
            </select>
          </div>

          {/* Botão Novo Cardápio */}
          <div className="flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              {t('addNewMenu')}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Cardápios */}
      <div className="space-y-6">
        {cardapiosFiltrados.map((cardapio) => (
          <div
            key={cardapio.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header do Cardápio */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {cardapio.name}
                    </h3>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      isCardapioAtivo(cardapio)
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {isCardapioAtivo(cardapio) ? t('active') : t('inactive')}
                    </span>
                  </div>
                  {cardapio.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {cardapio.description}
                    </p>
                  )}
                  
                  {/* Informações de data */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Período:</span>
                      <div>{formatData(cardapio.startDate)} - {formatData(cardapio.endDate)}</div>
                    </div>
                    <div>
                      <span className="font-medium">Criado em:</span>
                      <div>{formatData(cardapio.createdAt)}</div>
                    </div>
                    <div>
                      <span className="font-medium">Total de produtos:</span>
                      <div>{cardapio.products.length} itens</div>
                    </div>
                  </div>
                </div>
                
                {/* Ações */}
                <div className="flex space-x-2 ml-4">
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                    {t('edit')}
                  </button>
                  <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium">
                    {t('view')}
                  </button>
                  <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium">
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Produtos do Cardápio */}
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Produtos inclusos:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {cardapio.products.slice(0, 6).map((produtoId) => (
                  <div
                    key={produtoId}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm"
                  >
                    <span className="text-gray-900 dark:text-white">
                      {getProdutoNome(produtoId)}
                    </span>
                  </div>
                ))}
                {cardapio.products.length > 6 && (
                  <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 text-sm text-center text-gray-500 dark:text-gray-400">
                    +{cardapio.products.length - 6} produtos
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {cardapiosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {t('noMenusFound')}
            </p>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {cardapios.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('totalMenus')}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {cardapios.filter(c => isCardapioAtivo(c)).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('active')}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {cardapios.reduce((total, c) => total + c.products.length, 0)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('products')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardapiosPage;