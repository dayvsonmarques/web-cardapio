import { PrismaClient } from '@prisma/client';
import { productsTestData } from '../src/data/catalogTestData';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deletando produtos existentes...');
  
  // Delete all existing products
  await prisma.product.deleteMany({});
  console.log('✅ Produtos deletados');

  // Get existing categories from database
  console.log('📦 Buscando categorias do banco...');
  const dbCategories = await prisma.category.findMany();
  
  // Create a map of category names to IDs
  const categoryMap: Record<string, string> = {};
  dbCategories.forEach((cat: { name: string; id: string }) => {
    categoryMap[cat.name] = cat.id;
  });

  // Map categoryIds from test data to database IDs
  const testCategoryMap: Record<string, string> = {
    '1': 'Saladas',
    '2': 'Pratos Principais',
    '3': 'Sobremesas',
    '4': 'Bebidas',
    '5': 'Entradas',
  };

  console.log('📝 Inserindo 60 produtos no banco de dados...');
  
  let insertedCount = 0;
  let skippedCount = 0;

  for (const product of productsTestData) {
    try {
      // Get the category name from test data
      const categoryName = testCategoryMap[product.categoryId];
      
      // Get the actual database category ID
      const dbCategoryId = categoryMap[categoryName];
      
      if (!dbCategoryId) {
        console.log(`⚠️  Categoria "${categoryName}" não encontrada, pulando produto "${product.name}"`);
        skippedCount++;
        continue;
      }

      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          isAvailable: product.isAvailable,
          ingredients: product.ingredients,
          calories: product.nutritionalInfo.calories,
          proteins: product.nutritionalInfo.proteins,
          carbohydrates: product.nutritionalInfo.carbohydrates,
          fats: product.nutritionalInfo.fats,
          fiber: product.nutritionalInfo.fiber,
          categoryId: dbCategoryId,
        },
      });

      insertedCount++;
      
      // Log progress every 10 products
      if (insertedCount % 10 === 0) {
        console.log(`  ✓ ${insertedCount} produtos inseridos...`);
      }
    } catch (error) {
      console.error(`❌ Erro ao inserir produto "${product.name}":`, error);
      skippedCount++;
    }
  }

  console.log(`\n✨ Processo concluído!`);
  console.log(`  ✅ ${insertedCount} produtos inseridos com sucesso`);
  if (skippedCount > 0) {
    console.log(`  ⚠️  ${skippedCount} produtos pulados`);
  }

  // Show summary by category
  console.log('\n📊 Resumo por categoria:');
  const productsByCategory = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  productsByCategory.forEach((cat: { name: string; _count: { products: number } }) => {
    console.log(`  ${cat.name}: ${cat._count.products} produtos`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
