import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/restaurant/settings - Get restaurant settings
export async function GET() {
  try {
    // Get the first (and should be only) restaurant settings
    let settings = await prisma.restaurantSettings.findFirst();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          name: 'Meu Restaurante',
          street: 'Rua Principal',
          number: '100',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01000-000',
          storeType: 'HYBRID',
          operatingHours: {
            monday: { open: '11:00', close: '23:00', closed: false },
            tuesday: { open: '11:00', close: '23:00', closed: false },
            wednesday: { open: '11:00', close: '23:00', closed: false },
            thursday: { open: '11:00', close: '23:00', closed: false },
            friday: { open: '11:00', close: '00:00', closed: false },
            saturday: { open: '11:00', close: '00:00', closed: false },
            sunday: { open: '11:00', close: '22:00', closed: false },
          },
          phone: '',
          email: '',
          deliveryFee: 0,
          minDeliveryValue: 0,
          serviceFeePercent: 10,
        },
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching restaurant settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant settings' },
      { status: 500 }
    );
  }
}

// PUT /api/restaurant/settings - Update restaurant settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the first settings record
    const existingSettings = await prisma.restaurantSettings.findFirst();
    
    if (!existingSettings) {
      return NextResponse.json(
        { error: 'Restaurant settings not found' },
        { status: 404 }
      );
    }
    
    // Update settings
    const updatedSettings = await prisma.restaurantSettings.update({
      where: { id: existingSettings.id },
      data: {
        name: body.name,
        street: body.street,
        number: body.number,
        complement: body.complement,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        storeType: body.storeType,
        operatingHours: body.operatingHours,
        phone: body.phone,
        email: body.email,
        deliveryFee: body.deliveryFee,
        minDeliveryValue: body.minDeliveryValue,
        serviceFeePercent: body.serviceFeePercent,
      },
    });
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating restaurant settings:', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant settings' },
      { status: 500 }
    );
  }
}
