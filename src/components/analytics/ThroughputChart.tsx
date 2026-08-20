import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockThroughputData } from '../../data/mockAnalytics';

export const ThroughputChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <Card className="bg-slate-900/90 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wide">
            <Activity className="w-4 h-4" />
            <span>High-Throughput Log Stream Analytics</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Log Ingestion Rate & Bandwidth (Events/Sec & Mbps)
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          {(['24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg transition ${
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

      <div className="h-72 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockThroughputData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
            <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.2} name="Events / sec" />
            <Area type="monotone" dataKey="bandwidthMbps" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.1} name="Bandwidth Mbps" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
