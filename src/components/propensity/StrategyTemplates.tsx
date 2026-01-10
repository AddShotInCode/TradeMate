"use client";

import StrategyTemplateCard from "./StrategyTemplateCard";

interface StrategyTemplatesProps {
  selectedTemplate: string;
  onSelectTemplate: (id: string) => void;
}

const templates = [
  {
    id: "trend-follower",
    title: "추세 추종",
    description: "시장의 모멘텀을 활용합니다. 낮은 승률, 높은 손익비.",
    tags: ["모멘텀", "눌림목"],
    icon: "trending" as const,
  },
  {
    id: "breakout-trader",
    title: "돌파 매매",
    description: "변동성 확장 시 진입합니다. 인내와 신속함이 필요합니다.",
    tags: ["거래량", "지지/저항"],
    icon: "candle" as const,
  },
];

export default function StrategyTemplates({ selectedTemplate, onSelectTemplate }: StrategyTemplatesProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="size-8 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold">
          2
        </div>
        <h2 className="text-xl font-bold text-white">전략 템플릿 선택</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((template) => (
          <StrategyTemplateCard
            key={template.id}
            {...template}
            isSelected={selectedTemplate === template.id}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </section>
  );
}
