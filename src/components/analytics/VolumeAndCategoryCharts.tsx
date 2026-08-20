import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Activity, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const VolumeAndCategoryCharts: React.FC = () => {
  const { logs } = useApp();

  const categoryCounts: Record<string, number> = {};
  logs.forEach((l) => {
    const cat = l.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const total = logs.length;
  const categoryBreakdown = total > 0 ? Object.entries(categoryCounts).map(([category, count], idx) => {
    const colors = ['#06b6d4', '#3b82f6', '#f59e0b', '#ec4899', '#f43f5e', '#10b981'];
    return {
      category,
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
      color: colors[idx % colors.length]
    };
  }) : [];

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
          <span className="text-slate-400">{logs.length} Total Logs</span>
        </div>

        <div className="h-64 w-full pt-2 flex items-center justify-center">
          {logs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-sans">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-300">No log telemetry data available yet.</div>
              <div className="text-xs text-slate-500 mt-1">Upload a log file in Log Explorer to view volume trends.</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logs.map((l, i) => ({ time: l.timestamp.slice(11, 16) || `#${i+1}`, eventsPerSec: 1 }))}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fill="url(#volGrad)" name="Events" />
              </AreaChart>
            </ResponsiveContainer>
          )}
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
          <span className="text-slate-400">{categoryBreakdown.length} Categories</span>
        </div>

        <div className="h-44 my-1 flex items-center justify-center">
          {categoryBreakdown.length === 0 ? (
            <div className="text-center text-slate-500 font-sans text-xs">
              <Layers className="w-6 h-6 text-slate-600 mx-auto mb-1" />
              <span>No category data available yet.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {categoryBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          {categoryBreakdown.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-1 font-sans">No category statistics</div>
          ) : (
            categoryBreakdown.slice(0, 4).map((c, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="truncate">{c.category}</span>
                </span>
                <span className="text-slate-400 font-bold">{c.percentage}%</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
