"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { simulationService, Simulation } from "@/services/simulationService";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { TARGET_STOCKS } from "@/constants/targetStocks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewSessionModal from "./NewSessionModal";

export default function RecentSessions() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Simulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const getStockName = (code: string) => {
    return TARGET_STOCKS.find((s) => s.code === code)?.name || "";
  };

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const data = await simulationService.getList();
      // Dashboard only shows Active sessions (in-progress)
      setSessions(data.simulations.filter((s) => !s.endDate));
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await simulationService.delete(deleteTargetId);
      setSessions((prev) => prev.filter((s) => s.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (error) {
      console.error("Failed to delete session", error);
      alert("시뮬레이션 삭제에 실패했습니다.");
    }
  };

  const handleResume = (id: number) => {
    router.push(`/simulation?id=${id}`);
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">세션 목록을 불러오는 중...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-[#1e2329] rounded-xl border border-slate-200 dark:border-[#3b4754] gap-4">
        <AlertCircle className="w-12 h-12 text-slate-300 dark:text-[#3b4754]" />
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            진행 중인 시뮬레이션이 없습니다.
          </p>
          <p className="text-sm text-slate-500 dark:text-[#9dabb9] mt-1">
            새로운 시뮬레이션을 시작하여 트레이딩 실력을 키워보세요.
          </p>
        </div>
        <div className="mt-2">
          <NewSessionModal />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold">진행 중인 시뮬레이션</h2>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3b4754]">
        <table className="w-full text-left text-sm text-slate-500 dark:text-[#9dabb9]">
          <thead className="bg-slate-50 dark:bg-[#252b32] text-xs uppercase text-slate-900 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                종목
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                시작일
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                상태
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                생성일
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#3b4754] bg-white dark:bg-[#1c2127]">
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="hover:bg-slate-50 dark:hover:bg-[#252b32] transition-colors group"
              >
                <td
                  className="px-6 py-4 font-medium text-slate-900 dark:text-white cursor-pointer"
                  onClick={() => handleResume(session.id)}
                >
                  <span className="font-bold">{getStockName(session.stockCode)}</span>
                  <span className="ml-2 text-slate-500 dark:text-slate-400 font-normal">
                    ({session.stockCode})
                  </span>
                </td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => handleResume(session.id)}>
                  {session.startDate}
                </td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => handleResume(session.id)}>
                  {session.endDate ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      종료됨
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      진행중
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => handleResume(session.id)}>
                  {new Date(session.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTargetId(session.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>시뮬레이션을 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>
              이 작업은 되돌릴 수 없습니다. 시뮬레이션 및 모든 거래 기록이 영구적으로 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTargetId(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
