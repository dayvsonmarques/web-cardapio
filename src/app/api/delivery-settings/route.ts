import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obter configurações de entrega
export async function GET() {
  try {
    const settings = await prisma.deliverySettings.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  }
}

// POST - Criar nova configuração de entrega
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
      },
    });

    return NextResponse.json(settings, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar configuração:", error);
    return NextResponse.json(
      { error: "Erro ao criar configuração" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar configuração de entrega
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Busca a configuração mais recente
    const currentSettings = await prisma.deliverySettings.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!currentSettings) {
      return NextResponse.json(
        { error: "Configuração não encontrada" },
        { status: 404 }
      );
    }

    const settings = await prisma.deliverySettings.update({
      where: {
        id: currentSettings.id,
      },
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

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erro ao atualizar configuração:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configuração" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar configuração de entrega
export async function DELETE() {
  try {
    const currentSettings = await prisma.deliverySettings.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!currentSettings) {
      return NextResponse.json(
        { error: "Configuração não encontrada" },
        { status: 404 }
      );
    }

    await prisma.deliverySettings.delete({
      where: {
        id: currentSettings.id,
      },
    });

    return NextResponse.json({ message: "Configuração deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar configuração:", error);
    return NextResponse.json(
      { error: "Erro ao deletar configuração" },
      { status: 500 }
    );
  }
}
