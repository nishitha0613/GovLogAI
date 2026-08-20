import React from 'react';
import { ShieldCheck, Lock, Flame, Zap } from 'lucide-react';
import { Card } from '../ui/Card';

export const WhyGovLogAI: React.FC = () => {
  const benefits = [
    {
      icon: <Lock className="w-6 h-6 text-cyan-400" />,
      title: 'Intelligent Log Classification & Parsing',
      badge: 'Automated Ingestion',
      description: 'Parses unstructured text, JSON, and CSV server logs across e-gov microservices, extracting key headers, status codes, and anomaly parameters.'
    },
    {
      icon: <Flame className="w-6 h-6 text-purple-400" />,
      title: 'Correlated Event Grouping',
      badge: 'Pattern Synthesis',
      description: 'Stitches hundreds of fragmented log lines into unified incident events—linking IP origins, target endpoints, and failure cascades into single timelines.'
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: 'AI-Assisted Root Cause & Insights',
      badge: 'Actionable Playbooks',
      description: 'Translates raw error stack traces into concise AI summaries and provides recommended CLI playbooks for administrator review and action.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: 'Compliance & Audit Trail Alignment',
      badge: 'Standards Ready',
      description: 'Structured audit log schema designed to align with FISMA High, FedRAMP, and ISO 27001 enterprise governance guidelines.'
    }
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Why Choose GovLogAI Server Intelligence?
        </h2>
        <p className="text-slate-400 text-sm mt-2 font-mono">
          Product-focused observability for e-governance microservices and public sector log analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((b, i) => (
          <Card key={i} className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
              {b.icon}
            </div>

            <div className="space-y-1.5 flex-1 font-sans">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{b.title}</h3>
                {b.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {b.badge}
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{b.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
