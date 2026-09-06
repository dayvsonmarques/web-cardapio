"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface DeliveryAddress {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface DeliveryState {
  address: DeliveryAddress | null;
  distanceKm: number | null;
  cost: number | null;
  isFree: boolean;
}

interface DeliveryContextValue extends DeliveryState {
  setDelivery: (partial: Partial<DeliveryState>) => void;
  clearDelivery: () => void;
}

const STORAGE_KEY = "cardapio.delivery";
const EMPTY: DeliveryState = {
  address: null,
  distanceKm: null,
  cost: null,
  isFree: false,
};

const DeliveryContext = createContext<DeliveryContextValue | undefined>(undefined);

const readStored = (): DeliveryState => {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<DeliveryState>) };
  } catch {
    return EMPTY;
  }
};

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DeliveryState>(readStored);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage indisponível (aba anônima, bloqueado) — segue sem persistir
    }
  }, [state]);

  const setDelivery = (partial: Partial<DeliveryState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const clearDelivery = () => setState(EMPTY);

  return (
    <DeliveryContext.Provider value={{ ...state, setDelivery, clearDelivery }}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const ctx = useContext(DeliveryContext);
  if (ctx === undefined) {
    throw new Error("useDelivery must be used within a DeliveryProvider");
  }
  return ctx;
};
