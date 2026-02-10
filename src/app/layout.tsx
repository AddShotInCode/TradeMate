import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/layout/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TradeMate - 원칙 중심의 주식 매매 훈련 플랫폼",
    template: "%s | TradeMate",
  },
  description: "원칙 중심의 주식 매매 훈련 플랫폼. 충동적인 매매를 차단하고 원칙 준수를 평가합니다. 손익이 아닌 원칙 준수를 점수화하는 트레이딩 훈련 시뮬레이션.",
  keywords: [
    "주식 매매 훈련",
    "트레이딩 시뮬레이션",
    "원칙 중심 트레이딩",
    "주식 투자 교육",
    "매매 훈련 플랫폼",
    "주식 시뮬레이터",
    "트레이딩 연습",
    "주식 학습",
  ],
  authors: [{ name: "TradeMate" }],
  creator: "TradeMate",
  publisher: "TradeMate",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io",
    siteName: "TradeMate",
    title: "TradeMate - 원칙 중심의 주식 매매 훈련 플랫폼",
    description: "원칙 중심의 주식 매매 훈련 플랫폼. 충동적인 매매를 차단하고 원칙 준수를 평가합니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TradeMate - 원칙 중심 트레이딩 훈련",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeMate - 원칙 중심의 주식 매매 훈련 플랫폼",
    description: "원칙 중심의 주식 매매 훈련 플랫폼. 충동적인 매매를 차단하고 원칙 준수를 평가합니다.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code",
    // other: {
    //   "naver-site-verification": "your-naver-verification-code",
    // },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
