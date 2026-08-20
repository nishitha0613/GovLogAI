import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Activity, Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockThroughputData, mockCategoryBreakdown } from '../../data/mockAnalytics';

export const VolumeAndCategoryCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
      {/* Log Volume Over Time Chart */}
      <Card className="lg:col-span-2 bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Log Volume Ingestion Stream Over Time
            </h3>
          </div>
          <span className="text-slate-400">Peak: 52.4k req/s</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockThroughputData}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fill="url(#volGrad)" name="Events / sec" />
              <Area type="monotone" dataKey="threatsPerSec" stroke="#f43f5e" strokeWidth={2} fill="url(#threatGrad)" name="Threat Blocks / sec" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Log Categories Breakdown Chart */}
      <Card className="bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Log Categories Breakdown
            </h3>
          </div>
          <span className="text-slate-400">6 Categories</span>
        </div>

        <div className="h-44 my-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockCategoryBreakdown} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="category" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {mockCategoryBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          {mockCategoryBreakdown.slice(0, 4).map((c, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="truncate">{c.category}</span>
              </span>
              <span className="text-slate-400 font-bold">{c.percentage}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
