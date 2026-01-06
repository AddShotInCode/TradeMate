import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto flex max-w-[960px] flex-col items-center justify-center gap-8 px-4 text-center sm:px-10">
        <h2 className="max-w-[700px] text-4xl font-black tracking-tight text-white sm:text-5xl">
          도박을 멈추고 진짜 트레이딩을 시작할 준비가 되셨나요?
        </h2>
        <p className="max-w-[600px] text-lg text-[#9dabb9]">
          손익 중심에서 프로세스 중심으로 전환하고, 수익을 만드는 원칙을 구축하기 시작하세요.
        </p>
        <div className="flex flex-col w-full sm:w-auto gap-4 sm:flex-row">
          <Link
            href="/login"
            className="flex h-14 w-full sm:w-auto min-w-[200px] items-center justify-center rounded-lg bg-[#137fec] px-8 text-lg font-bold text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-[#137fec]/25"
          >
            지금 시작하기
          </Link>
        </div>
      </div>
    </section>
  );
}
