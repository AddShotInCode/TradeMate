"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  PlayCircle, 
  TrendingUp, 
  Gavel, 
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "relative z-40 h-screen border-r border-slate-200 bg-white dark:bg-[#111418] dark:border-[#3b4754] flex flex-col transition-all duration-300 shrink-0",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <div className="flex flex-col gap-4 p-4 h-full">
        {/* Logo & Toggle Area */}
        <div className={cn("flex items-center justify-between px-2 py-2", isCollapsed ? "flex-col gap-4" : "")}>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">TradeMate</h1>
              <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-normal">원칙 매매</p>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#283039]"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4">
          {[
            { icon: LayoutDashboard, label: "대시보드", href: "#", active: true },
            { icon: PlayCircle, label: "시뮬레이션", href: "#" },
            { icon: TrendingUp, label: "분석", href: "#" },
            { icon: Gavel, label: "원칙", href: "#" },
            { icon: User, label: "계정", href: "#" },
          ].map((item) => (
            <Link 
              key={item.label}
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                item.active 
                  ? "bg-blue-50 dark:bg-[#283039]" 
                  : "hover:bg-slate-50 dark:hover:bg-[#283039]",
                isCollapsed && "justify-center"
              )}
              title={item.label}
            >
              <item.icon 
                className={cn(
                  "w-6 h-6 shrink-0 transition-colors", 
                  item.active 
                    ? "text-primary dark:text-white" 
                    : "text-slate-500 dark:text-white group-hover:text-primary"
                )} 
              />
              {!isCollapsed && (
                <p 
                  className={cn(
                    "text-sm font-medium leading-normal whitespace-nowrap overflow-hidden transition-colors",
                    item.active
                      ? "text-primary dark:text-white"
                      : "text-slate-700 dark:text-white group-hover:text-primary"
                  )}
                >
                  {item.label}
                </p>
              )}
            </Link>
          ))}
        </nav>

        {/* Daily Tip - Hide when collapsed */}
        {!isCollapsed && (
          <div className="mt-auto">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
              <p className="text-xs text-primary font-bold uppercase mb-2">오늘의 팁</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">진입 전 캔들 마감을 기다리세요. 인내심이 수익을 만듭니다.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
