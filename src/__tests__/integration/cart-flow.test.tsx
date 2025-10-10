/**
 * Testes de Integração - Fluxo Completo do Carrinho
 * 
 * Testa o fluxo end-to-end do carrinho de compras:
 * - Navegação: Cardápio → Produto → Adicionar → Carrinho → Checkout
 * - Gestão de itens no carrinho
 * - Cálculos de totais
 * - Persistência de estado
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { CartProvider, useCart } from '@/context/CartContext';
import { productsTestData } from '@/data/catalogTestData';
import { Product } from '@/types/catalog';

// Mock do Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Componente de teste para acessar o contexto do carrinho
const CartTestComponent = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();

  return (
    <div>
      <div data-testid="cart-items-count">{getTotalItems()}</div>
      <div data-testid="cart-total-price">{getTotalPrice()}</div>
      <div data-testid="cart-items">
        {items.map((item) => (
          <div key={item.product.id} data-testid={`cart-item-${item.product.id}`}>
            <span data-testid={`item-name-${item.product.id}`}>{item.product.name}</span>
            <span data-testid={`item-quantity-${item.product.id}`}>{item.quantity}</span>
            <span data-testid={`item-price-${item.product.id}`}>{item.product.price}</span>
            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
              Aumentar
            </button>
            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
              Diminuir
            </button>
            <button onClick={() => removeItem(item.product.id)}>Remover</button>
          </div>
        ))}
      </div>
      <button
        onClick={() => addItem(productsTestData[0], 1)}
        data-testid="add-first-product"
      >
        Adicionar Primeiro Produto
      </button>
      <button
        onClick={() => addItem(productsTestData[1], 2)}
        data-testid="add-second-product"
      >
        Adicionar Segundo Produto
      </button>
      <button onClick={clearCart} data-testid="clear-cart">
        Limpar Carrinho
      </button>
    </div>
  );
};

describe('Cart Flow - Integration Tests', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    localStorage.clear();
  });

  const renderWithCart = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>);
  };

  describe('Adicionar Itens ao Carrinho', () => {
    it('deve adicionar produto ao carrinho com quantidade padrão', () => {
      renderWithCart(<CartTestComponent />);

      const addButton = screen.getByTestId('add-first-product');
      fireEvent.click(addButton);

      // Verifica que o item foi adicionado
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    });

    it('deve adicionar produto com quantidade customizada', () => {
      renderWithCart(<CartTestComponent />);

      const addButton = screen.getByTestId('add-second-product');
      fireEvent.click(addButton);

      // Verifica quantidade
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2');
    });

    it('deve adicionar múltiplos produtos diferentes', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      fireEvent.click(screen.getByTestId('add-second-product'));

      // Deve ter 3 itens no total (1 + 2)
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('3');
    });

    it('deve incrementar quantidade ao adicionar produto existente', () => {
      renderWithCart(<CartTestComponent />);

      const addButton = screen.getByTestId('add-first-product');
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      // Quantidade deve ser 2
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2');
    });

    it('deve calcular total corretamente ao adicionar produtos', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      
      const totalPrice = screen.getByTestId('cart-total-price');
      const expectedPrice = productsTestData[0].price.toFixed(2);
      
      expect(totalPrice.textContent).toContain(expectedPrice);
    });
  });

  describe('Atualizar Quantidade de Itens', () => {
    it('deve aumentar quantidade de item existente', () => {
      renderWithCart(<CartTestComponent />);

      // Adiciona produto
      fireEvent.click(screen.getByTestId('add-first-product'));

      // Aumenta quantidade
      const increaseButton = screen.getByText('Aumentar');
      fireEvent.click(increaseButton);

      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2');
    });

    it('deve diminuir quantidade de item existente', () => {
      renderWithCart(<CartTestComponent />);

      // Adiciona produto com quantidade 2
      fireEvent.click(screen.getByTestId('add-second-product'));

      // Diminui quantidade
      const decreaseButton = screen.getByText('Diminuir');
      fireEvent.click(decreaseButton);

      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    });

    it('deve remover item quando quantidade chega a zero', () => {
      renderWithCart(<CartTestComponent />);

      // Adiciona produto
      fireEvent.click(screen.getByTestId('add-first-product'));

      // Diminui até zero
      const decreaseButton = screen.getByText('Diminuir');
      fireEvent.click(decreaseButton);

      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
    });

    it('deve atualizar total ao mudar quantidade', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      
      const initialTotal = parseFloat(screen.getByTestId('cart-total-price').textContent || '0');

      // Aumenta quantidade
      fireEvent.click(screen.getByText('Aumentar'));

      const newTotal = parseFloat(screen.getByTestId('cart-total-price').textContent || '0');
      
      expect(newTotal).toBeGreaterThan(initialTotal);
    });
  });

  describe('Remover Itens do Carrinho', () => {
    it('deve remover item específico', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      fireEvent.click(screen.getByTestId('add-second-product'));

      // Remove primeiro produto
      const removeButton = screen.getAllByText('Remover')[0];
      fireEvent.click(removeButton);

      // Deve ter removido 1 item (restam 2 do segundo produto)
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2');
    });

    it('deve atualizar total ao remover item', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      fireEvent.click(screen.getByTestId('add-second-product'));

      const totalBeforeRemove = parseFloat(screen.getByTestId('cart-total-price').textContent || '0');

      // Remove item
      const removeButton = screen.getAllByText('Remover')[0];
      fireEvent.click(removeButton);

      const totalAfterRemove = parseFloat(screen.getByTestId('cart-total-price').textContent || '0');
      
      expect(totalAfterRemove).toBeLessThan(totalBeforeRemove);
    });
  });

  describe('Limpar Carrinho', () => {
    it('deve remover todos os itens ao limpar carrinho', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      fireEvent.click(screen.getByTestId('add-second-product'));

      // Limpa carrinho
      fireEvent.click(screen.getByTestId('clear-cart'));

      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total-price')).toHaveTextContent('0');
    });

    it('deve zerar total ao limpar carrinho', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      fireEvent.click(screen.getByTestId('clear-cart'));

      expect(screen.getByTestId('cart-total-price')).toHaveTextContent('0.00');
    });
  });

  describe('Cálculos de Totais', () => {
    it('deve calcular total de itens corretamente', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product')); // +1
      fireEvent.click(screen.getByTestId('add-second-product')); // +2

      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('3');
    });

    it('deve calcular total de preço corretamente', () => {
      renderWithCart(<CartTestComponent />);

      const product1 = productsTestData[0];
      const product2 = productsTestData[1];

      fireEvent.click(screen.getByTestId('add-first-product')); // 1x product1
      fireEvent.click(screen.getByTestId('add-second-product')); // 2x product2

      const expectedTotal = (product1.price * 1 + product2.price * 2).toFixed(2);
      const totalPrice = screen.getByTestId('cart-total-price');

      expect(totalPrice.textContent).toContain(expectedTotal);
    });

    it('deve recalcular total ao adicionar mais itens', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      const firstTotal = parseFloat(screen.getByTestId('cart-total-price').textContent || '0');

      fireEvent.click(screen.getByTestId('add-first-product'));
      const secondTotal = parseFloat(screen.getByTestId('cart-total-price').textContent || '0');

      expect(secondTotal).toBeGreaterThan(firstTotal);
    });
  });

  describe('Persistência de Estado', () => {
    it('deve manter estado ao re-renderizar', () => {
      const { rerender } = renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      
      // Re-renderiza
      rerender(
        <CartProvider>
          <CartTestComponent />
        </CartProvider>
      );

      // Estado deve persistir
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    });
  });

  describe('Validações e Edge Cases', () => {
    it('não deve adicionar quantidade negativa', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));

      // Tenta diminuir abaixo de zero
      const decreaseButton = screen.getByText('Diminuir');
      fireEvent.click(decreaseButton);
      fireEvent.click(decreaseButton);

      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
    });

    it('deve lidar com carrinho vazio', () => {
      renderWithCart(<CartTestComponent />);

      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total-price')).toHaveTextContent('0');
    });

    it('deve permitir adicionar item após limpar carrinho', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      fireEvent.click(screen.getByTestId('clear-cart'));
      fireEvent.click(screen.getByTestId('add-first-product'));

      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    });
  });

  describe('Renderização de Items', () => {
    it('deve renderizar informações corretas do produto', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));

      const product = productsTestData[0];
      expect(screen.getByTestId(`item-name-${product.id}`)).toHaveTextContent(product.name);
      expect(screen.getByTestId(`item-quantity-${product.id}`)).toHaveTextContent('1');
    });

    it('deve renderizar múltiplos itens corretamente', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));
      fireEvent.click(screen.getByTestId('add-second-product'));

      const product1 = productsTestData[0];
      const product2 = productsTestData[1];

      expect(screen.getByTestId(`cart-item-${product1.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`cart-item-${product2.id}`)).toBeInTheDocument();
    });
  });

  describe('Fluxo Completo E2E', () => {
    it('deve completar fluxo: adicionar → aumentar → diminuir → remover', () => {
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

    it('deve completar fluxo: múltiplos produtos → limpar → adicionar novamente', () => {
      renderWithCart(<CartTestComponent />);

      // Adiciona múltiplos
      fireEvent.click(screen.getByTestId('add-first-product'));
      fireEvent.click(screen.getByTestId('add-second-product'));
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('3');

      // Limpa
      fireEvent.click(screen.getByTestId('clear-cart'));
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');

      // Adiciona novamente
      fireEvent.click(screen.getByTestId('add-first-product'));
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    });
  });

  describe('Integração com Produtos', () => {
    it('deve manter referência ao produto original', () => {
      renderWithCart(<CartTestComponent />);

      fireEvent.click(screen.getByTestId('add-first-product'));

      const product = productsTestData[0];
      const itemName = screen.getByTestId(`item-name-${product.id}`);
      const itemPrice = screen.getByTestId(`item-price-${product.id}`);

      expect(itemName).toHaveTextContent(product.name);
      expect(itemPrice).toHaveTextContent(product.price.toString());
    });

    it('deve permitir adicionar produto indisponível (controle na UI)', () => {
      renderWithCart(<CartTestComponent />);

      // O carrinho em si não valida disponibilidade, isso é responsabilidade da UI
      fireEvent.click(screen.getByTestId('add-first-product'));
      
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    });
  });
});
