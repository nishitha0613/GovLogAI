import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockLatencyPercentiles } from '../../data/mockAnalytics';

export const LatencyHeatmap: React.FC = () => {
  return (
    <Card className="bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
            E-Gov Latency SLA Percentiles (p50, p90, p99 ms)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Border Gateway Spike Detected</span>
      </div>

      <div className="h-64 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockLatencyPercentiles}>
            <XAxis dataKey="service" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="p50" fill="#10b981" name="p50 Latency (ms)" />
            <Bar dataKey="p90" fill="#f59e0b" name="p90 Latency (ms)" />
            <Bar dataKey="p99" fill="#f43f5e" name="p99 Latency (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
