import React from 'react';
import { Crosshair, Radio } from 'lucide-react';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';

export const ThreatRadarMap: React.FC = () => {
  const { events, logs } = useApp();

  const criticalEvents = events.filter((e) => e.severity.includes('P1') || e.severity.includes('P2'));
  const criticalLogs = logs.filter((l) => l.level === 'CRITICAL' || l.level === 'FATAL');

  return (
    <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
            Threat Radar & Vector Tracing
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>RADAR ACTIVE</span>
        </div>
      </div>

      {/* Cyber Radar Animation Container */}
      <div className="relative my-3 h-52 rounded-xl bg-[#060a12] border border-slate-800/80 flex items-center justify-center overflow-hidden cyber-dots">
        {/* Radar Concentric Circles */}
        <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20"></div>
        <div className="absolute w-28 h-28 rounded-full border border-cyan-500/30"></div>
        <div className="absolute w-14 h-14 rounded-full border border-cyan-500/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-cyan-500/20"></div>
          <div className="h-full w-px bg-cyan-500/20"></div>
        </div>

        {/* Animated Rotating Radar Sweep */}
        <div className="absolute w-44 h-44 rounded-full origin-center animate-radar-sweep pointer-events-none">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/40 to-transparent rounded-tl-full"></div>
        </div>

        {/* Center Sovereign Hub Pin */}
        <div className="z-10 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-cyan-400/30 border border-cyan-400 flex items-center justify-center animate-ping absolute" />
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-[7px] font-bold text-black z-10">
            HQ
          </div>
          <span className="text-[10px] font-mono text-cyan-300 mt-1 font-bold bg-slate-950/90 px-1.5 py-0.5 rounded border border-cyan-800/50">
            GovNet Node #01
          </span>
        </div>

        {/* Dynamic Threat Target Pins */}
        {criticalEvents.slice(0, 3).map((evt, idx) => {
          const positions = [
            'top-8 left-8',
            'bottom-10 right-10',
            'top-12 right-14'
          ];
          return (
            <div key={evt.id} className={`absolute ${positions[idx] || 'top-10 left-12'} flex items-center gap-1`}>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[9px] font-mono text-rose-400 bg-rose-950/80 px-1 rounded border border-rose-900/50">
                {evt.threatActorIp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Top Attack Vectors List */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
          Intercepted Vectors:
        </div>
        {criticalEvents.length === 0 && criticalLogs.length === 0 ? (
          <div className="text-center py-2 text-slate-500 font-sans text-xs">
            No intercepted attack vectors recorded yet.
          </div>
        ) : (
          criticalEvents.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-slate-200 truncate">{item.title}</span>
              <span className="text-rose-400 font-semibold">{item.occurrences} events</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
