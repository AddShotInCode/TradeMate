export default function StatsSection() {
  const stats = [
    { value: "Beta", label: "현재 서비스 단계", highlight: true },
    { value: "Real-time", label: "시장 데이터 연동", highlight: false },
    { value: "Risk Free", label: "자금 손실 없는 훈련", highlight: false },
  ];

  return (
    <section className="border-y border-[#283039] bg-[#1c2127]/50">
      <div className="mx-auto flex max-w-[960px] flex-col px-4 py-12 sm:px-10">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-[#9dabb9]">
          안전한 환경에서 당신의 원칙을 검증하세요
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[#283039] bg-[#101922] p-6 text-center hover:border-[#137fec]/50 transition-colors"
            >
              <p
                className={`text-3xl font-black tracking-tight ${stat.highlight ? "text-[#137fec]" : "text-white"}`}
              >
                {stat.value}
              </p>
              <p className="text-sm font-medium text-[#9dabb9]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
