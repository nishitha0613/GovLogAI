import React from 'react';
import { Crosshair, Radio } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockThreatOriginData } from '../../data/mockAnalytics';

export const ThreatRadarMap: React.FC = () => {
  return (
    <Card className="bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
            Threat Origin Radar & Attack Vectors
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
          <span>REAL-TIME INTERCEPT</span>
        </div>
      </div>

      {/* Cyber Radar Animation Container */}
      <div className="relative my-4 h-56 rounded-xl bg-[#060a12] border border-slate-800 flex items-center justify-center overflow-hidden cyber-dots">
        {/* Radar Concentric Circles */}
        <div className="absolute w-48 h-48 rounded-full border border-cyan-500/20"></div>
        <div className="absolute w-32 h-32 rounded-full border border-cyan-500/30"></div>
        <div className="absolute w-16 h-16 rounded-full border border-cyan-500/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-cyan-500/20"></div>
          <div className="h-full w-px bg-cyan-500/20"></div>
        </div>

        {/* Animated Rotating Radar Sweep */}
        <div className="absolute w-48 h-48 rounded-full origin-center animate-radar-sweep pointer-events-none">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/40 to-transparent rounded-tl-full"></div>
        </div>

        {/* Center Sovereign Hub Pin */}
        <div className="z-10 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-cyan-400/30 border border-cyan-400 flex items-center justify-center animate-ping absolute" />
          <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-black z-10">
            HQ
          </div>
          <span className="text-[10px] font-mono text-cyan-300 mt-1 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded border border-cyan-800/50">
            GovNet Node #01
          </span>
        </div>

        {/* Simulated Threat Target Pins */}
        <div className="absolute top-10 left-12 flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span className="text-[9px] font-mono text-rose-400 bg-rose-950/80 px-1 rounded">185.220.101.44 (SQLi)</span>
        </div>

        <div className="absolute bottom-12 right-14 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span className="text-[9px] font-mono text-amber-400 bg-amber-950/80 px-1 rounded">194.26.29.112 (Botnet)</span>
        </div>

        <div className="absolute top-14 right-20 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span className="text-[9px] font-mono text-purple-400 bg-purple-950/80 px-1 rounded">45.154.255.89 (JWT)</span>
        </div>
      </div>

      {/* Top Attack Vectors List */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
          Intercepted Attack Vectors:
        </div>
        {mockThreatOriginData.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-200 truncate">{item.country}</span>
            <span className="text-rose-400 font-bold">{item.attackCount.toLocaleString()} blocks</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
