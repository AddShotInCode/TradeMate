"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Play } from "lucide-react";

interface Stock {
  code: string;
  name: string;
  market: string;
}

const STOCK_LIST = [
  { code: "005930", name: "삼성전자", market: "KOSPO" },
  { code: "000660", name: "SK하이닉스", market: "KOSPI" },
  { code: "005380", name: "현대차", market: "KOSPI" },
  { code: "005490", name: "POSCO홀딩스", market: "KOSPI" },
  { code: "035420", name: "NAVER", market: "KOSPI" },
  { code: "000270", name: "기아", market: "KOSPI" },
  { code: "068270", name: "셀트리온", market: "KOSPI" },
  { code: "012330", name: "현대모비스", market: "KOSPI" },
  { code: "055550", name: "신한지주", market: "KOSPI" },
  { code: "066570", name: "LG전자", market: "KOSPI" },
  { code: "035720", name: "카카오", market: "KOSPI" },
  { code: "036570", name: "엔씨소프트", market: "KOSPI" },
  { code: "251270", name: "넷마블", market: "KOSPI" },
  // KOSDAQ
  { code: "900110", name: "이스트아시아홀딩스", market: "KOSDAQ" },
  { code: "035760", name: "CJ ENM", market: "KOSDAQ" },
  { code: "293490", name: "카카오게임즈", market: "KOSDAQ" },
  { code: "263750", name: "펄어비스", market: "KOSDAQ" },
  { code: "112040", name: "위메이드", market: "KOSDAQ" },
  { code: "095340", name: "ISC", market: "KOSDAQ" },
  { code: "058470", name: "리노공업", market: "KOSDAQ" },
];

interface SessionSetupModalProps {
    isOpen: boolean;
    onClose?: () => void;
    trigger?: React.ReactNode;
    isForce?: boolean; // If true, hide close button and prevent closing without action
}

export default function SessionSetupModal({ isOpen, onClose, trigger, isForce = false }: SessionSetupModalProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(isOpen);
  const [selectedStock, setSelectedStock] = useState(STOCK_LIST[0].code);
  const [startDate, setStartDate] = useState("2024-01-01");

  // Sync internal state with prop
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // Sync internal state with prop if controlled
  // BUT: for simplicity, we'll let parent control isOpen if passed, or manage locally if trigger used.
  // Actually, mixing controlled/uncontrolled is slightly complex.
  // Let's simplify:
  // If `trigger` is present, it manages its own state or we manage it here.
  
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    if (isForce) return;
    setShowModal(false);
    onClose?.();
  };

  const handleStart = () => {
    router.push(`/simulation?code=${selectedStock}&start=${startDate.replace(/-/g, "")}`);
    if (!isForce) {
        setShowModal(false);
        onClose?.();
    }
  };
  
  // Calculate date limits: Max 1 year ago from today
  const today = new Date();
  const maxDate = today.toISOString().split('T')[0];
  const minDateObj = new Date();
  minDateObj.setFullYear(today.getFullYear() - 1);
  const minDate = minDateObj.toISOString().split('T')[0];

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
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">새 시뮬레이션 세션</h3>
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
                  <optgroup label="KOSPI" className="text-slate-900 dark:text-white bg-white dark:bg-[#101922]">
                    {STOCK_LIST.filter(s => s.market === 'KOSPI' || !s.market || s.market === 'KOSPO').map(stock => (
                      <option key={stock.code} value={stock.code}>
                        {stock.name} ({stock.code})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="KOSDAQ" className="text-slate-900 dark:text-white bg-white dark:bg-[#101922]">
                    {STOCK_LIST.filter(s => s.market === 'KOSDAQ').map(stock => (
                        <option key={stock.code} value={stock.code}>
                          {stock.name} ({stock.code})
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
                  <Button variant="ghost" onClick={closeModal}>
                    취소
                  </Button>
              )}
              <Button onClick={handleStart} className="px-6">
                <Play className="w-4 h-4 mr-2" />
                시뮬레이션 시작
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
