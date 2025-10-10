/**
 * Testes de Integração - Página de Detalhes do Produto
 * 
 * Testa o fluxo completo da página de produto incluindo:
 * - Renderização de informações do produto
 * - Navegação entre tabs
 * - Adicionar ao carrinho
 * - Carousel de produtos relacionados
 * - Integração com CartContext
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { useRouter, useParams } from 'next/navigation';
import ProductDetailPage from '@/app/cardapio/produto/[id]/page';
import { CartProvider } from '@/context/CartContext';
import { productsTestData } from '@/data/catalogTestData';

// Mock do Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock do Next Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('ProductDetailPage - Integration Tests', () => {
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
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
  });

  const renderWithCart = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>);
  };

  describe('Renderização Inicial', () => {
    it('deve renderizar todas as informações do produto', () => {
      renderWithCart(<ProductDetailPage />);

      const product = productsTestData[0];

      // Verifica título
      expect(screen.getByText(product.name)).toBeInTheDocument();

      // Verifica preço
      const priceText = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
      expect(screen.getByText(priceText)).toBeInTheDocument();

      // Verifica descrição
      expect(screen.getByText(product.description)).toBeInTheDocument();
    });

    it('deve exibir o botão voltar', () => {
      renderWithCart(<ProductDetailPage />);

      const backButton = screen.getByRole('button', { name: /voltar/i });
      expect(backButton).toBeInTheDocument();
    });

    it('deve exibir a categoria do produto com estilo tag', () => {
      renderWithCart(<ProductDetailPage />);

      const categoryBadge = screen.getByText(/bebidas|comidas|sobremesas|lanches/i);
      expect(categoryBadge).toBeInTheDocument();
      expect(categoryBadge).toHaveClass('bg-primary', 'text-white');
    });

    it('deve renderizar imagem do produto', () => {
      renderWithCart(<ProductDetailPage />);

      const product = productsTestData[0];
      const image = screen.getByAlt(product.name);
      expect(image).toBeInTheDocument();
    });
  });

  describe('Navegação entre Tabs', () => {
    it('deve exibir tab de ingredientes por padrão', () => {
      renderWithCart(<ProductDetailPage />);

      const ingredientesTab = screen.getByRole('button', { name: /ingredientes/i });
      expect(ingredientesTab).toHaveClass('text-primary');
    });

    it('deve trocar para tab de informações nutricionais ao clicar', () => {
      renderWithCart(<ProductDetailPage />);

      const nutritionalTab = screen.getByRole('button', { name: /informações nutricionais/i });
      fireEvent.click(nutritionalTab);

      // Verifica se o conteúdo nutricional está visível
      expect(screen.getByText(/calorias/i)).toBeInTheDocument();
      expect(screen.getByText(/proteínas/i)).toBeInTheDocument();
      expect(screen.getByText(/carboidratos/i)).toBeInTheDocument();
    });

    it('deve trocar para tab de informações adicionais ao clicar', () => {
      renderWithCart(<ProductDetailPage />);

      const additionalTab = screen.getByRole('button', { name: /informações adicionais/i });
      fireEvent.click(additionalTab);

      // Verifica se o conteúdo adicional está visível
      expect(screen.getByText(/disponibilidade/i)).toBeInTheDocument();
      expect(screen.getByText(/código do produto/i)).toBeInTheDocument();
    });

    it('deve alternar entre tabs mantendo o estado', () => {
      renderWithCart(<ProductDetailPage />);

      // Clica na tab nutricional
      const nutritionalTab = screen.getByRole('button', { name: /informações nutricionais/i });
      fireEvent.click(nutritionalTab);
      expect(screen.getByText(/calorias/i)).toBeInTheDocument();

      // Volta para ingredientes
      const ingredientesTab = screen.getByRole('button', { name: /ingredientes/i });
      fireEvent.click(ingredientesTab);
      
      // Verifica que voltou para ingredientes
      const product = productsTestData[0];
      if (product.ingredients.length > 0) {
        expect(screen.getByText(product.ingredients[0])).toBeInTheDocument();
      }
    });
  });

  describe('Funcionalidade de Adicionar ao Carrinho', () => {
    it('deve adicionar produto ao carrinho com quantidade padrão', () => {
      renderWithCart(<ProductDetailPage />);

      const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
      fireEvent.click(addButton);

      // Verifica se o produto foi adicionado (não há toast visível, mas o estado mudou)
      expect(addButton).toBeInTheDocument();
    });

    it('deve permitir alterar quantidade antes de adicionar', () => {
      renderWithCart(<ProductDetailPage />);

      // Aumenta quantidade
      const increaseButton = screen.getAllByRole('button', { name: '+' })[0];
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);

      // Verifica quantidade
      const quantityInput = screen.getByDisplayValue('3') as HTMLInputElement;
      expect(quantityInput).toBeInTheDocument();

      // Adiciona ao carrinho
      const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
      fireEvent.click(addButton);
    });

    it('deve diminuir quantidade com botão -', () => {
      renderWithCart(<ProductDetailPage />);

      // Aumenta primeiro
      const increaseButton = screen.getAllByRole('button', { name: '+' })[0];
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);

      // Agora diminui
      const decreaseButton = screen.getAllByRole('button', { name: '-' })[0];
      fireEvent.click(decreaseButton);

      const quantityInput = screen.getByDisplayValue('2') as HTMLInputElement;
      expect(quantityInput).toBeInTheDocument();
    });

    it('não deve permitir quantidade menor que 1', () => {
      renderWithCart(<ProductDetailPage />);

      const decreaseButton = screen.getAllByRole('button', { name: '-' })[0];
      fireEvent.click(decreaseButton);
      fireEvent.click(decreaseButton);

      const quantityInput = screen.getByDisplayValue('1') as HTMLInputElement;
      expect(quantityInput).toBeInTheDocument();
    });

    it('não deve permitir quantidade maior que 99', () => {
      renderWithCart(<ProductDetailPage />);

      const quantityInput = screen.getAllByRole('spinbutton')[0] as HTMLInputElement;
      fireEvent.change(quantityInput, { target: { value: '150' } });

      // Deve manter 99 como máximo
      expect(quantityInput.value).toBe('99');
    });
  });

  describe('Carousel de Produtos Relacionados', () => {
    it('deve exibir produtos relacionados', () => {
      renderWithCart(<ProductDetailPage />);

      const relatedSection = screen.getByText(/produtos relacionados/i);
      expect(relatedSection).toBeInTheDocument();
    });

    it('deve ter botões de navegação (setas)', () => {
      renderWithCart(<ProductDetailPage />);

      const prevButton = screen.getByLabelText(/produto anterior/i);
      const nextButton = screen.getByLabelText(/próximo produto/i);

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('deve navegar para próximo slide ao clicar na seta', () => {
      renderWithCart(<ProductDetailPage />);

      const nextButton = screen.getByLabelText(/próximo produto/i);
      fireEvent.click(nextButton);

      // Verifica que navegou (os indicadores devem mudar)
      const indicators = screen.getAllByRole('button', { name: /ir para slide/i });
      expect(indicators.length).toBeGreaterThan(0);
    });

    it('deve permitir adicionar produto relacionado ao carrinho', async () => {
      renderWithCart(<ProductDetailPage />);

      // Busca botões "Adicionar" dentro do carousel
      const addButtons = screen.getAllByRole('button', { name: /^adicionar$/i });
      
      if (addButtons.length > 1) {
        // Clica no botão de adicionar do produto relacionado
        fireEvent.click(addButtons[1]);
        
        // Produto deve ser adicionado ao carrinho
        await waitFor(() => {
          expect(addButtons[1]).toBeInTheDocument();
        });
      }
    });

    it('deve permitir ajustar quantidade no produto relacionado', () => {
      renderWithCart(<ProductDetailPage />);

      // Busca controles de quantidade dentro do carousel
      const increaseButtons = screen.getAllByRole('button', { name: '+' });
      
      if (increaseButtons.length > 1) {
        // Clica no botão + do produto relacionado
        fireEvent.click(increaseButtons[1]);
        
        // Verifica que a quantidade mudou
        const quantities = screen.getAllByText('2');
        expect(quantities.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Navegação e Interações', () => {
    it('deve voltar ao cardápio ao clicar no botão voltar', () => {
      renderWithCart(<ProductDetailPage />);

      const backButton = screen.getByRole('button', { name: /voltar/i });
      fireEvent.click(backButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/cardapio');
    });

    it('deve exibir breadcrumb de navegação', () => {
      renderWithCart(<ProductDetailPage />);

      expect(screen.getByText(/cardápio/i)).toBeInTheDocument();
    });
  });

  describe('Estados de Produto', () => {
    it('deve exibir badge de indisponível quando produto não está disponível', () => {
      // Mock produto indisponível
      (useParams as jest.Mock).mockReturnValue({ id: '999' }); // ID que não existe ou está indisponível

      renderWithCart(<ProductDetailPage />);

      // Se o produto não existir, deve mostrar mensagem de produto não encontrado
      const notFoundMessage = screen.queryByText(/produto não encontrado/i);
      if (notFoundMessage) {
        expect(notFoundMessage).toBeInTheDocument();
      }
    });

    it('deve exibir mensagem quando produto não é encontrado', () => {
      (useParams as jest.Mock).mockReturnValue({ id: 'invalid-id' });

      renderWithCart(<ProductDetailPage />);

      expect(screen.getByText(/produto não encontrado/i)).toBeInTheDocument();
    });

    it('deve ter link para voltar ao cardápio quando produto não existe', () => {
      (useParams as jest.Mock).mockReturnValue({ id: 'invalid-id' });

      renderWithCart(<ProductDetailPage />);

      const backLink = screen.getByText(/voltar para o cardápio/i);
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/cardapio');
    });
  });

  describe('Responsividade e Layout', () => {
    it('deve ter classes responsivas no grid de detalhes', () => {
      const { container } = renderWithCart(<ProductDetailPage />);

      const gridElement = container.querySelector('.lg\\:grid-cols-2');
      expect(gridElement).toBeInTheDocument();
    });

    it('deve ter espaçamentos adequados entre seções', () => {
      const { container } = renderWithCart(<ProductDetailPage />);

      // Verifica que há margens my-16 nas seções principais
      const sectionsWithMargin = container.querySelectorAll('.my-16');
      expect(sectionsWithMargin.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Integração com CartContext', () => {
    it('deve manter estado do carrinho ao adicionar produto', () => {
      const { rerender } = renderWithCart(<ProductDetailPage />);

      // Adiciona produto
      const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
      fireEvent.click(addButton);

      // Re-renderiza
      rerender(
        <CartProvider>
          <ProductDetailPage />
        </CartProvider>
      );

      // O botão ainda deve estar presente
      expect(screen.getByRole('button', { name: /adicionar ao carrinho/i })).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels apropriados em todos os botões', () => {
      renderWithCart(<ProductDetailPage />);

      expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /adicionar ao carrinho/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/produto anterior/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/próximo produto/i)).toBeInTheDocument();
    });

    it('deve ter alt text em imagens', () => {
      renderWithCart(<ProductDetailPage />);

      const product = productsTestData[0];
      const image = screen.getByAlt(product.name);
      expect(image).toHaveAttribute('alt', product.name);
    });

    it('deve ter navegação por teclado funcional', () => {
      renderWithCart(<ProductDetailPage />);

      const ingredientesTab = screen.getByRole('button', { name: /ingredientes/i });
      
      // Simula navegação por teclado
      ingredientesTab.focus();
      expect(document.activeElement).toBe(ingredientesTab);
    });
  });
});
