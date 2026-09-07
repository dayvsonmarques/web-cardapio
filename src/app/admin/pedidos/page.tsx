'use client';

import { usePageTitle } from '@/hooks/usePageTitle';

export default function PedidosPage() {
  usePageTitle('Pedidos');
  return (
    <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-dark">
      <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white">
        Pedidos - Em Desenvolvimento
      </h1>

      <div className="space-y-4 text-body dark:text-dark-6">
        <p>
          Esta página está sendo refatorada para suportar o novo sistema híbrido (Delivery + Presencial).
        </p>

        <div className="rounded-lg border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2">
          <h3 className="mb-2 font-semibold text-dark dark:text-white">
            Novos recursos sendo implementados:
          </h3>

          <ul className="list-inside list-disc space-y-1">
            <li>Suporte para pedidos de delivery com endereço</li>
            <li>Suporte para pedidos presenciais com mesas</li>
            <li>Sistema de múltiplos pagamentos</li>
            <li>Taxa de entrega e taxa de serviço</li>
            <li>Integração com API do Prisma</li>
          </ul>
        </div>

        <div className="rounded-lg border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2">
          <h3 className="mb-2 font-semibold text-dark dark:text-white">
            APIs Disponíveis:
          </h3>

          <ul className="list-inside list-disc space-y-1 font-mono text-sm">
            <li>GET /api/orders - Listar pedidos</li>
            <li>POST /api/orders - Criar pedido</li>
            <li>GET /api/tables - Listar mesas</li>
            <li>GET /api/restaurant/settings - Ver configurações</li>
          </ul>
        </div>

        <p className="text-sm italic">
          💡 Consulte o arquivo <code className="rounded bg-gray-2 px-2 py-1 dark:bg-dark-2">SISTEMA_HIBRIDO_IMPLEMENTADO.md</code> para mais detalhes sobre as mudanças.
        </p>
      </div>
    </div>
  );
}
