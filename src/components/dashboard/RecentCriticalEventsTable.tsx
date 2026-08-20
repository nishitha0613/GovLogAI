import React from 'react';
import { Flame, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const RecentCriticalEventsTable: React.FC = () => {
  const { events, setSelectedEvent, setCurrentRoute } = useApp();

  return (
    <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-0 overflow-hidden font-mono text-xs shadow-sm">
      {/* Table Header */}
      <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2 text-white font-bold font-sans">
          <Flame className="w-4 h-4 text-rose-400" />
          <span className="uppercase tracking-wider text-xs">Recent Correlated Critical Events</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentRoute('events')}
          icon={<ArrowRight className="w-3.5 h-3.5 text-cyan-400" />}
        >
          View All Incidents
        </Button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              <th className="py-2.5 px-3.5">Time</th>
              <th className="py-2.5 px-3.5">Severity</th>
              <th className="py-2.5 px-3.5">Microservice</th>
              <th className="py-2.5 px-3.5">Threat IP & Geo</th>
              <th className="py-2.5 px-3.5">Incident Description</th>
              <th className="py-2.5 px-3.5">Status</th>
              <th className="py-2.5 px-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {events.map((evt) => {
              const isP1 = evt.severity.includes('P1');
              return (
                <tr
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`hover:bg-slate-800/40 transition cursor-pointer ${
                    isP1 ? 'bg-rose-950/15' : ''
                  }`}
                >
                  <td className="py-2.5 px-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <Badge variant={isP1 ? 'critical' : 'warn'} size="sm">
                      {evt.severity}
                    </Badge>
                  </td>

                  <td className="py-2.5 px-3.5 font-bold text-white whitespace-nowrap text-xs">
                    {evt.affectedService}
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap font-mono">
                    <div className="text-rose-400 font-semibold text-xs">{evt.threatActorIp}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[130px] font-sans">{evt.country}</div>
                  </td>

                  <td className="py-2.5 px-3.5 max-w-[300px] text-slate-200">
                    <div className="font-medium text-white truncate text-xs">{evt.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{evt.aiRootCause}</div>
                  </td>

                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <Badge variant={evt.status === 'Resolved' || evt.status === 'Mitigated' ? 'success' : 'purple'} size="sm">
                      {evt.status}
                    </Badge>
                  </td>

                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <button className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition">
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
