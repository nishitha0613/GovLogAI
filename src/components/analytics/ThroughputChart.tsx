import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const ThroughputChart: React.FC = () => {
  const { logs } = useApp();
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <Card className="bg-slate-900/90 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4 font-mono text-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wide">
            <Activity className="w-4 h-4" />
            <span>High-Throughput Log Stream Analytics</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight font-sans">
            Log Ingestion Rate & Bandwidth (Events/Sec)
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

      <div className="h-72 w-full font-mono text-xs flex items-center justify-center">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-sans">
            <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-300">No log throughput data available yet.</div>
            <div className="text-xs text-slate-500 mt-1">Upload a log file in Log Explorer to view stream rate analytics.</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={logs.map((l, i) => ({ time: l.timestamp.slice(11, 16) || `#${i+1}`, eventsPerSec: 1 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.2} name="Events" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
