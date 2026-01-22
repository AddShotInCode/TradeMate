import { History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
          반갑습니다, 트레이더님
        </h1>
        <p className="text-slate-500 dark:text-[#9dabb9] text-base font-normal">
          감정을 배제하고, 원칙을 지키는 성공적인 하루 되세요.
        </p>
      </div>
      <div className="flex gap-3">
        <Button className="h-12 px-8 text-lg font-bold bg-white text-black hover:bg-slate-100 shadow-md">
            새 세션
        </Button>
      </div>
    </header>
  );
}
