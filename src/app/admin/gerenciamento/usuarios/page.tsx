'use client';

import { useState } from 'react';
import { UserCircleIcon, PencilIcon, TrashBinIcon, PlusIcon, EyeIcon } from '@/icons';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const usersTestData: User[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@cardapio.com',
    role: 'Administrador',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao.silva@cardapio.com',
    role: 'Gerente',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria.santos@cardapio.com',
    role: 'Operador',
    status: 'active',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    name: 'Pedro Costa',
    email: 'pedro.costa@cardapio.com',
    role: 'Operador',
    status: 'inactive',
    createdAt: new Date('2024-02-10'),
  },
];

export default function UsersPage() {
  const [users] = useState<User[]>(usersTestData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !filterRole || user.role === filterRole;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.status === 'active') ||
      (filterStatus === 'inactive' && user.status === 'inactive');

    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
  };

  const roles = Array.from(new Set(users.map((u) => u.role)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Gerenciamento de Usuários
          </h1>
          <p className="mt-2 text-body">
            Gerencie os usuários e suas permissões no sistema
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <UserCircleIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.total}
              </h4>
              <p className="text-sm text-body">Total de Usuários</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <UserCircleIcon className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.active}
              </h4>
              <p className="text-sm text-body">Usuários Ativos</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <UserCircleIcon className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.inactive}
              </h4>
              <p className="text-sm text-body">Usuários Inativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Função
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            >
              <option value="">Todas as funções</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke text-left dark:border-dark-3">
                <th className="px-6 py-4 font-semibold text-dark dark:text-white">
                  Usuário
                </th>
                <th className="px-6 py-4 font-semibold text-dark dark:text-white">
                  Email
                </th>
                <th className="px-6 py-4 font-semibold text-dark dark:text-white">
                  Função
                </th>
                <th className="px-6 py-4 font-semibold text-dark dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-dark dark:text-white">
                  Data de Criação
                </th>
                <th className="px-6 py-4 font-semibold text-dark dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-body">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-stroke last:border-0 dark:border-dark-3"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <UserCircleIcon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-medium text-dark dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body">
                      {user.createdAt.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          title="Visualizar"
                          className="rounded-lg p-2 hover:bg-gray-2 dark:hover:bg-dark-3"
                        >
                          <EyeIcon className="w-5 h-5 text-body" />
                        </button>
                        <button
                          title="Editar"
                          className="rounded-lg p-2 hover:bg-gray-2 dark:hover:bg-dark-3"
                        >
                          <PencilIcon className="w-5 h-5 text-body" />
                        </button>
                        <button
                          title="Excluir"
                          className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <TrashBinIcon className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
