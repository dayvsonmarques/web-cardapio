import { render, screen, fireEvent, act } from '@testing-library/react';
import CartMenu from '@/components/cardapio/CartMenu';
import { CartProvider } from '@/context/CartContext';

const renderMenu = () =>
  render(
    <CartProvider>
      <CartMenu />
    </CartProvider>,
  );

// O <div> que carrega os handlers de hover é o pai do link do carrinho.
const hoverArea = () => screen.getByTitle('Ver Carrinho').parentElement as HTMLElement;
const dropdownVisible = () => screen.queryByText('Seu carrinho está vazio') !== null;

describe('CartMenu - dropdown no hover (desktop)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('não mostra o dropdown antes do hover', () => {
    renderMenu();
    expect(dropdownVisible()).toBe(false);
  });

  it('mostra o dropdown ao entrar com o mouse', () => {
    renderMenu();
    act(() => {
      fireEvent.mouseEnter(hoverArea());
    });
    expect(dropdownVisible()).toBe(true);
  });

  it('não fecha imediatamente ao sair com o mouse (janela de tolerância)', () => {
    renderMenu();
    const area = hoverArea();

    act(() => {
      fireEvent.mouseEnter(area);
    });
    act(() => {
      fireEvent.mouseLeave(area);
    });

    // Segue visível logo após o mouseleave — dá tempo de mover até o dropdown.
    expect(dropdownVisible()).toBe(true);
  });

  it('fecha após a janela de tolerância se o mouse não voltar', () => {
    renderMenu();
    const area = hoverArea();

    act(() => {
      fireEvent.mouseEnter(area);
    });
    act(() => {
      fireEvent.mouseLeave(area);
    });
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(dropdownVisible()).toBe(false);
  });

  it('permanece aberto se o mouse voltar dentro da janela de tolerância', () => {
    renderMenu();
    const area = hoverArea();

    act(() => {
      fireEvent.mouseEnter(area);
    });
    act(() => {
      fireEvent.mouseLeave(area);
    });
    act(() => {
      jest.advanceTimersByTime(100);
      fireEvent.mouseEnter(area);
    });
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(dropdownVisible()).toBe(true);
  });
});
