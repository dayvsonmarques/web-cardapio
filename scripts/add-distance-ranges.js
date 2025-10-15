const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔧 Adicionando tabela distance_ranges...\n');

    // Criar tabela distance_ranges
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "distance_ranges" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "deliverySettingsId" TEXT NOT NULL,
        "minDistance" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "maxDistance" DOUBLE PRECISION NOT NULL,
        "cost" DOUBLE PRECISION NOT NULL,
        "isFree" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "distance_ranges_deliverySettingsId_fkey" 
          FOREIGN KEY ("deliverySettingsId") 
          REFERENCES "delivery_settings"("id") 
          ON DELETE CASCADE 
          ON UPDATE CASCADE
      );
    `);

    console.log('✅ Tabela distance_ranges criada com sucesso!\n');

    // Criar índice para otimizar buscas
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "distance_ranges_deliverySettingsId_idx" 
      ON "distance_ranges"("deliverySettingsId");
    `);

    console.log('✅ Índice criado com sucesso!\n');

    console.log('📊 Estrutura do banco atualizada!');
    console.log('\n🔄 Execute: npx prisma generate\n');

  } catch (error) {
    console.error('❌ Erro ao adicionar tabela:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
