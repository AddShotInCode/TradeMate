import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsGrid from "@/components/dashboard/StatsGrid";
import CoreFocus from "@/components/dashboard/CoreFocus";
import RecentSessions from "@/components/dashboard/RecentSessions";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div className="relative flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-8">
          <Header />
          
          <StatsGrid />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Focus Column (Left 2/3) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <CoreFocus />
              <RecentSessions />
            </div>

            {/* Right Side Column (Right 1/3) */}
            <div className="flex flex-col h-full">
              <QuickActions />
            </div>
          </div>
          
          <footer className="mt-8 text-center text-slate-500 dark:text-[#9dabb9] text-xs pb-4">
            © 2024 TradeMate. 모든 매매에는 위험이 따릅니다.
          </footer>
        </div>
      </main>
    </div>
  );
}
