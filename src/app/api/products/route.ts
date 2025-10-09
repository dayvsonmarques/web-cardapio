import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - List all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isAvailable = searchParams.get('isAvailable');
    
    const products = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(isAvailable !== null && { isAvailable: isAvailable === 'true' }),
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image,
        isAvailable: body.isAvailable ?? true,
        ingredients: body.ingredients || [],
        calories: body.nutritionalInfo.calories,
        proteins: body.nutritionalInfo.proteins,
        carbohydrates: body.nutritionalInfo.carbohydrates,
        fats: body.nutritionalInfo.fats,
        fiber: body.nutritionalInfo.fiber,
        categoryId: body.categoryId,
      },
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
