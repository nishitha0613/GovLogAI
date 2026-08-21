import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const DashboardCharts: React.FC = () => {
  const { logs } = useApp();
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('24h');

  const total = logs.length;

  const infoCount = logs.filter(l => l.level === 'INFO').length;
  const warnCount = logs.filter(l => l.level === 'WARN').length;
  const errorCount = logs.filter(l => l.level === 'ERROR').length;
  const criticalCount = logs.filter(l => l.level === 'CRITICAL').length;

  const severityData = total > 0 ? [
    { name: 'INFO', count: infoCount, percentage: `${Math.round((infoCount / total) * 100)}%`, color: '#10b981' },
    { name: 'WARN', count: warnCount, percentage: `${Math.round((warnCount / total) * 100)}%`, color: '#f59e0b' },
    { name: 'ERROR', count: errorCount, percentage: `${Math.round((errorCount / total) * 100)}%`, color: '#ec4899' },
    { name: 'CRITICAL', count: criticalCount, percentage: `${Math.round((criticalCount / total) * 100)}%`, color: '#f43f5e' },
  ].filter(s => s.count > 0) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-xs">
      {/* 1. Log Activity Chart Over Time */}
      <Card className="lg:col-span-2 bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
              Log Ingestion Stream Volume
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">({logs.length} Items)</span>
          </div>

          <div className="flex items-center gap-1">
            {(['1h', '24h', '7d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-0.5 rounded transition cursor-pointer text-xs font-mono ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-60 w-full flex items-center justify-center">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 font-sans">
              <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-300">No log data available yet.</div>
              <div className="text-[11px] text-slate-500 mt-1">Upload a log file in Log Explorer to view volume charts.</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logs.map((l, i) => ({ time: l.timestamp.slice(11, 16) || `#${i+1}`, eventsPerSec: 1 }))}>
                <defs>
                  <linearGradient id="colorLogVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fill="url(#colorLogVol)" name="Log Vol (Events)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* 2. Severity Distribution Chart */}
      <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
              Severity Breakdown
            </h3>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">{logs.length} Buffer</span>
        </div>

        <div className="h-40 my-1 flex items-center justify-center">
          {severityData.length === 0 ? (
            <div className="text-center text-slate-500 font-sans text-xs">
              <PieIcon className="w-6 h-6 text-slate-600 mx-auto mb-1" />
              <span>No data available yet.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
          {severityData.length === 0 ? (
            <div className="text-center text-slate-500 text-[10px] py-1 font-sans">No distribution data</div>
          ) : (
            severityData.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="truncate">{s.name}</span>
                </span>
                <span className="text-slate-400 font-bold">{s.percentage}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
