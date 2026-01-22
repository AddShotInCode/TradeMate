"use client";

import { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { EyeOff } from "lucide-react";
import { useSimulationStore, DUMMY_DATA } from "@/store/simulationStore";

export default function SimulationChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  const { currentTimeIndex, setCurrentPrice, currentPrice } = useSimulationStore();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#101922' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#283039' },
        horzLines: { color: '#283039' },
      },
      timeScale: {
        rightOffset: 20, // Add space for blind mode overlay
        barSpacing: 12,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0bda5b',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#0bda5b',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Initial Data Load
    const visibleData = DUMMY_DATA.slice(0, Math.min(currentTimeIndex + 1, DUMMY_DATA.length));
    candlestickSeries.setData(visibleData as CandlestickData[]);
    if (visibleData.length > 0) {
        const lastCandle = visibleData[visibleData.length - 1];
        setCurrentPrice(lastCandle.close);
        
        // Ensure visible range is correct
        chart.timeScale().setVisibleLogicalRange({
            from: visibleData.length - 30,
            to: visibleData.length + 10, // Add buffer
        });
    }

    // Resize Observer to handle container size changes (e.g. TradeLog resize)
    const resizeObserver = new ResizeObserver((entries) => {
        if (!chartContainerRef.current || !chartRef.current) return;
        
        const { width, height } = entries[0].contentRect;
        chartRef.current.applyOptions({ width, height });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // Update data when currentTimeIndex changes
  useEffect(() => {
    if (!seriesRef.current) return;
    
    const visibleData = DUMMY_DATA.slice(0, Math.min(currentTimeIndex + 1, DUMMY_DATA.length));
    seriesRef.current.setData(visibleData as CandlestickData[]);
    
    if (visibleData.length > 0) {
        const lastCandle = visibleData[visibleData.length - 1];
        setCurrentPrice(lastCandle.close);
        
        // Scroll to keep new candle visible but respect offset
        if (chartRef.current) {
             chartRef.current.timeScale().scrollToPosition(0, true);
        }
    }

  }, [currentTimeIndex, setCurrentPrice]);

  return (
    <div className="flex-1 w-full h-full relative rounded-lg overflow-hidden border border-[#3b4754] bg-[#101922]">
      <div ref={chartContainerRef} className="w-full h-full" />
      
      {/* Blind Mode Overlay */}
      <div className="absolute top-0 right-0 h-full w-[20%] bg-[#101922] border-l border-dashed border-slate-600 flex items-center justify-center z-20">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <EyeOff className="w-8 h-8" />
          <span className="text-xs uppercase tracking-widest font-bold">Blind Mode</span>
        </div>
      </div>
      
      {/* Current Price Line Label */}
      <div className="absolute top-[35%] left-0 right-[20%] border-t border-dashed border-white flex items-center justify-end pointer-events-none">
        <div className="bg-[#137fec] text-white text-xs font-bold px-1.5 py-0.5 rounded-l translate-x-full translate-y-[-50%] z-30">
            {currentPrice.toLocaleString('ko-KR')}
        </div>
      </div>
    </div>
  );
}
