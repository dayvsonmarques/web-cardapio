# Máscara e validação de telefone no checkout — Design

## Objetivo

No formulário de `/cardapio/checkout`, o campo **Telefone** passa a:

- formatar o valor enquanto o usuário digita (máscara de celular BR);
- validar que é um celular válido com DDD antes de confirmar o pedido.

## Contexto

- [src/app/cardapio/checkout/page.tsx](../../../src/app/cardapio/checkout/page.tsx):
  formulário controlado por `formData`; `handleChange` grava o valor cru; o botão
  "Confirmar Pedido" chama `handleSubmit` (que hoje não valida nada além do
  atributo `required`, e o botão fica fora do `<form>`).
- [src/lib/utils.ts](../../../src/lib/utils.ts) já tem `validatePhone` (aceita 10
  ou 11 dígitos), usado só nos próprios testes. **Não será alterado.**
- [src/hooks/useViaCep.ts](../../../src/hooks/useViaCep.ts) tem `formatCep` — o
  padrão de máscara progressiva a seguir.

## Decisão

"Sempre celular": máscara e validação assumem 11 dígitos, com `9` logo após o DDD.

## Componentes

### `src/lib/utils.ts` (novas funções)

```ts
export function formatPhone(value: string): string
export function isValidMobilePhone(phone: string): boolean
```

**`formatPhone`** — máscara progressiva rumo a `(XX) XXXXX-XXXX`:

| dígitos crus | saída |
|---|---|
| `""` | `""` |
| `"1"` | `"(1"` |
| `"11"` | `"(11"` |
| `"119"` | `"(11) 9"` |
| `"1192345"` | `"(11) 92345"` |
| `"11923456789"` | `"(11) 92345-6789"` |
| `"119234567890123"` | `"(11) 92345-6789"` (corta em 11) |

**`isValidMobilePhone`** — remove não-dígitos; `true` sse `length === 11` e o
3º dígito é `9`. Rejeita vazio, 10 dígitos, e 11 dígitos sem o `9`.

### `src/app/cardapio/checkout/page.tsx`

- `onChange` do telefone: `formatPhone(value)` antes do `setFormData`;
  `maxLength={15}`.
- Estado novo `phoneError: string | null`; `phoneRef: RefObject<HTMLInputElement>`.
- **onBlur** do telefone: se preenchido e `!isValidMobilePhone` →
  `phoneError = "Informe um celular válido com DDD, ex.: (11) 91234-5678"`.
  Se vazio → `phoneError = null` (o `required` cuida do vazio).
- **handleSubmit**: primeiro valida o telefone; se inválido → seta `phoneError`,
  `phoneRef.current?.focus()`, `return` (não limpa carrinho, não mostra o alert).
- Visual: quando `phoneError`, o input recebe borda vermelha e
  `aria-invalid="true"`; abaixo, `<p id="phone-error"
  className="mt-1 text-sm text-red-600 dark:text-red-400">{phoneError}</p>`,
  associado via `aria-describedby="phone-error"`.

## Casos de borda

- Colar um número com texto/símbolos: `formatPhone` ignora não-dígitos.
- Número com mais de 11 dígitos: cortado em 11 pela máscara.
- Campo vazio no submit: bloqueado por `required` (comportamento atual mantido);
  a validação JS trata do "preenchido mas inválido".
- Usuário logado cujo `user.phone` vem sem máscara: o `useEffect` de preenchimento
  passa a aplicar `formatPhone` ao popular o campo.

## Testes

`src/__tests__/lib/utils.test.ts` — novos blocos:

- `formatPhone`: cada linha da tabela acima; entrada com lixo não numérico.
- `isValidMobilePhone`: `"(11) 91234-5678"` → true; `"11912345678"` → true;
  `"1133334444"` (10 díg.) → false; `"11812345678"` (3º ≠ 9) → false; `""` → false.
