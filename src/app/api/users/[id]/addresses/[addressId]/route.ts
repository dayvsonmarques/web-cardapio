import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// PUT /api/users/[userId]/addresses/[addressId] - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const payload = await verifyToken(token);
    
    if (!payload || payload.userId !== params.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // If marking as default, unset other defaults
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { 
          userId: params.id,
          id: { not: params.addressId },
        },
        data: { isDefault: false },
      });
    }
    
    const address = await prisma.address.update({
      where: { 
        id: params.addressId,
        userId: params.id,
      },
      data: body,
    });
    
    return NextResponse.json(address);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[userId]/addresses/[addressId] - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; addressId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const payload = await verifyToken(token);
    
    if (!payload || payload.userId !== params.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await prisma.address.delete({
      where: { 
        id: params.addressId,
        userId: params.id,
      },
    });
    
    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
