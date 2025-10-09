import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'Lanches',
        description: 'Deliciosos lanches e hambúrgueres',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        name: 'Bebidas',
        description: 'Bebidas refrescantes e saborosas',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        name: 'Sobremesas',
        description: 'Sobremesas irresistíveis',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { id: '4' },
      update: {},
      create: {
        id: '4',
        name: 'Saladas',
        description: 'Saladas frescas e saudáveis',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create Products
  console.log('Creating products...');
  const products = await Promise.all([
    // Lanches
    prisma.product.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'X-Burger',
        description: 'Hambúrguer clássico com queijo, alface, tomate e molho especial',
        price: 25.90,
        categoryId: '1',
        image: 'https://via.placeholder.com/400x300/FF9800/ffffff?text=X-Burger',
        isAvailable: true,
        ingredients: ['Pão', 'Hambúrguer', 'Queijo', 'Alface', 'Tomate', 'Molho especial'],
        calories: 550,
        proteins: 28,
        carbohydrates: 45,
        fats: 25,
        fiber: 3,
      },
    }),
    prisma.product.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        name: 'Cheese Burger',
        description: 'Hambúrguer com duplo queijo e bacon crocante',
        price: 29.90,
        categoryId: '1',
        image: 'https://via.placeholder.com/400x300/FF9800/ffffff?text=Cheese+Burger',
        isAvailable: true,
        ingredients: ['Pão', 'Hambúrguer', 'Queijo duplo', 'Bacon', 'Cebola'],
        calories: 680,
        proteins: 35,
        carbohydrates: 48,
        fats: 32,
        fiber: 2,
      },
    }),
    // Bebidas
    prisma.product.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        name: 'Coca-Cola 350ml',
        description: 'Refrigerante Coca-Cola gelado',
        price: 6.00,
        categoryId: '2',
        image: 'https://via.placeholder.com/400x300/2196F3/ffffff?text=Coca-Cola',
        isAvailable: true,
        ingredients: ['Água gaseificada', 'Açúcar', 'Corante caramelo'],
        calories: 140,
        proteins: 0,
        carbohydrates: 37,
        fats: 0,
        fiber: 0,
      },
    }),
    prisma.product.upsert({
      where: { id: '4' },
      update: {},
      create: {
        id: '4',
        name: 'Suco de Laranja',
        description: 'Suco natural de laranja 500ml',
        price: 8.00,
        categoryId: '2',
        image: 'https://via.placeholder.com/400x300/64B5F6/ffffff?text=Suco',
        isAvailable: true,
        ingredients: ['Laranja natural', 'Água'],
        calories: 120,
        proteins: 2,
        carbohydrates: 28,
        fats: 0,
        fiber: 1,
      },
    }),
    // Sobremesas
    prisma.product.upsert({
      where: { id: '5' },
      update: {},
      create: {
        id: '5',
        name: 'Brownie com Sorvete',
        description: 'Brownie de chocolate quente com sorvete de baunilha',
        price: 15.90,
        categoryId: '3',
        image: 'https://via.placeholder.com/400x300/E91E63/ffffff?text=Brownie',
        isAvailable: true,
        ingredients: ['Chocolate', 'Farinha', 'Ovos', 'Açúcar', 'Sorvete'],
        calories: 420,
        proteins: 6,
        carbohydrates: 52,
        fats: 22,
        fiber: 3,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create a test user
  console.log('Creating test user...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'teste@cardapio.com' },
    update: {},
    create: {
      name: 'Usuário Teste',
      email: 'teste@cardapio.com',
      phone: '(11) 98765-4321',
      password: hashedPassword,
      addresses: {
        create: {
          street: 'Rua Teste',
          number: '123',
          complement: 'Apto 45',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          isDefault: true,
        },
      },
    },
  });

  console.log(`✅ Created test user: ${user.email} (password: 123456)`);

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
