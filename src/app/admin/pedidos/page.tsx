'use client';

export default function PedidosPage() {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-dark">
      <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white">
        Pedidos - Em Desenvolvimento
      </h1>
      <div className="space-y-4 text-body dark:text-dark-6">
        <p>
          Esta página está sendo refatorada para suportar o novo sistema híbrido.
        </p>
        <div className="rounded-lg border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2">
          <h3 className="mb-2 font-semibold text-dark dark:text-white">
            Novos recursos:
          </h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Pedidos delivery e presenciais</li>
            <li>Sistema de múltiplos pagamentos</li>
            <li>Taxas de entrega e serviço</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
