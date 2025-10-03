"use client";

import React, { useState, useMemo } from 'react';
import { categoriasTestData } from '@/data/catalogoTestData';
import { Categoria } from '@/types/catalogo';

const CategoriasPage: React.FC = () => {
  const [categorias] = useState<Categoria[]>(categoriasTestData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(categoria => {
      const matchSearch = categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (categoria.descricao && categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = filterStatus === 'all' || 
                         (filterStatus === 'true' && categoria.ativa) ||
                         (filterStatus === 'false' && !categoria.ativa);
      
      return matchSearch && matchStatus;
    });
  }, [categorias, searchTerm, filterStatus]);

  const formatData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(data);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Gerenciar Categorias
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organize os produtos em categorias
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filtro por Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas</option>
              <option value="true">Ativas</option>
              <option value="false">Inativas</option>
            </select>
          </div>

          {/* Botão Nova Categoria */}
          <div className="flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Nova Categoria
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriasFiltradas.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header do Card */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {categoria.nome}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  categoria.ativa
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {categoria.ativa ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                  Editar
                </button>
                <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm">
                  Excluir
                </button>
              </div>
            </div>

            {/* Descrição */}
            {categoria.descricao && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {categoria.descricao}
              </p>
            )}

            {/* Informações adicionais */}
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Criada em:</span>
                <span>{formatData(categoria.dataCriacao)}</span>
              </div>
              <div className="flex justify-between">
                <span>Atualizada em:</span>
                <span>{formatData(categoria.dataAtualizacao)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {categoriasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Nenhuma categoria encontrada com os filtros aplicados.
            </p>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {categorias.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total de Categorias
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {categorias.filter(c => c.ativa).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Categorias Ativas
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriasPage;