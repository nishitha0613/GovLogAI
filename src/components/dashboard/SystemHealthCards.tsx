import React from 'react';
import { Server, Database, Key, HardDrive, ShieldCheck, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const SystemHealthCards: React.FC = () => {
  const { setCurrentRoute } = useApp();

  const systems = [
    {
      id: 'sys-api',
      name: 'API Gateway',
      subtitle: 'National GovNet Router (Simulated)',
      icon: <Server className="w-5 h-5 text-cyan-400" />,
      status: 'Healthy',
      latency: '42ms',
      uptime: '99.99%',
      metric: '52.4k req/s',
      nodes: '32/32 Pods (Demo)',
      badgeVariant: 'success' as const
    },
    {
      id: 'sys-db',
      name: 'Database Cluster',
      subtitle: 'Postgres Primary & Replicas (Simulated)',
      icon: <Database className="w-5 h-5 text-amber-400" />,
      status: 'Degraded',
      latency: '380ms',
      uptime: '99.45%',
      metric: '82% Pool Cap',
      nodes: '22/24 Pods (Demo)',
      badgeVariant: 'warn' as const
    },
    {
      id: 'sys-auth',
      name: 'Authentication Service',
      subtitle: 'GovID OAuth2 & SAML (Simulated)',
      icon: <Key className="w-5 h-5 text-purple-400" />,
      status: 'Healthy',
      latency: '38ms',
      uptime: '99.98%',
      metric: '18.4M logins/d',
      nodes: '16/16 Pods (Demo)',
      badgeVariant: 'success' as const
    },
    {
      id: 'sys-storage',
      name: 'Storage & Log Vault',
      subtitle: 'Sovereign Encrypted Storage (Simulated)',
      icon: <HardDrive className="w-5 h-5 text-emerald-400" />,
      status: 'Healthy',
      latency: '12ms',
      uptime: '100%',
      metric: '342.6 GB Cold',
      nodes: '64 Disks (Demo)',
      badgeVariant: 'success' as const
    },
    {
      id: 'sys-net',
      name: 'Network & WAF Mesh',
      subtitle: 'Cloudflare Enterprise WAF (Simulated)',
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      status: 'Healthy',
      latency: '18ms',
      uptime: '99.99%',
      metric: '48.2 Mbps Bandwidth',
      nodes: '128 Nodes (Demo)',
      badgeVariant: 'success' as const
    }
  ];

  return (
    <Card className="bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2 font-mono">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Infrastructure Core Component Health (Simulated Demo Environment)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          Prototype Simulation Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        {systems.map((sys) => (
          <div
            key={sys.id}
            onClick={() => setCurrentRoute('analytics')}
            className={`p-3.5 rounded-xl bg-slate-950 border transition cursor-pointer hover:-translate-y-0.5 ${
              sys.status === 'Degraded'
                ? 'border-amber-600/60 hover:border-amber-500'
                : 'border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                {sys.icon}
              </div>
              <Badge variant={sys.badgeVariant} size="sm" pulse={sys.status === 'Degraded'}>
                {sys.status}
              </Badge>
            </div>

            <div className="text-sm font-bold text-white truncate">{sys.name}</div>
            <div className="text-[10px] text-slate-400 truncate mb-3">{sys.subtitle}</div>

            <div className="space-y-1 pt-2 border-t border-slate-800 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Latency:</span>
                <span className={`font-bold ${sys.status === 'Degraded' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {sys.latency}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Metric:</span>
                <span className="text-slate-200 font-semibold">{sys.metric}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Nodes:</span>
                <span className="text-slate-300">{sys.nodes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
