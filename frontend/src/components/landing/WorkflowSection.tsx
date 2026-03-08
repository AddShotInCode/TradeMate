import { PenLine, Zap, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    title: "전략 정의하기",
    description: "시장이 열리기 전에 당신의 규칙을 입력하세요.",
  },
  {
    icon: Zap,
    title: "통제하며 실행하기",
    description: "이탈을 차단하는 시뮬레이터에서 거래하세요.",
  },
  {
    icon: BarChart3,
    title: "성과 평가하기",
    description: "원칙 준수에 대한 즉각적인 피드백을 받으세요.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="relative overflow-hidden border-y border-[#283039] bg-[#1c2127] py-20 md:py-28">
      <div className="mx-auto flex max-w-[960px] flex-col gap-12 px-4 sm:px-10">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Image Side */}
          <div className="order-2 md:order-1">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#283039] bg-[#101922] shadow-2xl md:aspect-[4/3]"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAQU1JUei9iEnUYU3392C5KkXcp_SFWqD8Hm2j_AlwaTA359OfLbFMCiFN7iEeh2hjlhxSv7NF7oTB4LdThcqeRteupAahgkYn2EWu07t8i_nMwTLkwx_ly_JjAohR4EhRL5vlgy62cQXionXK2JKGyuTFVx7N_dSTyRjvdktNxt3e9IhIjesFirltWEGKVkIB7xYJwWsbGreYWkuntDP_XKPsT2SFWl9PlgxWYQtdKHDVYJwQjCWIgXYEztpoBpdvleCyWcLW3RHJA')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>

          {/* Text Side */}
          <div className="order-1 flex flex-col gap-6 md:order-2 md:pl-10">
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              정의. 실행. 평가.
            </h2>
            <p className="text-base leading-relaxed text-[#9dabb9]">
              성공적인 트레이딩은 예측이 아닌 대응과 원칙에 있습니다. TradeMate가 제안하는 체계적인
              훈련 과정
            </p>
            <ul className="flex flex-col gap-4">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <step.icon className="mt-1 size-5 text-[#137fec]" />
                  <div>
                    <strong className="text-white block">{step.title}</strong>
                    <span className="text-sm text-[#9dabb9]">{step.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
