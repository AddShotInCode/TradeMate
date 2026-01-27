"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import SimulationHeader from "@/components/simulation/SimulationHeader";
import StatsBar from "@/components/simulation/StatsBar";
import SimulationChart from "@/components/simulation/SimulationChart";
import ChartControls from "@/components/simulation/ChartControls";
import TradeLog from "@/components/simulation/TradeLog";
import OrderForm from "@/components/simulation/OrderForm";
import AllSimulationsList from "@/components/simulation/AllSimulationsList";
import { useSimulationStore } from "@/store/simulationStore";

function SimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const { loadSimulation, isLoading, error } = useSimulationStore();

  useEffect(() => {
    if (id) {
      loadSimulation(Number(id));
    }
  }, [id, loadSimulation]);

  if (!id) {
    return (
      <div className="flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <AllSimulationsList />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <SimulationHeader />

        <div className="flex flex-1 overflow-hidden relative">
          <main className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-[#283039]">
            <StatsBar />

            <div className="flex-1 relative bg-[#1c252e] p-4 flex flex-col min-h-0">
              <ChartControls />
              <div className="flex-1 w-full h-full relative">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full text-white">
                    Loading Simulation...
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full text-red-500">
                    {error}
                  </div>
                ) : (
                  <SimulationChart />
                )}
              </div>
            </div>

            <TradeLog />
          </main>

          <OrderForm />
        </div>
      </div>
    </div>
  );
}

// Main Page Component wraps content in Suspense
export default function SimulationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#101922] text-white">
          Loading...
        </div>
      }
    >
      <SimulationContent />
    </Suspense>
  );
}
