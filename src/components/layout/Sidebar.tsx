"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlayCircle,
  TrendingUp,
  Gavel,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

function subscribeToLocalStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getUserNameSnapshot() {
  return localStorage.getItem("tm_userName") ?? "";
}

function getUserNameServerSnapshot() {
  return "";
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const userName = useSyncExternalStore(
    subscribeToLocalStorage,
    getUserNameSnapshot,
    getUserNameServerSnapshot,
  );

  const navItems = [
    { icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
    { icon: PlayCircle, label: "시뮬레이션", href: "/simulation" },
    { icon: TrendingUp, label: "조회", href: "/inquiry" },
    { icon: Gavel, label: "원칙", href: "/propensity" },
  ];

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={cn(
        "relative z-40 h-screen border-r border-slate-200 bg-white dark:bg-[#111418] dark:border-[#3b4754] flex flex-col transition-all duration-300 shrink-0",
        isCollapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      <div className="flex flex-col gap-4 p-4 h-full">
        {/* Logo & Toggle Area */}
        <div
          className={cn(
            "flex items-center justify-between px-2 py-2",
            isCollapsed ? "flex-col gap-4" : "",
          )}
        >
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                TradeMate
              </h1>
              <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-normal">원칙 매매</p>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#283039]"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                  active
                    ? "bg-blue-50 dark:bg-[#283039]"
                    : "hover:bg-slate-50 dark:hover:bg-[#283039]",
                  isCollapsed && "justify-center",
                )}
                title={item.label}
              >
                <item.icon
                  className={cn(
                    "w-6 h-6 shrink-0 transition-colors",
                    active
                      ? "text-primary dark:text-white"
                      : "text-slate-500 dark:text-white group-hover:text-primary",
                  )}
                />
                {!isCollapsed && (
                  <p
                    className={cn(
                      "text-sm font-medium leading-normal whitespace-nowrap overflow-hidden transition-colors",
                      active
                        ? "text-primary dark:text-white"
                        : "text-slate-700 dark:text-white group-hover:text-primary",
                    )}
                  >
                    {item.label}
                  </p>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user button */}
        <div className="mt-auto">
          <Link
            href="/account"
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group hover:bg-slate-50 dark:hover:bg-[#283039]",
              isCollapsed && "justify-center",
            )}
            title={userName ? userName : "사용자"}
            aria-label={userName ? `${userName} 회원정보로 이동` : "회원정보로 이동"}
          >
            <User className="w-6 h-6 shrink-0 text-slate-500 dark:text-white group-hover:text-primary transition-colors" />
            {!isCollapsed && (
              <p className="text-sm font-medium leading-normal whitespace-nowrap overflow-hidden text-slate-700 dark:text-white group-hover:text-primary transition-colors">
                {userName ? userName : "사용자"}
              </p>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}
