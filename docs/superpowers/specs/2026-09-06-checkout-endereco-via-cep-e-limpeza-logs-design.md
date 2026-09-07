# Endereço no checkout via CEP, overlay de loading e limpeza de logs — Design

Três frentes, uma entrega:

1. Remover `console.log` de debug do fluxo do cardápio.
2. Overlay de loading em tela cheia durante o cálculo de frete.
3. Endereço da finalização passa a ser dirigido pelo CEP, herdando o que foi
   informado no carrinho.

---

## 1. Limpeza de logs

Remover apenas `console.log` de debug (os `console.error` de `catch` ficam):

| Arquivo | O que sai |
|---|---|
| `src/context/CartContext.tsx` | os 8 `console.log` |
| `src/hooks/useDeliveryCalculator.ts` | `console.log('Erro ao buscar endereço via CEP', err)` (o `catch` fica, silencioso) |
| `src/app/cardapio/checkout/page.tsx` | `console.log("Pedido finalizado:", …)` |
| `src/app/api/delivery-settings/route.ts` | ~13 `console.log` de debug em POST/PUT (inclui os com emoji) |

Fora de escopo: logs de stubs do admin, componentes de exemplo, user-profile.

## 2. `LoadingOverlay`

`src/components/cardapio/LoadingOverlay.tsx` (novo):

- Props: `show: boolean`, `message?: string` (default `"Carregando..."`).
- Retorna `null` quando `!show`.
- `fixed inset-0 z-[60]`, fundo `bg-black/40 backdrop-blur-sm`, card central
  (`bg-white dark:bg-gray-800`) com o spinner já usado no projeto
  (`h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary`)
  + a mensagem.
- `role="status"`, `aria-live="polite"`.

Usado no carrinho e no checkout, ligado a `deliveryLoading` do
`useDeliveryCalculator`.

## 3. Endereço via CEP

### `src/context/DeliveryContext.tsx` (novo)

```ts
interface DeliveryAddress {
  cep: string;        // formatado "00000-000"
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface DeliveryState {
  address: DeliveryAddress | null;
  distanceKm: number | null;
  cost: number | null;      // null = frete ainda não calculado
  isFree: boolean;
}

interface DeliveryContextValue extends DeliveryState {
  setDelivery: (partial: Partial<DeliveryState>) => void;
  clearDelivery: () => void;
}
```

- `useState` com initializer SSR-safe: se `typeof window !== 'undefined'`, lê
  `sessionStorage.getItem('cardapio.delivery')` dentro de try/catch; senão estado
  vazio.
- `useEffect([state])` grava em `sessionStorage` (try/catch).
- `useDelivery()` lança se usado fora do provider.
- Provider montado em `src/app/layout.tsx`, dentro de `<CartProvider>`.

### `carrinho/page.tsx`

- Ao ter sucesso em `calculateDelivery` (`result.success`), além dos states
  locais atuais, chama
  `setDelivery({ address: { ...result.data.address, cep: cepFormatado }, distanceKm: result.data.distance ?? null, cost: result.data.cost, isFree: result.data.isFree })`.
- No mount, se `delivery.address` existe: pré-preenche o input `cep` com
  `delivery.address.cep` (os demais states locais podem ser reidratados a partir
  do context para manter a UI consistente ao voltar ao carrinho).
- Renderiza `<LoadingOverlay show={deliveryLoading} message="Calculando frete..." />`.

### `checkout/page.tsx`

Remove o `<input name="address">` de texto livre. Nova seção "Endereço de
Entrega":

- **CEP** — `<input>` com `formatCep`; `onBlur`/ao completar 8 dígitos dispara
  `calculateDelivery(cep, getTotalPrice())`:
  - sucesso → guarda structured address em state local + `setDelivery(...)`,
    mostra frete no Resumo, revela os campos travados;
  - erro → exibe `result.error`, não revela endereço.
- **Rua / Bairro / Cidade / UF** — `<input disabled>` (estilo apagado), só
  aparecem quando há endereço resolvido; valores do ViaCEP.
- **Número** — `<input>` obrigatório.
- **Complemento** — `<input>` opcional.
- `<LoadingOverlay show={deliveryLoading} message="Calculando frete..." />`.

Mount:

- Se `delivery.address` existe → `cep`, endereço travado e frete já vêm
  carregados.
- Senão → só o campo de CEP visível.
- O `useEffect` que hoje preenche `formData.address` a partir de
  `user.addresses` é **removido** (nome/telefone/e-mail continuam vindo do
  usuário logado). Endereço passa a ser sempre via CEP.

`handleSubmit`:

- valida telefone (regra atual) **e** exige `address` resolvido + `numero`
  preenchido; se faltar, seta erro visível e não envia.
- Monta string legível para o payload:
  `"{street}, {numero}{ - complemento?} — {neighborhood}, {city}/{state} — CEP {cep}"`.
- Após `clearCart()`, chama `clearDelivery()`.

## Casos de borda

- `sessionStorage` indisponível (aba anônima, bloqueado): try/catch, cai para
  estado vazio; app funciona, só não persiste.
- CEP alterado no checkout depois de já ter endereço: novo `calculateDelivery`
  sobrescreve address/cost/distance no context.
- Carrinho vazio no checkout: comportamento atual de redirect é mantido.
- Usuário volta ao carrinho após calcular no checkout: `delivery.address` do
  context reidrata a UI.

## Testes

- `src/__tests__/components/LoadingOverlay.test.tsx` — não renderiza com
  `show=false`; com `show=true` mostra a mensagem e expõe `role="status"`.
- `src/__tests__/context/DeliveryContext.test.tsx` — `setDelivery` mescla;
  `clearDelivery` zera; persiste e reidrata via `sessionStorage`; `useDelivery`
  fora do provider lança.
- `src/__tests__/components/checkout.test.tsx` (com
  `jest.mock('@/components/cardapio/CardapioHeader')`):
  - sem `delivery.address` → aparece só o campo de CEP, sem inputs de rua/número;
  - com `DeliveryProvider` pré-populado → rua/bairro/cidade/UF travados + campo
    de número visíveis, CEP preenchido;
  - `handleSubmit` sem número → mensagem de erro, sem "pedido realizado".
