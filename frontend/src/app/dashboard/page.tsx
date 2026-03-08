import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/dashboard/Header";
import RecentSessions from "@/components/dashboard/RecentSessions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드",
  description: "나의 매매 훈련 현황과 최근 시뮬레이션 세션을 확인하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return (
    <div className="relative flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-8">
          <Header />

          <RecentSessions />

          <footer className="mt-8 text-center text-slate-500 dark:text-[#9dabb9] text-xs pb-4">
            © 2026 TradeMate. 모든 매매에는 위험이 따릅니다.
          </footer>
        </div>
      </main>
    </div>
  );
}
