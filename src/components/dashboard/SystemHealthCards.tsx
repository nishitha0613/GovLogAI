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
      subtitle: 'National GovNet Router',
      icon: <Server className="w-4 h-4 text-cyan-400" />,
      status: 'Healthy',
      latency: '42ms',
      uptime: '99.99%',
      metric: '52.4k req/s',
      nodes: '32/32 Active',
      badgeVariant: 'success' as const
    },
    {
      id: 'sys-db',
      name: 'Database Cluster',
      subtitle: 'Postgres Primary & Replicas',
      icon: <Database className="w-4 h-4 text-amber-400" />,
      status: 'Degraded',
      latency: '380ms',
      uptime: '99.45%',
      metric: '82% Pool Cap',
      nodes: '22/24 Active',
      badgeVariant: 'warn' as const
    },
    {
      id: 'sys-auth',
      name: 'Authentication Service',
      subtitle: 'GovID OAuth2 & SAML Matrix',
      icon: <Key className="w-4 h-4 text-purple-400" />,
      status: 'Healthy',
      latency: '38ms',
      uptime: '99.98%',
      metric: '18.4M logins/d',
      nodes: '16/16 Active',
      badgeVariant: 'success' as const
    },
    {
      id: 'sys-storage',
      name: 'Storage & Log Vault',
      subtitle: 'Sovereign Encrypted Storage',
      icon: <HardDrive className="w-4 h-4 text-emerald-400" />,
      status: 'Healthy',
      latency: '12ms',
      uptime: '100%',
      metric: '342.6 GB Cold',
      nodes: '64 Disks Active',
      badgeVariant: 'success' as const
    },
    {
      id: 'sys-net',
      name: 'Network & WAF Mesh',
      subtitle: 'Enterprise Zero-Trust WAF',
      icon: <ShieldCheck className="w-4 h-4 text-blue-400" />,
      status: 'Healthy',
      latency: '18ms',
      uptime: '99.99%',
      metric: '48.2 Mbps Bandwidth',
      nodes: '128 Edge Nodes',
      badgeVariant: 'success' as const
    }
  ];

  return (
    <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3.5">
        <div className="flex items-center gap-2 font-mono">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
            Infrastructure Core Component Health
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          All Core Systems Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        {systems.map((sys) => (
          <div
            key={sys.id}
            onClick={() => setCurrentRoute('analytics')}
            className={`p-3 rounded-xl bg-slate-950 border transition cursor-pointer hover:-translate-y-0.5 ${
              sys.status === 'Degraded'
                ? 'border-amber-600/50 hover:border-amber-500 bg-amber-950/10'
                : 'border-slate-800/80 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                {sys.icon}
              </div>
              <Badge variant={sys.badgeVariant} size="sm" pulse={sys.status === 'Degraded'}>
                {sys.status}
              </Badge>
            </div>

            <div className="text-xs font-bold text-white truncate font-sans">{sys.name}</div>
            <div className="text-[10px] text-slate-400 truncate mb-2.5">{sys.subtitle}</div>

            <div className="space-y-1 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Latency:</span>
                <span className={`font-bold ${sys.status === 'Degraded' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {sys.latency}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Metric:</span>
                <span className="text-slate-200 font-medium">{sys.metric}</span>
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
