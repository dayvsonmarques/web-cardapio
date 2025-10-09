import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders - List orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    const orders = await prisma.order.findMany({
      where: {
        ...(userId && { userId }),
        ...(status && { status: status as 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED' }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        deliveryStreet: body.deliveryStreet,
        deliveryNumber: body.deliveryNumber,
        deliveryComplement: body.deliveryComplement,
        deliveryNeighborhood: body.deliveryNeighborhood,
        deliveryCity: body.deliveryCity,
        deliveryState: body.deliveryState,
        deliveryZipCode: body.deliveryZipCode,
        paymentMethod: body.paymentMethod,
        subtotal: body.subtotal,
        total: body.total,
        notes: body.notes,
        userId: body.userId,
        items: {
          create: body.items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
