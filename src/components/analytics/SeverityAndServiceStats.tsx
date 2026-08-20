import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, Server } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { mockStatusDistribution, mockServiceStats } from '../../data/mockAnalytics';

export const SeverityAndServiceStats: React.FC = () => {
  const severityBreakdown = [
    { name: 'INFO (Normal)', percentage: '89.6%', count: '38.4M', color: '#10b981' },
    { name: 'WARN (Degraded)', percentage: '6.6%', count: '2.8M', color: '#f59e0b' },
    { name: 'ERROR (Fault)', percentage: '3.0%', count: '1.2M', color: '#ec4899' },
    { name: 'CRITICAL (Security)', percentage: '0.7%', count: '318k', color: '#f43f5e' },
    { name: 'FATAL (Outage)', percentage: '0.1%', count: '42k', color: '#8b5cf6' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
      {/* 1. Severity Distribution Donut */}
      <Card className="bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Severity Distribution
            </h3>
          </div>
          <span className="text-slate-400">Total: 42.8M</span>
        </div>

        <div className="h-44 my-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockStatusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="count"
              >
                {mockStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          {severityBreakdown.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="truncate">{s.name}</span>
              </span>
              <span className="text-slate-400 font-bold">{s.percentage}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Service-Wise Error / Incident Statistics Table */}
      <Card className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-0 overflow-hidden space-y-0">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-white font-bold">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-wide">Service-Wise Error & Incident Metrics</span>
          </div>
          <span className="text-slate-400 text-[11px]">5 Core Gateways</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">E-Gov Microservice</th>
                <th className="py-3 px-4">Error Rate</th>
                <th className="py-3 px-4">Incidents 24h</th>
                <th className="py-3 px-4">Latency p99</th>
                <th className="py-3 px-4">Uptime SLA</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockServiceStats.map((svc, idx) => (
                <tr key={idx} className="hover:bg-slate-800/60 transition">
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {svc.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={svc.errorRate.startsWith('4') ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {svc.errorRate}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-rose-400 font-bold">
                    {svc.incidents} Incidents
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                    {svc.latencyP99}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-emerald-400 font-bold">
                    {svc.sla}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Badge variant={svc.status === 'Healthy' ? 'success' : 'warn'} size="sm">
                      {svc.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
