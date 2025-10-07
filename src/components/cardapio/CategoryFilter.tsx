"use client";

import { Category } from "@/types/catalog";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {/* Botão "Todos" */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`rounded-lg px-6 py-3 text-base font-medium transition-all ${
            selectedCategoryId === null
              ? "bg-primary text-white shadow-md shadow-primary/30"
              : "bg-white text-body hover:bg-gray-2 dark:bg-gray-dark dark:text-gray-5 dark:hover:bg-gray-800"
          }`}
        >
          Todos
        </button>

        {/* Botões de Categorias */}
        {categories
          .filter((cat) => cat.isActive)
          .map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`rounded-lg px-6 py-3 text-base font-medium transition-all ${
                selectedCategoryId === category.id
                  ? "bg-primary text-white shadow-md shadow-primary/30"
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
