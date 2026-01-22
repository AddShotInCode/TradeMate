"use client";

import { useMemo, useRef, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, PencilLine, Phone, ShieldCheck, KeyRound, LockKeyhole } from "lucide-react";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function AccountPage() {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear;

  const [fullName, setFullName] = useState<string>("김트레이더");
  const [nameTouched, setNameTouched] = useState(false);

  const [birthYear, setBirthYear] = useState<string>("1995");
  const [birthMonth, setBirthMonth] = useState<string>("8");
  const [birthDay, setBirthDay] = useState<string>("24");

  const [phone, setPhone] = useState<string>("01012345678");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [saveAttempted, setSaveAttempted] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);

  const birthYearRef = useRef<HTMLSelectElement | null>(null);
  const birthMonthRef = useRef<HTMLSelectElement | null>(null);
  const birthDayRef = useRef<HTMLSelectElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  const years = useMemo(() => {
    const result: number[] = [];
    for (let y = maxYear; y >= minYear; y -= 1) result.push(y);
    return result;
  }, [maxYear, minYear]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => {
    const year = Number.parseInt(birthYear, 10);
    const month = Number.parseInt(birthMonth, 10);
    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return [];

    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [birthYear, birthMonth]);

  const isBirthYearInRange = useMemo(() => {
    if (birthYear.length !== 4) return false;
    const year = Number.parseInt(birthYear, 10);
    if (!Number.isFinite(year)) return false;
    return year >= minYear && year <= maxYear;
  }, [birthYear, maxYear, minYear]);

  const isBirthSelected = useMemo(
    () => Boolean(birthYear) && Boolean(birthMonth) && Boolean(birthDay),
    [birthDay, birthMonth, birthYear]
  );

  const isNameValid = useMemo(() => fullName.trim().length > 0, [fullName]);

  const isPhoneValid = useMemo(
    () => phone.trim().length === 0 || /^\d{11}$/.test(phone.trim()),
    [phone]
  );
  const isNewPasswordValid = useMemo(
    () => newPassword.trim().length === 0 || PASSWORD_REGEX.test(newPassword),
    [newPassword]
  );
  const isConfirmPasswordValid = useMemo(() => {
    if (newPassword.trim().length === 0 && confirmPassword.trim().length === 0) return true;
    if (newPassword.trim().length === 0 && confirmPassword.trim().length > 0) return false;
    return confirmPassword.length > 0 && confirmPassword === newPassword;
  }, [confirmPassword, newPassword]);

  function handleSave() {
    setSaveAttempted(true);
    setSaveMessage(null);

    if (!isNameValid) {
      nameRef.current?.focus();
      return;
    }

    if (!birthYear) {
      birthYearRef.current?.focus();
      return;
    }
    if (!birthMonth) {
      birthMonthRef.current?.focus();
      return;
    }
    if (!birthDay) {
      birthDayRef.current?.focus();
      return;
    }
    if (!isBirthSelected || !isBirthYearInRange) {
      birthYearRef.current?.focus();
      return;
    }
    if (!isPhoneValid) {
      phoneRef.current?.focus();
      return;
    }
    if (!isNewPasswordValid) {
      newPasswordRef.current?.focus();
      return;
    }
    if (!isConfirmPasswordValid) {
      confirmPasswordRef.current?.focus();
      return;
    }

    setSaveMessage("변경사항이 저장되었습니다.");
  }

  return (
    <div className="relative flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-8">
          <Card className="bg-white dark:bg-[#1c2127] border-gray-200 dark:border-[#283039]">
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                    회원정보
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-[#9dabb9]">
                    개인 정보와 보안 설정을 관리합니다.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-10">
              {/* 개인 정보 */}
              <section className="flex flex-col gap-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">개인 정보</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="name">
                      이름
                    </label>
                    <div className="relative">
                      <Input
                        id="name"
                        ref={nameRef}
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setNameTouched(true);
                        }}
                        onBlur={() => setNameTouched(true)}
                        className="h-12 bg-white dark:bg-[#111418] border-gray-200 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] pr-10"
                      />
                      <PencilLine className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-[#9dabb9]" />
                    </div>
                    {(nameTouched || saveAttempted) && !isNameValid ? (
                      <p className="text-xs text-red-500">이름을 입력해주세요.</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="birth-year">
                      생년월일
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        ref={birthYearRef}
                        id="birth-year"
                        value={birthYear}
                        onChange={(e) => {
                          const nextYear = e.target.value;
                          setBirthYear(nextYear);

                          if (!birthMonth || !birthDay) return;
                          const year = Number.parseInt(nextYear, 10);
                          const month = Number.parseInt(birthMonth, 10);
                          const day = Number.parseInt(birthDay, 10);
                          if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return;

                          const maxDayInMonth = new Date(year, month, 0).getDate();
                          if (day > maxDayInMonth) setBirthDay("");
                        }}
                        aria-label="생년월일 연도"
                        className="h-12 w-full rounded-md border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#111418] px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]"
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
                        ref={birthMonthRef}
                        value={birthMonth}
                        onChange={(e) => {
                          setBirthMonth(e.target.value);
                          setBirthDay("");
                        }}
                        aria-label="생년월일 월"
                        className="h-12 w-full rounded-md border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#111418] px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#137fec]"
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
                        ref={birthDayRef}
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        disabled={!birthYear || !birthMonth}
                        aria-label="생년월일 일"
                        className="h-12 w-full rounded-md border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#111418] px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#137fec] disabled:opacity-60"
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

                    {saveAttempted && !isBirthSelected ? (
                      <p className="text-xs text-red-500">생년월일을 선택해주세요.</p>
                    ) : null}
                    {saveAttempted && birthYear && !isBirthYearInRange ? (
                      <p className="text-xs text-red-500">연도는 {minYear}~{maxYear} 범위만 가능합니다.</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="email">
                      이메일
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value="kim.trader@trademate.io"
                        disabled
                        readOnly
                        className="h-12 bg-white dark:bg-[#111418] border-gray-200 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] pr-10 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      <Mail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-[#9dabb9]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="phone">
                      휴대폰 번호
                    </label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="예) 01012345678"
                        value={phone}
                        ref={phoneRef}
                        onChange={(e) => {
                          const next = e.target.value.replace(/\D/g, "").slice(0, 11);
                          setPhone(next);
                        }}
                        className="h-12 bg-white dark:bg-[#111418] border-gray-200 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] pr-10"
                      />
                      <Phone className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-[#9dabb9]" />
                    </div>
                    {(saveAttempted || phone.trim().length > 0) && !isPhoneValid ? (
                      <p className="text-xs text-red-500">숫자 11자리만 입력해주세요.</p>
                    ) : null}
                  </div>
                </div>
              </section>

              {/* 비밀번호 & 보안 */}
              <section className="flex flex-col gap-6 pt-8 border-t border-gray-200 dark:border-[#283039]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-[#137fec]" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">비밀번호 및 보안</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="current-password">
                      현재 비밀번호
                    </label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="현재 비밀번호를 입력하세요"
                        className="h-12 bg-white dark:bg-[#111418] border-gray-200 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] pr-10"
                      />
                      <KeyRound className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-[#9dabb9]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="new-password">
                      새 비밀번호
                    </label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="새 비밀번호를 입력하세요"
                        value={newPassword}
                        ref={newPasswordRef}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-12 bg-white dark:bg-[#111418] border-gray-200 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] pr-10"
                      />
                      <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-[#9dabb9]" />
                    </div>
                    {(saveAttempted || newPassword.length > 0) && !isNewPasswordValid ? (
                      <p className="text-xs text-red-500">알파벳/숫자/특수기호 포함, 8자 이상으로 입력해주세요.</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="confirm-password">
                      새 비밀번호 확인
                    </label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="새 비밀번호를 다시 입력하세요"
                        value={confirmPassword}
                        ref={confirmPasswordRef}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 bg-white dark:bg-[#111418] border-gray-200 dark:border-[#3b4754] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] focus-visible:ring-[#137fec] pr-10"
                      />
                      <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-[#9dabb9]" />
                    </div>
                    {(saveAttempted || confirmPassword.length > 0) && !isConfirmPasswordValid ? (
                      <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
                    ) : null}
                  </div>
                </div>
              </section>

              {saveMessage ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {saveMessage}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-[#283039]">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-600 dark:text-[#9dabb9] hover:bg-gray-100 dark:hover:bg-[#252b33]"
                >
                  취소
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="bg-[#137fec] hover:bg-blue-600 text-white font-semibold"
                >
                  변경사항 저장
                </Button>
              </div>
            </CardContent>
          </Card>

          <footer className="mt-2 text-center text-slate-500 dark:text-[#9dabb9] text-xs pb-4">
            © 2026 TradeMate. 모든 매매에는 위험이 따릅니다.
          </footer>
        </div>
      </main>
    </div>
  );
}
