import React from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const RbacSettings: React.FC = () => {
  const roles = [
    { role: 'GovCert Chief Security Officer', users: 3, access: 'Full Command & Auto-Playbook Execution', tier: 'Tier-1 Secret' },
    { role: 'E-Gov SecOps Threat Analyst', users: 14, access: 'Log Explorer, Event Correlation & Manual Remediation', tier: 'Tier-2 Secret' },
    { role: 'Federal Compliance Auditor', users: 6, access: 'Read-Only Cryptographic Audit Log Export', tier: 'Auditor' },
  ];

  return (
    <Card className="bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
            Role-Based Access Control (RBAC) & Audit Policies
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">23 Registered Analysts</span>
      </div>

      <div className="space-y-3">
        {roles.map((r, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{r.role}</span>
                <Badge variant="purple" size="sm">{r.tier}</Badge>
              </div>
              <div className="text-slate-400 mt-1">Access Scope: {r.access}</div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{r.users} Active Officers</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
