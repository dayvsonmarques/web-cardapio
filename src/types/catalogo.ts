// Interfaces para os dados do catálogo

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  ativa: boolean;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoriaId: string;
  categoria?: Categoria;
  imagem?: string;
  disponivel: boolean;
  ingredientes?: string[];
  informacoesNutricionais?: {
    calorias?: number;
    proteinas?: number;
    carboidratos?: number;
    gorduras?: number;
  };
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface Cardapio {
  id: string;
  nome: string;
  descricao?: string;
  produtos: string[]; // IDs dos produtos
  ativo: boolean;
  dataInicio?: Date;
  dataFim?: Date;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

// Types para formulários
export type CategoriaForm = Omit<Categoria, 'id' | 'dataCriacao' | 'dataAtualizacao'>;
export type ProdutoForm = Omit<Produto, 'id' | 'categoria' | 'dataCriacao' | 'dataAtualizacao'>;
export type CardapioForm = Omit<Cardapio, 'id' | 'dataCriacao' | 'dataAtualizacao'>;

// Types para listagem/tabelas
export interface ProdutoTableData extends Produto {
  categoriaNome: string;
}
export interface CardapioTableData extends Cardapio {
  totalProdutos: number;
}