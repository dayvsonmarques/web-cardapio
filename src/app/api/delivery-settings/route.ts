import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.deliverySettings.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        distanceRanges: { orderBy: { minDistance: 'asc' } }
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const settings = await prisma.deliverySettings.create({
      data: {
        storeStreet: body.storeStreet,
        storeNumber: body.storeNumber,
        storeComplement: body.storeComplement || null,
        storeNeighborhood: body.storeNeighborhood,
        storeCity: body.storeCity,
        storeState: body.storeState,
        storeZipCode: body.storeZipCode,
        deliveryType: body.deliveryType,
        fixedCost: body.fixedCost || 0,
        costPerKm: body.costPerKm || 0,
        freeDeliveryMinValue: body.freeDeliveryMinValue || null,
        hasDeliveryLimit: body.hasDeliveryLimit ?? false,
        maxDeliveryDistance: body.maxDeliveryDistance || null,
        allowPickup: body.allowPickup ?? true,
        isActive: body.isActive ?? true,
        distanceRanges: body.distanceRanges ? {
          create: body.distanceRanges.map((range: {minDistance: number, maxDistance: number, cost: number, isFree: boolean}) => ({
            minDistance: range.minDistance,
            maxDistance: range.maxDistance,
            cost: range.cost,
            isFree: range.isFree ?? false,
          })),
        } : undefined,
      },
      include: {
        distanceRanges: { orderBy: { minDistance: 'asc' } }
      },
    });
    
    return NextResponse.json(settings, { status: 201 });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ 
      error: "Erro ao criar configuração",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const currentSettings = await prisma.deliverySettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!currentSettings) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 });
    }

    if (body.distanceRanges !== undefined) {
      await prisma.$executeRawUnsafe(
        `DELETE FROM distance_ranges WHERE "deliverySettingsId" = $1`,
        currentSettings.id
      );
    }

    let settings;
    try {
      // Primeiro atualiza os dados básicos
      settings = await prisma.deliverySettings.update({
        where: { id: currentSettings.id },
        data: {
          storeStreet: body.storeStreet,
          storeNumber: body.storeNumber,
          storeComplement: body.storeComplement || null,
          storeNeighborhood: body.storeNeighborhood,
          storeCity: body.storeCity,
          storeState: body.storeState,
          storeZipCode: body.storeZipCode,
          deliveryType: body.deliveryType,
          fixedCost: body.fixedCost || 0,
          costPerKm: body.costPerKm || 0,
          freeDeliveryMinValue: body.freeDeliveryMinValue || null,
          hasDeliveryLimit: body.hasDeliveryLimit ?? false,
          maxDeliveryDistance: body.maxDeliveryDistance || null,
          allowPickup: body.allowPickup ?? true,
          isActive: body.isActive ?? true,
        },
      });
      
      // Depois cria as novas faixas de distância, se houver
      if (body.distanceRanges && body.distanceRanges.length > 0) {
        await prisma.distanceRange.createMany({
          data: body.distanceRanges.map((range: {minDistance: number, maxDistance: number, cost: number, isFree: boolean}) => ({
            deliverySettingsId: currentSettings.id,
            minDistance: range.minDistance,
            maxDistance: range.maxDistance,
            cost: range.cost,
            isFree: range.isFree ?? false,
          })),
        });
      }
      
      // Busca a configuração completa com as faixas
      settings = await prisma.deliverySettings.findUnique({
        where: { id: currentSettings.id },
        include: {
          distanceRanges: { orderBy: { minDistance: 'asc' } }
        },
      });
    } catch (updateError) {
      console.error("Erro no Prisma update:", updateError);
      throw updateError;
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao atualizar configuração:", error);

    return NextResponse.json({ 
      error: "Erro ao atualizar configuração",
      details: error instanceof Error ? error.message : String(error),
      type: typeof error
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const currentSettings = await prisma.deliverySettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    
    if (!currentSettings) {
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 });
    }
    
    await prisma.deliverySettings.delete({ where: { id: currentSettings.id } });
    return NextResponse.json({ message: "Configuração deletada com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro ao deletar configuração" }, { status: 500 });
  }
}
