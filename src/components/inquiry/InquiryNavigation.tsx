"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/ui/Logo";

export default function InquiryNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex-none flex items-center justify-between whitespace-nowrap border-b border-[#283039] bg-[#111418] px-4 sm:px-10 py-3 z-20">
      <Link href="/" className="flex items-center gap-4 text-white">
        <Logo />
      </Link>
      
      <div className="flex flex-1 justify-end gap-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-9">
          <Link 
            href="/dashboard" 
            className="text-[#9dabb9] hover:text-[#137fec] text-sm font-medium leading-normal transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/inquiry" 
            className="text-[#137fec] text-sm font-medium leading-normal"
          >
            Inquiry
          </Link>
          <Link 
            href="#" 
            className="text-[#9dabb9] hover:text-[#137fec] text-sm font-medium leading-normal transition-colors"
          >
            Journal
          </Link>
          <Link 
            href="#" 
            className="text-[#9dabb9] hover:text-[#137fec] text-sm font-medium leading-normal transition-colors"
          >
            Settings
          </Link>
        </div>
        
        {/* User Avatar */}
        <div 
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-[#137fec]/20 hidden sm:block"
          style={{ 
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB9f_uiiJEbOf2wKIuL6mJNkdiUH3RzLGkk0No1z-99HaPnsVaaSjJT91H2nHdoqOfVMUXkepqi6R5eOmMh25RSkGzpSfxXyXxdp1j7LPy9H8Vn36Ff13xQfs0g9LN14TAko4vEeHpWbyjUalEfvii1ziWK14-4SntlkGjKELW3JpBm3Rn7Bn3wVn4ptls5MlQ5ShCCh0lJB9wpWtRWKAwF3qG11Xk_BnZwqxOUtwD1sShIZT15mtUncdJs_z5dKeWmMcgYqKJjGs85")` 
          }}
        />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-[#1c2127] border border-[#283039] text-white"
        >
          {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden border-t border-[#283039] bg-[#111418] px-4 py-4 z-50">
          <div className="flex flex-col gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-[#9dabb9] hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/inquiry" className="text-sm font-medium text-[#137fec]">
              Inquiry
            </Link>
            <Link href="#" className="text-sm font-medium text-[#9dabb9] hover:text-white transition-colors">
              Journal
            </Link>
            <Link href="#" className="text-sm font-medium text-[#9dabb9] hover:text-white transition-colors">
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
