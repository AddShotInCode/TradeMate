import Link from "next/link";
import { cn } from "@/lib/utils";

const sessions = [
  {
    date: "오늘, 10:23 AM",
    strategy: "추세 추종",
    duration: "45m",
    adherence: 98,
    result: 240.00,
  },
  {
    date: "어제, 14:15 PM",
    strategy: "돌파 매매",
    duration: "1h 20m",
    adherence: 84,
    result: -120.50,
  },
  {
    date: "10월 24일, 09:00 AM",
    strategy: "스캘핑",
    duration: "2h 00m",
    adherence: 95,
    result: 85.00,
  },
];

export default function RecentSessions() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold">최근 세션</h2>
        <Link href="#" className="text-sm text-primary font-medium hover:underline">
          모두 보기
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#3b4754]">
        <table className="w-full text-left text-sm text-slate-500 dark:text-[#9dabb9]">
          <thead className="bg-slate-50 dark:bg-[#252b32] text-xs uppercase text-slate-900 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">날짜</th>
              <th scope="col" className="px-6 py-4 font-semibold">전략</th>
              <th scope="col" className="px-6 py-4 font-semibold">시간</th>
              <th scope="col" className="px-6 py-4 font-semibold text-center">준수율</th>
              <th scope="col" className="px-6 py-4 font-semibold text-right">결과</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#3b4754] bg-white dark:bg-[#1c2127]">
            {sessions.map((session, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-[#252b32] transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{session.date}</td>
                <td className="px-6 py-4">{session.strategy}</td>
                <td className="px-6 py-4">{session.duration}</td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                    session.adherence >= 90 
                      ? "bg-green-500/10 text-green-500 ring-green-500/20"
                      : "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20"
                  )}>
                    {session.adherence}%
                  </span>
                </td>
                <td className={cn(
                  "px-6 py-4 text-right font-medium",
                  session.result > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {session.result > 0 ? "+" : ""}${session.result.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
