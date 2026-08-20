import React from 'react';
import { Zap, Clock, Repeat, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const TrendsAndMttrSection: React.FC = () => {
  const { events, logs } = useApp();

  const p1Count = events.filter((e) => e.severity.includes('P1')).length;
  const p2Count = events.filter((e) => e.severity.includes('P2')).length;
  const resolvedCount = events.filter((e) => e.status === 'Resolved' || e.status === 'Mitigated').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
      {/* 1. Critical Incident Trends & MTTR Section */}
      <Card className="lg:col-span-2 bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Critical Incident Trends & MTTR Benchmarks
            </h3>
          </div>
          <span className="text-slate-400">{events.length} Correlated Incidents</span>
        </div>

        {/* MTTR KPI Header Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> AI Auto-Remediation
            </div>
            <div className="text-xl font-bold text-cyan-400 mt-1">{resolvedCount} Mitigated</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Automated Containment</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> P1/P2 Criticals
            </div>
            <div className="text-xl font-bold text-amber-400 mt-1">{p1Count + p2Count} Events</div>
            <div className="text-[10px] text-slate-400 mt-0.5">SecOps Triage Queue</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30">
            <div className="text-slate-400 text-[11px]">Log Compression Ratio</div>
            <div className="text-xl font-bold text-purple-400 mt-1">
              {events.length > 0 ? `${Math.round((logs.length || 1) / events.length)}:1` : 'N/A'}
            </div>
            <div className="text-[10px] text-purple-300 mt-0.5 font-sans">Synthesized Reduction</div>
          </div>
        </div>

        {/* Empty State Banner */}
        <div className="h-56 w-full flex items-center justify-center">
          {events.length === 0 ? (
            <div className="text-center py-8 text-slate-500 font-sans">
              <Flame className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-300">No incident trend benchmarks recorded yet.</div>
              <div className="text-xs text-slate-500 mt-1">Upload log data in Log Explorer to synthesize correlated incident timelines.</div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center gap-2 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-white uppercase font-sans">Active Incident Timeline Synthesis</div>
              <div className="text-slate-300 text-xs font-mono">{events.length} security incident graphs synthesized from {logs.length} classified logs.</div>
            </div>
          )}
        </div>
      </Card>

      {/* 2. Most Recurring Issues Card List */}
      <Card className="bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Top Recurring Issues
            </h3>
          </div>
          <span className="text-slate-400 font-mono">{events.length} Items</span>
        </div>

        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="py-10 text-center text-slate-500 font-sans text-xs">
              No recurring issues recorded yet.
            </div>
          ) : (
            events.slice(0, 4).map((issue, idx) => (
              <div key={issue.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-cyan-400 font-bold">#{idx + 1} {issue.severity}</span>
                  <span className="text-emerald-400 font-bold">{issue.occurrences} logs</span>
                </div>
                <div className="text-white font-bold text-xs truncate font-sans">{issue.title}</div>
                <div className="text-slate-400 text-[11px] truncate font-sans">Target: {issue.affectedService}</div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
