/**
 * Catalog Type Definitions
 * All types related to products, categories, and menus
 */

// ============================================================
// CATEGORY TYPES
// ============================================================

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

// ============================================================
// PRODUCT TYPES
// ============================================================

export interface NutritionalInfo {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  ingredients: string[];
  nutritionalInfo: NutritionalInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  ingredients: string[];
  nutritionalInfo: NutritionalInfo;
}

export interface ProductWithCategory extends Product {
  categoryName: string;
}

// ============================================================
// MENU TYPES
// ============================================================

export interface Menu {
  id: string;
  name: string;
  description: string;
  products: string[]; // Array of product IDs
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuFormData {
  name: string;
  description: string;
  products: string[];
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface MenuWithProducts extends Menu {
  productDetails: Product[];
}

// ============================================================
// FORM TYPES
// ============================================================

export type CategoryForm = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type ProductForm = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type MenuForm = Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================================
// TABLE/LIST TYPES
// ============================================================

export interface ProductTableData extends Product {
  categoryName: string;
}

export interface CategoryTableData extends Category {
  productCount: number;
}

export interface MenuTableData extends Menu {
  productCount: number;
}
