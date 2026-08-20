import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const QuickStatsCharts: React.FC = () => {
  const { logs } = useApp();

  const total = logs.length;
  const status200 = logs.filter((l) => l.statusCode >= 200 && l.statusCode < 300).length;
  const status400 = logs.filter((l) => l.statusCode >= 400 && l.statusCode < 500).length;
  const status500 = logs.filter((l) => l.statusCode >= 500).length;

  const statusMix = total > 0 ? [
    { name: '200 OK', count: status200, color: '#10b981' },
    { name: '4xx Client Err', count: status400, color: '#f59e0b' },
    { name: '5xx Server Err', count: status500, color: '#f43f5e' },
  ].filter(s => s.count > 0) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
      {/* 24h Log Throughput Area Chart */}
      <Card className="lg:col-span-2 bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide font-sans">
              24-Hour Log Ingestion Throughput
            </h3>
          </div>
          <span className="text-xs text-cyan-400 font-semibold">{logs.length} Items</span>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 font-sans">
              <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-300">No log throughput data available yet.</div>
              <div className="text-[11px] text-slate-500 mt-1">Upload a log file in Log Explorer to view throughput charts.</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={logs.map((l, i) => ({ time: l.timestamp.slice(11, 16) || `#${i+1}`, eventsPerSec: 1 }))}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" name="Events" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* HTTP Status Breakdown Pie Chart */}
      <Card className="bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide font-sans">
              Response Code Mix
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{logs.length} Total</span>
        </div>

        <div className="h-48 my-2 flex items-center justify-center">
          {statusMix.length === 0 ? (
            <div className="text-center text-slate-500 font-sans text-xs">
              <PieIcon className="w-6 h-6 text-slate-600 mx-auto mb-1" />
              <span>No response mix data available yet.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {statusMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-800">
          {statusMix.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-1 font-sans">No status code mix</div>
          ) : (
            statusMix.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="text-slate-400 font-bold">{item.count}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
