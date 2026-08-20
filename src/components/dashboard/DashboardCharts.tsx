import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { mockThroughputData } from '../../data/mockAnalytics';

export const DashboardCharts: React.FC = () => {
  const { logs } = useApp();
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('24h');

  // Dynamically calculate severity distribution from AppContext logs
  const infoCount = logs.filter(l => l.level === 'INFO').length;
  const warnCount = logs.filter(l => l.level === 'WARN').length;
  const errorCount = logs.filter(l => l.level === 'ERROR').length;
  const criticalCount = logs.filter(l => l.level === 'CRITICAL' || l.level === 'FATAL').length;

  const total = logs.length || 1;
  const severityData = [
    { name: 'INFO (Normal)', count: infoCount * 1000 + 3500, percentage: `${Math.round((infoCount / total) * 100)}%`, color: '#10b981' },
    { name: 'WARN (Degraded)', count: warnCount * 500 + 400, percentage: `${Math.round((warnCount / total) * 100)}%`, color: '#f59e0b' },
    { name: 'ERROR (Fault)', count: errorCount * 300 + 120, percentage: `${Math.round((errorCount / total) * 100)}%`, color: '#ec4899' },
    { name: 'CRITICAL (Security)', count: criticalCount * 200 + 35, percentage: `${Math.round((criticalCount / total) * 100)}%`, color: '#f43f5e' },
  ];

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
            <span className="text-[11px] text-slate-400 font-mono">({logs.length} Live Items)</span>
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

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockThroughputData}>
              <defs>
                <linearGradient id="colorLogVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorThreatBlocks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fill="url(#colorLogVol)" name="Log Vol (Events/s)" />
              <Area type="monotone" dataKey="threatsPerSec" stroke="#f43f5e" strokeWidth={2} fill="url(#colorThreatBlocks)" name="Threat Blocks/s" />
            </AreaChart>
          </ResponsiveContainer>
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

        <div className="h-40 my-1">
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
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
          {severityData.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="truncate">{s.name}</span>
              </span>
              <span className="text-slate-400 font-bold">{s.percentage}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
