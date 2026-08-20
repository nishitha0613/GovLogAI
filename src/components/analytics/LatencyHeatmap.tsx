import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const LatencyHeatmap: React.FC = () => {
  const { logs, services } = useApp();

  const data = services.map(s => {
    const sLogs = logs.filter(l => l.service === s.name);
    const times = sLogs.map(l => l.responseTimeMs).sort((a, b) => a - b);
    const count = times.length;

    const p50 = count > 0 ? times[Math.floor(count * 0.5)] || 0 : 0;
    const p90 = count > 0 ? times[Math.floor(count * 0.9)] || 0 : 0;
    const p99 = count > 0 ? times[Math.floor(count * 0.99)] || 0 : 0;

    return {
      service: s.name.split(' ')[0],
      p50,
      p90,
      p99
    };
  });

  return (
    <Card className="bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wide">
            E-Gov Latency SLA Percentiles (p50, p90, p99 ms)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">{logs.length} Log Samples</span>
      </div>

      <div className="h-64 w-full font-mono text-xs flex items-center justify-center">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-sans">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-300">No latency telemetry data available yet.</div>
            <div className="text-xs text-slate-500 mt-1">Upload a log file in Log Explorer to calculate SLA percentiles.</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="service" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="p50" fill="#10b981" name="p50 Latency (ms)" />
              <Bar dataKey="p90" fill="#f59e0b" name="p90 Latency (ms)" />
              <Bar dataKey="p99" fill="#f43f5e" name="p99 Latency (ms)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
