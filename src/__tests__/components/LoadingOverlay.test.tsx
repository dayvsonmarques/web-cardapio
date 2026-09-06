import { render, screen } from '@testing-library/react';
import LoadingOverlay from '@/components/cardapio/LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders nothing when show is false', () => {
    const { container } = render(<LoadingOverlay show={false} message="Calculando frete..." />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the message and a status role when show is true', () => {
    render(<LoadingOverlay show message="Calculando frete..." />);

    const status = screen.getByRole('status');
    expect(status).not.toBeNull();
    expect(status.textContent).toContain('Calculando frete...');
  });

  it('falls back to a default message', () => {
    render(<LoadingOverlay show />);
    expect(screen.getByRole('status').textContent).toContain('Carregando...');
  });
});
