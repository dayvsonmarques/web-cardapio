import { useUser } from "@/context/UserContext";

export const translations = {
  en: {
    // Header/Profile
    editProfile: "Edit profile",
    accountSettings: "Account settings",
    support: "Support",
    signOut: "Sign out",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    language: "Language",
    portuguese: "Portuguese",
    english: "English",
    
    // Products Page
    manageProducts: "Manage Products",
    viewAndManageProducts: "View and manage all products in the catalog",
    addNewProduct: "Add New Product",
    totalProducts: "Total Products",
    available: "Available",
    unavailable: "Unavailable",
    avgPrice: "Avg Price",
    searchProducts: "Search products...",
    allCategories: "All Categories",
    all: "All",
    filterByStatus: "Filter by status",
    image: "Image",
    product: "Product",
    category: "Category",
    price: "Price",
    status: "Status",
    actions: "Actions",
    noProductsFound: "No products found",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    deleteProduct: "Delete Product",
    actionCannotBeUndone: "This action cannot be undone",
    confirmDeleteProduct: "Are you sure you want to delete the product",
    cancel: "Cancel",
    confirmDelete: "Yes, Delete",
    noImage: "No image",
    
    // Categories Page
    manageCategories: "Manage Categories",
    viewAndManageCategories: "View and manage all categories in the catalog",
    addNewCategory: "Add New Category",
    totalCategories: "Total Categories",
    active: "Active",
    inactive: "Inactive",
    searchCategories: "Search categories...",
    allStatus: "All Status",
    name: "Name",
    description: "Description",
    noCategoriesFound: "No categories found",
    deleteCategory: "Delete Category",
    confirmDeleteCategory: "Are you sure you want to delete the category",
    
    // Menus Page
    manageMenus: "Manage Menus",
    viewAndManageMenus: "View and manage all menus",
    addNewMenu: "Add New Menu",
    totalMenus: "Total Menus",
    searchMenus: "Search menus...",
    startDate: "Start Date",
    endDate: "End Date",
    products: "Products",
    noMenusFound: "No menus found",
    deleteMenu: "Delete Menu",
    confirmDeleteMenu: "Are you sure you want to delete the menu",
  },
  pt: {
    // Header/Profile
    editProfile: "Editar perfil",
    accountSettings: "Configurações da conta",
    support: "Suporte",
    signOut: "Sair",
    lightMode: "Modo claro",
    darkMode: "Modo escuro",
    language: "Idioma",
    portuguese: "Português",
    english: "Inglês",
    
    // Products Page
    manageProducts: "Gerenciar Produtos",
    viewAndManageProducts: "Visualize e gerencie todos os produtos do catálogo",
    addNewProduct: "Adicionar Novo Produto",
    totalProducts: "Total de Produtos",
    available: "Disponíveis",
    unavailable: "Indisponíveis",
    avgPrice: "Preço Médio",
    searchProducts: "Buscar produtos...",
    allCategories: "Todas as Categorias",
    all: "Todos",
    filterByStatus: "Filtrar por status",
    image: "Imagem",
    product: "Produto",
    category: "Categoria",
    price: "Preço",
    status: "Status",
    actions: "Ações",
    noProductsFound: "Nenhum produto encontrado",
    view: "Visualizar",
    edit: "Editar",
    delete: "Excluir",
    deleteProduct: "Excluir Produto",
    actionCannotBeUndone: "Esta ação não pode ser desfeita",
    confirmDeleteProduct: "Tem certeza que deseja excluir o produto",
    cancel: "Cancelar",
    confirmDelete: "Sim, Excluir",
    noImage: "Sem imagem",
    
    // Categories Page
    manageCategories: "Gerenciar Categorias",
    viewAndManageCategories: "Visualize e gerencie todas as categorias do catálogo",
    addNewCategory: "Adicionar Nova Categoria",
    totalCategories: "Total de Categorias",
    active: "Ativas",
    inactive: "Inativas",
    searchCategories: "Buscar categorias...",
    allStatus: "Todos os Status",
    name: "Nome",
    description: "Descrição",
    noCategoriesFound: "Nenhuma categoria encontrada",
    deleteCategory: "Excluir Categoria",
    confirmDeleteCategory: "Tem certeza que deseja excluir a categoria",
    
    // Menus Page
    manageMenus: "Gerenciar Cardápios",
    viewAndManageMenus: "Visualize e gerencie todos os cardápios",
    addNewMenu: "Adicionar Novo Cardápio",
    totalMenus: "Total de Cardápios",
    searchMenus: "Buscar cardápios...",
    startDate: "Data Início",
    endDate: "Data Fim",
    products: "Produtos",
    noMenusFound: "Nenhum cardápio encontrado",
    deleteMenu: "Excluir Cardápio",
    confirmDeleteMenu: "Tem certeza que deseja excluir o cardápio",
  },
};

type TranslationKey = keyof typeof translations.en;

export const useTranslations = () => {
  const { language } = useUser();
  
  const t = (key: TranslationKey): string => {
    return translations[language][key as keyof typeof translations.pt] || translations.en[key];
  };

  return { t, language };
};