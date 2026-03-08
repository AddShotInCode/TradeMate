import { CheckCircle, XCircle, Shield } from "lucide-react";

interface PrincipleItem {
  label: string;
  passed: boolean;
}

interface PrincipleCheckProps {
  principles: PrincipleItem[];
}

export default function PrincipleCheck({ principles }: PrincipleCheckProps) {
  return (
    <div className="bg-gradient-to-br from-[#137fec]/20 to-[#137fec]/5 rounded-xl border border-[#137fec]/30 p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Shield className="size-16 text-[#137fec]" />
      </div>
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="size-5 text-[#137fec]" />
          원칙 체크
        </h3>
        <p className="text-slate-400 text-xs mt-1 mb-4">나의 매매 원칙 기반</p>
        <div className="space-y-3">
          {principles.map((principle) => (
            <div key={principle.label} className="flex items-center gap-3">
              <div
                className={`size-6 rounded-full flex items-center justify-center flex-none ${
                  principle.passed ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                {principle.passed ? (
                  <CheckCircle className="size-4 text-green-500" />
                ) : (
                  <XCircle className="size-4 text-red-500" />
                )}
              </div>
              <span className="text-sm text-slate-300">{principle.label}</span>
            </div>
          ))}
        </div>
        <button className="mt-5 w-full bg-[#137fec] hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
          나의 원칙 확인
        </button>
      </div>
    </div>
  );
}
