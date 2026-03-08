"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, ISeriesApi, CandlestickData } from "lightweight-charts";
import { EyeOff, Loader2 } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { useSearchParams } from "next/navigation";

export default function SimulationChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const { data, isLoading, currentTimeIndex, setCurrentPrice, loadData, error } =
    useSimulationStore();
  const [legend, setLegend] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
    date: string;
  } | null>(null);

  // Refs for accessing fresh state inside event callbacks without re-subscribing
  const dataRef = useRef(data);
  const currentIndexRef = useRef(currentTimeIndex);

  useEffect(() => {
    dataRef.current = data;
    currentIndexRef.current = currentTimeIndex;
  }, [data, currentTimeIndex]);

  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");
  const startParam = searchParams.get("start");

  useEffect(() => {
    const code = codeParam || "005930";
    const start = startParam || "20240101";
    loadData(code, start, "20251231");
  }, [codeParam, startParam, loadData]);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (data.length === 0) return;

    // Helper to create chart - only called when we have valid dims
    const initChart = (width: number, height: number) => {
      if (chartRef.current) return; // Already created

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
        width: width,
        height: height,
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

      // Initial Data
      const visibleData = data.slice(0, Math.min(currentTimeIndex + 1, data.length));
      candlestickSeries.setData(visibleData);

      if (visibleData.length > 0) {
        const lastCandle = visibleData[visibleData.length - 1];
        setCurrentPrice(lastCandle.close as number);

        if (visibleData.length > 30) {
          chart.timeScale().setVisibleLogicalRange({
            from: visibleData.length - 30,
            to: visibleData.length + 5,
          });
        }

        setLegend({
          open: lastCandle.open as number,
          high: lastCandle.high as number,
          low: lastCandle.low as number,
          close: lastCandle.close as number,
          date: String(lastCandle.time),
        });
      }

      // Crosshair Handler
      chart.subscribeCrosshairMove((param) => {
        if (
          !param.point ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > chart.timeScale().width()
        ) {
          const visibleData = dataRef.current.slice(
            0,
            Math.min(currentIndexRef.current + 1, dataRef.current.length)
          );
          if (visibleData.length > 0) {
            const last = visibleData[visibleData.length - 1];
            setLegend({
              open: last.open as number,
              high: last.high as number,
              low: last.low as number,
              close: last.close as number,
              date: String(last.time),
            });
          }
          return;
        }

        const seriesData = param.seriesData.get(candlestickSeries) as CandlestickData;
        if (seriesData) {
          setLegend({
            open: seriesData.open as number,
            high: seriesData.high as number,
            low: seriesData.low as number,
            close: seriesData.close as number,
            date: String(seriesData.time),
          });
        } else if (param.time) {
          const currentData = dataRef.current;
          const found = currentData.find((d) => String(d.time) === String(param.time));
          if (found) {
            const foundIndex = currentData.indexOf(found);
            if (foundIndex !== -1 && foundIndex <= currentIndexRef.current) {
              setLegend({
                open: found.open as number,
                high: found.high as number,
                low: found.low as number,
                close: found.close as number,
                date: String(found.time),
              });
            }
          }
        }
      });
    };

    // Resize Observer handles BOTH initial size detection AND updates
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !entries[0].contentRect) return;
      const { width, height } = entries[0].contentRect;

      // Only trigger layout/creation if dimensions are valid
      if (width > 0 && height > 0) {
        if (!chartRef.current) {
          // First time valid size -> Create Chart
          initChart(width, height);
        } else {
          // Resize existing chart
          chartRef.current.applyOptions({ width, height });
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]); // Re-create chart only if data length changes drastically (like initial load), logic might need refinement if simple data updates ensue

  // Update data when currentTimeIndex changes
  useEffect(() => {
    if (!seriesRef.current) return;

    // We can rely on replaceData or update.
    // Since we are simulating 'history' revealing, we are growing the known array.
    // setData is fine for this size.
    const visibleData = data.slice(0, Math.min(currentTimeIndex + 1, data.length));
    seriesRef.current.setData(visibleData);

    if (visibleData.length > 0) {
      const lastCandle = visibleData[visibleData.length - 1];
      setCurrentPrice(lastCandle.close as number);

      // Ensure the new candle is visible
      if (chartRef.current) {
        // Scroll to real-time?
        // chartRef.current.timeScale().scrollToPosition(0, true);
      }
    }
  }, [currentTimeIndex, setCurrentPrice, data]);

  if (isLoading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center bg-[#101922] border border-[#3b4754] rounded-lg">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-slate-400">Loading Market Data...</span>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-[#101922] border border-[#3b4754] rounded-lg text-red-400 p-4 text-center">
        <p className="font-bold mb-2">Failed to load data</p>
        <p className="text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full relative rounded-lg overflow-hidden border border-[#3b4754] bg-[#101922]">
      <div ref={chartContainerRef} className="w-full h-full" />

      {/* Legend Overlay */}
      {legend && (
        <div className="absolute top-3 left-3 z-20 flex flex-col pointer-events-none bg-[#101922]/80 p-2 rounded border border-gray-800 backdrop-blur-sm">
          <div className="text-sm font-bold text-white mb-1">{legend.date}</div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px]">OPEN</span>
              <span className="text-[#d1d5db]">{legend.open.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px]">HIGH</span>
              <span className="text-[#ef4444]">{legend.high.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px]">LOW</span>
              <span className="text-[#3b82f6]">{legend.low.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[10px]">CLOSE</span>
              <span className={legend.close >= legend.open ? "text-[#ef4444]" : "text-[#3b82f6]"}>
                {legend.close.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Blind Mode Overlay */}
      <div
        className="absolute top-0 right-0 h-full z-10 pointer-events-none"
        style={{
          width: "80px",
          background: "linear-gradient(to right, transparent, #101922 30%)",
        }}
      >
        <div className="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col items-center gap-1 text-slate-500">
          <EyeOff />
          <span className="text-xs uppercase tracking-widest font-bold">Blind Mode</span>
        </div>
      </div>

      {/* Current Price Line Label */}
    </div>
  );
}
