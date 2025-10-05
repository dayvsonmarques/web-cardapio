import type { Metadata } from "next";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import React from "react";
import MetaMensal from "@/components/dashboard/MetaMensal";
import GraficoVendasMensais from "@/components/dashboard/GraficoVendasMensais";
import GraficoEstatisticas from "@/components/dashboard/GraficoEstatisticas";
import PedidosRecentes from "@/components/dashboard/PedidosRecentes";
import DemografiaClientes from "@/components/dashboard/DemografiaClientes";

export const metadata: Metadata = {
  title: "Dashboard | Cardápio Digital",
  description: "Painel de controle do sistema de cardápio digital",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <DashboardMetrics />

        <GraficoVendasMensais />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MetaMensal />
      </div>

      <div className="col-span-12">
        <GraficoEstatisticas />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemografiaClientes />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <PedidosRecentes />
      </div>
    </div>
  );
}
