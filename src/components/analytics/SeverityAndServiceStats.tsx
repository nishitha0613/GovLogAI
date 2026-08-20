import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, Server } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const SeverityAndServiceStats: React.FC = () => {
  const { logs, services, events } = useApp();

  const total = logs.length;

  const infoCount = logs.filter(l => l.level === 'INFO').length;
  const warnCount = logs.filter(l => l.level === 'WARN').length;
  const errorCount = logs.filter(l => l.level === 'ERROR').length;
  const criticalCount = logs.filter(l => l.level === 'CRITICAL' || l.level === 'FATAL').length;

  const severityData = total > 0 ? [
    { name: 'INFO', count: infoCount, percentage: `${Math.round((infoCount / total) * 100)}%`, color: '#10b981' },
    { name: 'WARN', count: warnCount, percentage: `${Math.round((warnCount / total) * 100)}%`, color: '#f59e0b' },
    { name: 'ERROR', count: errorCount, percentage: `${Math.round((errorCount / total) * 100)}%`, color: '#ec4899' },
    { name: 'CRITICAL', count: criticalCount, percentage: `${Math.round((criticalCount / total) * 100)}%`, color: '#f43f5e' },
  ].filter(s => s.count > 0) : [];

  const serviceStats = services.map(s => {
    const serviceLogs = logs.filter(l => l.service === s.name);
    const serviceEvents = events.filter(e => e.affectedService === s.name);
    const errLogs = serviceLogs.filter(l => l.level === 'ERROR' || l.level === 'CRITICAL' || l.level === 'FATAL');
    const errRate = serviceLogs.length > 0 ? `${((errLogs.length / serviceLogs.length) * 100).toFixed(1)}%` : '0.0%';
    const status = serviceEvents.some(e => e.severity.includes('P1')) ? 'Degraded' : 'Healthy';

    return {
      name: s.name,
      errorRate: errRate,
      incidents: serviceEvents.length,
      status,
      logCount: serviceLogs.length,
    };
  });

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
          <span className="text-slate-400">Total: {total}</span>
        </div>

        <div className="h-44 my-1 flex items-center justify-center">
          {severityData.length === 0 ? (
            <div className="text-center text-slate-500 font-sans text-xs">
              <PieIcon className="w-6 h-6 text-slate-600 mx-auto mb-1" />
              <span>No severity telemetry data available yet.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          {severityData.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-1 font-sans">No distribution available</div>
          ) : (
            severityData.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="truncate">{s.name}</span>
                </span>
                <span className="text-slate-400 font-bold">{s.percentage} ({s.count})</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 2. Service-Wise Error / Incident Statistics Table */}
      <Card className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-0 overflow-hidden space-y-0">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2 text-white font-bold">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-wide">Service-Wise Error & Incident Metrics</span>
          </div>
          <span className="text-slate-400 text-[11px]">{services.length} Microservices</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">E-Gov Microservice</th>
                <th className="py-3 px-4">Error Rate</th>
                <th className="py-3 px-4">Incidents</th>
                <th className="py-3 px-4">Processed Logs</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {total === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                    No microservice statistics recorded yet. Upload a log file to calculate service metrics.
                  </td>
                </tr>
              ) : (
                serviceStats.map((svc, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/60 transition">
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {svc.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={svc.errorRate !== '0.0%' ? 'text-amber-400 font-bold font-mono' : 'text-slate-300 font-mono'}>
                        {svc.errorRate}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-rose-400 font-bold font-mono">
                      {svc.incidents} Incidents
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300 font-mono">
                      {svc.logCount} logs
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Badge variant={svc.status === 'Healthy' ? 'success' : 'warn'} size="sm">
                        {svc.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
