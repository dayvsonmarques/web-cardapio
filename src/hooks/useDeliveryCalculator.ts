import { useState } from 'react';
import { calculateDistanceViaAPI } from '@/lib/googleMaps';

interface DeliveryCalculation {
  type: 'FIXED' | 'VARIABLE' | 'FIXED_PLUS_KM' | 'FREE_ABOVE_VALUE';
  cost: number;
  distance?: number;
  durationText?: string;
  isFree: boolean;
}

export function useDeliveryCalculator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDelivery = async (
    cep: string,
    orderTotal: number
  ): Promise<DeliveryCalculation | null> => {
    try {
      setLoading(true);
      setError(null);

      // Buscar configurações de entrega
      const settingsResponse = await fetch('/api/delivery-settings');
      if (!settingsResponse.ok) {
        throw new Error('Erro ao buscar configurações de entrega');
      }

      const settings = await settingsResponse.json();
      
      if (!settings || !settings.isActive) {
        throw new Error('Serviço de entrega não disponível');
      }

      // Calcular distância real usando Google Maps API
      const distanceResult = await calculateDistanceViaAPI(
        settings.storeZipCode,
        cep
      );

      if (!distanceResult) {
        throw new Error('Não foi possível calcular a distância');
      }

      const distance = distanceResult.distanceKm;
      const durationText = distanceResult.durationText;

      let cost = 0;
      let isFree = false;

      switch (settings.deliveryType) {
        case 'FIXED':
          cost = settings.fixedCost;
          break;

        case 'VARIABLE':
          cost = distance * settings.costPerKm;
          break;

        case 'FIXED_PLUS_KM':
          cost = settings.fixedCost + (distance * settings.costPerKm);
          break;

        case 'FREE_ABOVE_VALUE':
          if (settings.freeDeliveryMinValue && orderTotal >= settings.freeDeliveryMinValue) {
            cost = 0;
            isFree = true;
          } else {
            cost = settings.fixedCost || 0;
          }
          break;

        default:
          cost = 0;
      }

      return {
        type: settings.deliveryType,
        cost: Math.max(0, cost),
        distance,
        durationText,
        isFree,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular frete';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { calculateDelivery, loading, error };
}
