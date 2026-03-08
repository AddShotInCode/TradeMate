interface StockHeaderProps {
  symbol: string;
  name: string;
  exchange: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export default function StockHeader({
  name,
  exchange,
  price,
  change,
  changePercent,
  isPositive,
}: StockHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-white">{name || "-"}</h1>
          <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs font-semibold">
            {exchange}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start md:items-end">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className={`text-lg font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {change} ({changePercent})
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">최종 업데이트: 장 마감</p>
      </div>
    </div>
  );
}
