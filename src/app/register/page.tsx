"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CandlestickChart, Eye, EyeOff, Info, LockKeyhole, ShieldCheck } from "lucide-react";

import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavigation from "@/components/landing/LandingNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/constants/legal_constants";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const EMAIL_CODE_TTL_SECONDS = 5 * 60;

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerificationMessage, setEmailVerificationMessage] = useState<string | null>(null);
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false);
  const [emailCodeExpiresAt, setEmailCodeExpiresAt] = useState<number | null>(null);
  const [emailCodeRemainingSeconds, setEmailCodeRemainingSeconds] = useState<number | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const [birthYear, setBirthYear] = useState<string>(""
  );
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("");

  const currentYear = new Date().getFullYear();

  const years = useMemo(() => {
    const start = currentYear - 100;
    const end = currentYear;

    const result: number[] = [];
    for (let y = end; y >= start; y -= 1) result.push(y);
    return result;
  }, [currentYear]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const days = useMemo(() => {
    const year = Number.parseInt(birthYear, 10);
    const month = Number.parseInt(birthMonth, 10);
    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return [];

    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [birthYear, birthMonth]);

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email), [email]);
  const isPasswordValid = useMemo(() => PASSWORD_REGEX.test(password), [password]);
  const isConfirmValid = useMemo(
    () => confirmPassword.length > 0 && confirmPassword === password,
    [confirmPassword, password]
  );
  const isPhoneValid = useMemo(() => phone.trim().length === 0 || /^\d{11}$/.test(phone.trim()), [phone]);
  const isBirthSelected = useMemo(
    () => Boolean(birthYear) && Boolean(birthMonth) && Boolean(birthDay),
    [birthYear, birthMonth, birthDay]
  );

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      isBirthSelected &&
      isEmailValid &&
      isEmailVerified &&
      isPasswordValid &&
      isConfirmValid &&
      isPhoneValid &&
      agreeRequired
    );
  }, [agreeRequired, fullName, isBirthSelected, isConfirmValid, isEmailValid, isEmailVerified, isPasswordValid, isPhoneValid]);

  const sendEmailCodeButtonLabel = useMemo(() => {
    if (isEmailVerified) return "인증완료";
    if (isSendingEmailCode) return "발송중...";
    if (isEmailCodeSent) return "재발송";
    return "인증번호 발송";
  }, [isEmailCodeSent, isEmailVerified, isSendingEmailCode]);

  async function requestEmailVerificationCode() {
    if (!isEmailValid) {
      setEmailVerificationMessage("이메일 형식을 확인해주세요.");
      return;
    }

    try {
      setIsSendingEmailCode(true);
      setEmailVerificationMessage(null);
      setIsEmailVerified(false);

      const res = await fetch("/api/auth/email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { ok: boolean; delivered?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setIsEmailCodeSent(false);
        setEmailVerificationMessage(data.message ?? "인증번호 발송에 실패했습니다.");
        return;
      }

      setIsEmailCodeSent(true);
      setEmailCode("");
      const expiresAt = Date.now() + EMAIL_CODE_TTL_SECONDS * 1000;
      setEmailCodeExpiresAt(expiresAt);
      setEmailCodeRemainingSeconds(EMAIL_CODE_TTL_SECONDS);
      setEmailVerificationMessage(data.message ?? "인증번호를 이메일로 발송했습니다.");
    } catch {
      setIsEmailCodeSent(false);
      setEmailVerificationMessage("인증번호 발송 중 오류가 발생했습니다.");
    } finally {
      setIsSendingEmailCode(false);
    }
  }

  async function verifyEmailVerificationCode(codeOverride?: string) {
    if (!isEmailCodeSent) {
      setEmailVerificationMessage("먼저 인증번호를 발송해주세요.");
      return;
    }

    if (emailCodeExpiresAt && Date.now() > emailCodeExpiresAt) {
      setIsEmailVerified(false);
      setIsEmailCodeSent(false);
      setEmailVerificationMessage("인증번호가 만료되었습니다. 다시 발송해주세요.");
      return;
    }

    const code = (codeOverride ?? emailCode).trim();
    if (code.length !== 6) {
      setEmailVerificationMessage("인증번호 6자리를 입력해주세요.");
      return;
    }

    try {
      setIsVerifyingEmailCode(true);
      setEmailVerificationMessage(null);

      const res = await fetch("/api/auth/verify-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setIsEmailVerified(false);
        setEmailVerificationMessage(data.message ?? "인증에 실패했습니다.");
        return;
      }

      setIsEmailVerified(true);
      setEmailCodeExpiresAt(null);
      setEmailCodeRemainingSeconds(null);
      setEmailVerificationMessage("이메일 인증이 완료되었습니다.");
    } catch {
      setIsEmailVerified(false);
      setEmailVerificationMessage("인증 처리 중 오류가 발생했습니다.");
    } finally {
      setIsVerifyingEmailCode(false);
    }
  }

  useEffect(() => {
    if (!isEmailCodeSent) return;
    if (!emailCodeExpiresAt) return;
    if (isEmailVerified) return;

    const intervalId = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((emailCodeExpiresAt - Date.now()) / 1000));
      setEmailCodeRemainingSeconds(remaining);

      if (remaining === 0) {
        setIsEmailCodeSent(false);
        setEmailVerificationMessage("인증번호가 만료되었습니다. 다시 발송해주세요.");
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [emailCodeExpiresAt, isEmailCodeSent, isEmailVerified]);

  useEffect(() => {
    if (!isPrivacyOpen && !isTermsOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsPrivacyOpen(false);
        setIsTermsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPrivacyOpen, isTermsOpen]);

  function openTermsOfService() {
    setIsTermsOpen(true);
  }

  function openPrivacyPolicy() {
    setIsPrivacyOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      localStorage.setItem("tm_userName", fullName.trim());
    } catch {
      // ignore storage errors
    }

    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f6f7f8] dark:bg-[#101a22] font-sans text-[#101922] dark:text-white flex flex-col overflow-hidden">
      <LandingNavigation />

      {isTermsOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="이용약관"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsTermsOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl bg-white dark:bg-[#151f28] border border-slate-200 dark:border-[#2a3441] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#2a3441]">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">이용약관</h3>
              <button
                type="button"
                className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-[#9dacb9] dark:hover:text-white transition-colors"
                onClick={() => setIsTermsOpen(false)}
              >
                닫기
              </button>
            </div>

            <div className="px-6 py-5 overflow-auto max-h-[calc(80vh-120px)]">
              <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-[#d5dde6]">
                {TERMS_OF_SERVICE}
              </pre>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-[#2a3441] flex justify-end">
              <button
                type="button"
                className="h-10 px-4 rounded-lg bg-[#137fec] hover:bg-blue-600 text-white font-bold transition-all duration-200 shadow-lg shadow-[#137fec]/25 hover:shadow-[#137fec]/40 active:scale-[0.98]"
                onClick={() => setIsTermsOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isPrivacyOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="개인정보 처리방침"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsPrivacyOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl bg-white dark:bg-[#151f28] border border-slate-200 dark:border-[#2a3441] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#2a3441]">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">개인정보 처리방침</h3>
              <button
                type="button"
                className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-[#9dacb9] dark:hover:text-white transition-colors"
                onClick={() => setIsPrivacyOpen(false)}
              >
                닫기
              </button>
            </div>

            <div className="px-6 py-5 overflow-auto max-h-[calc(80vh-120px)]">
              <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-[#d5dde6]">
                {PRIVACY_POLICY}
              </pre>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-[#2a3441] flex justify-end">
              <button
                type="button"
                className="h-10 px-4 rounded-lg bg-[#137fec] hover:bg-blue-600 text-white font-bold transition-all duration-200 shadow-lg shadow-[#137fec]/25 hover:shadow-[#137fec]/40 active:scale-[0.98]"
                onClick={() => setIsPrivacyOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center p-4">
        {/* Background blur orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#137fec]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[480px] flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#137fec] to-blue-600 text-white shadow-lg shadow-[#137fec]/20 mb-4">
              <CandlestickChart className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">회원가입</h2>
            <p className="text-slate-500 dark:text-[#9dacb9] text-sm text-center max-w-xs">
              TradeMate와 함께 원칙 중심의 매매를 시작해보세요.
            </p>
          </div>

          <Card className="bg-white dark:bg-[#151f28] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a3441] overflow-hidden">
            {/* progress bar */}
            <div className="h-1 w-full bg-[#2a3441] relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[#137fec] rounded-full" />
            </div>

            <CardHeader className="sr-only">회원가입</CardHeader>

            <CardContent className="p-8">
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="full-name">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="full-name"
                    placeholder="예) 홍길동"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9dacb9] focus-visible:ring-[#137fec] focus-visible:ring-offset-0"
                  />
                  
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-white">
                    생년월일 <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={birthYear}
                      onChange={(e) => {
                        const nextYear = e.target.value;
                        setBirthYear(nextYear);

                        if (!birthMonth || !birthDay) return;

                        const year = Number.parseInt(nextYear, 10);
                        const month = Number.parseInt(birthMonth, 10);
                        const day = Number.parseInt(birthDay, 10);

                        if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return;
                        const maxDay = new Date(year, month, 0).getDate();
                        if (day > maxDay) setBirthDay("");
                      }}
                      required
                      aria-label="Birth year"
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] transition-colors text-base"
                    >
                      <option value="" disabled>
                        연도
                      </option>
                      {years.map((y) => (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      ))}
                    </select>

                    <select
                      value={birthMonth}
                      onChange={(e) => {
                        setBirthMonth(e.target.value);
                        setBirthDay("");
                      }}
                      required
                      aria-label="Birth month"
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] transition-colors text-base"
                    >
                      <option value="" disabled>
                        월
                      </option>
                      {months.map((m) => (
                        <option key={m} value={String(m)}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <select
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      required
                      disabled={!birthYear || !birthMonth}
                      aria-label="Birth day"
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] transition-colors text-base disabled:opacity-60"
                    >
                      <option value="" disabled>
                        일
                      </option>
                      {days.map((d) => (
                        <option key={d} value={String(d)}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!isBirthSelected ? (
                    <p className="text-xs text-red-500">생년월일을 선택해주세요.</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="email">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      placeholder="예) name@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const nextEmail = e.target.value;
                        setEmail(nextEmail);
                        setIsEmailCodeSent(false);
                        setIsEmailVerified(false);
                        setEmailCode("");
                        setEmailCodeExpiresAt(null);
                        setEmailCodeRemainingSeconds(null);
                        setEmailVerificationMessage(null);
                      }}
                      className="w-full h-12 px-4 pr-24 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9dacb9] focus-visible:ring-[#137fec] focus-visible:ring-offset-0"
                    />

                    <Button
                      type="button"
                      onClick={requestEmailVerificationCode}
                      disabled={!isEmailValid || isSendingEmailCode || isEmailVerified}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-3 rounded-md bg-[#137fec] hover:bg-blue-600 text-white font-bold transition-all duration-200 shadow-lg shadow-[#137fec]/25 hover:shadow-[#137fec]/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      aria-label="인증번호 발송"
                    >
                      {sendEmailCodeButtonLabel}
                    </Button>
                  </div>

                  {email.length > 0 && !isEmailValid ? (
                    <p className="text-xs text-red-500">이메일 형식이 올바르지 않습니다.</p>
                  ) : null}

                  <div className="relative">
                    <Input
                      id="email-code"
                      placeholder="인증번호 6자리 입력"
                      inputMode="numeric"
                      type="text"
                      value={emailCode}
                      disabled={!isEmailCodeSent || isEmailVerified}
                      onChange={(e) => {
                        const next = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setEmailCode(next);

                        if (!isEmailCodeSent || isEmailVerified || isVerifyingEmailCode) return;
                        if (next.length !== 6) return;
                        if (emailCodeExpiresAt && Date.now() > emailCodeExpiresAt) {
                          setIsEmailCodeSent(false);
                          setEmailVerificationMessage("인증번호가 만료되었습니다. 다시 발송해주세요.");
                          return;
                        }
                        void verifyEmailVerificationCode(next);
                      }}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9dacb9] focus-visible:ring-[#137fec] focus-visible:ring-offset-0 disabled:opacity-60"
                    />
                  </div>

                  {isEmailCodeSent && !isEmailVerified && emailCodeRemainingSeconds !== null ? (
                    <p className={
                      emailCodeRemainingSeconds === 0
                        ? "text-xs text-red-500"
                        : "text-xs text-slate-500 dark:text-[#9dacb9]"
                    }>
                      남은시간 {formatCountdown(emailCodeRemainingSeconds)}
                    </p>
                  ) : null}

                  {emailVerificationMessage ? (
                    <p className={isEmailVerified ? "text-xs text-emerald-500" : "text-xs text-slate-500 dark:text-[#9dacb9]"}>
                      {emailVerificationMessage}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="password">
                        비밀번호 <span className="text-red-500">*</span>
                      </label>

                      <div className="group relative flex items-center justify-center">
                        <Info className="size-4 text-slate-400 group-hover:text-[#137fec] cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-800 border border-slate-700 text-white text-xs leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 text-center pointer-events-none transform translate-y-1 group-hover:translate-y-0">
                          알파벳/숫자/특수기호 포함, 8자 이상이어야 합니다.
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-10 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9dacb9] focus-visible:ring-[#137fec] focus-visible:ring-offset-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-0 h-full flex items-center text-slate-400 hover:text-[#137fec] transition-colors"
                        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>

                    {password.length > 0 && !isPasswordValid ? (
                      <p className="text-xs text-red-500">알파벳/숫자/특수기호 포함, 8자 이상으로 입력해주세요.</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="confirm-password">
                      비밀번호 재입력 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9dacb9] focus-visible:ring-[#137fec] focus-visible:ring-offset-0"
                    />
                    {confirmPassword.length > 0 && !isConfirmValid ? (
                      <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-white" htmlFor="phone">
                      전화번호
                    </label>

                    <div className="group relative flex items-center justify-center">
                      <Info className="size-4 text-slate-400 group-hover:text-[#137fec] cursor-help transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-800 border border-slate-700 text-white text-xs leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 text-center pointer-events-none transform translate-y-1 group-hover:translate-y-0">
                        2단계 인증(2FA) 설정을 위해 사용할 수 있습니다.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                      </div>
                    </div>
                  </div>

                  <Input
                    id="phone"
                    placeholder="예) 01012345678"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg bg-slate-50 dark:bg-[#1c2227] border border-slate-200 dark:border-[#3b4954] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9dacb9] focus-visible:ring-[#137fec] focus-visible:ring-offset-0"
                  />
                  {phone.trim().length > 0 && !isPhoneValid ? (
                    <p className="text-xs text-red-500">숫자 11자리만 입력해주세요.</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <label className="flex items-start gap-3 group cursor-pointer">
                    <input
                      className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-[#3b4954] bg-slate-50 dark:bg-[#1c2227] text-[#137fec] focus:ring-offset-0 focus:ring-2 focus:ring-[#137fec]/50 cursor-pointer"
                      type="checkbox"
                      required
                      checked={agreeRequired}
                      onChange={(e) => setAgreeRequired(e.target.checked)}
                    />
                    <span className="text-sm text-slate-500 dark:text-[#9dacb9] group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      (필수){" "}
                      <button
                        type="button"
                        onClick={openTermsOfService}
                        className="text-[#137fec] hover:text-blue-400 font-medium underline-offset-2 hover:underline"
                      >
                        이용약관
                      </button>
                      {" "}및{" "}
                      <button
                        type="button"
                        onClick={openPrivacyPolicy}
                        className="text-[#137fec] hover:text-blue-400 font-medium underline-offset-2 hover:underline"
                      >
                        개인정보 처리방침
                      </button>
                      에 동의합니다.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 group cursor-pointer">
                    <input
                      className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-[#3b4954] bg-slate-50 dark:bg-[#1c2227] text-[#137fec] focus:ring-offset-0 focus:ring-2 focus:ring-[#137fec]/50 cursor-pointer"
                      type="checkbox"
                      checked={agreeMarketing}
                      onChange={(e) => setAgreeMarketing(e.target.checked)}
                    />
                    <span className="text-sm text-slate-500 dark:text-[#9dacb9] group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      (선택) 마케팅 정보 수신에 동의합니다.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full h-12 mt-2 flex items-center justify-center gap-2 bg-[#137fec] hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-[#137fec]/25 hover:shadow-[#137fec]/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>회원가입</span>
                  <span aria-hidden className="text-sm font-bold">→</span>
                </Button>
              </form>
            </CardContent>

            <CardFooter className="px-8 py-5 bg-slate-50 dark:bg-[#121a21] border-t border-slate-200 dark:border-[#2a3441] text-center flex justify-center">
              <p className="text-sm text-slate-600 dark:text-[#9dacb9]">
                이미 계정이 있으신가요?{" "}
                <Link className="text-[#137fec] hover:text-blue-400 font-bold ml-1 transition-colors" href="/login">
                  로그인
                </Link>
              </p>
            </CardFooter>
          </Card>

          <div className="mt-8 flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-600">
              <LockKeyhole className="size-4" />
              <span>256-bit 암호화</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-600">
              <ShieldCheck className="size-4" />
              <span>보안 검증</span>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
