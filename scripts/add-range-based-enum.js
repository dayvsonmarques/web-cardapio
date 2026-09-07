const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addRangeBasedEnum() {
  try {
    console.log('🔄 Adicionando RANGE_BASED ao enum DeliveryType...');
    
    // Adiciona o valor ao enum no PostgreSQL
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum 
          WHERE enumlabel = 'RANGE_BASED' 
          AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'DeliveryType')
        ) THEN
          ALTER TYPE "DeliveryType" ADD VALUE 'RANGE_BASED';
        END IF;
      END $$;
    `);
    
    console.log('✅ Valor RANGE_BASED adicionado com sucesso ao enum!');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar valor ao enum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addRangeBasedEnum()
  .catch((error) => {
    console.error('❌ Falha na execução:', error);
    process.exit(1);
  });
