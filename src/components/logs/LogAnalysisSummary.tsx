import React from 'react';
import { Info, AlertTriangle, AlertOctagon, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';
import type { LogEntry } from '../../types/log';

interface LogAnalysisSummaryProps {
  logs?: LogEntry[];
}

export const LogAnalysisSummary: React.FC<LogAnalysisSummaryProps> = ({ logs = [] }) => {
  const infoCount = logs.filter(l => l.level === 'INFO').length;
  const warnCount = logs.filter(l => l.level === 'WARN').length;
  const errorCount = logs.filter(l => l.level === 'ERROR').length;
  const criticalCount = logs.filter(l => l.level === 'CRITICAL' || l.level === 'FATAL').length;
  const totalLogs = logs.length;

  const severityCards = [
    {
      title: 'INFO',
      count: infoCount,
      pct: totalLogs > 0 ? ((infoCount / totalLogs) * 100).toFixed(1).replace(/\.0$/, '') : '0',
      icon: <Info className="w-5 h-5 text-emerald-400" />,
      badgeBg: 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400',
      textColor: 'text-emerald-400',
      subText: 'Standard operational log entries'
    },
    {
      title: 'WARNING',
      count: warnCount,
      pct: totalLogs > 0 ? ((warnCount / totalLogs) * 100).toFixed(1).replace(/\.0$/, '') : '0',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      badgeBg: 'bg-amber-950/60 border-amber-800/60 text-amber-400',
      textColor: 'text-amber-400',
      subText: 'System warnings & throttles'
    },
    {
      title: 'ERROR',
      count: errorCount,
      pct: totalLogs > 0 ? ((errorCount / totalLogs) * 100).toFixed(1).replace(/\.0$/, '') : '0',
      icon: <AlertOctagon className="w-5 h-5 text-orange-400" />,
      badgeBg: 'bg-orange-950/60 border-orange-800/60 text-orange-400',
      textColor: 'text-orange-400',
      subText: 'System errors & 5xx HTTP codes'
    },
    {
      title: 'CRITICAL',
      count: criticalCount,
      pct: totalLogs > 0 ? ((criticalCount / totalLogs) * 100).toFixed(1).replace(/\.0$/, '') : '0',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      badgeBg: 'bg-rose-950/60 border-rose-800/60 text-rose-400',
      textColor: 'text-rose-400',
      subText: 'Critical security vectors'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
      {severityCards.map((card) => (
        <Card key={card.title} className="bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-sans tracking-wide text-slate-300">
              {card.title}
            </span>
            <div className={`p-2 rounded-xl border ${card.badgeBg}`}>
              {card.icon}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className={`text-3xl font-extrabold font-mono ${card.textColor}`}>
              {card.count.toLocaleString()}
            </div>
            {totalLogs > 0 && (
              <span className="text-xs font-mono text-slate-400 font-semibold">
                {card.pct}%
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 mt-1.5 truncate font-sans">
            {card.subText}
          </div>
        </Card>
      ))}
    </div>
  );
};
