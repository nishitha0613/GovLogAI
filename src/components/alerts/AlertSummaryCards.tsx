import React from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const AlertSummaryCards: React.FC = () => {
  const { alerts } = useApp();

  const activeCount = alerts.filter(a => a.status === 'Open' || a.status === 'Investigating').length;
  const criticalCount = alerts.filter(a => a.severity.includes('P1')).length;
  const highCount = alerts.filter(a => a.severity.includes('P2')).length;
  const acknowledgedCount = alerts.filter(a => a.status === 'Acknowledged').length;
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length;

  const cards = [
    {
      title: 'Active Alerts',
      value: activeCount.toString(),
      subText: 'Requires triage',
      icon: <Bell className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400',
      borderGlow: 'hover:border-purple-500/50'
    },
    {
      title: 'Critical (P1)',
      value: criticalCount.toString(),
      subText: 'Immediate action needed',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'text-rose-400',
      borderGlow: 'hover:border-rose-500/50'
    },
    {
      title: 'High Priority (P2)',
      value: highCount.toString(),
      subText: 'Security & Ops spikes',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-400',
      borderGlow: 'hover:border-amber-500/50'
    },
    {
      title: 'Acknowledged',
      value: acknowledgedCount.toString(),
      subText: 'Under analyst review',
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      color: 'text-cyan-400',
      borderGlow: 'hover:border-cyan-500/50'
    },
    {
      title: 'Resolved Detections',
      value: resolvedCount.toString(),
      subText: 'Auto-mitigated playbooks',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400',
      borderGlow: 'hover:border-emerald-500/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
      {cards.map((c, idx) => (
        <Card key={idx} className={`bg-slate-900/90 border border-slate-800 p-4 transition ${c.borderGlow}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 font-semibold truncate">{c.title}</span>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
              {c.icon}
            </div>
          </div>
          <div className={`text-2xl lg:text-3xl font-black font-mono ${c.color}`}>
            {c.value}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 truncate">
            {c.subText}
          </div>
        </Card>
      ))}
    </div>
  );
};
