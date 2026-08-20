import React, { useState } from 'react';
import { Terminal, FileCode, ShieldAlert, AlertTriangle, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

interface PipelineStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  previewCode: string;
  detailText: string;
}

export const PipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(3);

  const steps: PipelineStep[] = [
    {
      id: 1,
      title: '1. Ingestion',
      subtitle: 'Multi-Source Logs',
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      previewCode: `[POST] 185.220.101.44 /api/v2/visa/verify-passport payload="' UNION SELECT..."`,
      detailText: 'Ingests raw Syslog, Fluentd log streams, K8s container logs, and CSV traces from simulated e-governance microservices.'
    },
    {
      id: 2,
      title: '2. Parsing',
      subtitle: 'Schema Structuring',
      icon: <FileCode className="w-5 h-5 text-blue-400" />,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      previewCode: `{ "timestamp": "14:26:45", "service": "border-gateway", "method": "POST", "status": 403 }`,
      detailText: 'Structures unstructured log text into a standardized JSON payload schema with extracted timestamps, IP origins, and HTTP status codes.'
    },
    {
      id: 3,
      title: '3. Classification',
      subtitle: 'Category Identification',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      previewCode: `Category: API Security / OWASP A03:2021 SQL Injection Signature Match`,
      detailText: 'GovLogAI classification model analyzes log parameters to categorize events into Authentication, API Security, DB Queries, and System Maintenance.'
    },
    {
      id: 4,
      title: '4. Severity',
      subtitle: 'Anomaly Scoring',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      previewCode: `Anomaly Score: 97% | Severity: P1 Critical | Impact: Biometric DB Probe`,
      detailText: 'Evaluates anomaly scores (0-100%) and priority ratings (P1-P4) based on endpoint sensitivity, status codes, and baseline traffic patterns.'
    },
    {
      id: 5,
      title: '5. Event Grouping',
      subtitle: 'Incident Synthesis',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      previewCode: `Grouped 14 related logs into Single Correlated Incident #EVT-901`,
      detailText: 'Correlates related log entries sharing common IP addresses, endpoints, or error sequences into unified event timelines.'
    },
    {
      id: 6,
      title: '6. Insights',
      subtitle: 'Actionable Playbooks',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      previewCode: `Recommended Action: govlog-cli waf block-ip 185.220.101.44 --duration 72h`,
      detailText: 'Generates AI-assisted root cause summaries and recommended CLI playbooks for administrator triage and remediation.'
    }
  ];

  const currentStepInfo = steps.find(s => s.id === activeStep) || steps[0];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Log Processing Pipeline Prototype</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Visual Log Intelligence Pipeline
        </h2>
        <p className="text-slate-400 text-sm mt-2 font-mono">
          How GovLogAI transforms unstructured server log files into structured event insights.
        </p>
      </div>

      {/* Stepper Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 font-mono">
        {steps.map((step) => {
          const isSelected = step.id === activeStep;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-3.5 rounded-xl bg-slate-900/90 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `glass-panel-glow ${step.borderColor} scale-105 shadow-xl`
                  : 'border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                  {step.icon}
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
              </div>

              <div>
                <div className={`text-xs font-bold ${step.color}`}>{step.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">{step.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Step Transformation Box */}
      <Card className="glass-panel-glow border border-slate-800 p-6 bg-slate-950/80 font-mono">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${currentStepInfo.color}`}>
                Phase {currentStepInfo.id}: {currentStepInfo.subtitle}
              </span>
              <span className="text-xs text-slate-500">• Click any step above to inspect</span>
            </div>

            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              {currentStepInfo.detailText}
            </p>
          </div>

          {/* Code Transformation Box */}
          <div className="w-full lg:w-1/2 text-xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pipeline Stage Output Sample:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Prototype Simulation
              </span>
            </div>
            <pre className="p-4 rounded-xl bg-[#080c14] border border-slate-800 text-cyan-300 overflow-x-auto whitespace-pre-wrap">
              {currentStepInfo.previewCode}
            </pre>
          </div>
        </div>
      </Card>
    </section>
  );
};
