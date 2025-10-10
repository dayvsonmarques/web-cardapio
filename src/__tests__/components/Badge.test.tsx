import { render, screen } from '@testing-library/react';
import Badge from '@/components/ui/badge/Badge';

describe('Badge Component', () => {
  it('should render badge with children', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should apply default variant and color', () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-brand-50', 'text-brand-500');
  });

  it('should render with solid variant', () => {
    const { container } = render(
      <Badge variant="solid" color="success">
        Success
      </Badge>
    );
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-success-500', 'text-white');
  });

  it('should render with different colors', () => {
    const { rerender, container } = render(<Badge color="error">Error</Badge>);
    expect(container.firstChild).toHaveClass('bg-error-50', 'text-error-600');

    rerender(<Badge color="warning">Warning</Badge>);
    expect(container.firstChild).toHaveClass('bg-warning-50', 'text-warning-600');

    rerender(<Badge color="info">Info</Badge>);
    expect(container.firstChild).toHaveClass('bg-blue-light-50', 'text-blue-light-500');
  });

  it('should render with different sizes', () => {
    const { rerender, container } = render(<Badge size="sm">Small</Badge>);
    expect(container.firstChild).toHaveClass('text-theme-xs');

    rerender(<Badge size="md">Medium</Badge>);
    expect(container.firstChild).toHaveClass('text-sm');
  });

  it('should render with start icon', () => {
    const StartIcon = () => <span data-testid="start-icon">→</span>;
    render(
      <Badge startIcon={<StartIcon />}>
        With Start Icon
      </Badge>
    );
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByText('With Start Icon')).toBeInTheDocument();
  });

  it('should render with end icon', () => {
    const EndIcon = () => <span data-testid="end-icon">←</span>;
    render(
      <Badge endIcon={<EndIcon />}>
        With End Icon
      </Badge>
    );
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByText('With End Icon')).toBeInTheDocument();
  });

  it('should render with both icons', () => {
    const StartIcon = () => <span data-testid="start-icon">→</span>;
    const EndIcon = () => <span data-testid="end-icon">←</span>;
    render(
      <Badge startIcon={<StartIcon />} endIcon={<EndIcon />}>
        With Both Icons
      </Badge>
    );
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByText('With Both Icons')).toBeInTheDocument();
  });

  it('should apply all base styles', () => {
    const { container } = render(<Badge>Test</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'font-medium'
    );
  });
});
