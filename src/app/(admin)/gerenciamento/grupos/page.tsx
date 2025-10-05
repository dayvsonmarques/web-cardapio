'use client';

import { useState } from 'react';
import { GroupIcon, PencilIcon, TrashBinIcon, PlusIcon, EyeIcon, UserCircleIcon } from '@/icons';

interface UserGroup {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  createdAt: Date;
}

const groupsTestData: UserGroup[] = [
  {
    id: '1',
    name: 'Administradores',
    description: 'Acesso total ao sistema',
    userCount: 2,
    permissions: ['users.manage', 'products.manage', 'orders.manage', 'settings.manage'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Gerentes',
    description: 'Gerenciamento de produtos e pedidos',
    userCount: 3,
    permissions: ['products.manage', 'orders.manage', 'reports.view'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Operadores',
    description: 'Operação básica do sistema',
    userCount: 8,
    permissions: ['products.view', 'orders.create', 'orders.view'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Garçons',
    description: 'Gerenciamento de pedidos e mesas',
    userCount: 12,
    permissions: ['orders.create', 'orders.view', 'tables.manage'],
    createdAt: new Date('2024-01-20'),
  },
];

export default function GroupsPage() {
  const [groups] = useState<UserGroup[]>(groupsTestData);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: groups.length,
    totalUsers: groups.reduce((sum, g) => sum + g.userCount, 0),
    avgPermissions: Math.round(
      groups.reduce((sum, g) => sum + g.permissions.length, 0) / groups.length
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Grupos de Usuários
          </h1>
          <p className="mt-2 text-body">
            Organize usuários em grupos com permissões específicas
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Novo Grupo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <GroupIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.total}
              </h4>
              <p className="text-sm text-body">Total de Grupos</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
              <UserCircleIcon className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.totalUsers}
              </h4>
              <p className="text-sm text-body">Usuários nos Grupos</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <GroupIcon className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.avgPermissions}
              </h4>
              <p className="text-sm text-body">Média de Permissões</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="max-w-md">
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Buscar Grupo
          </label>
          <input
            type="text"
            placeholder="Nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full rounded-xl border border-stroke bg-white p-8 text-center shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-body">Nenhum grupo encontrado</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <GroupIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark dark:text-white">
                      {group.name}
                    </h3>
                    <p className="text-sm text-body">
                      {group.userCount} {group.userCount === 1 ? 'usuário' : 'usuários'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mb-4 text-sm text-body">{group.description}</p>

              <div className="mb-4">
                <p className="mb-2 text-xs font-medium text-dark dark:text-white">
                  Permissões ({group.permissions.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.permissions.slice(0, 3).map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex rounded-full bg-gray-2 px-2 py-1 text-xs text-body dark:bg-dark-3"
                    >
                      {permission}
                    </span>
                  ))}
                  {group.permissions.length > 3 && (
                    <span className="inline-flex rounded-full bg-gray-2 px-2 py-1 text-xs text-body dark:bg-dark-3">
                      +{group.permissions.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4 text-xs text-body">
                Criado em {group.createdAt.toLocaleDateString('pt-BR')}
              </div>

              <div className="flex items-center gap-2">
                <button
                  title="Visualizar"
                  className="flex-1 rounded-lg border border-stroke px-3 py-2 text-sm font-medium hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-3"
                >
                  <EyeIcon className="mx-auto w-5 h-5" />
                </button>
                <button
                  title="Editar"
                  className="flex-1 rounded-lg border border-stroke px-3 py-2 text-sm font-medium hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-3"
                >
                  <PencilIcon className="mx-auto w-5 h-5" />
                </button>
                <button
                  title="Excluir"
                  className="flex-1 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <TrashBinIcon className="mx-auto w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
