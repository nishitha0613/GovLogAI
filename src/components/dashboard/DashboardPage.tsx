import React from 'react';
import { ShieldCheck, Server, Cpu, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const DashboardPage: React.FC = () => {
  const { logs, events, setCurrentRoute } = useApp();

  const totalLogs = logs.length;
  const criticalCount = events.filter(e => e.severity.includes('P1') || e.severity.includes('Critical')).length;

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-6 font-sans">
      {/* High-Level System Health Status Banner */}
      <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-6 rounded-xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <span>E-GOVERNANCE SYSTEM POSTURE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-xl font-bold text-white font-sans mt-0.5">
                Executive Command — System Overview
              </h1>
            </div>
          </div>

          <Badge variant={criticalCount > 0 ? 'critical' : 'success'} size="md">
            {criticalCount > 0 ? 'Actionable Threats Detected' : 'Operational Normal'}
          </Badge>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed font-sans max-w-3xl">
          GovLogAI is actively monitoring sovereign government digital infrastructure. All log ingestion, threat classification, and cryptographic audit hashing are executing within your local air-gapped environment.
        </p>

        {/* High-Level Infrastructure Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-sans text-xs">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Log Ingestion Status</span>
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {totalLogs > 0 ? `${totalLogs.toLocaleString()} Buffer Entries` : 'Idle / Standby'}
            </div>
            <div className="text-[10px] text-slate-500">Local Sovereign Ingestion Engine</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-sans text-xs">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>ML & Cryptographic Engine</span>
            </div>
            <div className="text-lg font-bold text-purple-400 mt-1">Active / Air-Gapped</div>
            <div className="text-[10px] text-slate-500">SHA-256 + Isolation Forest ML</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 font-sans text-xs">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Data Sovereignty</span>
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-1">100% On-Premise</div>
            <div className="text-[10px] text-slate-500">Zero External Cloud Dependencies</div>
          </div>
        </div>

        {/* Navigation Quick Link to Detailed Security Analysis */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setCurrentRoute('security-alerts')}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition inline-flex items-center gap-2 cursor-pointer font-sans"
          >
            <span>Go to Detailed Security & Alerts Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};
