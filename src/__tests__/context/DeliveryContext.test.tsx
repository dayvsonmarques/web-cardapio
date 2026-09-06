import { renderHook, act } from '@testing-library/react';
import { DeliveryProvider, useDelivery } from '@/context/DeliveryContext';

const address = {
  cep: '52070-290',
  street: 'Rua Teste',
  neighborhood: 'Boa Viagem',
  city: 'Recife',
  state: 'PE',
};

describe('DeliveryContext', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('throws when useDelivery is used outside the provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useDelivery())).toThrow(
      'useDelivery must be used within a DeliveryProvider',
    );
    spy.mockRestore();
  });

  it('starts empty', () => {
    const { result } = renderHook(() => useDelivery(), { wrapper: DeliveryProvider });
    expect(result.current.address).toBeNull();
    expect(result.current.distanceKm).toBeNull();
    expect(result.current.cost).toBeNull();
    expect(result.current.isFree).toBe(false);
  });

  it('merges partial updates via setDelivery', () => {
    const { result } = renderHook(() => useDelivery(), { wrapper: DeliveryProvider });

    act(() => result.current.setDelivery({ address, distanceKm: 5 }));
    act(() => result.current.setDelivery({ cost: 12.5, isFree: false }));

    expect(result.current.address).toEqual(address);
    expect(result.current.distanceKm).toBe(5);
    expect(result.current.cost).toBe(12.5);
  });

  it('clears back to empty with clearDelivery', () => {
    const { result } = renderHook(() => useDelivery(), { wrapper: DeliveryProvider });

    act(() => result.current.setDelivery({ address, cost: 10 }));
    act(() => result.current.clearDelivery());

    expect(result.current.address).toBeNull();
    expect(result.current.cost).toBeNull();
  });

  it('persists to sessionStorage and hydrates a fresh provider from it', () => {
    const first = renderHook(() => useDelivery(), { wrapper: DeliveryProvider });
    act(() => first.result.current.setDelivery({ address, distanceKm: 8, cost: 0, isFree: true }));

    // Um provider novo (nova montagem) deve ler o que ficou salvo.
    const second = renderHook(() => useDelivery(), { wrapper: DeliveryProvider });
    expect(second.result.current.address).toEqual(address);
    expect(second.result.current.distanceKm).toBe(8);
    expect(second.result.current.isFree).toBe(true);
  });
});
