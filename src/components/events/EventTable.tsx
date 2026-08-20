import React from 'react';
import { ChevronRight, Download, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { SecurityEvent } from '../../types/log';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface EventTableProps {
  events: SecurityEvent[];
}

export const EventTable: React.FC<EventTableProps> = ({ events }) => {
  const { setSelectedEvent } = useApp();

  const exportEventsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `govlog_events_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-0 overflow-hidden font-mono text-xs shadow-sm">
      {/* Action Bar */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2 text-slate-200 font-bold font-sans">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Correlated Incident Graphs ({events.length} Events)</span>
        </div>

        <button
          onClick={exportEventsJson}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              <th className="py-2.5 px-3.5">Event ID</th>
              <th className="py-2.5 px-3.5">Title & Service</th>
              <th className="py-2.5 px-3.5">Category</th>
              <th className="py-2.5 px-3.5">Severity</th>
              <th className="py-2.5 px-3.5">Occurrences</th>
              <th className="py-2.5 px-3.5">First Seen</th>
              <th className="py-2.5 px-3.5">Last Seen</th>
              <th className="py-2.5 px-3.5">Status</th>
              <th className="py-2.5 px-3.5 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {events.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-500 font-mono">
                  No matching correlated security events found for current filter criteria.
                </td>
              </tr>
            ) : (
              events.map((evt) => {
                const isP1 = evt.severity.includes('P1');
                return (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`hover:bg-slate-800/40 transition cursor-pointer ${
                      isP1 ? 'bg-rose-950/15' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-bold text-cyan-400 font-mono whitespace-nowrap">
                      {evt.id}
                    </td>

                    <td className="py-2.5 px-3.5 max-w-[260px]">
                      <div className="font-semibold text-white truncate text-xs">{evt.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{evt.affectedService}</div>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <Badge variant="purple" size="sm">
                        {evt.category}
                      </Badge>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <Badge variant={isP1 ? 'critical' : evt.severity.includes('P2') ? 'warn' : 'info'} size="sm">
                        {evt.severity}
                      </Badge>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap font-semibold text-emerald-400 font-mono">
                      {evt.occurrences.toLocaleString()} logs
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {evt.firstSeen}
                    </td>

                    <td className="py-2.5 px-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {evt.lastSeen}
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <Badge variant={evt.status === 'Resolved' || evt.status === 'Mitigated' ? 'success' : 'warn'} size="sm">
                        {evt.status}
                      </Badge>
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition">
                        <ChevronRight className="w-4 h-4 text-purple-400" />
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
