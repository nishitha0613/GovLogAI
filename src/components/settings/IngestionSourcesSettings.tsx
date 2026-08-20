import React from 'react';
import { Layers, Key } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { mockIngestionSources } from '../../data/mockServices';

export const IngestionSourcesSettings: React.FC = () => {
  return (
    <Card className="bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
            Log Ingestion Collectors & Pipelines
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">4 Collectors Active</span>
      </div>

      <div className="space-y-3">
        {mockIngestionSources.map((ing) => (
          <div
            key={ing.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{ing.name}</span>
                <Badge variant={ing.status === 'Active' ? 'success' : 'warn'} size="sm">
                  {ing.status}
                </Badge>
              </div>
              <div className="text-slate-400 mt-1">
                Type: {ing.type} • Nodes Connected: {ing.nodesConnected}
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <div>
                <span className="text-slate-500">Rate: </span>
                <strong className="text-cyan-400">{ing.eventsPerSec.toLocaleString()} e/s</strong>
              </div>
              <div>
                <span className="text-slate-500">Bandwidth: </span>
                <strong className="text-purple-400">{ing.bandwidthMbps} Mbps</strong>
              </div>
              <button className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition">
                <Key className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
