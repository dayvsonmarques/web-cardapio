'use client';

import { useState } from 'react';
import { CalenderIcon, PencilIcon, TrashBinIcon, PlusIcon, EyeIcon } from '@/icons';
import { usePageTitle } from '@/hooks/usePageTitle';

interface Reserva {
  id: string;
  mesa: string;
  cliente: string;
  telefone: string;
  dataInicio: string;
  horaInicio: string;
  dataFim: string;
  horaFim: string;
  valor: number;
  pessoas: number;
  status: 'Confirmada' | 'Pendente' | 'Cancelada' | 'Concluída';
  observacoes?: string;
  criadaEm: string;
}

const reservasTestData: Reserva[] = [
  {
    id: '1',
    mesa: 'Mesa 05',
    cliente: 'João Silva',
    telefone: '(11) 98765-4321',
    dataInicio: '2025-10-10',
    horaInicio: '19:00',
    dataFim: '2025-10-10',
    horaFim: '21:00',
    valor: 150.00,
    pessoas: 4,
    status: 'Confirmada',
    observacoes: 'Aniversário - solicita decoração especial',
    criadaEm: '2025-10-05',
  },
  {
    id: '2',
    mesa: 'Mesa 12',
    cliente: 'Maria Santos',
    telefone: '(11) 97654-3210',
    dataInicio: '2025-10-12',
    horaInicio: '20:00',
    dataFim: '2025-10-12',
    horaFim: '22:30',
    valor: 200.00,
    pessoas: 6,
    status: 'Pendente',
    observacoes: 'Jantar de negócios',
    criadaEm: '2025-10-05',
  },
  {
    id: '3',
    mesa: 'Mesa 08',
    cliente: 'Pedro Costa',
    telefone: '(11) 96543-2109',
    dataInicio: '2025-10-15',
    horaInicio: '18:30',
    dataFim: '2025-10-15',
    horaFim: '20:00',
    valor: 100.00,
    pessoas: 2,
    status: 'Confirmada',
    criadaEm: '2025-10-04',
  },
  {
    id: '4',
    mesa: 'Mesa 03',
    cliente: 'Ana Oliveira',
    telefone: '(11) 95432-1098',
    dataInicio: '2025-10-08',
    horaInicio: '19:30',
    dataFim: '2025-10-08',
    horaFim: '21:30',
    valor: 180.00,
    pessoas: 5,
    status: 'Concluída',
    criadaEm: '2025-10-01',
  },
  {
    id: '5',
    mesa: 'Mesa 20',
    cliente: 'Carlos Ferreira',
    telefone: '(11) 94321-0987',
    dataInicio: '2025-10-06',
    horaInicio: '20:00',
    dataFim: '2025-10-06',
    horaFim: '22:00',
    valor: 120.00,
    pessoas: 3,
    status: 'Cancelada',
    observacoes: 'Cliente cancelou por motivos pessoais',
    criadaEm: '2025-10-03',
  },
  {
    id: '6',
    mesa: 'Mesa 15',
    cliente: 'Beatriz Lima',
    telefone: '(11) 93210-9876',
    dataInicio: '2025-10-20',
    horaInicio: '19:00',
    dataFim: '2025-10-20',
    horaFim: '21:30',
    valor: 250.00,
    pessoas: 8,
    status: 'Confirmada',
    observacoes: 'Comemoração de formatura',
    criadaEm: '2025-10-05',
  },
];

export default function ReservasPage() {
  usePageTitle('Reservas');
  
  const [reservas] = useState<Reserva[]>(reservasTestData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterData, setFilterData] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredReservas = reservas.filter((reserva) => {
    const matchSearch =
      reserva.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.mesa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.telefone.includes(searchTerm);
    const matchStatus = !filterStatus || reserva.status === filterStatus;
    const matchData = !filterData || reserva.dataInicio === filterData;

    return matchSearch && matchStatus && matchData;
  });

  const stats = {
    total: reservas.length,
    confirmadas: reservas.filter((r) => r.status === 'Confirmada').length,
    pendentes: reservas.filter((r) => r.status === 'Pendente').length,
    concluidas: reservas.filter((r) => r.status === 'Concluída').length,
    canceladas: reservas.filter((r) => r.status === 'Cancelada').length,
    receitaTotal: reservas
      .filter((r) => r.status === 'Confirmada' || r.status === 'Concluída')
      .reduce((sum, r) => sum + r.valor, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmada':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Cancelada':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Concluída':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">
            Reservas de Mesas
          </h1>
          <p className="mt-2 text-body">
            Gerencie as reservas de mesas do restaurante
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Reserva
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CalenderIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.total}
              </h4>
              <p className="text-sm text-body">Total de Reservas</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <CalenderIcon className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.confirmadas}
              </h4>
              <p className="text-sm text-body">Confirmadas</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10">
              <CalenderIcon className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {stats.pendentes}
              </h4>
              <p className="text-sm text-body">Pendentes</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
              <CalenderIcon className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-dark dark:text-white">
                {formatCurrency(stats.receitaTotal)}
              </h4>
              <p className="text-sm text-body">Receita Total</p>
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
              placeholder="Cliente, mesa ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
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
              <option value="">Todos os status</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Data
            </label>
            <input
              type="date"
              value={filterData}
              onChange={(e) => setFilterData(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke text-left dark:border-dark-3">
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Mesa
                </th>
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Cliente
                </th>
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Telefone
                </th>
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Data/Hora Início
                </th>
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Data/Hora Fim
                </th>
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Pessoas
                </th>
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Valor
                </th>
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 font-medium text-dark dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.map((reserva) => (
                <tr
                  key={reserva.id}
                  className="border-b border-stroke last:border-0 dark:border-dark-3"
                >
                  <td className="px-6 py-4 font-medium text-dark dark:text-white">
                    {reserva.mesa}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-dark dark:text-white">
                        {reserva.cliente}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body">{reserva.telefone}</td>
                  <td className="px-6 py-4 text-body">
                    <div>
                      <p className="font-medium">{formatDate(reserva.dataInicio)}</p>
                      <p className="text-sm">{reserva.horaInicio}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body">
                    <div>
                      <p className="font-medium">{formatDate(reserva.dataFim)}</p>
                      <p className="text-sm">{reserva.horaFim}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-body">
                    {reserva.pessoas}
                  </td>
                  <td className="px-6 py-4 font-medium text-dark dark:text-white">
                    {formatCurrency(reserva.valor)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                        reserva.status
                      )}`}
                    >
                      {reserva.status}
                    </span>
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
                        className="rounded-lg p-2 hover:bg-gray-2 dark:hover:bg-dark-3"
                      >
                        <TrashBinIcon className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservas.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-body">Nenhuma reserva encontrada</p>
          </div>
        )}
      </div>

      {/* Modal de Nova Reserva */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-dark dark:text-white">
                Nova Reserva
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-body hover:text-dark dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Mesa
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mesa 05"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Cliente
                  </label>
                  <input
                    type="text"
                    placeholder="Nome do cliente"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Número de Pessoas
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="4"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Data Início
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Hora Início
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Hora Fim
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Valor da Reserva
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="150.00"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    Status
                  </label>
                  <select className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white">
                    <option value="Pendente">Pendente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Observações
                </label>
                <textarea
                  rows={3}
                  placeholder="Observações sobre a reserva..."
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-stroke px-6 py-2 text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
                >
                  Salvar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
