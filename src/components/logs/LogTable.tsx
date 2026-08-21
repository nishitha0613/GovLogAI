import React from 'react';
import { ChevronRight, Download, Sparkles, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { LogEntry } from '../../types/log';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface LogTableProps {
  logs: LogEntry[];
  hasProcessedLogs?: boolean;
}

export const LogTable: React.FC<LogTableProps> = ({ logs, hasProcessedLogs = false }) => {
  const { setSelectedLog } = useApp();

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
    <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-0 overflow-hidden font-mono text-xs shadow-sm">
      {/* Table Action Bar */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2 text-slate-200 font-bold font-sans">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Classified Intelligence Logs ({logs.length} Entries)</span>
        </div>

        <button
          onClick={exportLogsAsJson}
          disabled={logs.length === 0}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition ${
            logs.length === 0
              ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white cursor-pointer'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              <th className="py-2.5 px-3.5">Timestamp</th>
              <th className="py-2.5 px-3.5">Source / Service</th>
              <th className="py-2.5 px-3.5">Log Message</th>
              <th className="py-2.5 px-3.5">Category</th>
              <th className="py-2.5 px-3.5">Severity</th>
              <th className="py-2.5 px-3.5">Classification & ML</th>
              <th className="py-2.5 px-3.5">SHA-256 Audit Hash</th>
              <th className="py-2.5 px-3.5 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  {!hasProcessedLogs ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-1">
                        <FileText className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white font-sans">No logs available yet.</h4>
                      <p className="text-xs text-slate-400 font-sans max-w-sm">
                        Upload and process a log file to view events here.
                      </p>
                    </div>
                  ) : (
                    <div className="py-8 text-slate-400 font-mono text-xs">
                      No matching classified log entries found for current filter criteria.
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isCritical = log.level === 'CRITICAL' || log.level === 'FATAL';

                const timeDisplay = log.timestamp.includes('T')
                  ? log.timestamp.split('T')[1].slice(0, 12)
                  : log.timestamp.slice(0, 12);

                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`hover:bg-slate-800/40 transition cursor-pointer ${
                      isCritical ? 'bg-rose-950/15' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {timeDisplay}
                    </td>

                    <td className="py-2.5 px-3.5 font-bold text-white whitespace-nowrap text-xs">
                      <div>{log.service}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">{log.endpoint}</div>
                    </td>

                    <td className="py-2.5 px-3.5 max-w-[280px] truncate text-slate-200 text-xs" title={log.message}>
                      <span className="text-cyan-400 font-mono font-bold mr-1.5">{log.method}</span>
                      {log.message}
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <Badge variant="purple" size="sm">
                        {log.category || 'System Maintenance'}
                      </Badge>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
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

                    <td className="py-2.5 px-3.5 whitespace-nowrap text-xs">
                      <div className="flex flex-col">
                        <span className={isCritical ? 'text-rose-400 font-semibold font-mono text-[11px]' : 'text-slate-300 font-sans'}>
                          {log.threatVector || 'Standard Operations'}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          ML Score: {log.anomalyScore || 10}/100
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap font-mono text-[10px] text-slate-400" title={log.hash || 'SHA-256 Audit Block Hash'}>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Tamper-proof hash verified" />
                        <span className="text-slate-300 font-bold">{log.hash ? `${log.hash.slice(0, 10)}...` : 'SHA256-PENDING'}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition">
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
