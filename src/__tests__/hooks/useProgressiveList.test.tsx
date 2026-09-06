import { render, screen, act } from '@testing-library/react';
import useProgressiveList from '@/hooks/useProgressiveList';

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

let ioInstances: Array<{ callback: IOCallback }>;

beforeEach(() => {
  ioInstances = [];

  class MockIntersectionObserver {
    callback: IOCallback;
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();

    constructor(callback: IOCallback) {
      this.callback = callback;
      ioInstances.push(this);
    }

    takeRecords() {
      return [];
    }
  }

  // @ts-expect-error - test shim for jsdom
  global.IntersectionObserver = MockIntersectionObserver;
});

const triggerIntersection = () => {
  act(() => {
    ioInstances.forEach((io) => io.callback([{ isIntersecting: true }]));
  });
};

const makeItems = (count: number) => Array.from({ length: count }, (_, i) => i);

function Harness({ items, batchSize }: { items: number[]; batchSize?: number }) {
  const { visibleItems, hasMore, sentinelRef } = useProgressiveList(items, batchSize);

  return (
    <div>
      <span data-testid="count">{visibleItems.length}</span>
      <span data-testid="has-more">{String(hasMore)}</span>
      {hasMore && <div data-testid="sentinel" ref={sentinelRef} />}
    </div>
  );
}

const count = () => Number(screen.getByTestId('count').textContent);
const hasMore = () => screen.getByTestId('has-more').textContent === 'true';

describe('useProgressiveList', () => {
  it('exposes only the first batch initially', () => {
    render(<Harness items={makeItems(20)} batchSize={8} />);

    expect(count()).toBe(8);
    expect(hasMore()).toBe(true);
  });

  it('has no more items when the list fits in the first batch', () => {
    render(<Harness items={makeItems(5)} batchSize={8} />);

    expect(count()).toBe(5);
    expect(hasMore()).toBe(false);
    expect(screen.queryByTestId('sentinel')).toBeNull();
  });

  it('reveals the next batch when the sentinel intersects', () => {
    render(<Harness items={makeItems(20)} batchSize={8} />);

    triggerIntersection();
    expect(count()).toBe(16);
    expect(hasMore()).toBe(true);

    triggerIntersection();
    expect(count()).toBe(20);
    expect(hasMore()).toBe(false);
  });

  it('never reveals more items than exist', () => {
    render(<Harness items={makeItems(10)} batchSize={8} />);

    triggerIntersection();
    triggerIntersection();

    expect(count()).toBe(10);
  });

  it('resets to the first batch when the items reference changes', () => {
    const { rerender } = render(<Harness items={makeItems(20)} batchSize={8} />);

    triggerIntersection();
    expect(count()).toBe(16);

    rerender(<Harness items={makeItems(20)} batchSize={8} />);
    expect(count()).toBe(8);
  });

  it('defaults to a batch size of 8', () => {
    render(<Harness items={makeItems(30)} />);

    expect(count()).toBe(8);
  });
});
