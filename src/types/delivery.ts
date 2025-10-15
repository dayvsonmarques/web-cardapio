export enum DeliveryType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
  FIXED_PLUS_KM = 'FIXED_PLUS_KM',
  FREE_ABOVE_VALUE = 'FREE_ABOVE_VALUE',
  RANGE_BASED = 'RANGE_BASED',
}

export interface DistanceRange {
  id?: string;
  minDistance: number;
  maxDistance: number;
  cost: number;
  isFree: boolean;
}

export interface DeliverySettings {
  id: string;
  storeStreet: string;
  storeNumber: string;
  storeComplement?: string | null;
  storeNeighborhood: string;
  storeCity: string;
  storeState: string;
  storeZipCode: string;
  deliveryType: DeliveryType;
  fixedCost: number;
  costPerKm: number;
  freeDeliveryMinValue?: number | null;
  hasDeliveryLimit: boolean;
  maxDeliveryDistance?: number | null;
  allowPickup: boolean;
  isActive: boolean;
  distanceRanges?: DistanceRange[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryFormData {
  storeStreet: string;
  storeNumber: string;
  storeComplement?: string;
  storeNeighborhood: string;
  storeCity: string;
  storeState: string;
  storeZipCode: string;
  deliveryType: DeliveryType;
  fixedCost: number;
  costPerKm: number;
  freeDeliveryMinValue?: number;
  hasDeliveryLimit: boolean;
  maxDeliveryDistance?: number;
  allowPickup: boolean;
  isActive: boolean;
  distanceRanges?: DistanceRange[];
}

export const deliveryTypeLabels: Record<DeliveryType, string> = {
  [DeliveryType.FIXED]: 'Custo Fixo',
  [DeliveryType.VARIABLE]: 'Custo Variável (por KM)',
  [DeliveryType.FIXED_PLUS_KM]: 'Custo Fixo + Valor por KM',
  [DeliveryType.RANGE_BASED]: 'Custo Variável por Faixa de Distância',
  [DeliveryType.FREE_ABOVE_VALUE]: 'Frete Grátis Acima de Valor',
};
