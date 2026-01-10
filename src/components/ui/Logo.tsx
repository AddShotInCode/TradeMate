import { CandlestickChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  hideText?: boolean;
}

export default function Logo({ className, iconClassName, textClassName, hideText = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 text-white", className)}>
      <div className={cn("flex size-8 items-center justify-center rounded-lg bg-[#137fec]/20 text-[#137fec]", iconClassName)}>
        <CandlestickChart className="size-5" />
      </div>
      {!hideText && (
        <h2 className={cn("text-lg font-bold leading-tight tracking-tight", textClassName)}>
          TradeMate
        </h2>
      )}
    </div>
  );
}
