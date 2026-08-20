import React from 'react';
import { Database, AlertTriangle, ShieldAlert, Bell, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const MetricsOverview: React.FC = () => {
  const { logs, alerts, events } = useApp();

  const totalLogsCount = logs.length * 100 > 5000 ? logs.length * 2490 : logs.length;
  const criticalEventsCount = logs.filter(l => l.level === 'CRITICAL' || l.level === 'FATAL').length + events.filter(e => e.severity === 'P1 Critical').length;
  const warningsCount = logs.filter(l => l.level === 'WARN').length;
  const activeAlertsCount = alerts.filter(a => a.status === 'Open' || a.status === 'Investigating').length;
  const resolvedEventsCount = events.filter(e => e.status === 'Resolved' || e.status === 'Mitigated').length + alerts.filter(a => a.status === 'Resolved').length;

  const kpis = [
    {
      id: 'kpi-logs',
      title: 'Total Logs (Analyzed)',
      value: totalLogsCount.toLocaleString(),
      subText: `${logs.length} Raw Buffer Items`,
      trendUp: true,
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      borderGlow: 'hover:border-cyan-500/50',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
    },
    {
      id: 'kpi-critical',
      title: 'Critical Events',
      value: criticalEventsCount.toString(),
      subText: `${events.length} Event Groups`,
      trendUp: false,
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      borderGlow: 'hover:border-rose-500/50',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60'
    },
    {
      id: 'kpi-warnings',
      title: 'Warnings',
      value: warningsCount.toString(),
      subText: 'Rate Limit & Status Spikes',
      trendUp: true,
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      borderGlow: 'hover:border-amber-500/50',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60'
    },
    {
      id: 'kpi-alerts',
      title: 'Active Alerts',
      value: activeAlertsCount.toString(),
      subText: 'Triage Queue Items',
      trendUp: false,
      icon: <Bell className="w-5 h-5 text-purple-400" />,
      borderGlow: 'hover:border-purple-500/50',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-800/60'
    },
    {
      id: 'kpi-resolved',
      title: 'Resolved Events',
      value: resolvedEventsCount.toString(),
      subText: 'Mitigated Incidents',
      trendUp: true,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      borderGlow: 'hover:border-emerald-500/50',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
      {kpis.map((kpi) => (
        <Card
          key={kpi.id}
          className={`bg-slate-900/90 border border-slate-800 transition-all duration-300 ${kpi.borderGlow} hover:-translate-y-0.5 cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold truncate">{kpi.title}</span>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
              {kpi.icon}
            </div>
          </div>

          <div className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            {kpi.value}
          </div>

          <div className="flex items-center justify-between text-[11px] mt-3 pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 truncate">{kpi.subText}</span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${kpi.badgeColor}`}>
              LIVE DEMO
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
