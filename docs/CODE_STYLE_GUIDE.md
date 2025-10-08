# Code Style Guide - English Nomenclature

## 📋 Naming Conventions

All code must follow English nomenclature following industry best practices:

### Files
- ✅ `catalog.ts` (not `catalogo.ts`)
- ✅ `orders.ts` (not `pedidos.ts`)
- ✅ `catalogTestData.ts` (not `catalogoTestData.ts`)

### Types/Interfaces
```typescript
// ✅ Good
interface Product {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
}

// ❌ Bad
interface Produto {
  id: string;
  nome: string;
  preco: number;
  disponivel: boolean;
  dataCriacao: Date;
}
```

### Variables
```typescript
// ✅ Good
const filteredProducts = products.filter(...);
const totalPrice = calculateTotal();
const isAvailable = checkAvailability();

// ❌ Bad
const produtosFiltrados = produtos.filter(...);
const precoTotal = calcularTotal();
const disponivel = verificarDisponibilidade();
```

### Functions
```typescript
// ✅ Good
function calculateTotal(items: OrderItem[]): number {}
function formatPrice(value: number): string {}
const handleSubmit = () => {};

// ❌ Bad
function calcularTotal(itens: ItemPedido[]): number {}
function formatarPreco(valor: number): string {}
const aoSubmeter = () => {};
```

### Boolean Properties
Use `is`, `has`, `can`, `should` prefixes:
```typescript
// ✅ Good
isActive, isAvailable, hasPermission, canEdit, shouldDisplay

// ❌ Bad
ativo, disponivel, temPermissao, podeEditar, deveExibir
```

### Event Handlers
Use `handle` or `on` prefix:
```typescript
// ✅ Good
handleClick, handleSubmit, onClose, onChange

// ❌ Bad
aoClicar, aoSubmeter, fechar, mudar
```

## 🌐 i18n (Internationalization)

UI text should use the translation system:

```typescript
// ✅ Good
<button>{t('save')}</button>
<h1>{t('manageProducts')}</h1>

// ❌ Bad
<button>Salvar</button>
<h1>Gerenciar Produtos</h1>
```

## 📁 Project Structure

```
src/
├── types/          # Type definitions (English)
│   ├── catalog.ts
│   ├── orders.ts
│   └── user.ts
├── data/           # Test/mock data (English)
│   └── catalogTestData.ts
├── components/     # React components
├── hooks/          # Custom hooks
│   └── useTranslations.ts  # i18n system
├── context/        # React contexts
└── app/           # Next.js pages
```

## 🔄 Migration Checklist

- [ ] Rename type files (catalogo.ts → catalog.ts)
- [ ] Rename data files (catalogoTestData.ts → catalogTestData.ts)
- [ ] Update all interface names (Produto → Product)
- [ ] Update all property names (nome → name, preco → price)
- [ ] Update all variable names
- [ ] Update all function names
- [ ] Update all imports
- [ ] Test all pages
- [ ] Verify i18n still works

## 📝 Examples

### Before (Portuguese)
```typescript
interface Produto {
  nome: string;
  preco: number;
  disponivel: boolean;
  dataCriacao: Date;
}

const produtos = produtosTestData;
const produtosFiltrados = produtos.filter(p => p.disponivel);
const precoTotal = produtosFiltrados.reduce((acc, p) => acc + p.preco, 0);
```

### After (English)
```typescript
interface Product {
  name: string;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
}

const products = productsTestData;
const filteredProducts = products.filter(p => p.isAvailable);
const totalPrice = filteredProducts.reduce((acc, p) => acc + p.price, 0);
```

## 🎯 Benefits

1. **International Collaboration** - Easier for global teams
2. **Industry Standard** - Follows worldwide conventions
3. **Better IDE Support** - Most plugins/tools expect English
4. **Consistency** - Same language as libraries/frameworks
5. **Documentation** - Easier to document and share
