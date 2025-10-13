export enum DeliveryType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
  FIXED_PLUS_KM = 'FIXED_PLUS_KM',
  FREE_ABOVE_VALUE = 'FREE_ABOVE_VALUE',
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
  allowPickup: boolean;
  isActive: boolean;
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
  allowPickup: boolean;
  isActive: boolean;
}

export const deliveryTypeLabels: Record<DeliveryType, string> = {
  [DeliveryType.FIXED]: 'Custo Fixo',
  [DeliveryType.VARIABLE]: 'Custo Variável (por KM)',
  [DeliveryType.FIXED_PLUS_KM]: 'Custo Fixo + Valor por KM',
  [DeliveryType.FREE_ABOVE_VALUE]: 'Frete Grátis Acima de Valor',
};
