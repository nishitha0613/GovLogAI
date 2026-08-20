import React from 'react';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#060911] px-6 py-4 text-xs text-slate-500 font-mono">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-400 font-sans font-semibold">
            <Shield className="w-4 h-4 text-cyan-400" />
            GovLogAI Platform v4.2.0-Sovereign
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="hidden sm:flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All 6 E-Gov Gateways Monitored
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 text-cyan-400" />
            Air-Gap Compliant
          </span>
          <span className="text-slate-700">•</span>
          <span>FISMA High</span>
          <span className="text-slate-700">•</span>
          <span>ISO 27001</span>
          <span className="text-slate-700">•</span>
          <span>FedRAMP Ready</span>
        </div>
      </div>
    </footer>
  );
};
