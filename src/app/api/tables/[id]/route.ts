import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/tables/[id] - Get a specific table
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          where: {
            status: {
              in: ['PENDING', 'PREPARING', 'READY'],
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            payments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    
    if (!table) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(table);
  } catch (error) {
    console.error('Error fetching table:', error);
    return NextResponse.json(
      { error: 'Failed to fetch table' },
      { status: 500 }
    );
  }
}

// PUT /api/tables/[id] - Update a table
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if table exists
    const existingTable = await prisma.table.findUnique({
      where: { id },
    });
    
    if (!existingTable) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }
    
    // If updating number, check if new number is already taken
    if (body.number && body.number !== existingTable.number) {
      const tableWithNumber = await prisma.table.findUnique({
        where: { number: body.number },
      });
      
      if (tableWithNumber) {
        return NextResponse.json(
          { error: 'Table number already exists' },
          { status: 409 }
        );
      }
    }
    
    const updatedTable = await prisma.table.update({
      where: { id },
      data: {
        number: body.number,
        capacity: body.capacity,
        location: body.location,
        isActive: body.isActive,
      },
    });
    
    return NextResponse.json(updatedTable);
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json(
      { error: 'Failed to update table' },
      { status: 500 }
    );
  }
}

// DELETE /api/tables/[id] - Delete a table
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check if table has any orders
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });
    
    if (!table) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }
    
    if (table.orders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete table with existing orders. Consider deactivating it instead.' },
        { status: 409 }
      );
    }
    
    await prisma.table.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json(
      { error: 'Failed to delete table' },
      { status: 500 }
    );
  }
}
