"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/ui/Logo";

export default function LandingNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#283039] bg-[#101922]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[960px] items-center justify-between px-4 sm:px-10">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#about"
            className="text-sm font-medium text-[#9dabb9] hover:text-white transition-colors"
          >
            서비스 소개
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-[#9dabb9] hover:text-white transition-colors"
          >
            주요 기능
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href="/login"
            className="hidden sm:flex h-9 items-center justify-center rounded-lg bg-[#1c2127] border border-[#283039] px-4 text-sm font-bold text-white hover:bg-[#283039] transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/register"
            className="flex h-9 items-center justify-center rounded-lg bg-[#137fec] px-4 text-sm font-bold text-white hover:bg-blue-600 transition-colors shadow-[0_0_15px_rgba(19,127,236,0.4)]"
          >
            회원가입
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-[#1c2127] border border-[#283039] text-white"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#283039] bg-[#101922] px-4 py-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/#about"
              className="text-sm font-medium text-[#9dabb9] hover:text-white transition-colors"
            >
              서비스 소개
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-[#9dabb9] hover:text-white transition-colors"
            >
              주요 기능
            </Link>
            <Link
              href="/login"
              className="flex h-9 items-center justify-center rounded-lg bg-[#1c2127] border border-[#283039] px-4 text-sm font-bold text-white hover:bg-[#283039] transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
