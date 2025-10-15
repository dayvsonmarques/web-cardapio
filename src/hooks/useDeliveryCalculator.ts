import { useState } from 'react';
import { calculateDistanceViaAPI } from '@/lib/googleMaps';

interface AddressInfo {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface DeliveryCalculation {
  type: 'FIXED' | 'VARIABLE' | 'FIXED_PLUS_KM' | 'FREE_ABOVE_VALUE' | 'RANGE_BASED';
  cost: number;
  distance?: number;
  address?: AddressInfo;
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

      // Buscar informações do endereço via ViaCEP
      let addressInfo: AddressInfo | undefined;
      try {
        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const viaCepData = await viaCepResponse.json();
        
        if (!viaCepData.erro) {
          addressInfo = {
            street: viaCepData.logradouro,
            neighborhood: viaCepData.bairro,
            city: viaCepData.localidade,
            state: viaCepData.uf,
          };
        }
      } catch (err) {
        console.log('Erro ao buscar endereço via CEP:', err);
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

      // Verificar se há limite de distância
      if (settings.hasDeliveryLimit && settings.maxDeliveryDistance) {
        if (distance > settings.maxDeliveryDistance) {
          throw new Error(
            `Desculpe, não entregamos nesta região. Nossa área de entrega é limitada a ${settings.maxDeliveryDistance}km. Distância calculada: ${distance.toFixed(1)}km`
          );
        }
      }

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

        case 'RANGE_BASED':
          // Buscar a faixa correspondente à distância
          if (settings.distanceRanges && settings.distanceRanges.length > 0) {
            interface DistanceRange {
              minDistance: number;
              maxDistance: number;
              cost: number;
              isFree: boolean;
            }
            
            const matchingRange = (settings.distanceRanges as DistanceRange[]).find(
              (range) => distance >= range.minDistance && distance <= range.maxDistance
            );

            if (matchingRange) {
              cost = matchingRange.isFree ? 0 : matchingRange.cost;
              isFree = matchingRange.isFree;
            } else {
              // Se não encontrar faixa correspondente, não entrega
              throw new Error(
                `Desculpe, não entregamos nesta distância (${distance.toFixed(1)}km). Verifique as faixas de entrega disponíveis.`
              );
            }
          } else {
            throw new Error('Faixas de distância não configuradas');
          }
          break;

        default:
          cost = 0;
      }

      return {
        type: settings.deliveryType,
        cost: Math.max(0, cost),
        distance,
        address: addressInfo,
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
