"use client";

import { CandlestickChart, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import LandingNavigation from "@/components/landing/LandingNavigation";
import LandingFooter from "@/components/landing/LandingFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      router.push("/dashboard");
    } catch {
      // Error handled in store, displayed via error state
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101922] font-sans text-[#101922] dark:text-white flex flex-col">
      <LandingNavigation />

      <main className="flex-1 flex items-center justify-center p-4 relative">
        {/* 배경 장식 요소: 은은한 어두운 기하학적 패턴 */}
        <div
          className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://cdn.usegalileo.ai/sdxl10/240c0649-659f-4318-ae30-80a911e8633c.png')",
          }}
        ></div>

        {/* 메인 로그인 카드 컨테이너 */}
        <Card className="w-full max-w-[440px] bg-white dark:bg-[#1e2329] shadow-2xl border-gray-200 dark:border-[#2a3441] overflow-hidden relative z-10 transition-colors">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-[#137fec]/10 flex items-center justify-center">
                <CandlestickChart className="text-[#137fec] size-7" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              TradeMate
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-[#9dabb9]">
              다시 오신 것을 환영합니다. 세부 정보를 입력해주세요.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 pb-10">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 이메일 입력 필드 */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="email"
                >
                  이메일
                </label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  className="bg-gray-50 dark:bg-[#1c2127] border-gray-300 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] h-12"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.email.message}
                  </span>
                )}
              </div>

              {/* 비밀번호 입력 필드 */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="password"
                >
                  비밀번호
                </label>
                <div className="relative flex w-full items-center">
                  <Input
                    id="password"
                    placeholder="비밀번호를 입력하세요"
                    type={showPassword ? "text" : "password"}
                    className="bg-gray-50 dark:bg-[#1c2127] border-gray-300 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] h-12 pr-12 transition-all"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.password.message}
                  </span>
                )}
              </div>

              {error && <div className="text-sm text-red-500 font-medium text-center">{error}</div>}
              {/* 로그인 버튼 */}
              <Button className="w-full bg-[#137fec] hover:bg-blue-600 text-white h-12 text-sm font-semibold shadow-sm mt-2">
                로그인
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-gray-500 dark:text-[#9dabb9]">
              계정이 없으신가요?{" "}
              <Link
                className="font-medium text-[#137fec] hover:text-[#137fec]/80 hover:underline transition-colors"
                href="/register"
              >
                회원가입
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <LandingFooter />
    </div>
  );
}
