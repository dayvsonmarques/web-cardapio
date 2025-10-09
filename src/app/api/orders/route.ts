import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
        table: true,
        payments: true,
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
    
    // Validate order type
    const orderType = body.orderType || 'DELIVERY';
    
    // Validate based on order type
    if (orderType === 'DELIVERY') {
      // Delivery orders must have delivery address
      if (!body.deliveryStreet || !body.deliveryCity || !body.deliveryZipCode) {
        return NextResponse.json(
          { error: 'Delivery address is required for delivery orders' },
          { status: 400 }
        );
      }
      
      // Delivery orders should not have tableId
      if (body.tableId) {
        return NextResponse.json(
          { error: 'Delivery orders cannot have a table' },
          { status: 400 }
        );
      }
    } else if (orderType === 'DINE_IN') {
      // Dine-in orders must have a table
      if (!body.tableId) {
        return NextResponse.json(
          { error: 'Table is required for dine-in orders' },
          { status: 400 }
        );
      }
      
      // Verify table exists and is active
      const table = await prisma.table.findUnique({
        where: { id: body.tableId },
      });
      
      if (!table) {
        return NextResponse.json(
          { error: 'Table not found' },
          { status: 404 }
        );
      }
      
      if (!table.isActive) {
        return NextResponse.json(
          { error: 'Table is not active' },
          { status: 400 }
        );
      }
    }
    
    // Calculate totals
    const subtotal = body.subtotal;
    let total = subtotal;
    
    // Add delivery fee for delivery orders
    const deliveryFee = orderType === 'DELIVERY' ? (body.deliveryFee || 0) : 0;
    total += deliveryFee;
    
    // Add service fee for dine-in orders
    const includeService = orderType === 'DINE_IN' ? (body.includeService !== false) : false;
    const serviceFee = includeService ? subtotal * (body.serviceFeePercent || 0.1) : 0;
    total += serviceFee;
    
    // Create order with transaction
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderType,
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone,
          
          // Delivery fields (optional)
          deliveryStreet: body.deliveryStreet,
          deliveryNumber: body.deliveryNumber,
          deliveryComplement: body.deliveryComplement,
          deliveryNeighborhood: body.deliveryNeighborhood,
          deliveryCity: body.deliveryCity,
          deliveryState: body.deliveryState,
          deliveryZipCode: body.deliveryZipCode,
          deliveryFee,
          
          // Table fields (optional)
          tableId: body.tableId,
          includeService,
          serviceFee,
          
          // Totals
          subtotal,
          total,
          
          notes: body.notes,
          userId: body.userId,
          
          // Items
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
          table: true,
        },
      });
      
      // Create payment(s)
      if (body.payments && body.payments.length > 0) {
        await tx.payment.createMany({
          data: body.payments.map((payment: { amount: number; paymentMethod: string; notes?: string }) => ({
            orderId: newOrder.id,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            notes: payment.notes,
          })),
        });
      } else if (body.paymentMethod) {
        // Legacy: single payment method
        await tx.payment.create({
          data: {
            orderId: newOrder.id,
            amount: total,
            paymentMethod: body.paymentMethod,
          },
        });
      }
      
      return newOrder;
    });
    
    // Fetch complete order with payments
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        table: true,
        payments: true,
      },
    });
    
    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
