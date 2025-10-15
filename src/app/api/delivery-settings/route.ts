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
    console.log("POST - Body:", JSON.stringify(body, null, 2));
    
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
    console.log("📥 PUT - Dados recebidos:");
    console.log("  deliveryType:", body.deliveryType);
    console.log("  hasDeliveryLimit:", body.hasDeliveryLimit);
    console.log("  maxDeliveryDistance:", body.maxDeliveryDistance);
    console.log("  distanceRanges:", body.distanceRanges?.length || 0, "faixas");
    
    const currentSettings = await prisma.deliverySettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    
    if (!currentSettings) {
      console.error("❌ Configuração não encontrada");
      return NextResponse.json({ error: "Configuração não encontrada" }, { status: 404 });
    }
    
    console.log("✅ Configuração encontrada:", currentSettings.id);
    
    if (body.distanceRanges !== undefined) {
      console.log("🗑️ Deletando faixas antigas...");
      await prisma.$executeRawUnsafe(
        `DELETE FROM distance_ranges WHERE "deliverySettingsId" = $1`,
        currentSettings.id
      );
      console.log("✅ Faixas deletadas:", body.distanceRanges.length, "novas faixas");
    }
    
    console.log("🔄 Atualizando configuração...");
    
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
        console.log("➕ Criando novas faixas de distância...");
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
      console.log("✅ Update executado com sucesso");
    } catch (updateError) {
      console.error("❌ Erro no Prisma update:");
      console.error("  Message:", updateError instanceof Error ? updateError.message : "Unknown");
      console.error("  Type:", typeof updateError);
      console.error("  Full error:", updateError);
      throw updateError;
    }
    
    console.log("✅ Configuração atualizada com sucesso!");
    return NextResponse.json(settings);
  } catch (error) {
    console.error("❌ Erro ao atualizar configuração:");
    console.error("Error object:", error);
    console.error("Error type:", typeof error);
    console.error("Error message:", error instanceof Error ? error.message : "Unknown");
    console.error("Error stack:", error instanceof Error ? error.stack : "N/A");
    
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
