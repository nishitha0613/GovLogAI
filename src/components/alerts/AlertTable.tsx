import React from 'react';
import { Bell, ChevronRight, Download } from 'lucide-react';
import type { AlertItem } from '../../types/log';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface AlertTableProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
}

export const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  onSelectAlert,
  onAcknowledge,
  onResolve,
}) => {
  const exportAlertsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `govlog_alerts_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <Card className="bg-slate-900/90 border border-slate-800 p-0 overflow-hidden font-mono text-xs">
      {/* Table Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Bell className="w-4 h-4 text-purple-400" />
          <span>Active Detections Queue ({alerts.length} Alerts)</span>
        </div>

        <button
          onClick={exportAlertsJson}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Alert ID</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Title & Description</th>
              <th className="py-3 px-4">Source / Service</th>
              <th className="py-3 px-4">Rule Triggered</th>
              <th className="py-3 px-4">Triggered Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Quick Triage / Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-500">
                  No matching incident alerts found for current filter criteria.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const isP1 = alert.severity.includes('P1');
                return (
                  <tr
                    key={alert.id}
                    onClick={() => onSelectAlert(alert)}
                    className={`hover:bg-slate-800/60 transition cursor-pointer ${
                      isP1 ? 'bg-rose-950/20 border-l-4 border-l-rose-500' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                      {alert.id}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={isP1 ? 'critical' : alert.severity.includes('P2') ? 'warn' : 'info'} size="sm" pulse={isP1 && alert.status === 'Open'}>
                        {alert.severity}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 max-w-[280px]">
                      <div className="font-bold text-white truncate">{alert.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{alert.description}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-200 whitespace-nowrap">
                      {alert.service}
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {alert.ruleTriggered}
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          alert.status === 'Resolved'
                            ? 'success'
                            : alert.status === 'Acknowledged'
                            ? 'purple'
                            : alert.status === 'Investigating'
                            ? 'info'
                            : 'critical'
                        }
                        size="sm"
                      >
                        {alert.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {alert.status === 'Open' && (
                          <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-purple-900/60 border border-slate-700 text-purple-300 text-[11px] font-mono transition"
                            title="Acknowledge Alert"
                          >
                            Ack
                          </button>
                        )}

                        {alert.status !== 'Resolved' && (
                          <button
                            onClick={() => onResolve(alert.id)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-900/60 border border-slate-700 text-emerald-300 text-[11px] font-mono transition"
                            title="Resolve Alert"
                          >
                            Resolve
                          </button>
                        )}

                        <button
                          onClick={() => onSelectAlert(alert)}
                          className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
                        >
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                        </button>
                      </div>
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
