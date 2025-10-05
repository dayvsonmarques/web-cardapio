/**/**// Catalog Types - All in English following best practices// Interfaces para os dados do catálogo

 * Catalog Type Definitions

 * All types related to products, categories, and menus * Catalog Type Definitions

 */

 * All types related to products, categories, and menus

// ============================================================

// CATEGORY TYPES */

// ============================================================

export interface Category {export interface Categoria {

export interface Category {

  id: string;// ============================================================

  name: string;

  description: string;// CATEGORY TYPES  id: string;  id: string;

  isActive: boolean;

  createdAt: Date;// ============================================================

  updatedAt: Date;

}  name: string;  nome: string;



export interface CategoryFormData {export interface Category {

  name: string;

  description: string;  id: string;  description?: string;  descricao?: string;

  isActive: boolean;

}  name: string;



// ============================================================  description: string;  isActive: boolean;  ativa: boolean;

// PRODUCT TYPES

// ============================================================  isActive: boolean;



export interface NutritionalInfo {  createdAt: Date;  createdAt: Date;  dataCriacao: Date;

  calories: number;

  proteins: number;  updatedAt: Date;

  carbohydrates: number;

  fats: number;}  updatedAt: Date;  dataAtualizacao: Date;

  fiber: number;

}



export interface Product {export interface CategoryFormData {}}

  id: string;

  name: string;  name: string;

  description: string;

  price: number;  description: string;

  categoryId: string;

  image: string;  isActive: boolean;

  isAvailable: boolean;

  ingredients: string[];}export interface NutritionalInfo {export interface Produto {

  nutritionalInfo: NutritionalInfo;

  createdAt: Date;

  updatedAt: Date;

}// ============================================================  calories: number;  id: string;



export interface ProductFormData {// PRODUCT TYPES

  name: string;

  description: string;// ============================================================  protein: number;  nome: string;

  price: number;

  categoryId: string;

  image: string;

  isAvailable: boolean;export interface NutritionalInfo {  carbohydrates: number;  descricao: string;

  ingredients: string[];

  nutritionalInfo: NutritionalInfo;  calories: number;

}

  proteins: number;  fat: number;  preco: number;

export interface ProductWithCategory extends Product {

  categoryName: string;  carbohydrates: number;

}

  fats: number;}  categoriaId: string;

// ============================================================

// MENU TYPES  fiber: number;

// ============================================================

}  categoria?: Categoria;

export interface Menu {

  id: string;

  name: string;

  description: string;export interface Product {export interface Product {  imagem?: string;

  products: string[]; // Array of product IDs

  isActive: boolean;  id: string;

  startDate?: Date;

  endDate?: Date;  name: string;  id: string;  disponivel: boolean;

  createdAt: Date;

  updatedAt: Date;  description: string;

}

  price: number;  name: string;  ingredientes?: string[];

export interface MenuFormData {

  name: string;  categoryId: string;

  description: string;

  products: string[];  image: string;  description: string;  informacoesNutricionais?: {

  isActive: boolean;

  startDate?: Date;  isAvailable: boolean;

  endDate?: Date;

}  ingredients: string[];  price: number;    calorias?: number;



export interface MenuWithProducts extends Menu {  nutritionalInfo: NutritionalInfo;

  productDetails: Product[];

}  createdAt: Date;  categoryId: string;    proteinas?: number;


  updatedAt: Date;

}  category?: Category;    carboidratos?: number;



export interface ProductFormData {  image?: string;    gorduras?: number;

  name: string;

  description: string;  isAvailable: boolean;  };

  price: number;

  categoryId: string;  ingredients?: string[];  dataCriacao: Date;

  image: string;

  isAvailable: boolean;  nutritionalInfo?: NutritionalInfo;  dataAtualizacao: Date;

  ingredients: string[];

  nutritionalInfo: NutritionalInfo;  createdAt: Date;}

}

  updatedAt: Date;

export interface ProductWithCategory extends Product {

  categoryName: string;}export interface Cardapio {

}

  id: string;

// ============================================================

// MENU TYPESexport interface Menu {  nome: string;

// ============================================================

  id: string;  descricao?: string;

export interface Menu {

  id: string;  name: string;  produtos: string[]; // IDs dos produtos

  name: string;

  description: string;  description?: string;  ativo: boolean;

  products: string[]; // Array of product IDs

  isActive: boolean;  products: string[]; // Array of product IDs  dataInicio?: Date;

  startDate?: Date;

  endDate?: Date;  isActive: boolean;  dataFim?: Date;

  createdAt: Date;

  updatedAt: Date;  startDate?: Date;  dataCriacao: Date;

}

  endDate?: Date;  dataAtualizacao: Date;

export interface MenuFormData {

  name: string;  createdAt: Date;}

  description: string;

  products: string[];  updatedAt: Date;

  isActive: boolean;

  startDate?: Date;}// Types para formulários

  endDate?: Date;

}export type CategoriaForm = Omit<Categoria, 'id' | 'dataCriacao' | 'dataAtualizacao'>;



export interface MenuWithProducts extends Menu {// Form Typesexport type ProdutoForm = Omit<Produto, 'id' | 'categoria' | 'dataCriacao' | 'dataAtualizacao'>;

  productDetails: Product[];

}export type CategoryForm = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;export type CardapioForm = Omit<Cardapio, 'id' | 'dataCriacao' | 'dataAtualizacao'>;


export type ProductForm = Omit<Product, 'id' | 'category' | 'createdAt' | 'updatedAt'>;

export type MenuForm = Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>;// Types para listagem/tabelas

export interface ProdutoTableData extends Produto {

// Table/List Types  categoriaNome: string;

export interface ProductTableData extends Product {}

  categoryName: string;export interface CardapioTableData extends Cardapio {

}  totalProdutos: number;

}
export interface CategoryTableData extends Category {
  productCount: number;
}

export interface MenuTableData extends Menu {
  productCount: number;
}
