import { renderHook, act } from '@testing-library/react';
import { useDeliveryCalculator } from '@/hooks/useDeliveryCalculator';

type FetchStub = { ok?: boolean; body: unknown };

const originalFetch = global.fetch;

function stubFetch(routes: Array<[string, FetchStub]>) {
  global.fetch = jest.fn((input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();
    const match = routes.find(([pattern]) => url.includes(pattern));

    if (!match) {
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    }

    const [, stub] = match;
    return Promise.resolve({
      ok: stub.ok ?? true,
      json: async () => stub.body,
    } as Response);
  }) as unknown as typeof fetch;
}

const viaCepBody = {
  logradouro: 'Rua Teste',
  bairro: 'Boa Viagem',
  localidade: 'Recife',
  uf: 'PE',
};

const distanceBody = {
  distanceKm: 5,
  distanceText: '5 km',
  durationText: '10 min',
  durationMinutes: 10,
};

describe('useDeliveryCalculator', () => {
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns a success result with the calculated cost', async () => {
    stubFetch([
      [
        '/api/delivery-settings',
        {
          body: {
            isActive: true,
            storeZipCode: '52070290',
            deliveryType: 'FIXED',
            fixedCost: 12.5,
            hasDeliveryLimit: false,
          },
        },
      ],
      ['viacep.com.br', { body: viaCepBody }],
      ['/api/calculate-distance', { body: distanceBody }],
    ]);

    const { result } = renderHook(() => useDeliveryCalculator());

    let outcome;
    await act(async () => {
      outcome = await result.current.calculateDelivery('52070290', 100);
    });

    expect(outcome).toEqual({
      success: true,
      data: {
        type: 'FIXED',
        cost: 12.5,
        distance: 5,
        isFree: false,
        address: {
          street: 'Rua Teste',
          neighborhood: 'Boa Viagem',
          city: 'Recife',
          state: 'PE',
        },
      },
    });
  });

  it('returns a failure result with the specific message when delivery is inactive', async () => {
    stubFetch([['/api/delivery-settings', { body: { isActive: false } }]]);

    const { result } = renderHook(() => useDeliveryCalculator());

    let outcome: Awaited<ReturnType<typeof result.current.calculateDelivery>> | undefined;
    await act(async () => {
      outcome = await result.current.calculateDelivery('52070290', 100);
    });

    // O contrato: falha volta no retorno (não em estado assíncrono), com mensagem.
    expect(outcome?.success).toBe(false);
    expect(outcome && !outcome.success && outcome.error).toMatch(/serviço de entrega/i);
  });

  it('returns a failure result with the out-of-range message', async () => {
    stubFetch([
      [
        '/api/delivery-settings',
        {
          body: {
            isActive: true,
            storeZipCode: '52070290',
            deliveryType: 'FIXED',
            fixedCost: 10,
            hasDeliveryLimit: true,
            maxDeliveryDistance: 3,
          },
        },
      ],
      ['viacep.com.br', { body: viaCepBody }],
      ['/api/calculate-distance', { body: { ...distanceBody, distanceKm: 12 } }],
    ]);

    const { result } = renderHook(() => useDeliveryCalculator());

    let outcome: Awaited<ReturnType<typeof result.current.calculateDelivery>> | undefined;
    await act(async () => {
      outcome = await result.current.calculateDelivery('52070290', 100);
    });

    expect(outcome?.success).toBe(false);
    expect(outcome && !outcome.success && outcome.error).toMatch(/área de entrega/i);
  });
});
