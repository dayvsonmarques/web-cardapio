import { NextRequest, NextResponse } from 'next/server';
import { resolveDistanceResult } from '@/lib/googleMaps';

/**
 * API Route para calcular distância via Google Maps.
 * Mantém a API key segura no servidor e sempre responde com um resultado
 * utilizável: em qualquer falha da Google, cai para a distância simulada.
 */
export async function POST(request: NextRequest) {
  let originCep = '';
  let destinationCep = '';

  try {
    ({ originCep, destinationCep } = await request.json());
  } catch {
    return NextResponse.json(
      { error: 'Corpo da requisição inválido' },
      { status: 400 }
    );
  }

  if (!originCep || !destinationCep) {
    return NextResponse.json(
      { error: 'CEPs de origem e destino são obrigatórios' },
      { status: 400 }
    );
  }

  const result = await resolveDistanceResult(originCep, destinationCep, {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  return NextResponse.json(result);
}
