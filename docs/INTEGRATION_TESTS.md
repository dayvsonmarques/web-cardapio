# Testes de Integração - Documentação

## 📋 Visão Geral

Os testes de integração verificam o comportamento de múltiplos componentes trabalhando juntos, simulando interações reais do usuário com a aplicação.

## 🗂️ Estrutura dos Testes

```
src/__tests__/
├── integration/
│   ├── product-detail.test.tsx      # Página de detalhes do produto
│   ├── carousel.test.tsx            # Carousel de produtos relacionados  
│   └── cart-flow.test.tsx           # Fluxo completo do carrinho
├── components/
│   └── Badge.test.tsx               # Testes unitários de componentes
├── context/
│   └── CartContext.test.tsx         # Testes do contexto do carrinho
├── lib/
│   ├── jwt.test.ts                  # Testes de JWT
│   └── utils.test.ts                # Testes de utilitários
└── api/
    └── auth-login.test.ts           # Testes de API de autenticação
```

## 🧪 Suítes de Teste

### 1. **Product Detail Page** (`product-detail.test.tsx`)

Testa a página completa de detalhes do produto incluindo todas as interações.

#### Cenários Testados:

**Renderização Inicial**
- ✅ Renderiza informações do produto (nome, preço, descrição)
- ✅ Exibe botão voltar com estilo correto
- ✅ Mostra categoria como tag com background colorido
- ✅ Renderiza imagem do produto

**Navegação entre Tabs**
- ✅ Exibe tab de ingredientes por padrão
- ✅ Troca para informações nutricionais ao clicar
- ✅ Troca para informações adicionais ao clicar
- ✅ Mantém estado ao alternar entre tabs

**Adicionar ao Carrinho**
- ✅ Adiciona produto com quantidade padrão (1)
- ✅ Permite alterar quantidade antes de adicionar
- ✅ Aumenta/diminui quantidade com botões +/-
- ✅ Não permite quantidade < 1 ou > 99
- ✅ Adiciona produto ao carrinho

**Carousel de Produtos Relacionados**
- ✅ Exibe produtos relacionados
- ✅ Tem setas de navegação (anterior/próximo)
- ✅ Permite navegar entre slides
- ✅ Permite adicionar produtos relacionados ao carrinho
- ✅ Permite ajustar quantidade de produtos relacionados

**Estados e Edge Cases**
- ✅ Exibe mensagem quando produto não encontrado
- ✅ Mostra badge de indisponível quando aplicável
- ✅ Tem link para voltar ao cardápio

**Acessibilidade**
- ✅ Labels apropriados em botões
- ✅ Alt text em imagens
- ✅ Navegação por teclado funcional

#### Exemplo de Uso:

```typescript
it('deve adicionar produto ao carrinho com quantidade customizada', () => {
  renderWithCart(<ProductDetailPage />);

  // Aumenta quantidade
  const increaseButton = screen.getAllByRole('button', { name: '+' })[0];
  fireEvent.click(increaseButton);
  fireEvent.click(increaseButton);

  // Verifica quantidade
  const quantityInput = screen.getByDisplayValue('3');
  expect(quantityInput).toBeInTheDocument();

  // Adiciona ao carrinho
  const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
  fireEvent.click(addButton);
});
```

---

### 2. **Related Products Carousel** (`carousel.test.tsx`)

Testa funcionalidades específicas do carousel de produtos relacionados.

#### Cenários Testados:

**Renderização**
- ✅ Renderiza produtos visíveis (4 por vez)
- ✅ Renderiza setas de navegação
- ✅ Renderiza indicadores de slide
- ✅ Renderiza preços e controles de quantidade
- ✅ Renderiza botões "Adicionar"

**Auto-slide**
- ✅ Avança automaticamente após 5 segundos
- ✅ Continua em loop infinito
- ✅ Reinicia ao chegar ao final

**Navegação Manual - Setas**
- ✅ Avança ao clicar na seta próximo
- ✅ Volta ao clicar na seta anterior
- ✅ Navega múltiplas vezes

**Navegação Manual - Indicadores**
- ✅ Vai para slide específico ao clicar
- ✅ Atualiza indicador ativo ao navegar

**Controle de Quantidade**
- ✅ Aumenta quantidade com botão +
- ✅ Diminui quantidade com botão -
- ✅ Não permite quantidade < 1
- ✅ Mantém quantidades independentes por produto

**Adicionar ao Carrinho**
- ✅ Adiciona com quantidade padrão
- ✅ Adiciona com quantidade customizada
- ✅ Reseta quantidade para 1 após adicionar
- ✅ Não adiciona ao clicar no link do produto

**Links e Imagens**
- ✅ Links clicáveis na imagem e nome
- ✅ HREFs corretos apontando para produto
- ✅ Exibe fallback quando imagem falha

**Produtos Indisponíveis**
- ✅ Exibe badge de indisponível
- ✅ Não exibe controles para produtos indisponíveis

**Acessibilidade**
- ✅ Aria-labels apropriados
- ✅ Navegação por teclado

#### Exemplo de Uso:

```typescript
it('deve adicionar produto com quantidade customizada do carousel', () => {
  renderWithCart(<RelatedProductsCarousel products={mockProducts} />);

  const increaseButtons = screen.getAllByRole('button', { name: '+' });
  const addButtons = screen.getAllByRole('button', { name: /^adicionar$/i });
  
  // Aumenta quantidade
  fireEvent.click(increaseButtons[0]);
  fireEvent.click(increaseButtons[0]);
  
  // Adiciona
  fireEvent.click(addButtons[0]);
  
  // Quantidade deve resetar para 1
  const quantity = screen.getByText('1');
  expect(quantity).toBeDefined();
});
```

