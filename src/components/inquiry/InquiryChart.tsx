"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createChart, ColorType, ISeriesApi } from "lightweight-charts";
import type { CandlestickData, MouseEventParams, Time } from "lightweight-charts";
import { Loader2 } from "lucide-react";
import { useInquiryStore } from "@/store/inquiryStore";

type RangeKey = "1M" | "3M" | "6M" | "1Y";

const RANGE_BUTTONS: Array<{ key: RangeKey; label: string }> = [
  { key: "1M", label: "1달" },
  { key: "3M", label: "3달" },
  { key: "6M", label: "6달" },
  { key: "1Y", label: "1년" },
];

function timeToDate(time: CandlestickData["time"]): Date {
  if (typeof time === "number") {
    // UTCTimestamp (seconds)
    return new Date(time * 1000);
  }

  if (typeof time === "string") {
    // Expected: YYYY-MM-DD
    const [y, m, d] = time.split("-").map((n) => Number(n));
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }

  // BusinessDay: { year, month, day }
  return new Date(time.year, time.month - 1, time.day);
}

function getFromDate(lastDate: Date, range: RangeKey): Date {
  const from = new Date(lastDate.getTime());
  if (range === "1M") {
    from.setMonth(from.getMonth() - 1);
    return from;
  }
  if (range === "3M") {
    from.setMonth(from.getMonth() - 3);
    return from;
  }
  if (range === "6M") {
    from.setMonth(from.getMonth() - 6);
    return from;
  }
  // 1Y
  from.setFullYear(from.getFullYear() - 1);
  return from;
}

