// Script para adicionar colunas de limite de entrega
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addColumns() {
  console.log('🔧 Adicionando colunas de limite de entrega...\n');

  try {
    // Tenta adicionar as colunas usando SQL direto
    await prisma.$executeRawUnsafe(`
      ALTER TABLE delivery_settings 
      ADD COLUMN IF NOT EXISTS "hasDeliveryLimit" BOOLEAN NOT NULL DEFAULT false
    `);
    console.log('✅ Coluna hasDeliveryLimit adicionada');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE delivery_settings 
      ADD COLUMN IF NOT EXISTS "maxDeliveryDistance" DOUBLE PRECISION
    `);
    console.log('✅ Coluna maxDeliveryDistance adicionada');

    console.log('\n✅ Colunas adicionadas com sucesso!');
    console.log('📝 Executando prisma generate...\n');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Colunas já existem no banco');
    } else {
      console.error('❌ Erro:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addColumns();
