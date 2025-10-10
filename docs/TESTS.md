# 🧪 Testes Unitários

## 📋 Visão Geral

Este projeto utiliza **Jest** e **React Testing Library** para testes unitários e de integração.

## 🚀 Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa ao salvar)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## 📁 Estrutura dos Testes

```
src/
├── __tests__/
│   ├── lib/              # Testes de utilitários
│   │   ├── jwt.test.ts
│   │   └── utils.test.ts
│   ├── api/              # Testes de rotas API
│   │   └── auth-login.test.ts
│   ├── components/       # Testes de componentes React
│   │   └── Badge.test.tsx
│   └── context/          # Testes de Context API
│       └── CartContext.test.tsx
```

## 🧩 Tipos de Testes

### 1. Testes de Utilitários (`lib/`)

**Arquivo:** `src/lib/utils.ts`
**Testes:** `src/__tests__/lib/utils.test.ts`

Funções testadas:
- ✅ `formatPrice()` - Formatação de preços em R$
- ✅ `formatDate()` - Formatação de datas (PT-BR)
- ✅ `formatDateTime()` - Formatação de data/hora
- ✅ `validateCPF()` - Validação de CPF
- ✅ `validatePhone()` - Validação de telefone
- ✅ `validateEmail()` - Validação de email
- ✅ `validateCEP()` - Validação de CEP
- ✅ `calculatePercentage()` - Cálculo de porcentagem
- ✅ `truncateText()` - Truncar texto com elipses

**Exemplo de uso:**
```typescript
import { formatPrice, validateCPF } from '@/lib/utils';

const price = formatPrice(10.5);        // "R$ 10,50"
const isValid = validateCPF('111.444.777-35'); // true
```

### 2. Testes de JWT (`lib/jwt.ts`)

**Testes:** `src/__tests__/lib/jwt.test.ts`

Funções testadas:
- ✅ `createToken()` - Criação de JWT
- ✅ `verifyToken()` - Verificação e decode de JWT
- ✅ Validação de tokens inválidos
- ✅ Validação de tokens adulterados
- ✅ Integridade dos dados do payload

### 3. Testes de Componentes React

**Badge Component**
**Testes:** `src/__tests__/components/Badge.test.tsx`

Cenários testados:
- ✅ Renderização com children
- ✅ Variantes (light/solid)
- ✅ Cores (primary, success, error, warning, info)
- ✅ Tamanhos (sm, md)
- ✅ Ícones (start/end)
- ✅ Classes CSS aplicadas

### 4. Testes de Context API

**CartContext**
**Testes:** `src/__tests__/context/CartContext.test.tsx`

Funcionalidades testadas:
- ✅ `addItem()` - Adicionar produto ao carrinho
- ✅ `removeItem()` - Remover produto
- ✅ `updateQuantity()` - Atualizar quantidade
- ✅ `clearCart()` - Limpar carrinho
- ✅ `getTotalItems()` - Total de itens
- ✅ `getTotalPrice()` - Preço total
- ✅ Incremento de quantidade para item existente
- ✅ Múltiplos produtos no carrinho
- ✅ Remoção quando quantidade é zero

### 5. Testes de API Routes

**Login Route**
**Testes:** `src/__tests__/api/auth-login.test.ts`

Cenários testados:
- ✅ Login com credenciais corretas
- ✅ Login com usuário inexistente (401)
- ✅ Login com senha incorreta (401)
- ✅ Validação de campos obrigatórios
- ✅ Tratamento de erros de banco de dados
- ✅ Senha não retornada no response

## 📊 Cobertura de Código

Para visualizar o relatório de cobertura:

```bash
npm run test:coverage
```

O relatório será gerado em `coverage/lcov-report/index.html`

### Metas de Cobertura

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

## 🛠️ Configuração

### Jest Config (`jest.config.js`)

```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
}
```

### Jest Setup (`jest.setup.js`)

```javascript
import '@testing-library/jest-dom'
```

## 📝 Escrevendo Novos Testes

### Teste de Componente React

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Teste de Hook/Context

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });
});
```

### Teste de API Route

```typescript
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/my-route/route';

describe('GET /api/my-route', () => {
  it('should return 200', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-route');
    const response = await GET(request);
    expect(response.status).toBe(200);
  });
});
```

### Teste de Função Utilitária

```typescript
import { myUtilFunction } from '@/lib/utils';

describe('myUtilFunction', () => {
  it('should return expected result', () => {
    expect(myUtilFunction(input)).toBe(expectedOutput);
  });
});
```

## 🐛 Debug de Testes

Para debugar testes específicos:

```bash
# Executar apenas um arquivo
npm test -- utils.test.ts

# Executar testes com pattern
npm test -- --testNamePattern="formatPrice"

# Modo verbose
npm test -- --verbose

# Sem cache
npm test -- --no-cache
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Checklist para Novos Testes

Ao adicionar novos testes, certifique-se de:

- [ ] Teste cobre casos de sucesso
- [ ] Teste cobre casos de erro
- [ ] Teste cobre edge cases (valores nulos, vazios, etc)
- [ ] Testes são isolados (não dependem de ordem)
- [ ] Mocks são limpos entre testes
- [ ] Nomes dos testes são descritivos
- [ ] Testes são rápidos (< 1s cada)
- [ ] Cobertura adequada das funcionalidades críticas

## 🎯 Próximos Passos

Áreas para expandir a cobertura de testes:

1. **Componentes de UI**
   - [ ] Button
   - [ ] Modal
   - [ ] Table
   - [ ] Dropdown

2. **Pages**
   - [ ] Login page
   - [ ] Product list page
   - [ ] Checkout page

3. **API Routes**
   - [ ] Products routes
   - [ ] Orders routes
   - [ ] Tables routes

4. **Integration Tests**
   - [ ] User flow completo (login → adicionar ao carrinho → checkout)
   - [ ] Admin flow (criar produto → editar → deletar)

5. **E2E Tests** (Futuro)
   - Considerar Playwright ou Cypress para testes end-to-end
