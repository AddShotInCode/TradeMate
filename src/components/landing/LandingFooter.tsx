import { Twitter, Github } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

const footerLinks = {
  product: [
    { label: "주요 기능", href: "#features" },
    { label: "업데이트", href: "#" },
  ],
  company: [
    { label: "서비스 소개", href: "#about" },
    { label: "블로그", href: "#" },
    { label: "채용", href: "#" },
  ],
  legal: [
    { label: "개인정보처리방침", href: "#" },
    { label: "이용약관", href: "#" },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#283039] bg-[#101922] py-12">
      <div className="mx-auto flex max-w-[960px] flex-col gap-10 px-4 sm:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Logo />
            </Link>
            <p className="max-w-[300px] text-sm text-[#9dabb9]">
              원칙 중심의 트레이딩 훈련 및 연습을 위한 플랫폼입니다.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white">제품</h4>
              {footerLinks.product.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-[#9dabb9] hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white">팀</h4>
              {footerLinks.company.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-[#9dabb9] hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white">법적 고지</h4>
              {footerLinks.legal.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-[#9dabb9] hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-[#283039] pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#9dabb9]">© 2026 TradeMate. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-[#9dabb9] hover:text-white transition-colors">
                <Twitter className="size-5" />
              </a>
              <a href="#" className="text-[#9dabb9] hover:text-white transition-colors">
                <Github className="size-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col gap-2 text-[11px] leading-relaxed text-[#9dabb9]/60">
            <p>
              본 서비스는 공공데이터포털(apis.data.go.kr)의 [금융위원회_주식시세정보] API를 활용하여 데이터를 제공합니다.
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>데이터 갱신 주기: 일 1회 (기준일자로부터 영업일 하루 뒤 13:00 이후 업데이트)</li>
              <li>제공되는 주식시세정보(시가, 종가, 고가, 저가, 거래량 등)는 실시간 정보가 아니며, 데이터 보유기관의 사정에 따라 지연되거나 제공되지 않을 수 있습니다.</li>
              <li>제공된 데이터를 바탕으로 한 투자 결정의 책임은 전적으로 본인에게 있으며, TradeMate는 이에 대한 어떠한 법적 책임도 지지 않습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
