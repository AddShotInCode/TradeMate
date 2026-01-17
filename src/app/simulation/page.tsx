import Sidebar from "@/components/layout/Sidebar";
import SimulationHeader from "@/components/simulation/SimulationHeader";
import StatsBar from "@/components/simulation/StatsBar";
import SimulationChart from "@/components/simulation/SimulationChart";
import ChartControls from "@/components/simulation/ChartControls";
import TradeLog from "@/components/simulation/TradeLog";
import OrderForm from "@/components/simulation/OrderForm";

export default function SimulationPage() {
  return (
    <div className="relative flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <SimulationHeader />

        <div className="flex flex-1 overflow-hidden relative">
          <main className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-[#283039]">
            {/* Stats Bar */}
            <StatsBar />

            {/* Chart Area */}
            <div className="flex-1 relative bg-[#1c252e] p-4 flex flex-col">
              <ChartControls />
              <SimulationChart />
            </div>

            {/* Trade Log */}
            <TradeLog />
          </main>

          {/* Right Sidebar - Order Form */}
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
