import { NextRequest, NextResponse } from 'next/server';

interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }>;
  }>;
  status: string;
}

/**
 * API Route para calcular distância via Google Maps
 * Mantém a API key segura no servidor
 */
export async function POST(request: NextRequest) {
  try {
    const { originCep, destinationCep } = await request.json();

    if (!originCep || !destinationCep) {
      return NextResponse.json(
        { error: 'CEPs de origem e destino são obrigatórios' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      // Retorna distância simulada se API key não estiver configurada
      return NextResponse.json(simulateDistance(originCep, destinationCep));
    }

    // Remove formatação dos CEPs
    const origin = originCep.replace(/\D/g, '');
    const destination = destinationCep.replace(/\D/g, '');

    // Formata CEPs para consulta
    const originFormatted = `${origin.slice(0, 5)}-${origin.slice(5)}, Brasil`;
    const destinationFormatted = `${destination.slice(0, 5)}-${destination.slice(5)}, Brasil`;

    // Chama Google Maps Distance Matrix API
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
      // Se não conseguir calcular, retorna distância simulada
      return NextResponse.json(simulateDistance(originCep, destinationCep));
    }

    return NextResponse.json({
      distanceKm: Math.round(element.distance.value / 1000 * 10) / 10,
      distanceText: element.distance.text,
      durationText: element.duration.text,
      durationMinutes: Math.round(element.duration.value / 60),
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    
    // Fallback para distância simulada
    const { originCep, destinationCep } = await request.json();
    return NextResponse.json(simulateDistance(originCep, destinationCep));
  }
}

function simulateDistance(originCep: string, destinationCep: string) {
  const cep1 = originCep.replace(/\D/g, '');
  const cep2 = destinationCep.replace(/\D/g, '');

  const diff = Math.abs(parseInt(cep1) - parseInt(cep2));
  const distanceKm = Math.max(1, Math.min(Math.round(diff / 1000), 50));
  const durationMinutes = Math.round((distanceKm / 40) * 60);

  return {
    distanceKm,
    distanceText: `${distanceKm} km`,
    durationText: `${durationMinutes} min`,
    durationMinutes,
  };
}
