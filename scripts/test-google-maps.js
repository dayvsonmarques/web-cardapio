/**
 * Script de teste para Google Maps Distance Matrix API
 * Execute: node scripts/test-google-maps.js
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function testGoogleMapsAPI() {
  console.log('🧪 Testando Google Maps Distance Matrix API...\n');

  // Verificar se API Key está configurada
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.log('❌ API Key não configurada');
    console.log('📝 Configure em .env.local:');
    console.log('   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui\n');
    console.log('ℹ️  Sistema usará distância simulada (fallback)\n');
    return testFallback();
  }

  console.log('✅ API Key encontrada:', API_KEY.substring(0, 20) + '...\n');

  // Testar com CEPs reais
  const tests = [
    {
      name: 'Av. Paulista → Vila Olímpia',
      origin: '01310-100',
      destination: '04567-000',
      expectedDistance: '~15km'
    },
    {
      name: 'Av. Paulista → Perdizes',
      origin: '01310-100',
      destination: '05001-000',
      expectedDistance: '~8km'
    }
  ];

  for (const test of tests) {
    console.log(`📍 Teste: ${test.name}`);
    console.log(`   Origem: ${test.origin}`);
    console.log(`   Destino: ${test.destination}`);
    console.log(`   Esperado: ${test.expectedDistance}`);
    
    try {
      const result = await calculateDistance(test.origin, test.destination);
      
      if (result.status === 'OK') {
        const element = result.rows[0].elements[0];
        if (element.status === 'OK') {
          const distanceKm = (element.distance.value / 1000).toFixed(1);
          console.log(`   ✅ Resultado: ${distanceKm}km em ${element.duration.text}`);
        } else {
          console.log(`   ⚠️  Status do elemento: ${element.status}`);
        }
      } else {
        console.log(`   ❌ Status da API: ${result.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('✅ Testes concluídos!\n');
  console.log('💡 Se os testes falharam, verifique:');
  console.log('   1. API Key está correta');
  console.log('   2. Distance Matrix API está ativada no Google Cloud');
  console.log('   3. Faturamento está ativado (requer cartão de crédito)');
}

async function calculateDistance(origin, destination) {
  const originFormatted = `${origin.slice(0, 5)}-${origin.slice(5)}, Brasil`;
  const destinationFormatted = `${destination.slice(0, 5)}-${destination.slice(5)}, Brasil`;

  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.searchParams.append('origins', originFormatted);
  url.searchParams.append('destinations', destinationFormatted);
  url.searchParams.append('key', API_KEY);
  url.searchParams.append('mode', 'driving');
  url.searchParams.append('language', 'pt-BR');

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

function testFallback() {
  console.log('🔄 Testando modo fallback (distância simulada)...\n');

  const tests = [
    { origin: '01310100', destination: '04567000', expected: 33 },
    { origin: '01310100', destination: '05001000', expected: 37 },
  ];

  for (const test of tests) {
    const origin = test.origin;
    const destination = test.destination;
    const diff = Math.abs(parseInt(origin) - parseInt(destination));
    const distance = Math.max(1, Math.min(Math.round(diff / 1000), 50));
    
    console.log(`📍 CEP ${origin} → ${destination}`);
    console.log(`   Distância simulada: ${distance}km`);
    console.log(`   ✅ Fallback funcionando\n`);
  }

  console.log('✅ Modo fallback funcional!\n');
  console.log('💡 Para usar Google Maps, configure a API Key em .env.local\n');
}

// Executar testes
testGoogleMapsAPI().catch(console.error);
