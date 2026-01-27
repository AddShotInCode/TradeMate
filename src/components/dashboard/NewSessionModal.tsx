"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SessionSetupModal from "@/components/simulation/SessionSetupModal";

export default function NewSessionModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SessionSetupModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        trigger={
            <Button 
                onClick={() => setIsOpen(true)}
                className="h-12 px-8 text-lg font-bold bg-white text-black hover:bg-slate-100 shadow-md"
            >
                새 세션
            </Button>
        }
    />
  );
}
