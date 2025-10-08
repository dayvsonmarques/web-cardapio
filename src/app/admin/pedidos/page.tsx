'use client';

import { useState, useMemo } from 'react';
import { tablesTestData, ordersTestData, productsTestData } from '@/data/catalogTestData';
import { Order, Table, OrderItem, Payment, PAYMENT_METHOD_LABELS, PaymentMethod } from '@/types/orders';
import Image from 'next/image';

type ModalType = 'novo-pedido' | 'adicionar-item' | 'adicionar-pagamento' | 'visualizar' | null;

// Type aliases para compatibilidade com nomes em português
type Pedido = Order;
type ItemPedido = OrderItem;

export default function PedidosPage() {
  const [mesas, setMesas] = useState<Table[]>(tablesTestData);
  const [pedidos, setPedidos] = useState<Order[]>(ordersTestData);
  const [modalAberto, setModalAberto] = useState<ModalType>(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // Estado do formulário de novo pedido
  const [novoPedidoForm, setNovoPedidoForm] = useState({
    tableId: '',
    includeService: true,
    notes: '',
  });

  // Estado do formulário de adicionar item
  const [novoItemForm, setNovoItemForm] = useState({
    productId: '',
    quantity: 1,
    notes: '',
  });

  // Estado do formulário de pagamento
  const [novoPagamentoForm, setNovoPagamentoForm] = useState({
    amount: '',
    method: 'cash' as PaymentMethod,
    notes: '',
  });

  const [buscaProduto, setBuscaProduto] = useState('');

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      if (filtroStatus === 'todos') return true;
      return pedido.status === filtroStatus;
    });
  }, [pedidos, filtroStatus]);

  const produtosFiltrados = useMemo(() => {
    return productsTestData.filter((produto) =>
      produto.name.toLowerCase().includes(buscaProduto.toLowerCase())
    );
  }, [buscaProduto]);

  const mesasLivres = useMemo(() => {
    return mesas.filter((mesa) => mesa.status === 'available');
  }, [mesas]);

  const calcularTotais = (items: ItemPedido[], includeService: boolean) => {
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const serviceCharge = includeService ? subtotal * 0.1 : 0;
    const total = subtotal + serviceCharge;
    return { subtotal, serviceCharge, total };
  };

  const abrirNovoPedido = () => {
    setNovoPedidoForm({ tableId: '', includeService: true, notes: '' });
    setModalAberto('novo-pedido');
  };

  const criarPedido = () => {
    if (!novoPedidoForm.tableId) {
      alert('Selecione uma mesa');
      return;
    }

    const mesa = mesas.find((m) => m.id === novoPedidoForm.tableId);
    if (!mesa) return;

    const novoPedido: Pedido = {
      id: String(pedidos.length + 1),
      tableId: mesa.id,
      tableNumber: mesa.number,
      items: [],
      subtotal: 0,
      serviceCharge: 0,
      total: 0,
      status: 'pending',
      payments: [],
      totalPaid: 0,
      remainingBalance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: novoPedidoForm.notes,
    };

    setPedidos([...pedidos, novoPedido]);
    setMesas(mesas.map((m) => (m.id === mesa.id ? { ...m, status: 'occupied' as const } : m)));
    setModalAberto(null);
    setPedidoSelecionado(novoPedido);
    setModalAberto('adicionar-item');
  };

  const abrirAdicionarItem = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setNovoItemForm({ productId: '', quantity: 1, notes: '' });
    setBuscaProduto('');
    setModalAberto('adicionar-item');
  };

  const adicionarItem = () => {
    if (!pedidoSelecionado || !novoItemForm.productId) {
      alert('Selecione um produto');
      return;
    }

    const produto = productsTestData.find((p) => p.id === novoItemForm.productId);
    if (!produto) return;

    const novoItem: ItemPedido = {
      id: String(Date.now()),
      productId: produto.id,
      productName: produto.name,
      quantity: novoItemForm.quantity,
      unitPrice: produto.price,
      subtotal: produto.price * novoItemForm.quantity,
      notes: novoItemForm.notes,
    };

    const itensAtualizados = [...pedidoSelecionado.items, novoItem];
    const totais = calcularTotais(itensAtualizados, pedidoSelecionado.serviceCharge > 0);

    const pedidoAtualizado: Pedido = {
      ...pedidoSelecionado,
      items: itensAtualizados,
      ...totais,
      remainingBalance: totais.total - pedidoSelecionado.totalPaid,
    };

    setPedidos(pedidos.map((p) => (p.id === pedidoAtualizado.id ? pedidoAtualizado : p)));
    setPedidoSelecionado(pedidoAtualizado);
    setNovoItemForm({ productId: '', quantity: 1, notes: '' });
    setBuscaProduto('');
  };

  const removerItem = (itemId: string) => {
    if (!pedidoSelecionado) return;

    const itensAtualizados = pedidoSelecionado.items.filter((item) => item.id !== itemId);
    const totais = calcularTotais(itensAtualizados, pedidoSelecionado.serviceCharge > 0);

    const pedidoAtualizado: Pedido = {
      ...pedidoSelecionado,
      items: itensAtualizados,
      ...totais,
      remainingBalance: totais.total - pedidoSelecionado.totalPaid,
    };

    setPedidos(pedidos.map((p) => (p.id === pedidoAtualizado.id ? pedidoAtualizado : p)));
    setPedidoSelecionado(pedidoAtualizado);
  };

  const alternarServico = () => {
    if (!pedidoSelecionado) return;

    const incluirServico = !(pedidoSelecionado.serviceCharge > 0);
    const totais = calcularTotais(pedidoSelecionado.items, incluirServico);

    const pedidoAtualizado: Pedido = {
      ...pedidoSelecionado,
      ...totais,
      remainingBalance: totais.total - pedidoSelecionado.totalPaid,
    };

    setPedidos(pedidos.map((p) => (p.id === pedidoAtualizado.id ? pedidoAtualizado : p)));
    setPedidoSelecionado(pedidoAtualizado);
  };

  const abrirAdicionarPagamento = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setNovoPagamentoForm({
      amount: String(pedido.remainingBalance.toFixed(2)),
      method: 'cash',
      notes: '',
    });
    setModalAberto('adicionar-pagamento');
  };

  const adicionarPagamento = () => {
    if (!pedidoSelecionado) return;

    const valor = parseFloat(novoPagamentoForm.amount);
    if (isNaN(valor) || valor <= 0) {
      alert('Valor inválido');
      return;
    }

    if (valor > pedidoSelecionado.remainingBalance) {
      alert('Valor maior que o restante');
      return;
    }

    const novoPagamento: Payment = {
      id: String(Date.now()),
      amount: valor,
      method: novoPagamentoForm.method,
      paidAt: new Date(),
    };

    const valorPago = pedidoSelecionado.totalPaid + valor;
    const valorRestante = pedidoSelecionado.total - valorPago;

    const pedidoAtualizado: Pedido = {
      ...pedidoSelecionado,
      payments: [...pedidoSelecionado.payments, novoPagamento],
      totalPaid: valorPago,
      remainingBalance: valorRestante,
      status: valorRestante === 0 ? 'paid' : pedidoSelecionado.status,
      closedAt: valorRestante === 0 ? new Date() : undefined,
    };

    setPedidos(pedidos.map((p) => (p.id === pedidoAtualizado.id ? pedidoAtualizado : p)));

    if (valorRestante === 0) {
      setMesas(
        mesas.map((m) => (m.id === pedidoSelecionado.tableId ? { ...m, status: 'available' as const } : m))
      );
    }

    setModalAberto(null);
    setPedidoSelecionado(null);
  };

  const visualizarPedido = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setModalAberto('visualizar');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-blue-500 text-white';
      case 'em_preparo':
        return 'bg-yellow-500 text-white';
      case 'finalizado':
        return 'bg-green-500 text-white';
      case 'cancelado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      aberto: 'Aberto',
      em_preparo: 'Em Preparo',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getMesaStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'occupied':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getMesaStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Livre',
      occupied: 'Ocupada',
      reserved: 'Reservada',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pedidos</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gerencie os pedidos das mesas do restaurante
          </p>
        </div>
        <button
          onClick={abrirNovoPedido}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Pedido
        </button>
      </div>

      {/* Visão Geral das Mesas */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Mesas</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
          {mesas.map((mesa) => {
            const pedidoDaMesa = pedidos.find((p) => p.tableId === mesa.id && p.status !== 'paid');
            return (
              <div
                key={mesa.id}
                onClick={() => {
                  if (pedidoDaMesa) {
                    visualizarPedido(pedidoDaMesa);
                  }
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:shadow-lg ${getMesaStatusColor(
                  mesa.status
                )}`}
              >
                <div className="text-2xl font-bold">#{mesa.number}</div>
                <div className="text-xs">{getMesaStatusLabel(mesa.status)}</div>
                <div className="mt-1 text-xs opacity-70">{mesa.capacity} pessoas</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFiltroStatus('todos')}
          className={`rounded px-4 py-2 text-sm font-medium ${
            filtroStatus === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Todos ({pedidos.length})
        </button>
        <button
          onClick={() => setFiltroStatus('aberto')}
          className={`rounded px-4 py-2 text-sm font-medium ${
            filtroStatus === 'aberto'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Abertos ({pedidos.filter((p) => p.status === 'pending').length})
        </button>
        <button
          onClick={() => setFiltroStatus('em_preparo')}
          className={`rounded px-4 py-2 text-sm font-medium ${
            filtroStatus === 'em_preparo'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Em Preparo ({pedidos.filter((p) => p.status === 'preparing').length})
        </button>
        <button
          onClick={() => setFiltroStatus('finalizado')}
          className={`rounded px-4 py-2 text-sm font-medium ${
            filtroStatus === 'finalizado'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Finalizados ({pedidos.filter((p) => p.status === 'paid').length})
        </button>
      </div>

      {/* Lista de Pedidos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pedidosFiltrados.map((pedido) => (
          <div
            key={pedido.id}
            className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg dark:bg-gray-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Mesa {pedido.tableNumber}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pedido #{pedido.id}
                </p>
              </div>
              <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(pedido.status)}`}>
                {getStatusLabel(pedido.status)}
              </span>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatarMoeda(pedido.subtotal)}
                </span>
              </div>
              {pedido.serviceCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Serviço (10%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatarMoeda(pedido.serviceCharge)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">{formatarMoeda(pedido.total)}</span>
              </div>
              {pedido.totalPaid > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">Pago:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatarMoeda(pedido.totalPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600 dark:text-red-400">Restante:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {formatarMoeda(pedido.remainingBalance)}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => visualizarPedido(pedido)}
                className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Ver Detalhes
              </button>
              {pedido.status !== 'paid' && pedido.status !== 'cancelled' && (
                <button
                  onClick={() => abrirAdicionarPagamento(pedido)}
                  className="flex-1 rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Pagamento
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {pedidosFiltrados.length === 0 && (
        <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Nenhum pedido encontrado</p>
        </div>
      )}

      {/* Modal: Novo Pedido */}
      {modalAberto === 'novo-pedido' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Novo Pedido</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selecione a Mesa
                </label>
                <select
                  value={novoPedidoForm.tableId}
                  onChange={(e) => setNovoPedidoForm({ ...novoPedidoForm, tableId: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecione uma mesa</option>
                  {mesasLivres.map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa {mesa.number} - {mesa.capacity} pessoas
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={novoPedidoForm.includeService}
                    onChange={(e) =>
                      setNovoPedidoForm({ ...novoPedidoForm, includeService: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Incluir 10% de serviço</span>
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Observações
                </label>
                <textarea
                  value={novoPedidoForm.notes}
                  onChange={(e) => setNovoPedidoForm({ ...novoPedidoForm, notes: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Observações sobre o pedido..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalAberto(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={criarPedido}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Criar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Item */}
      {modalAberto === 'adicionar-item' && pedidoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Adicionar Item - Mesa {pedidoSelecionado.tableNumber}
            </h2>

            {/* Itens já adicionados */}
            {pedidoSelecionado.items.length > 0 && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Itens do Pedido</h3>
                <div className="space-y-2">
                  {pedidoSelecionado.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded bg-white p-3 dark:bg-gray-800"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{item.productName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.quantity}x {formatarMoeda(item.unitPrice)} ={' '}
                          {formatarMoeda(item.quantity * item.unitPrice)}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-gray-500 dark:text-gray-500">{item.notes}</div>
                        )}
                      </div>
                      <button
                        onClick={() => removerItem(item.id)}
                        className="ml-4 text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium">{formatarMoeda(pedidoSelecionado.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pedidoSelecionado.serviceCharge > 0}
                        onChange={alternarServico}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Serviço (10%):</span>
                    </label>
                    <span className="font-medium">
                      {formatarMoeda(pedidoSelecionado.serviceCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatarMoeda(pedidoSelecionado.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Busca de produto */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Buscar Produto
              </label>
              <input
                type="text"
                value={buscaProduto}
                onChange={(e) => setBuscaProduto(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Digite o nome do produto..."
              />
            </div>

            {/* Lista de produtos */}
            <div className="mb-4 max-h-60 space-y-2 overflow-y-auto">
              {produtosFiltrados.slice(0, 10).map((produto) => (
                <div
                  key={produto.id}
                  onClick={() => setNovoItemForm({ ...novoItemForm, productId: produto.id })}
                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                    novoItemForm.productId === produto.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {produto.image && (
                      <Image
                        src={produto.image}
                        alt={produto.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{produto.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatarMoeda(produto.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {novoItemForm.productId && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={novoItemForm.quantity}
                    onChange={(e) =>
                      setNovoItemForm({ ...novoItemForm, quantity: parseInt(e.target.value) || 1 })
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Observações
                  </label>
                  <input
                    type="text"
                    value={novoItemForm.notes}
                    onChange={(e) => setNovoItemForm({ ...novoItemForm, notes: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Sem cebola, bem passado..."
                  />
                </div>

                <button
                  onClick={adicionarItem}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Adicionar ao Pedido
                </button>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setModalAberto(null);
                  setPedidoSelecionado(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Pagamento */}
      {modalAberto === 'adicionar-pagamento' && pedidoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Adicionar Pagamento - Mesa {pedidoSelecionado.tableNumber}
            </h2>

            <div className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Total do Pedido:</span>
                <span className="font-bold">{formatarMoeda(pedidoSelecionado.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700 dark:text-green-300">Já Pago:</span>
                <span className="font-bold">{formatarMoeda(pedidoSelecionado.totalPaid)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold">
                <span className="text-red-700 dark:text-red-300">Restante:</span>
                <span className="text-red-700 dark:text-red-300">
                  {formatarMoeda(pedidoSelecionado.remainingBalance)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={pedidoSelecionado.remainingBalance}
                  value={novoPagamentoForm.amount}
                  onChange={(e) => setNovoPagamentoForm({ ...novoPagamentoForm, amount: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Método de Pagamento
                </label>
                <select
                  value={novoPagamentoForm.method}
                  onChange={(e) =>
                    setNovoPagamentoForm({
                      ...novoPagamentoForm,
                      method: e.target.value as PaymentMethod,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Observações
                </label>
                <input
                  type="text"
                  value={novoPagamentoForm.notes}
                  onChange={(e) =>
                    setNovoPagamentoForm({ ...novoPagamentoForm, notes: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Troco para R$ 100,00"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalAberto(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarPagamento}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Visualizar Pedido */}
      {modalAberto === 'visualizar' && pedidoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Mesa {pedidoSelecionado.tableNumber}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pedido #{pedidoSelecionado.id}</p>
              </div>
              <span className={`rounded px-3 py-1 text-sm font-medium ${getStatusColor(pedidoSelecionado.status)}`}>
                {getStatusLabel(pedidoSelecionado.status)}
              </span>
            </div>

            {/* Itens */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Itens</h3>
              <div className="space-y-2">
                {pedidoSelecionado.items.map((item) => (
                  <div key={item.id} className="rounded bg-gray-50 p-3 dark:bg-gray-700">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{item.productName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.quantity}x {formatarMoeda(item.unitPrice)}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-gray-500 dark:text-gray-500">{item.notes}</div>
                        )}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatarMoeda(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totais */}
            <div className="mb-6 space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium">{formatarMoeda(pedidoSelecionado.subtotal)}</span>
              </div>
              {pedidoSelecionado.serviceCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Serviço (10%):</span>
                  <span className="font-medium">{formatarMoeda(pedidoSelecionado.serviceCharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatarMoeda(pedidoSelecionado.total)}</span>
              </div>
            </div>

            {/* Pagamentos */}
            {pedidoSelecionado.payments.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Pagamentos</h3>
                <div className="space-y-2">
                  {pedidoSelecionado.payments.map((pagamento) => (
                    <div key={pagamento.id} className="flex justify-between rounded bg-green-50 p-3 dark:bg-green-900">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {PAYMENT_METHOD_LABELS[pagamento.method]}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {pagamento.paidAt.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div className="font-bold text-green-700 dark:text-green-300">
                        {formatarMoeda(pagamento.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">Total Pago:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatarMoeda(pedidoSelecionado.totalPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600 dark:text-red-400">Restante:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {formatarMoeda(pedidoSelecionado.remainingBalance)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {pedidoSelecionado.notes && (
              <div className="mb-6">
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Observações</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{pedidoSelecionado.notes}</p>
              </div>
            )}

            <div className="flex gap-3">
              {pedidoSelecionado.status !== 'paid' && pedidoSelecionado.status !== 'cancelled' && (
                <>
                  <button
                    onClick={() => {
                      setModalAberto(null);
                      setTimeout(() => abrirAdicionarItem(pedidoSelecionado), 100);
                    }}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Adicionar Item
                  </button>
                  <button
                    onClick={() => {
                      setModalAberto(null);
                      setTimeout(() => abrirAdicionarPagamento(pedidoSelecionado), 100);
                    }}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Adicionar Pagamento
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setModalAberto(null);
                  setPedidoSelecionado(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
