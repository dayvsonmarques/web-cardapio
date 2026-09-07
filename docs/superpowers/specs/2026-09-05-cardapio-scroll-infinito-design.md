# Scroll infinito no cardápio — Design

## Objetivo

Na página `/cardapio`, exibir os produtos de forma incremental em vez de renderizar
a lista inteira de uma vez. Novos lotes são carregados automaticamente conforme o
usuário rola até o fim do grid.

## Contexto

- Os produtos vêm de dados locais (`productsTestData` em `src/data/catalogTestData.ts`),
  sem paginação de API.
- A página já filtra por categoria (`selectedCategoryId`) e busca (`searchTerm`),
  produzindo `filteredProducts` via `useMemo`.

## Abordagem

Revelação progressiva client-side:

- Lote de **8** produtos.
- Gatilho por `IntersectionObserver` observando um elemento sentinela no fim do grid.
- Sem alteração de backend, dados ou componentes de card.

## Componentes

### `src/hooks/useProgressiveList.ts` (novo)

Hook genérico e reutilizável.

- Assinatura: `useProgressiveList<T>(items: T[], batchSize = 8)`
- Retorna:
  - `visibleItems: T[]` — `items.slice(0, visibleCount)`
  - `hasMore: boolean` — `visibleCount < items.length`
  - `sentinelRef: RefObject<HTMLDivElement>` — anexar a um elemento no fim da lista
- Estado interno: `visibleCount`, inicia em `batchSize`.
- `useEffect` reseta `visibleCount` para `batchSize` quando a referência de `items`
  muda (busca/categoria alteram o array filtrado).
- `useEffect` cria um `IntersectionObserver` no `sentinelRef`; ao intersectar e
  havendo `hasMore`, `setVisibleCount(c => c + batchSize)`. Faz cleanup ao
  desmontar ou quando as dependências mudam.
- Guarda para ambiente sem `IntersectionObserver` (SSR/teste): não quebra, apenas
  não observa.

### `src/app/cardapio/page.tsx` (alteração)

- `const { visibleItems, hasMore, sentinelRef } = useProgressiveList(filteredProducts, 8)`
- O grid renderiza `visibleItems` em vez de `filteredProducts`.
- Quando `hasMore`, renderiza `<div ref={sentinelRef}>` logo após o grid, com um
  indicador simples ("Carregando mais produtos...").
- O bloco "Nenhum produto encontrado" continua baseado em `filteredProducts.length`.

## Fluxo de dados

```
filteredProducts (useMemo) ──▶ useProgressiveList ──▶ visibleItems ──▶ grid
                                      ▲
                          IntersectionObserver no sentinelRef
```

## Tratamento de erros / casos de borda

- `items` vazio: `visibleItems = []`, `hasMore = false`, sentinela não renderiza.
- Filtro reduz a lista abaixo de `visibleCount`: reset para `batchSize` no efeito
  de mudança de `items`.
- `IntersectionObserver` indisponível: hook não observa; lista mostra o primeiro
  lote (degradação aceitável; sem regressão de erro).

## Testes

`src/__tests__/hooks/useProgressiveList.test.tsx` com `renderHook`:

- Inicia expondo apenas `batchSize` itens.
- `hasMore` verdadeiro quando há mais itens, falso quando todos visíveis.
- Ao trocar a referência de `items`, `visibleCount` volta a `batchSize`.
- Simular interseção (mock de `IntersectionObserver`) aumenta `visibleItems` em `batchSize`.
- Lista menor que `batchSize`: `hasMore` falso, todos os itens visíveis.
