import React from 'react';
import { Clock, Globe, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const EventTimeline: React.FC = () => {
  const { events, setSelectedEvent } = useApp();

  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
        Correlated Security Events ({events.length})
      </div>

      <div className="grid grid-cols-1 gap-4">
        {events.map((evt) => {
          const isP1 = evt.severity.includes('P1');
          return (
            <Card
              key={evt.id}
              onClick={() => setSelectedEvent(evt)}
              danger={isP1}
              className="hover:border-purple-500/50 transition cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={isP1 ? 'critical' : 'warn'} size="sm">
                      {evt.severity}
                    </Badge>

                    <Badge variant="purple" size="sm">
                      {evt.category}
                    </Badge>

                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>

                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                      {evt.logsCount} Log Lines Correlated
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{evt.title}</h3>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {evt.aiRootCause}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      Service: <strong className="text-white">{evt.affectedService}</strong>
                    </span>

                    <span className="flex items-center gap-1 text-slate-300">
                      <Globe className="w-3.5 h-3.5 text-rose-400" />
                      Threat Actor: <strong className="text-rose-300">{evt.threatActorIp}</strong> ({evt.country})
                    </span>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-4 h-4 text-cyan-400" />}>
                    View Incident Graph
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
