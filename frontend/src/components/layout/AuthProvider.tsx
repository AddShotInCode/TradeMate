"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initialize();
      setIsInitializing(false);
    };

    init();
  }, [initialize]);

  if (isInitializing) {
    return null; // Or return a loading spinner component
  }

  return <>{children}</>;
}
