export interface Mesa {
  id: string;
  numero: number;
  status: 'livre' | 'ocupada' | 'reservada';
  capacidade: number;
}

export interface ItemPedido {
  id: string;
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  observacoes?: string;
}

export interface Pagamento {
  id: string;
  valor: number;
  metodoPagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'vale_refeicao';
  dataPagamento: Date;
  observacoes?: string;
}

export interface Pedido {
  id: string;
  mesaId: string;
  numeroMesa: number;
  itens: ItemPedido[];
  subtotal: number;
  servicoOpcional: number; // 10%
  incluirServico: boolean;
  total: number;
  status: 'aberto' | 'em_preparo' | 'finalizado' | 'cancelado';
  pagamentos: Pagamento[];
  valorPago: number;
  valorRestante: number;
  dataAbertura: Date;
  dataFechamento?: Date;
  observacoes?: string;
}

export type MetodoPagamento = 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'vale_refeicao';

export const metodoPagamentoLabels: Record<MetodoPagamento, string> = {
  dinheiro: 'Dinheiro',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
  pix: 'PIX',
  vale_refeicao: 'Vale Refeição',
};
