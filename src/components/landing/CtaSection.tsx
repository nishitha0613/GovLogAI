import React from 'react';
import { Shield, Terminal, LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const CtaSection: React.FC = () => {
  const { setCurrentRoute } = useApp();

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="glass-panel-glow rounded-3xl p-10 md:p-14 border border-cyan-500/30 text-center relative overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Server Log Intelligence Prototype</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Explore GovLogAI Log Intelligence?
          </h2>

          <p className="text-base text-slate-300 font-sans leading-relaxed">
            Launch the interactive prototype console to experience intelligent log classification, severity detection, event grouping, and AI-assisted incident triage across e-governance microservice architectures.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setCurrentRoute('dashboard')}
              icon={<LayoutGrid className="w-5 h-5" />}
            >
              Launch Command Console
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentRoute('logs')}
              icon={<Terminal className="w-5 h-5 text-cyan-400" />}
            >
              Explore Live Log Stream
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
