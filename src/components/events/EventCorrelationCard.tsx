import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const EventCorrelationCard: React.FC = () => {
  const { logs, events } = useApp();

  const totalLogsCount = logs.length;
  const eventsCount = events.length;
  const ratio = eventsCount > 0 ? `${Math.round(totalLogsCount / eventsCount)}:1` : 'N/A';

  return (
    <Card className="glass-panel-glow border border-purple-500/30 p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 font-mono">
          <div className="flex items-center gap-2 text-purple-300 text-xs uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>GovLogAI Correlation Engine v4.2 (Synthesized Events)</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
            Multi-Log Incident Synthesis & Attack Graph
          </h2>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            GovLogAI automatically correlates raw server log lines into grouped security events. Fragmented microservice probes sharing IP origins, categories, or endpoints are linked into attack timelines with AI root cause explanations.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono shrink-0">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-purple-400 font-bold text-base">{eventsCount} Groups</div>
            <div className="text-slate-500 text-[10px]">Synthesized Events</div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-cyan-400 font-bold text-base">{ratio}</div>
            <div className="text-slate-500 text-[10px]">Log to Event Ratio</div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-emerald-400 font-bold text-base">Active</div>
            <div className="text-slate-500 text-[10px]">Correlation Engine</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
