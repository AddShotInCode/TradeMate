interface StatItem {
  label: string;
  value: string;
}

interface KeyStatsProps {
  stats: StatItem[];
}

export default function KeyStats({ stats }: KeyStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[#1e293b] p-4 rounded-xl border border-[#334155]">
          <p className="text-xs font-medium text-[#9dabb9] uppercase tracking-wider mb-1">
            {stat.label}
          </p>
          <p className="text-lg font-semibold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
