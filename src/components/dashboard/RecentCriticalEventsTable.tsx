import React from 'react';
import { Flame, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const RecentCriticalEventsTable: React.FC = () => {
  const { events, setSelectedEvent, setCurrentRoute } = useApp();

  return (
    <Card className="bg-slate-900/90 border border-slate-800 p-0 overflow-hidden font-mono text-xs">
      {/* Table Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2 text-white font-bold">
          <Flame className="w-4 h-4 text-rose-400" />
          <span className="uppercase tracking-wide">Recent Correlated Critical Events</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentRoute('events')}
          icon={<ArrowRight className="w-3.5 h-3.5 text-cyan-400" />}
        >
          View All Incident Graphs
        </Button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Affected Microservice</th>
              <th className="py-3 px-4">Threat Actor IP & Geo</th>
              <th className="py-3 px-4">Incident Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {events.map((evt) => {
              const isP1 = evt.severity.includes('P1');
              return (
                <tr
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`hover:bg-slate-800/60 transition cursor-pointer ${
                    isP1 ? 'bg-rose-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={isP1 ? 'critical' : 'warn'} size="sm">
                      {evt.severity}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {evt.affectedService}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-rose-400 font-bold">{evt.threatActorIp}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{evt.country}</div>
                  </td>

                  <td className="py-3 px-4 max-w-[320px] font-sans text-slate-200">
                    <div className="font-semibold text-white truncate">{evt.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{evt.aiRootCause}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={evt.status === 'Resolved' || evt.status === 'Mitigated' ? 'success' : 'purple'} size="sm">
                      {evt.status}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition">
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
