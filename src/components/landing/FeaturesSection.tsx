import { Lock, Target, History } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "충동 차단",
    description:
      "사전 설정한 규칙을 위반하는 거래를 방지합니다. 최대 손실, 최대 거래 횟수, 잠금 시간을 설정하여 FOMO를 차단하세요.",
  },
  {
    icon: Target,
    title: "원칙 준수 점수",
    description:
      "매 세션마다 점수를 받으세요. 계획을 얼마나 잘 따랐는지에 따라 0-100점으로 당신의 원칙 준수를 시각화합니다.",
  },
  {
    icon: History,
    title: "마켓 리플레이",
    description:
      "실제와 같은 환경에서 효율적으로 연습하세요. 실제 자본 위험 없이 과거 시장 데이터를 10배속으로 재생합니다.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto flex max-w-[960px] flex-col gap-16 px-4 sm:px-10">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[700px] space-y-4">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              왜 TradeMate인가요?
            </h2>
            <p className="text-lg text-[#9dabb9]">
              TradeMate는 강력한 원칙 준수 시스템을 통해 나쁜 습관을 올바른 실행으로 바꾸도록 설계되었습니다. 
              단순히 차트를 보여주는 것이 아니라, 당신의 거래 과정을 분석하고 개선합니다.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col gap-6 rounded-2xl border border-[#283039] bg-[#1c2127] p-8 hover:border-[#137fec]/50 transition-all duration-300"
            >
              <div className="flex size-14 items-center justify-center rounded-xl bg-[#101922] text-[#137fec] group-hover:scale-110 transition-transform">
                <feature.icon className="size-7" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[#9dabb9]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
