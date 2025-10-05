'use client';

import { useState } from 'react';
import { LockIcon, PencilIcon, CheckCircleIcon, PlusIcon } from '@/icons';

interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
  isActive: boolean;
}

interface PermissionModule {
  name: string;
  permissions: Permission[];
}

const permissionsTestData: PermissionModule[] = [
  {
    name: 'Usuários',
    permissions: [
      {
        id: 'users.view',
        module: 'Usuários',
        action: 'Visualizar',
        description: 'Permite visualizar a lista de usuários',
        isActive: true,
      },
      {
        id: 'users.create',
        module: 'Usuários',
        action: 'Criar',
        description: 'Permite criar novos usuários',
        isActive: true,
      },
      {
        id: 'users.edit',
        module: 'Usuários',
        action: 'Editar',
        description: 'Permite editar usuários existentes',
        isActive: true,
      },
      {
        id: 'users.delete',
        module: 'Usuários',
        action: 'Excluir',
        description: 'Permite excluir usuários',
        isActive: true,
      },
    ],
  },
  {
    name: 'Produtos',
    permissions: [
      {
        id: 'products.view',
        module: 'Produtos',
        action: 'Visualizar',
        description: 'Permite visualizar a lista de produtos',
        isActive: true,
      },
      {
        id: 'products.create',
        module: 'Produtos',
        action: 'Criar',
        description: 'Permite criar novos produtos',
        isActive: true,
      },
      {
        id: 'products.edit',
        module: 'Produtos',
        action: 'Editar',
        description: 'Permite editar produtos existentes',
        isActive: true,
      },
      {
        id: 'products.delete',
        module: 'Produtos',
        action: 'Excluir',
        description: 'Permite excluir produtos',
        isActive: true,
      },
    ],
  },
  {
    name: 'Pedidos',
    permissions: [
      {
        id: 'orders.view',
        module: 'Pedidos',
        action: 'Visualizar',
        description: 'Permite visualizar pedidos',
        isActive: true,
      },
      {
        id: 'orders.create',
        module: 'Pedidos',
        action: 'Criar',
        description: 'Permite criar novos pedidos',
        isActive: true,
      },
      {
        id: 'orders.edit',
        module: 'Pedidos',
        action: 'Editar',
        description: 'Permite editar pedidos',
        isActive: true,
      },
      {
        id: 'orders.cancel',
        module: 'Pedidos',
        action: 'Cancelar',
        description: 'Permite cancelar pedidos',
        isActive: true,
      },
    ],
  },
  {
    name: 'Relatórios',
    permissions: [
      {
        id: 'reports.view',
        module: 'Relatórios',
        action: 'Visualizar',
        description: 'Permite visualizar relatórios',
        isActive: true,
      },
      {
        id: 'reports.export',
        module: 'Relatórios',
        action: 'Exportar',
        description: 'Permite exportar relatórios',
        isActive: true,
      },
    ],
  },
  {
    name: 'Configurações',
    permissions: [
      {
        id: 'settings.view',
        module: 'Configurações',
        action: 'Visualizar',
        description: 'Permite visualizar configurações',
        isActive: true,
      },
      {
        id: 'settings.edit',
        module: 'Configurações',
        action: 'Editar',
        description: 'Permite editar configurações do sistema',
        isActive: true,
      },
    ],
  },
];

export default function PermissionsPage() {
  const [modules] = useState<PermissionModule[]>(permissionsTestData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('');

  const allPermissions = modules.flatMap((m) => m.permissions);

  const filteredPermissions = allPermissions.filter((permission) => {
    const matchSearch =
      permission.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = !filterModule || permission.module === filterModule;

    return matchSearch && matchModule;
  });

  const stats = {
    total: allPermissions.length,
    active: allPermissions.filter((p) => p.isActive).length,
    modules: modules.length,
  };

  const moduleNames = modules.map((m) => m.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Permissões de Acesso
          </h1>
          <p className="mt-2 text-body">
            Gerencie as permissões disponíveis no sistema
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Nova Permissão
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <LockIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.total}
              </h4>
              <p className="text-sm text-body">Total de Permissões</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircleIcon className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.active}
              </h4>
              <p className="text-sm text-body">Permissões Ativas</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
              <LockIcon className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.modules}
              </h4>
              <p className="text-sm text-body">Módulos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Ação, descrição ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Módulo
            </label>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            >
              <option value="">Todos os módulos</option>
              {moduleNames.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Permissions by Module */}
      <div className="space-y-6">
        {modules.map((module) => {
          const modulePermissions = filteredPermissions.filter(
            (p) => p.module === module.name
          );

          if (modulePermissions.length === 0) return null;

          return (
            <div
              key={module.name}
              className="rounded-xl border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark"
            >
              <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  {module.name}
                  <span className="ml-2 text-sm font-normal text-body">
                    ({modulePermissions.length}{' '}
                    {modulePermissions.length === 1 ? 'permissão' : 'permissões'})
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-stroke text-left dark:border-dark-3">
                      <th className="px-6 py-3 font-medium text-dark dark:text-white">
                        Código
                      </th>
                      <th className="px-6 py-3 font-medium text-dark dark:text-white">
                        Ação
                      </th>
                      <th className="px-6 py-3 font-medium text-dark dark:text-white">
                        Descrição
                      </th>
                      <th className="px-6 py-3 font-medium text-dark dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-3 font-medium text-dark dark:text-white">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {modulePermissions.map((permission) => (
                      <tr
                        key={permission.id}
                        className="border-b border-stroke last:border-0 dark:border-dark-3"
                      >
                        <td className="px-6 py-4">
                          <code className="rounded bg-gray-2 px-2 py-1 text-xs text-dark dark:bg-dark-3 dark:text-white">
                            {permission.id}
                          </code>
                        </td>
                        <td className="px-6 py-4 font-medium text-dark dark:text-white">
                          {permission.action}
                        </td>
                        <td className="px-6 py-4 text-body">{permission.description}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              permission.isActive
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {permission.isActive ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            title="Editar"
                            className="rounded-lg p-2 hover:bg-gray-2 dark:hover:bg-dark-3"
                          >
                            <PencilIcon className="w-5 h-5 text-body" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="rounded-xl border border-stroke bg-white p-8 text-center shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-body">Nenhuma permissão encontrada</p>
        </div>
      )}
    </div>
  );
}
