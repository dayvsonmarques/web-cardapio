import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/tables - List all tables
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    
    const tables = await prisma.table.findMany({
      where: isActive !== null ? { isActive: isActive === 'true' } : undefined,
      orderBy: { number: 'asc' },
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
          take: 1, // Get only the most recent active order
        },
      },
    });
    
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}

// POST /api/tables - Create a new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.number || !body.capacity) {
      return NextResponse.json(
        { error: 'Table number and capacity are required' },
        { status: 400 }
      );
    }
    
    // Check if table number already exists
    const existingTable = await prisma.table.findUnique({
      where: { number: body.number },
    });
    
    if (existingTable) {
      return NextResponse.json(
        { error: 'Table number already exists' },
        { status: 409 }
      );
    }
    
    const table = await prisma.table.create({
      data: {
        number: body.number,
        capacity: body.capacity,
        location: body.location,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });
    
    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json(
      { error: 'Failed to create table' },
      { status: 500 }
    );
  }
}
