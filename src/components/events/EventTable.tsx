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
    <Card className="bg-slate-900/90 border border-slate-800 p-0 overflow-hidden font-mono text-xs">
      {/* Action Bar */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Correlated Incident Graphs ({events.length} Events)</span>
        </div>

        <button
          onClick={exportEventsJson}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Event Title & Service</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Occurrences</th>
              <th className="py-3 px-4">First Seen</th>
              <th className="py-3 px-4">Last Seen</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {events.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-500">
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
                    className={`hover:bg-slate-800/60 transition cursor-pointer ${
                      isP1 ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                      {evt.id}
                    </td>

                    <td className="py-3 px-4 max-w-[280px]">
                      <div className="font-bold text-white truncate">{evt.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{evt.affectedService}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="purple" size="sm">
                        {evt.category}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={isP1 ? 'critical' : evt.severity.includes('P2') ? 'warn' : 'info'} size="sm">
                        {evt.severity}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-400">
                      {evt.occurrences.toLocaleString()} logs
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {evt.firstSeen}
                    </td>

                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {evt.lastSeen}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={evt.status === 'Resolved' || evt.status === 'Mitigated' ? 'success' : 'warn'} size="sm">
                        {evt.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition">
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
