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
          원칙을 지키세요. 뇌동매매를 멈추세요.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="h-10 px-4 font-bold border-slate-200 dark:border-slate-200 text-slate-900 dark:text-black dark:bg-white hover:bg-slate-100 dark:hover:bg-slate-200">
            <History className="mr-2 h-5 w-5" />
            기록
        </Button>
        <Button className="h-10 px-4 font-bold bg-primary hover:bg-blue-600 text-white shadow-md shadow-primary/20">
            새 세션
        </Button>
      </div>
    </header>
  );
}
