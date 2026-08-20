import React from 'react';
import { ShieldCheck, Cpu, Layers, Sparkles, Terminal, LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  const { setCurrentRoute } = useApp();

  return (
    <section className="relative pt-12 pb-20 px-6 overflow-hidden cyber-grid border-b border-slate-800/80">
      {/* Subtle Radial Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
        {/* Classification Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c121e] border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sovereign AI Log Intelligence & Observability Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Turn Complex Logs Into{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Actionable Intelligence
          </span>
        </h1>

        {/* Product Description */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
          GovLogAI ingests, parses, and classifies log streams across e-governance infrastructure. Group correlated log entries into events, evaluate anomaly severity, and execute AI-assisted root cause insights & remediation playbooks.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button
            variant="primary"
            size="md"
            onClick={() => setCurrentRoute('dashboard')}
            icon={<LayoutGrid className="w-4 h-4" />}
          >
            Launch Executive Command
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentRoute('logs')}
            icon={<Terminal className="w-4 h-4 text-cyan-400" />}
          >
            Log Explorer
          </Button>
        </div>

        {/* Core Capabilities Bar */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left font-mono">
          <div className="bg-[#0c121e]/90 p-3.5 rounded-xl border border-slate-800/80 shadow-sm">
            <div className="text-base font-bold text-white flex items-center gap-1.5 font-sans">
              <span>Multi-Source</span>
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-sans">Syslog, JSON & CSV Ingest</div>
          </div>

          <div className="bg-[#0c121e]/90 p-3.5 rounded-xl border border-slate-800/80 shadow-sm">
            <div className="text-base font-bold text-cyan-400 flex items-center gap-1.5 font-sans">
              <span>AI Classifier</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-sans">Severity & Vector Detection</div>
          </div>

          <div className="bg-[#0c121e]/90 p-3.5 rounded-xl border border-slate-800/80 shadow-sm">
            <div className="text-base font-bold text-purple-400 flex items-center gap-1.5 font-sans">
              <span>Event Grouping</span>
              <Layers className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-sans">Correlation Matrix Engine</div>
          </div>

          <div className="bg-[#0c121e]/90 p-3.5 rounded-xl border border-slate-800/80 shadow-sm">
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5 font-sans">
              <span>AI Playbooks</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-sans">Automated Remediation</div>
          </div>
        </div>
      </div>
    </section>
  );
};
