"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Play } from "lucide-react";
import { TARGET_STOCKS } from "@/constants/targetStocks";

import { simulationService } from "@/services/simulationService";

interface SessionSetupModalProps {
  isOpen: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
  isForce?: boolean; // If true, hide close button and prevent closing without action
}

export default function SessionSetupModal({
  isOpen,
  onClose,
  trigger,
  isForce = false,
}: SessionSetupModalProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(isOpen);
  const [selectedStock, setSelectedStock] = useState(TARGET_STOCKS[0].code);

  // Calculate default valid date (e.g., today or yesterday)
  const getTodayString = () => {
      const d = new Date();
      return d.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getTodayString());
  const [isCreating, setIsCreating] = useState(false); // Add Loading State

  // Sync internal state with prop
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    if (isForce) return;
    setShowModal(false);
    onClose?.();
  };

  const handleStart = async () => {
    try {
      setIsCreating(true);
      // Date Format: YYYY-MM-DD (ISO 8601) as per specification
      const formattedDate = startDate;

      const response = await simulationService.create(selectedStock, formattedDate);

      // Redirect to simulation page with ID
      router.push(`/simulation?id=${response.id}`);

      if (!isForce) {
        setShowModal(false);
        onClose?.();
      }
    } catch (error) {
      console.error("Failed to create simulation", error);
      alert("시뮬레이션 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  // Calculate date limits: Max 1 year ago from today
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const minDateObj = new Date();
  minDateObj.setFullYear(today.getFullYear() - 1);
  const minDate = minDateObj.toISOString().split("T")[0];

  // Decide visibility
  const visible = isOpen || showModal;

  return (
    <>
      {trigger && (
        <div onClick={openModal} className="inline-block">
          {trigger}
        </div>
      )}

      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#1c252e] rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-[#3b4754]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#283039]">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                새 시뮬레이션 세션
              </h3>
              {!isForce && (
                <button
                  onClick={closeModal}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Stock Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  종목 선택
                </label>
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full h-10 rounded-md border border-slate-300 dark:border-[#3b4754] bg-white dark:bg-[#101922] px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <optgroup
                    label="KOSPI"
                    className="text-slate-900 dark:text-white bg-white dark:bg-[#101922]"
                  >
                    {TARGET_STOCKS.filter((s) => s.market === "KOSPI" || !s.market).map((stock) => (
                      <option key={stock.code} value={stock.code}>
                        {stock.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup
                    label="KOSDAQ"
                    className="text-slate-900 dark:text-white bg-white dark:bg-[#101922]"
                  >
                    {TARGET_STOCKS.filter((s) => s.market === "KOSDAQ").map((stock) => (
                      <option key={stock.code} value={stock.code}>
                        {stock.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  시작 날짜
                </label>
                <Input
                  type="date"
                  value={startDate}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="dark:bg-[#101922] dark:border-[#3b4754] dark:text-white dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-[#283039] bg-slate-50 dark:bg-[#161f28] flex justify-end gap-3">
              {!isForce && (
                <Button 
                    variant="ghost" 
                    onClick={closeModal}
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#283039]"
                >
                  취소
                </Button>
              )}
              <Button onClick={handleStart} className="px-6" disabled={isCreating}>
                {isCreating ? (
                  <span>생성 중...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    시뮬레이션 시작
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
