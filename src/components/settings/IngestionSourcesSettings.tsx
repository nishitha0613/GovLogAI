import React from 'react';
import { Layers, Key } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const IngestionSourcesSettings: React.FC = () => {
  const collectors = [
    { id: 'col-1', name: 'K8s Container Log DaemonSet', type: 'FluentBit / Vector', status: 'Ready', endpoint: 'syslog://ingest.govlog.internal:514' },
    { id: 'col-2', name: 'OpenTelemetry Security Agent', type: 'OTel Collector', status: 'Ready', endpoint: 'grpc://otel.govlog.internal:4317' },
    { id: 'col-3', name: 'Border Gateway Syslog Receiver', type: 'RSyslog / TLS', status: 'Ready', endpoint: 'syslog-tls://border-ingress.govlog.internal:6514' },
    { id: 'col-4', name: 'Treasury Audit Event Stream', type: 'Apache Kafka Consumer', status: 'Ready', endpoint: 'kafka://treasury-kafka.govlog.internal:9092' },
  ];

  return (
    <Card className="bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wide">
            Log Ingestion Collectors & Pipeline Settings
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">{collectors.length} Pipelines Configured</span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {collectors.map((ing) => (
          <div
            key={ing.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-sans">{ing.name}</span>
                <Badge variant="purple" size="sm">
                  {ing.status}
                </Badge>
              </div>
              <div className="text-slate-400 mt-1 text-[11px]">
                Type: {ing.type} • Endpoint: <span className="text-cyan-300">{ing.endpoint}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <button className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]" title="API Key Secret">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>Secret API Key</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
