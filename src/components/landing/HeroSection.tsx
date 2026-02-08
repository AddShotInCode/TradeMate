

export default function HeroSection() {
  return (
    <section
      id="about"
      className="relative flex flex-col items-center justify-center overflow-hidden py-16 md:py-24"
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#137fec]/20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[960px] px-4 sm:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          {/* Text Content */}
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-4">
              {/* Headline */}
              <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-white sm:text-4xl md:text-5xl">
                시장을 정복하고, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#137fec] to-blue-300">
                  나 자신을 정복하라.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base font-normal leading-relaxed text-[#9dabb9] sm:text-lg max-w-[500px]">
                TradeMate는 충동적인 매매를 차단하고 당신의 원칙 준수를 평가합니다. 손익이 아닌 원칙
                준수를 점수화하는 트레이딩 훈련 플랫폼을 지향합니다.
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full flex-1 md:w-auto">
            <div
              className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#283039] bg-[#1c2127] shadow-2xl"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCr1xaKYCeUJzSTE8ffvZ2ZuopfHEvOREfA2bBt_NLwC2VuJE37PcArjnz6FtMqbuif4DsxzFBk4yJQAJ8TYUMsy2tIasqAhnZRnmtNbvdgokQZpyL4JgCxbUWQDtOD6rrmVVLFBM8wgz9TvSuIgrYamURzGa-2QbVs1SK7Nzq90ra0wFPiUF6wKDl9N-gXRaeHzTYv246XbggeyOQjRHcn_qseZyRgd0nmxBirx0iVHFPidCHrId6lBr9EOkVrq9VRAoJNnAnXaT3k')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay gradient to fade bottom */}
              <div className="h-full w-full bg-gradient-to-t from-[#101922] via-transparent to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
