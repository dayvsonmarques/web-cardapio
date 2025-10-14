/**
 * Google Maps Distance Matrix API Integration
 * Calcula distância real entre dois endereços via Google Maps
 */

interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: {
        text: string;
        value: number; // em metros
      };
      duration: {
        text: string;
        value: number; // em segundos
      };
      status: string;
    }>;
  }>;
  status: string;
}

interface DistanceResult {
  distanceKm: number;
  distanceText: string;
  durationText: string;
  durationMinutes: number;
}

/**
 * Calcula a distância real entre dois CEPs usando Google Maps Distance Matrix API
 * @param originCep CEP de origem (loja)
 * @param destinationCep CEP de destino (cliente)
 * @returns Distância em km e tempo estimado
 */
export async function calculateRealDistance(
  originCep: string,
  destinationCep: string
): Promise<DistanceResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('Google Maps API key not configured. Using simulated distance.');
    return simulateDistance(originCep, destinationCep);
  }

  try {
    // Remove formatação dos CEPs
    const origin = originCep.replace(/\D/g, '');
    const destination = destinationCep.replace(/\D/g, '');

    // Formata CEPs para consulta (Brasil)
    const originFormatted = `${origin.slice(0, 5)}-${origin.slice(5)}, Brasil`;
    const destinationFormatted = `${destination.slice(0, 5)}-${destination.slice(5)}, Brasil`;

    // Monta URL da API
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.append('origins', originFormatted);
    url.searchParams.append('destinations', destinationFormatted);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('mode', 'driving');
    url.searchParams.append('language', 'pt-BR');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`);
    }

    const data: DistanceMatrixResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Maps API status: ${data.status}`);
    }

    const element = data.rows[0]?.elements[0];

    if (!element || element.status !== 'OK') {
      throw new Error(`Distance calculation failed: ${element?.status}`);
    }

    return {
      distanceKm: Math.round(element.distance.value / 1000 * 10) / 10, // metros para km
      distanceText: element.distance.text,
      durationText: element.duration.text,
      durationMinutes: Math.round(element.duration.value / 60),
    };
  } catch (error) {
    console.error('Error calculating real distance:', error);
    
    // Fallback para distância simulada
    return simulateDistance(originCep, destinationCep);
  }
}

/**
 * Calcula distância simulada (fallback quando API não está disponível)
 * Mantém compatibilidade com implementação anterior
 */
function simulateDistance(
  originCep: string,
  destinationCep: string
): DistanceResult {
  const cep1 = originCep.replace(/\D/g, '');
  const cep2 = destinationCep.replace(/\D/g, '');

  const diff = Math.abs(parseInt(cep1) - parseInt(cep2));
  const distanceKm = Math.max(1, Math.min(Math.round(diff / 1000), 50));

  // Estima tempo baseado em 40km/h de velocidade média
  const durationMinutes = Math.round((distanceKm / 40) * 60);

  return {
    distanceKm,
    distanceText: `${distanceKm} km`,
    durationText: `${durationMinutes} min`,
    durationMinutes,
  };
}

/**
 * Valida se a API Key do Google Maps está configurada
 */
export function isGoogleMapsConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return !!(apiKey && apiKey !== 'your_api_key_here');
}

/**
 * Calcula distância via API do backend (server-side)
 * Recomendado para evitar expor API key no frontend
 */
export async function calculateDistanceViaAPI(
  originCep: string,
  destinationCep: string
): Promise<DistanceResult | null> {
  try {
    const response = await fetch('/api/calculate-distance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originCep,
        destinationCep,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to calculate distance');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling distance API:', error);
    return null;
  }
}
