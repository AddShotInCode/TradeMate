"use client";

import { CandlestickChart, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LandingNavigation from "@/components/landing/LandingNavigation";
import LandingFooter from "@/components/landing/LandingFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922] font-sans text-[#101922] dark:text-white flex flex-col">
      <LandingNavigation />

      <main className="flex-1 flex items-center justify-center p-4 relative">
        {/* 배경 장식 요소: 은은한 어두운 기하학적 패턴 */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://cdn.usegalileo.ai/sdxl10/240c0649-659f-4318-ae30-80a911e8633c.png')" }}
        ></div>

        {/* 메인 로그인 카드 컨테이너 */}
        <Card className="w-full max-w-[440px] bg-white dark:bg-[#1e2329] shadow-2xl border-gray-200 dark:border-[#2a3441] overflow-hidden relative z-10 transition-colors">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-[#137fec]/10 flex items-center justify-center">
                <CandlestickChart className="text-[#137fec] size-7" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">TradeMate</CardTitle>
            <CardDescription className="text-gray-500 dark:text-[#9dabb9]">다시 오신 것을 환영합니다. 세부 정보를 입력해주세요.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 pb-10">
            {/* 이메일 입력 필드 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="email">이메일</label>
              <Input 
                id="email" 
                placeholder="name@example.com" 
                type="email" 
                className="bg-gray-50 dark:bg-[#1c2127] border-gray-300 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] h-12"
              />
            </div>

            {/* 비밀번호 입력 필드 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white" htmlFor="password">비밀번호</label>
              <div className="relative flex w-full items-center">
                <Input 
                  id="password" 
                  placeholder="비밀번호를 입력하세요" 
                  type={showPassword ? "text" : "password"}
                  className="bg-gray-50 dark:bg-[#1c2127] border-gray-300 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] h-12 pr-12 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* 비밀번호 찾기 */}
            <div className="flex items-center justify-end mt-1">
              <Link className="text-sm font-medium text-[#137fec] hover:text-[#137fec]/80 transition-colors" href="#">비밀번호를 잊으셨나요?</Link>
            </div>

            {/* 로그인 버튼 */}
            <Button className="w-full bg-[#137fec] hover:bg-blue-600 text-white h-12 text-sm font-semibold shadow-sm mt-2">
              로그인
            </Button>

            {/* 소셜 로그인 구분선 */}
            <div className="relative mt-2">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-[#3b4754]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-[#1e2329] px-2 text-xs text-gray-400 dark:text-[#637588]">또는</span>
              </div>
            </div>

            {/* 게스트 로그인 버튼 */}
            <Button variant="outline" className="w-full h-12 gap-2 border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#252b33]">
              <User className="size-5" />
              <span>게스트로 계속하기</span>
            </Button>
          </CardContent>

          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-gray-500 dark:text-[#9dabb9]">
              계정이 없으신가요?{" "}
              <Link className="font-medium text-[#137fec] hover:text-[#137fec]/80 hover:underline transition-colors" href="#">회원가입</Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <LandingFooter />
    </div>
  );
}
