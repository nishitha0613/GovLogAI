import React from 'react';
import { UserCheck, Landmark, Activity, MapPin, Plane, CreditCard } from 'lucide-react';
import { Card } from '../ui/Card';

export const UseCases: React.FC = () => {
  const cases = [
    {
      icon: <UserCheck className="w-6 h-6 text-cyan-400" />,
      title: 'National Digital Identity (GovID)',
      badge: 'Authentication Gateway',
      desc: 'Detects credential stuffing patterns, MFA retry spikes, and automated bot queries on citizen authentication portals.'
    },
    {
      icon: <Landmark className="w-6 h-6 text-emerald-400" />,
      title: 'Tax & Revenue Filings',
      badge: 'Database Resilience',
      desc: 'Monitors corporate and individual annual filing backend microservices for DB pool exhaustion and unindexed query bottlenecks.'
    },
    {
      icon: <Activity className="w-6 h-6 text-rose-400" />,
      title: 'National Health Exchange (EHR)',
      badge: 'Privacy Audit',
      desc: 'Audits electronic medical record API queries for unusual access patterns, SAML token errors, and data access anomalies.'
    },
    {
      icon: <MapPin className="w-6 h-6 text-amber-400" />,
      title: 'Land Registry & Cadastral GIS',
      badge: 'API Rate Defense',
      desc: 'Flags commercial API key query spikes for bulk property title exports and spatial GeoJSON boundaries.'
    },
    {
      icon: <Plane className="w-6 h-6 text-purple-400" />,
      title: 'Border Control & Visa Gateway',
      badge: 'Biometric Gateway',
      desc: 'Monitors passport verification endpoints for malicious SQL injection payloads and key vault connection timeouts.'
    },
    {
      icon: <CreditCard className="w-6 h-6 text-blue-400" />,
      title: 'Public Treasury Settlement API',
      badge: 'Treasury Audit',
      desc: 'Flags JWT "alg: none" header manipulation attempts on high-value public procurement disbursement authorization requests.'
    }
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">
          E-Governance Microservice Use Cases
        </h2>
        <p className="text-slate-400 text-sm mt-2 font-mono">
          Tailored log intelligence scenarios across simulated e-governance infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
        {cases.map((c, i) => (
          <Card key={i} className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                {c.icon}
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {c.badge}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 font-sans">{c.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">{c.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};