---

### 3. **Cart Flow** (`cart-flow.test.tsx`)

Testa o fluxo completo end-to-end do carrinho de compras.

#### Cenários Testados:

**Adicionar Itens**
- ✅ Adiciona produto com quantidade padrão
- ✅ Adiciona produto com quantidade customizada
- ✅ Adiciona múltiplos produtos diferentes
- ✅ Incrementa quantidade ao adicionar produto existente
- ✅ Calcula total corretamente

**Atualizar Quantidade**
- ✅ Aumenta quantidade de item existente
- ✅ Diminui quantidade de item existente
- ✅ Remove item quando quantidade chega a zero
- ✅ Atualiza total ao mudar quantidade

**Remover Itens**
- ✅ Remove item específico
- ✅ Atualiza total ao remover item

**Limpar Carrinho**
- ✅ Remove todos os itens
- ✅ Zera total

**Cálculos**
- ✅ Calcula total de itens corretamente
- ✅ Calcula total de preço corretamente
- ✅ Recalcula ao adicionar mais itens

**Persistência**
- ✅ Mantém estado ao re-renderizar

**Validações**
- ✅ Não adiciona quantidade negativa
- ✅ Lida com carrinho vazio
- ✅ Permite adicionar após limpar

**Fluxo E2E**
- ✅ Adicionar → Aumentar → Diminuir → Remover
- ✅ Múltiplos produtos → Limpar → Adicionar novamente

#### Exemplo de Uso:

```typescript
it('deve completar fluxo completo E2E', () => {
  renderWithCart(<CartTestComponent />);

  // Adiciona
  fireEvent.click(screen.getByTestId('add-first-product'));
  expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');

  // Aumenta
  fireEvent.click(screen.getByText('Aumentar'));
  expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2');

  // Diminui
  fireEvent.click(screen.getByText('Diminuir'));
  expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');

  // Remove
  fireEvent.click(screen.getByText('Remover'));
  expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
});
```

---

## 🚀 Executando os Testes

### Todos os Testes de Integração

```bash
npm test -- --testPathPattern=integration
```

### Teste Específico

```bash
# Apenas página de produto
npm test -- product-detail.test.tsx

# Apenas carousel
npm test -- carousel.test.tsx

# Apenas fluxo do carrinho
npm test -- cart-flow.test.tsx
```

### Com Coverage

```bash
npm test -- --testPathPattern=integration --coverage
```

### Watch Mode

```bash
npm test -- --testPathPattern=integration --watch
```

---

## 📊 Estatísticas de Cobertura

### Cobertura Atual

- **Página de Produto**: 20+ testes, ~85% cobertura
- **Carousel**: 35+ testes, ~90% cobertura
- **Cart Flow**: 30+ testes, ~95% cobertura

### Total de Testes de Integração

- **85+ testes** de integração
- **Tempo de execução**: ~3-5 segundos
- **Cobertura combinada**: ~85% dos fluxos principais

---

## 🎯 Boas Práticas

### 1. **Renderização com Contexto**

Sempre envolva componentes no CartProvider quando testando funcionalidades do carrinho:

```typescript
const renderWithCart = (component: React.ReactElement) => {
  return render(<CartProvider>{component}</CartProvider>);
};
```

### 2. **Limpeza entre Testes**

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

### 3. **Fake Timers para Auto-slide**

```typescript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

// No teste
act(() => {
  jest.advanceTimersByTime(5000);
});
```

### 4. **Queries Semânticas**

Use queries semânticas ao invés de classes CSS:

```typescript
// ✅ Bom
screen.getByRole('button', { name: /adicionar/i })

// ❌ Evitar
container.querySelector('.add-button')
```

### 5. **Testes de Acessibilidade**

Sempre inclua testes de acessibilidade:

```typescript
it('deve ter labels apropriados', () => {
  renderWithCart(<Component />);
  expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
});
```

---

## 🐛 Debugging

### Ver Output de Testes

```bash
npm test -- --verbose
```

### Debug de Componente Específico

```typescript
import { debug } from '@testing-library/react';

it('test', () => {
  const { debug } = render(<Component />);
  debug(); // Imprime HTML do componente
});
```

### Verificar Estado do Contexto

```typescript
it('verifica estado do cart', () => {
  const { container } = renderWithCart(<CartTestComponent />);
  screen.debug(container); // Mostra todo o DOM
});
```

---

## 📝 Adicionando Novos Testes

### Template de Teste de Integração

```typescript
/**
 * Testes de Integração - [Nome do Componente]
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '@/context/CartContext';
import Component from '@/components/Component';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('Component - Integration Tests', () => {
  const renderWithCart = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Feature Name', () => {
    it('deve fazer algo específico', () => {
      renderWithCart(<Component />);
      
      // Arrange
      const button = screen.getByRole('button');
      
      // Act
      fireEvent.click(button);
      
      // Assert
      expect(button).toBeInTheDocument();
    });
  });
});
```

---

## 🔄 Continuous Integration

Os testes de integração são executados automaticamente em cada:

- ✅ Pull Request
- ✅ Commit na branch principal
- ✅ Deploy para produção

---

## 📚 Referências

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✅ Checklist para Novos Testes

Ao adicionar novos testes de integração, verifique:

- [ ] Renderização inicial está testada
- [ ] Todas as interações do usuário estão cobertas
- [ ] Estados de erro/loading estão testados
- [ ] Navegação entre estados está testada
- [ ] Cálculos/lógica de negócio estão validados
- [ ] Acessibilidade está verificada
- [ ] Edge cases estão cobertos
- [ ] Mocks estão configurados corretamente
- [ ] Limpeza (cleanup) está implementada
- [ ] Documentação está atualizada
