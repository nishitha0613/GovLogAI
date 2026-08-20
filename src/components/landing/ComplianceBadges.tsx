import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

export const ComplianceBadges: React.FC = () => {
  const certifications = [
    { title: 'FedRAMP Guidelines', subtitle: 'Federal Risk Framework', color: 'text-cyan-400' },
    { title: 'FISMA Standards', subtitle: 'Security Control Alignment', color: 'text-emerald-400' },
    { title: 'ISO 27001 Schema', subtitle: 'InfoSec Management Guidelines', color: 'text-purple-400' },
    { title: 'SOC 2 Controls', subtitle: 'Security & Availability Framework', color: 'text-blue-400' },
    { title: 'Sovereign On-Prem', subtitle: 'Local Data Boundary Support', color: 'text-amber-400' },
    { title: 'Privacy Protocols', subtitle: 'Citizen Data Protection Schema', color: 'text-rose-400' },
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2 font-sans">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Designed for Alignment With FISMA, FedRAMP, ISO 27001, SOC 2 and sovereign/on-premise deployment requirements.</span>
        </h3>
        <p className="text-slate-400 text-xs mt-2 font-mono">
          Structured log schemas and security architecture designed to support public sector compliance readiness.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center hover:border-slate-700 transition"
          >
            <Award className={`w-6 h-6 mx-auto mb-2 ${cert.color}`} />
            <div className="text-sm font-bold text-white font-mono">{cert.title}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{cert.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