export default function InquiryChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const displayDataRef = useRef<CandlestickData[]>([]);

  const { data, isLoading } = useInquiryStore();
  const [range, setRange] = useState<RangeKey>("1Y");
  // Only store crosshair-driven legend; latest candle display can be derived from current display data.
  const [crosshairLegend, setCrosshairLegend] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
    date: string;
  } | null>(null);

  const displayData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const last = data[data.length - 1];
    const lastDate = timeToDate(last.time);
    const fromDate = getFromDate(lastDate, range);

    return data.filter((candle) => timeToDate(candle.time) >= fromDate);
  }, [data, range]);

  useEffect(() => {
    displayDataRef.current = displayData;
  }, [displayData]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const initChart = (width: number, height: number) => {
      if (chartRef.current) return;

      const chart = createChart(chartContainerRef.current!, {
        layout: {
          background: { type: ColorType.Solid, color: "#101922" },
          textColor: "#d1d5db",
        },
        grid: {
          vertLines: { color: "#283039" },
          horzLines: { color: "#283039" },
        },
        crosshair: {
          mode: 1,
          vertLine: { visible: true, labelVisible: true },
          horzLine: { visible: true, labelVisible: true },
        },
        timeScale: {
          rightOffset: 20,
          barSpacing: 12,
          fixLeftEdge: true,
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: true,
        },
        rightPriceScale: {
          autoScale: true,
          scaleMargins: {
            top: 0.15,
            bottom: 0.15,
          },
        },
        width,
        height,
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#ef4444",
        downColor: "#3b82f6",
        borderVisible: false,
        wickUpColor: "#ef4444",
        wickDownColor: "#3b82f6",
      });

      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      chart.subscribeCrosshairMove((param: MouseEventParams<Time>) => {
        const seriesPoint = param.seriesData.get(candlestickSeries) as CandlestickData | undefined;
        if (param.time && seriesPoint) {
          setCrosshairLegend({
            open: seriesPoint.open,
            high: seriesPoint.high,
            low: seriesPoint.low,
            close: seriesPoint.close,
            date: String(seriesPoint.time),
          });
        } else {
          setCrosshairLegend(null);
        }
      });

      // If data already exists, paint immediately.
      if (displayDataRef.current.length > 0) {
        candlestickSeries.setData(displayDataRef.current);
        chart.applyOptions({
          rightPriceScale: {
            autoScale: true,
          },
        });
        chart.timeScale().fitContent();
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !entries[0].contentRect) return;
      const { width, height } = entries[0].contentRect;
      if (width <= 0 || height <= 0) return;

      if (!chartRef.current) {
        initChart(width, height);
      } else {
        chartRef.current.applyOptions({ width, height });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, []);

  // Update data when it changes or range changes
  useEffect(() => {
    if (!seriesRef.current) return;
    if (displayData.length === 0) return;

    seriesRef.current.setData(displayData);
    chartRef.current?.applyOptions({
      rightPriceScale: {
        autoScale: true,
      },
    });
    chartRef.current?.timeScale().fitContent();
  }, [displayData]);

  const lastCandle = displayData.length > 0 ? displayData[displayData.length - 1] : null;
  const currentDisplay =
    crosshairLegend ||
    (lastCandle
      ? {
          open: lastCandle.open as number,
          high: lastCandle.high as number,
          low: lastCandle.low as number,
          close: lastCandle.close as number,
          date: String(lastCandle.time),
        }
      : null);

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-1 shadow-sm relative">
      {/* Chart Mount */}
      <div ref={chartContainerRef} className="w-full h-[300px] sm:h-[400px]" />

      {/* Loading / Empty Overlay */}
      {(isLoading || displayData.length === 0) && (
        <div className="absolute inset-1 flex items-center justify-center bg-[#1e293b] rounded-xl">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-[#137fec]" />
              <span className="text-slate-400 text-sm">Loading Chart Data...</span>
            </div>
          ) : (
            <span className="text-slate-400 text-sm">No Data Available</span>
          )}
        </div>
      )}

      {/* Range Buttons (Top-Left) */}
      <div className="absolute top-3 left-3 z-20 flex gap-1">
        {RANGE_BUTTONS.map((btn) => {
          const active = btn.key === range;
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => setRange(btn.key)}
              className={
                "px-2 py-1 text-xs rounded border transition-colors " +
                (active
                  ? "bg-slate-200 text-slate-900 border-slate-200"
                  : "bg-[#111418]/70 text-slate-200 border-[#283039] hover:bg-[#111418]/90")
              }
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Legend Overlay */}
      {currentDisplay && displayData.length > 0 && (
        <div className="absolute top-12 left-3 z-10 flex items-center gap-3 text-xs font-mono bg-[#111418]/80 p-2 rounded border border-[#283039] backdrop-blur-sm">
          <span
            className={`${currentDisplay.close > currentDisplay.open ? "text-red-500" : "text-blue-500"}`}
          >
            O: {currentDisplay.open.toLocaleString()}
          </span>
          <span className="text-white">H: {currentDisplay.high.toLocaleString()}</span>
          <span className="text-white">L: {currentDisplay.low.toLocaleString()}</span>
          <span
            className={`${currentDisplay.close > currentDisplay.open ? "text-red-500" : "text-blue-500"}`}
          >
            C: {currentDisplay.close.toLocaleString()}
          </span>

          <div className="relative">
            <button
              type="button"
              aria-label="지표 설명"
              className="group inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#283039] bg-[#0b0f14]/70 text-[10px] font-semibold text-slate-200 hover:bg-[#0b0f14]"
            >
              ?
              <div className="pointer-events-none absolute left-full top-1/2 ml-2 hidden w-[180px] -translate-y-1/2 rounded-md border border-[#283039] bg-[#0b0f14]/95 px-2 py-1.5 text-[11px] leading-snug text-slate-200 shadow-lg group-hover:block">
                <div>
                  <span className="font-semibold">O</span>: 시가 (Open)
                </div>
                <div>
                  <span className="font-semibold">H</span>: 고가 (High)
                </div>
                <div>
                  <span className="font-semibold">L</span>: 저가 (Low)
                </div>
                <div>
                  <span className="font-semibold">C</span>: 종가 (Close)
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
