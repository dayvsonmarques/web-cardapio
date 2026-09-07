"use client";

import { Category } from "@/types/catalog";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {/* Botões de Categorias - Sem botão "Todos" */}
        {categories
          .filter((cat) => cat.isActive)
          .map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`rounded-lg px-6 py-3 text-lg font-medium transition-all ${
                selectedCategoryId === category.id
                  ? "border border-gray-300 bg-white text-gray-900 shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  : "bg-white text-body hover:bg-gray-2 dark:bg-gray-dark dark:text-gray-5 dark:hover:bg-gray-800"
              }`}
            >
              {category.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
