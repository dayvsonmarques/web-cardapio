const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Exemplos de faixas de distância pré-configuradas
const EXAMPLE_RANGES = {
  restaurante_local: [
    { minDistance: 0, maxDistance: 2, cost: 0, isFree: true },
    { minDistance: 2, maxDistance: 4, cost: 5.00, isFree: false },
    { minDistance: 4, maxDistance: 6, cost: 10.00, isFree: false },
    { minDistance: 6, maxDistance: 8, cost: 15.00, isFree: false },
  ],
  
  ecommerce_regional: [
    { minDistance: 0, maxDistance: 10, cost: 0, isFree: true },
    { minDistance: 10, maxDistance: 30, cost: 15.00, isFree: false },
    { minDistance: 30, maxDistance: 50, cost: 30.00, isFree: false },
    { minDistance: 50, maxDistance: 100, cost: 50.00, isFree: false },
  ],
  
  delivery_premium: [
    { minDistance: 0, maxDistance: 5, cost: 8.00, isFree: false },
    { minDistance: 5, maxDistance: 10, cost: 12.00, isFree: false },
    { minDistance: 10, maxDistance: 15, cost: 18.00, isFree: false },
    { minDistance: 15, maxDistance: 20, cost: 25.00, isFree: false },
  ],
  
  exemplo_completo: [
    { minDistance: 1, maxDistance: 3, cost: 0, isFree: true },
    { minDistance: 3, maxDistance: 5, cost: 10.00, isFree: false },
    { minDistance: 5, maxDistance: 7, cost: 15.00, isFree: false },
    { minDistance: 7, maxDistance: 10, cost: 20.00, isFree: false },
  ],
};

async function addExampleRanges(tipo = 'exemplo_completo') {
  try {
    console.log(`\n🔧 Adicionando faixas de exemplo: ${tipo}\n`);

    // Buscar configuração de entrega existente
    const settings = await prisma.deliverySettings.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!settings) {
      console.error('❌ Nenhuma configuração de entrega encontrada!');
      console.log('   Execute primeiro o setup de entregas.');
      return;
    }

    console.log(`✅ Configuração encontrada: ${settings.id}\n`);

    // Atualizar tipo de entrega para RANGE_BASED
    await prisma.deliverySettings.update({
      where: { id: settings.id },
      data: { deliveryType: 'RANGE_BASED' },
    });

    console.log('✅ Tipo de entrega atualizado para RANGE_BASED\n');

    // Deletar faixas antigas (se houver)
    await prisma.distanceRange.deleteMany({
      where: { deliverySettingsId: settings.id },
    });

    console.log('✅ Faixas antigas removidas\n');

    // Adicionar novas faixas
    const ranges = EXAMPLE_RANGES[tipo] || EXAMPLE_RANGES.exemplo_completo;
    
    for (const range of ranges) {
      await prisma.distanceRange.create({
        data: {
          deliverySettingsId: settings.id,
          minDistance: range.minDistance,
          maxDistance: range.maxDistance,
          cost: range.cost,
          isFree: range.isFree,
          updatedAt: new Date(),
        },
      });

      const costText = range.isFree ? 'Frete Grátis' : `R$ ${range.cost.toFixed(2)}`;
      console.log(`   ✅ ${range.minDistance}km - ${range.maxDistance}km: ${costText}`);
    }

    console.log('\n✅ Faixas de exemplo adicionadas com sucesso!\n');
    console.log('📋 Resumo:');
    console.log(`   - Tipo: ${tipo}`);
    console.log(`   - Total de faixas: ${ranges.length}`);
    console.log(`   - Configuração ID: ${settings.id}\n`);
    console.log('🎯 Acesse o admin para visualizar ou editar as faixas\n');

  } catch (error) {
    console.error('❌ Erro ao adicionar faixas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
const tipo = process.argv[2] || 'exemplo_completo';

console.log('\n📦 Tipos disponíveis:');
console.log('   - restaurante_local');
console.log('   - ecommerce_regional');
console.log('   - delivery_premium');
console.log('   - exemplo_completo (padrão)\n');
console.log(`   Usando: ${tipo}\n`);

addExampleRanges(tipo)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
