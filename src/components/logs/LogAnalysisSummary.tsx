import React from 'react';
import { Terminal, AlertTriangle, ShieldAlert, Layers, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

interface LogAnalysisSummaryProps {
  fileName?: string;
  totalLogs?: number;
  errorCount?: number;
  criticalCount?: number;
  eventGroupsCount?: number;
  confidenceRating?: number | string;
  isCustomFile?: boolean;
}

export const LogAnalysisSummary: React.FC<LogAnalysisSummaryProps> = ({
  fileName = 'sovereign_egov_cluster.log',
  totalLogs = 12450,
  errorCount = 184,
  criticalCount = 14,
  eventGroupsCount = 3,
  confidenceRating = 'Rule-Based',
  isCustomFile = false,
}) => {
  const summaryKpis = [
    {
      title: 'Total Logs Processed',
      value: totalLogs.toLocaleString(),
      subText: `Source: ${fileName}`,
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      color: 'text-cyan-400'
    },
    {
      title: 'Error Count',
      value: errorCount.toLocaleString(),
      subText: 'ERROR & 500 Status Entries',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-400'
    },
    {
      title: 'Critical Events',
      value: criticalCount.toString(),
      subText: 'CRITICAL Level & Security Threats',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'text-rose-400'
    },
    {
      title: 'Correlated Event Groups',
      value: eventGroupsCount.toString(),
      subText: 'Incident Groups Synthesized',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400'
    },
    {
      title: isCustomFile ? 'Analysis Engine' : 'AI Confidence Rating',
      value: isCustomFile ? 'Rule-Based' : typeof confidenceRating === 'number' ? `${confidenceRating}%` : confidenceRating,
      subText: isCustomFile ? 'Prototype Rule-Based Analysis' : 'Neural signature match',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
      {summaryKpis.map((kpi, idx) => (
        <Card key={idx} className="bg-slate-900/90 border border-slate-800 p-4 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 truncate">{kpi.title}</span>
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
              {kpi.icon}
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${kpi.color}`}>
            {kpi.value}
          </div>
          <div className="text-[10px] text-slate-400 mt-2 truncate">
            {kpi.subText}
          </div>
        </Card>
      ))}
    </div>
  );
};
