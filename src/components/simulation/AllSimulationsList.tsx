"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { simulationService, Simulation } from "@/services/simulationService";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, ArrowUpDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewSessionModal from "@/components/dashboard/NewSessionModal";
import { TARGET_STOCKS } from "@/constants/targetStocks";

type SortOrder = "newest" | "oldest";

export default function AllSimulationsList() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Simulation[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Simulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const getStockName = (code: string) => {
    return TARGET_STOCKS.find((s) => s.code === code)?.name || "";
  };

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const data = await simulationService.getList();
      setSessions(data.simulations);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const sorted = [...sessions].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    setFilteredSessions(sorted);
  }, [sessions, sortOrder]);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await simulationService.delete(deleteTargetId);
      setSessions((prev) => prev.filter((s) => s.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (error) {
      console.error("Failed to delete session", error);
      toast.error("시뮬레이션 삭제에 실패했습니다.");
    }
  };

  const handleResume = (id: number) => {
    router.push(`/simulation?id=${id}`);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-500">
        시뮬레이션 목록을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">모든 시뮬레이션</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              진행 중인 세션과 종료된 세션을 모두 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={toggleSort}>
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === "newest" ? "최신순" : "오래된순"}
            </Button>
            <NewSessionModal />
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e2329] rounded-xl border border-slate-200 dark:border-[#3b4754] gap-4">
            <AlertCircle className="w-12 h-12 text-slate-300 dark:text-[#3b4754]" />
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                생성된 시뮬레이션이 없습니다.
              </p>
              <p className="text-sm text-slate-500 dark:text-[#9dabb9] mt-1">
                새로운 시뮬레이션을 시작하여 트레이딩 실력을 키워보세요.
              </p>
            </div>
            <div className="mt-2">
              <NewSessionModal />
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#3b4754] shadow-sm">
            <table className="w-full text-left text-sm text-slate-500 dark:text-[#9dabb9]">
              <thead className="bg-slate-50 dark:bg-[#252b32] text-xs uppercase text-slate-900 dark:text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    종목(코드)
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    시작일
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold">
                    종료일
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
                {filteredSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-slate-50 dark:hover:bg-[#252b32] transition-colors group"
                  >
                    <td
                      className="px-6 py-4 font-medium text-slate-900 dark:text-white cursor-pointer"
                      onClick={() => handleResume(session.id)}
                    >
                      <span className="font-bold">{getStockName(session.stockCode)}</span>
                      <span className="ml-1 text-slate-500 font-normal">({session.stockCode})</span>
                    </td>
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleResume(session.id)}
                    >
                      {session.startDate}
                    </td>
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleResume(session.id)}
                    >
                      {session.endDate || "-"}
                    </td>
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleResume(session.id)}
                    >
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
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleResume(session.id)}
                    >
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      {session.endDate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Analysis Logic here
                            toast.info("분석 페이지로 이동합니다 (준비 중)");
                          }}
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          결과 분석
                        </Button>
                      )}
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
        )}

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
    </div>
  );
}
