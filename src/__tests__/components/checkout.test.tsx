import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from '@/app/cardapio/checkout/page';
import { DeliveryProvider } from '@/context/DeliveryContext';

// CardapioHeader arrasta @/icons (stub de imagem no jest) -> substitui por nada.
jest.mock('@/components/cardapio/CardapioHeader', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));
jest.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: [{ product: { id: 'p1', name: 'Produto', price: 50 }, quantity: 1 }],
    getTotalPrice: () => 50,
    clearCart: jest.fn(),
  }),
}));

const savedAddress = {
  cep: '52070-290',
  street: 'Rua Teste',
  neighborhood: 'Boa Viagem',
  city: 'Recife',
  state: 'PE',
};

const seedDelivery = (state: object) =>
  window.sessionStorage.setItem('cardapio.delivery', JSON.stringify(state));

const renderCheckout = () =>
  render(
    <DeliveryProvider>
      <CheckoutPage />
    </DeliveryProvider>,
  );

describe('CheckoutPage - endereço via CEP', () => {
  const originalAlert = window.alert;

  beforeEach(() => {
    window.sessionStorage.clear();
    window.alert = jest.fn();
    global.fetch = jest.fn().mockRejectedValue(new Error('no network in test')) as unknown as typeof fetch;
  });

  afterEach(() => {
    window.alert = originalAlert;
    jest.restoreAllMocks();
  });

  it('sem CEP salvo: mostra só o campo de CEP, sem rua/número nem endereço livre', () => {
    renderCheckout();

    expect(screen.getByPlaceholderText('00000-000')).toBeTruthy();
    expect(screen.queryByText('Número *')).toBeNull();
    expect(screen.queryByPlaceholderText('Rua, número, bairro')).toBeNull();
    expect(
      screen.getByText('Informe o CEP para carregarmos o endereço de entrega.'),
    ).toBeTruthy();
  });

  it('com endereço salvo no contexto: vem o CEP, os campos travados e o frete no resumo', () => {
    seedDelivery({ address: savedAddress, distanceKm: 3, cost: 8, isFree: false });
    renderCheckout();

    expect((screen.getByPlaceholderText('00000-000') as HTMLInputElement).value).toBe('52070-290');
    expect((screen.getByDisplayValue('Rua Teste') as HTMLInputElement).readOnly).toBe(true);
    expect(screen.getByText('Número *')).toBeTruthy();

    // Resumo: frete e total (50 + 8)
    expect(screen.getByText('R$ 8,00')).toBeTruthy();
    expect(screen.getByText('R$ 58,00')).toBeTruthy();
  });

  it('bloqueia o envio se o número não for informado', () => {
    seedDelivery({ address: savedAddress, distanceKm: 3, cost: 8, isFree: false });
    renderCheckout();

    fireEvent.change(screen.getByPlaceholderText('(11) 91234-5678'), {
      target: { value: '11912345678' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Pedido' }));

    expect(screen.getByText('Informe o número do endereço.')).toBeTruthy();
    expect(window.alert).not.toHaveBeenCalled();
  });
});
