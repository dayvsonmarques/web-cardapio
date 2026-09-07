# Aumentar fontes pequenas no site público — Design

## Objetivo

Textos pequenos do site público estão pequenos demais. Subir um degrau na escala
de tamanho, trocando as classes utilitárias no JSX (sem mexer no CSS/`@theme`).

## Escopo

18 arquivos:

- `src/app/cardapio/**/page.tsx` (page, produto/[id], carrinho, checkout,
  login, area-cliente)
- `src/components/cardapio/*.tsx` (CardapioHeader, CardapioFooter, CartMenu,
  CategoryFilter, ProductCard, LoadingOverlay)
- `src/components/landing/*.tsx` (HeroSection, ServicesSection, PricingSection,
  ClientsSection, ContactSection, Footer)

Fora: `src/app/admin`, `src/layout`, `src/components/common` e demais componentes
de dashboard. `src/app/page.tsx` e `LandingNav` não têm essas classes.

## Transformação

Por arquivo, em três passes nesta ordem (evita subir duas vezes):

1. `text-base` → `text-lg`
2. `text-sm` → `text-base`
3. `text-xs` → `text-sm`

Casa apenas o token inteiro, com fronteira `(?<![\w-]) … (?![\w-])`, então
prefixos de variante são preservados: `sm:text-sm` → `sm:text-base`,
`md:text-base` → `md:text-lg`, etc. `text-lg`, títulos e valores arbitrários
(`text-[Npx]`) não mudam. `text-theme-xs/sm` não ocorre nesses arquivos.

Resultado: corpo 16→18px, `text-sm` 14→16px, `text-xs` 12→14px.

## Verificação

`tsc --noEmit`, `next lint`, e render de `/`, `/cardapio`, `/cardapio/carrinho`,
`/cardapio/checkout`, `/cardapio/login`, `/cardapio/area-cliente`,
`/cardapio/produto/[id]`. Sem teste automatizado (troca de classe utilitária).

## Commits

~10 desses arquivos têm restyle não commitado do usuário nas mesmas linhas; o
bump não é separável por hunk. Decisão do usuário: commitar esses arquivos
inteiros (restyle + bump juntos).
