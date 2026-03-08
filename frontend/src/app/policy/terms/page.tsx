import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavigation from "@/components/landing/LandingNavigation";
import { TERMS_OF_SERVICE } from "@/constants/legal_constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "TradeMate 서비스 이용약관을 확인하세요.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#101922] text-white font-sans flex flex-col">
      <LandingNavigation />

      <main className="flex-1 w-full max-w-[960px] mx-auto px-4 sm:px-10 py-12 md:py-20">
        <h1 className="text-3xl font-black mb-8 border-b border-[#283039] pb-4">이용약관</h1>
        <div className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[#9dabb9] font-sans">
            {TERMS_OF_SERVICE}
          </pre>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
