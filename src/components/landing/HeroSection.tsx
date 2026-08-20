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
        {/* Prototype Identification Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-xl shadow-cyan-500/5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>AI-Powered Server Log Intelligence Prototype</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Turn Server Logs Into{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Actionable Intelligence
          </span>
        </h1>

        {/* Product Description */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
          GovLogAI ingests, parses, and classifies server log streams across e-governance microservice architectures. Automatically group correlated log entries into events, evaluate anomaly severity, and receive AI-assisted root cause insights and actionable remediation playbooks.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setCurrentRoute('dashboard')}
            icon={<LayoutGrid className="w-5 h-5" />}
          >
            Launch Dashboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentRoute('logs')}
            icon={<Terminal className="w-5 h-5 text-cyan-400" />}
          >
            Analyze Logs
          </Button>
        </div>

        {/* Prototype Core Capabilities Bar */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono">
          <div className="glass-panel p-4 rounded-xl border border-slate-800/90">
            <div className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>Multi-Source</span>
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Syslog, JSON & CSV Ingest</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/90">
            <div className="text-lg font-bold text-cyan-400 flex items-center gap-1.5">
              <span>AI Classifier</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Severity & Vector Detection</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/90">
            <div className="text-lg font-bold text-purple-400 flex items-center gap-1.5">
              <span>Event Grouping</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Pattern Correlation Engine</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/90">
            <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
              <span>AI Insights</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1">Recommended Remediation</div>
          </div>
        </div>
      </div>
    </section>
  );
};
