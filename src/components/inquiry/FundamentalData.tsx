interface FundamentalItem {
  label: string;
  value: string;
}

interface FundamentalDataProps {
  data: FundamentalItem[];
  asOfDate?: string;
}

export default function FundamentalData({ data, asOfDate }: FundamentalDataProps) {
  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-white">기본 정보</h3>
        {asOfDate && (
          <span className="text-xs text-[#9dabb9]">기준일: {asOfDate}</span>
        )}
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex justify-between border-b border-slate-800 pb-2"
          >
            <span className="text-[#9dabb9] text-sm">{item.label}</span>
            <span className="text-white font-medium text-sm">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
