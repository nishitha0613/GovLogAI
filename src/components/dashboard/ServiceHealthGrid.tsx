import React from 'react';
import { Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const ServiceHealthGrid: React.FC = () => {
  const { services, setCurrentRoute } = useApp();

  return (
    <Card className="bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
            E-Gov Microservice Health Matrix
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          6 Core Endpoints Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => {
          const isHealthy = srv.status === 'Healthy';
          const isDegraded = srv.status === 'Degraded';
          const isCritical = srv.status === 'Critical';

          return (
            <div
              key={srv.id}
              onClick={() => setCurrentRoute('analytics')}
              className={`p-4 rounded-xl bg-slate-950 border transition cursor-pointer ${
                isCritical
                  ? 'border-rose-600/60 hover:border-rose-500 shadow-lg shadow-rose-950/40'
                  : isDegraded
                  ? 'border-amber-600/60 hover:border-amber-500'
                  : 'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400">{srv.category}</span>
                <Badge
                  variant={isHealthy ? 'success' : isDegraded ? 'warn' : 'critical'}
                  size="sm"
                  pulse={isCritical}
                >
                  {srv.status}
                </Badge>
              </div>

              <div className="text-sm font-bold text-white mb-1 truncate">{srv.name}</div>
              <div className="text-[11px] text-slate-400 font-mono mb-3 truncate">{srv.agency}</div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                <div>
                  <div className="text-slate-500">Latency</div>
                  <div className={`font-bold ${srv.latencyMs > 300 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {srv.latencyMs}ms
                  </div>
                </div>

                <div>
                  <div className="text-slate-500">24h Vol</div>
                  <div className="text-slate-200 font-semibold">{srv.requestCount24h}</div>
                </div>

                <div>
                  <div className="text-slate-500">K8s Nodes</div>
                  <div className="text-slate-200 font-semibold">
                    {srv.nodesActive}/{srv.totalNodes}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
