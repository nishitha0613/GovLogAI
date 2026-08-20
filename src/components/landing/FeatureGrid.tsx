import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Flame, 
  Lock, 
  Layers 
} from 'lucide-react';
import { Card } from '../ui/Card';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: 'Intelligent Anomaly Classifier',
      description: 'Evaluates baseline traffic parameters to detect HTTP rate spikes, error code cascades, and OWASP threat vectors.'
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: 'Local Inference & Air-Gapped Ready',
      description: 'Architected for local LLM inference and on-premise container deployment so log data stays within local security boundaries.'
    },
    {
      icon: <Flame className="w-6 h-6 text-purple-400" />,
      title: 'Multi-Log Incident Correlation',
      description: 'Groups correlated microservice log lines sharing common IP origins or endpoints into unified incident timelines.'
    },
    {
      icon: <Terminal className="w-6 h-6 text-rose-400" />,
      title: 'AI Remediation Playbooks',
      description: 'Generates verified CLI commands for administrator review to block malicious IP ranges, scale pod replicas, and adjust rate limits.'
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-400" />,
      title: 'E-Gov Collector Compatibility',
      description: 'Compatible with Syslog streams, Fluentd collectors, Kubernetes DaemonSets, CloudWatch logs, and CSV log traces.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: 'Compliance Audit Standards',
      description: 'Structured log schema designed to align with FISMA High, FedRAMP, and ISO 27001 enterprise audit standards.'
    }
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80 font-mono">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">
          Key Features & Core Capabilities
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Engineered for e-governance microservice observability and intelligent log analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Card key={i} className="hover:border-cyan-500/40 transition-all duration-300">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 w-fit mb-4">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-sans">{f.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">{f.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};
