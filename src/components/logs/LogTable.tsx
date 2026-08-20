import React from 'react';
import { ChevronRight, Download, Sparkles, ShieldAlert, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { LogEntry } from '../../types/log';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface LogTableProps {
  logs: LogEntry[];
}

export const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  const { setSelectedLog, events } = useApp();

  const exportLogsAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `govlog_classified_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <Card className="bg-slate-900/90 border border-slate-800 p-0 overflow-hidden font-mono text-xs">
      {/* Table Action Bar */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Classified Intelligence Logs ({logs.length} Entries)</span>
        </div>

        <button
          onClick={exportLogsAsJson}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Source / Service</th>
              <th className="py-3 px-4">Original Log Message</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Threat / Classification</th>
              <th className="py-3 px-4">Correlation Group</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-500">
                  No matching classified log entries found for current filter criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isCritical = log.level === 'CRITICAL' || log.level === 'FATAL';
                
                // Find matching correlated event group
                const matchingEvent = events.find(e => 
                  e.affectedService === log.service && (e.category === log.category || e.relatedLogs.some(l => l.id === log.id))
                );

                const timeDisplay = log.timestamp.includes('T')
                  ? log.timestamp.split('T')[1].slice(0, 12)
                  : log.timestamp.slice(0, 12);

                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`hover:bg-slate-800/60 transition cursor-pointer ${
                      isCritical ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {timeDisplay}
                    </td>

                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      <div>{log.service}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{log.endpoint}</div>
                    </td>

                    <td className="py-3 px-4 max-w-[300px] truncate font-sans text-slate-200" title={log.message}>
                      <span className="text-cyan-400 font-mono font-bold mr-1.5">{log.method}</span>
                      {log.message}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="purple" size="sm">
                        {log.category || 'System Maintenance'}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          log.level === 'CRITICAL' || log.level === 'FATAL'
                            ? 'critical'
                            : log.level === 'ERROR'
                            ? 'error'
                            : log.level === 'WARN'
                            ? 'warn'
                            : 'info'
                        }
                        size="sm"
                      >
                        {log.level}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-300">
                        {isCritical && <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        <span className={isCritical ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {log.threatVector || 'Standard Operations'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                      {matchingEvent ? (
                        <span className="text-purple-400 font-bold flex items-center gap-1">
                          <Layers className="w-3 h-3" /> [{matchingEvent.id}]
                        </span>
                      ) : (
                        <span className="text-slate-500">Uncorrelated</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition">
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
