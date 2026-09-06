# Toast ao adicionar produto no carrinho — Design

## Objetivo

Ao adicionar um produto ao carrinho, exibir um toast de confirmação.

## Contexto

- Infra de toast já existe: `react-hot-toast`, `<Toaster>` montado em
  `src/app/layout.tsx` (`src/components/common/ToastProvider.tsx`), já usado em
  `src/app/admin/entregas/page.tsx` via `toast.success(...)`.
- `addItem` é chamado por `ProductCard.tsx` e `src/app/cardapio/produto/[id]/page.tsx`.

## Decisão

- Disparo **dentro de `CartContext.addItem`** — um único ponto, cobre todos os
  chamadores presentes e futuros.
- Mensagem **fixa**: `"Produto adicionado ao carrinho"` (sem nome nem quantidade).

## Implementação

`src/context/CartContext.tsx`:

```ts
import toast from "react-hot-toast";
// ...
const addItem = (product, quantity) => {
  setItems((prevItems) => { /* inalterado */ });
  toast.success("Produto adicionado ao carrinho");
};
```

O `toast.success` fica **fora** do updater do `setItems` (updater pode rodar duas
vezes em StrictMode). Cobre tanto item novo quanto incremento de quantidade.

## Testes

`src/__tests__/context/CartContext.test.tsx`:

- `jest.mock("react-hot-toast")` com `default.success` mockado.
- Novo caso: `addItem(product, 1)` chama
  `toast.success("Produto adicionado ao carrinho")`.
- Os casos existentes seguem passando (mock não quebra nada).
