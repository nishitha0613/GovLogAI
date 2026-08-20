import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Zap, Clock, Repeat, Flame } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockIncidentTrends, mockRecurringIssues } from '../../data/mockAnalytics';

export const TrendsAndMttrSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
      {/* 1. Critical Incident Trends & MTTR Section */}
      <Card className="lg:col-span-2 bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Critical Incident Trends & MTTR Benchmark (Simulated Data)
            </h3>
          </div>
          <span className="text-slate-400">7-Day Demo Analysis</span>
        </div>

        {/* MTTR KPI Header Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> AI Auto-Remediation MTTR
            </div>
            <div className="text-xl font-bold text-cyan-400 mt-1">1.4 Seconds</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Automated CLI Execution</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Analyst Manual MTTR
            </div>
            <div className="text-xl font-bold text-amber-400 mt-1">4.2 Minutes</div>
            <div className="text-[10px] text-slate-400 mt-0.5">SecOps Triage Workflow</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30">
            <div className="text-slate-400 text-[11px]">Total Incident Reduction</div>
            <div className="text-xl font-bold text-purple-400 mt-1">-68% Velocity Gain</div>
            <div className="text-[10px] text-purple-300 mt-0.5">Illustrative Estimate</div>
          </div>
        </div>

        {/* Trend Bar Chart */}
        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockIncidentTrends}>
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="critical" fill="#f43f5e" name="P1 Critical Incidents (Demo)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="high" fill="#f59e0b" name="P2 High Incidents (Demo)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Most Recurring Issues Card List */}
      <Card className="bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Top Recurring Issues (Demo)
            </h3>
          </div>
          <span className="text-slate-400">Ranked Sample</span>
        </div>

        <div className="space-y-3">
          {mockRecurringIssues.map((issue, idx) => (
            <div key={issue.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#{idx + 1} {issue.severity}</span>
                <span className="text-emerald-400 font-bold">{issue.occurrences} occurrences</span>
              </div>
              <div className="text-white font-bold text-xs truncate">{issue.signature}</div>
              <div className="text-slate-400 text-[11px] truncate">Target: {issue.service}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
