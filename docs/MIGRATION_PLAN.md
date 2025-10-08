# Migration Plan - Portuguese to English

## Summary
Complete refactoring from Portuguese to English naming conventions across the entire codebase.

## Type Mappings

### Types/Interfaces
| Portuguese | English |
|-----------|---------|
| Categoria | Category |
| Produto | Product |
| Cardapio | Menu |
| Mesa | Table |
| Pedido | Order |
| ItemPedido | OrderItem |
| Pagamento | Payment |
| MetodoPagamento | PaymentMethod |
| StatusPedido | OrderStatus |
| StatusMesa | TableStatus |
| InfoNutricional | NutritionalInfo |

### Properties
| Portuguese | English |
|-----------|---------|
| nome | name |
| descricao | description |
| preco | price |
| categoriaId | categoryId |
| imagem | image |
| disponivel | isAvailable |
| ingredientes | ingredients |
| infoNutricional | nutritionalInfo |
| ativa | isActive |
| dataCriacao | createdAt |
| dataAtualizacao | updatedAt |
| produtos | products |
| dataInicio | startDate |
| dataFim | endDate |
| numero | number |
| capacidade | capacity |
| status | status |
| pedidoAtual | currentOrderId |
| mesaId | tableId |
| numeroMesa | tableNumber |
| itens | items |
| produtoId | productId |
| nomeProduto | productName |
| quantidade | quantity |
| precoUnitario | unitPrice |
| subtotal | subtotal |
| observacoes | notes |
| taxaServico | serviceCharge |
| total | total |
| pagamentos | payments |
| totalPago | totalPaid |
| saldoRestante | remainingBalance |
| valor | amount |
| metodo | method |
| pagoEm | paidAt |
| fechadoEm | closedAt |
| calorias | calories |
| proteinas | proteins |
| carboidratos | carbohydrates |
| gorduras | fats |
| fibras | fiber |

### Test Data Variables
| Portuguese | English |
|-----------|---------|
| categoriasTestData | categoriesTestData |
| produtosTestData | productsTestData |
| cardapiosTestData | menusTestData |
| mesasTestData | tablesTestData |
| pedidosTestData | ordersTestData |
| metodoPagamentoLabels | PAYMENT_METHOD_LABELS |

## Files to Update

### ✅ Already Created (English)
- [x] /src/types/catalog.ts
- [x] /src/types/orders.ts
- [x] /src/data/catalogTestData.ts
- [x] CODE_STYLE_GUIDE.md

### 🔄 Needs Update (References to Portuguese)

#### Product Pages
- [ ] /src/app/(admin)/catalogo/produtos/page.tsx
  - Import: `Produto` → `Product`
  - Import: `produtosTestData` → `productsTestData`
  - Import: `categoriasTestData` → `categoriesTestData`
  - All property references: `.nome` → `.name`, `.preco` → `.price`, etc.

- [ ] /src/app/(admin)/catalogo/produtos/novo/page.tsx
  - Import: `ProdutoForm` → `ProductFormData`
  - All form field names

- [ ] /src/app/(admin)/catalogo/produtos/[id]/page.tsx
  - Import: `Produto` → `Product`
  - Import: `produtosTestData` → `productsTestData`
  - All property references

- [ ] /src/app/(admin)/catalogo/produtos/[id]/editar/page.tsx
  - Import: `ProdutoForm` → `ProductFormData`
  - All form field names

#### Category Page
- [ ] /src/app/(admin)/catalogo/categorias/page.tsx
  - Import: `Categoria` → `Category`
  - Import: `categoriasTestData` → `categoriesTestData`
  - All property references

#### Menu Page
- [ ] /src/app/(admin)/catalogo/cardapios/page.tsx
  - Import: `Cardapio` → `Menu`
  - Import: `cardapiosTestData` → `menusTestData`
  - Import: `produtosTestData` → `productsTestData`
  - All property references

#### Orders Page
- [ ] /src/app/(admin)/pedidos/page.tsx
  - Import: `Pedido` → `Order`
  - Import: `Mesa` → `Table`
  - Import: `ItemPedido` → `OrderItem`
  - Import: `Pagamento` → `Payment`
  - Import: `MetodoPagamento` → `PaymentMethod`
  - Import: `metodoPagamentoLabels` → `PAYMENT_METHOD_LABELS`
  - Import: `mesasTestData` → `tablesTestData`
  - Import: `pedidosTestData` → `ordersTestData`
  - Import: `produtosTestData` → `productsTestData`
  - All property references

## Execution Strategy

1. ✅ **Phase 1**: Create new English type files (DONE)
2. ✅ **Phase 2**: Create new English data files (DONE)
3. **Phase 3**: Update all page imports and references (IN PROGRESS)
4. **Phase 4**: Test each page individually
5. **Phase 5**: Remove any backup files
6. **Phase 6**: Run dev server and verify all pages work

## Testing Checklist

After migration:
- [ ] Products list page loads
- [ ] Products create page works
- [ ] Products view page displays data
- [ ] Products edit page works  
- [ ] Categories page loads and functions
- [ ] Menus page loads and displays products
- [ ] Orders page loads and displays orders
- [ ] All filters work correctly
- [ ] All forms submit correctly
- [ ] No TypeScript errors
- [ ] No console errors

## Backup Strategy

Before major changes:
```bash
# Backup command (if needed)
cp file.tsx file.tsx.backup
```

After successful migration:
```bash
# Remove backup files
find . -name "*.backup" -delete
```

## Current Status

**PHASE**: 3 - Updating page imports
**NEXT STEP**: Update /src/app/(admin)/catalogo/produtos/page.tsx completely
**BLOCKERS**: None
**ESTIMATED COMPLETION**: All pages need updates (7 files)
