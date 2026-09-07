// Script para testar conexão com banco e API delivery-settings
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🧪 Testando conexão com banco de dados...\n');

  try {
    // Testa conexão
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida\n');

    // Verifica configurações de entrega
    console.log('📦 Buscando configurações de entrega...');
    const settings = await prisma.deliverySettings.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (settings) {
      console.log('✅ Configuração encontrada:');
      console.log(JSON.stringify(settings, null, 2));
    } else {
      console.log('⚠️  Nenhuma configuração de entrega encontrada');
      console.log('💡 Acesse http://localhost:3000/admin/entregas para criar uma\n');
    }

  } catch (error) {
    console.error('❌ Erro ao conectar com banco:', error.message);
    console.log('\n📝 Verifique:');
    console.log('   1. PostgreSQL está rodando?');
    console.log('   2. DATABASE_URL está correto no .env.local?');
    console.log('   3. Banco "cardapio" existe?\n');
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
