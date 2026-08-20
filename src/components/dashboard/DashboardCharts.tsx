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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
      {/* 1. Log Activity Chart Over Time */}
      <Card className="lg:col-span-2 bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Log Activity Stream Over Time ({logs.length} Buffer Logs)
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {(['1h', '24h', '7d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
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
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fill="url(#colorLogVol)" name="Log Vol (Events/s)" />
              <Area type="monotone" dataKey="threatsPerSec" stroke="#f43f5e" strokeWidth={2} fill="url(#colorThreatBlocks)" name="Threat Blocks/s" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Severity Distribution Chart */}
      <Card className="bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Severity Distribution
            </h3>
          </div>
          <span className="text-slate-400">{logs.length} Log Buffer</span>
        </div>

        <div className="h-44 my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
          {severityData.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
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
