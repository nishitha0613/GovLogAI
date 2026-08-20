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
import { Card } from '../ui/Card';
import { mockThroughputData, mockStatusDistribution } from '../../data/mockAnalytics';

export const QuickStatsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 24h Log Throughput Area Chart */}
      <Card className="lg:col-span-2 bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              24-Hour Log Ingestion Throughput (Events/sec)
            </h3>
          </div>
          <span className="text-xs text-cyan-400 font-mono font-semibold">Peak: 52,400 e/s</span>
        </div>

        <div className="h-64 w-full font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockThroughputData}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="eventsPerSec" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" name="Ingestion e/s" />
              <Area type="monotone" dataKey="threatsPerSec" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" name="Blocked Threats" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* HTTP Status Breakdown Pie Chart */}
      <Card className="bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Response Code Mix
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">42.8M total</span>
        </div>

        <div className="h-48 my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockStatusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
              >
                {mockStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-800">
          {mockStatusDistribution.slice(0, 4).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </span>
              <span className="text-slate-400 font-bold">{(item.count / 1000000).toFixed(1)}M</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
