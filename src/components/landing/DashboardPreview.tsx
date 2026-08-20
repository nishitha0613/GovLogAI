import React, { useState } from 'react';
import { LayoutGrid, Terminal, Flame, BarChart3, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DashboardPreview: React.FC = () => {
  const { setCurrentRoute } = useApp();
  const [activeTab, setActiveTab] = useState<'command' | 'logs' | 'events' | 'analytics'>('command');

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Interactive Prototype Preview
        </h2>
        <p className="text-slate-400 text-sm mt-2 font-mono">
          Explore the GovLogAI console suite designed for server log analysis and incident triage.
        </p>
      </div>

      <div className="glass-panel-glow rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* Navigation Tabs Header */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="text-xs text-slate-400 ml-2">govlog-prototype-v4.2</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('command')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'command' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Command Center
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'logs' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Log Explorer
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'events' ? 'bg-purple-950 text-purple-300 border border-purple-700/50 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Event Grouping
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'analytics' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> AI Predictive
            </button>
          </div>
        </div>

        {/* Tab Preview Content */}
        <div className="p-6 bg-[#080c14]">
          {activeTab === 'command' && (
            <div className="space-y-4 font-mono">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Total Logs Analyzed</div>
                  <div className="text-xl font-bold text-white mt-1">42,891,040</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Threat Anomaly Index</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">98.4% Normal</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Active Incidents</div>
                  <div className="text-xl font-bold text-rose-400 mt-1">3 Incidents</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">AI Response Speed</div>
                  <div className="text-xl font-bold text-purple-400 mt-1">1.4s Avg</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Badge variant="critical" size="sm">P1 CRITICAL</Badge>
                  <span className="text-white font-bold">SQL Injection attempt on Border Control Visa Gateway</span>
                </div>
                <Button variant="primary" size="sm" onClick={() => setCurrentRoute('dashboard')}>
                  Open Interactive Console
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-400">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300">status:500 service:tax-portal threat:sqli</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-rose-400 font-bold mr-2">POST</span>
                  <span className="text-slate-200">/api/v2/visa/verify-passport</span>
                  <span className="text-slate-400 text-[11px] ml-3">IP: 185.220.101.44 (Tor Exit Node)</span>
                </div>
                <Badge variant="critical" size="sm">97% Anomaly Score</Badge>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
                <div className="flex items-center justify-between text-purple-300 font-bold mb-1">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> AI Neural Inspector Diagnosis</span>
                  <span>Remediation Playbook Generated</span>
                </div>
                <pre className="text-emerald-400 bg-slate-950 p-2 rounded text-[11px]">
                  govlog-cli waf block-ip 185.220.101.44 --duration 72h
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="critical" size="sm">P1 Critical Incident #EVT-901</Badge>
                  <span className="text-slate-400">14 Correlated Logs</span>
                </div>
                <h4 className="text-sm font-bold text-white">JWT Algorithm Manipulation Attack targeting Public Treasury API</h4>
                <p className="text-slate-300 font-sans text-xs">
                  Adversary set header "alg": "none" aiming to bypass signature check on treasury disbursement payout authorization.
                </p>
                <div className="text-emerald-400 text-[11px] pt-1">
                  Recommended Action: Block IP 45.154.255.89 & Revoke Session Tokens.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-purple-300 font-bold">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-purple-400" /> AI Threat Build-Up Forecast</span>
                  <span className="text-amber-400">Predicted Spike at 19:00 (88% Prob)</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">
                  GovLogAI predictive engine detected ping patterns targeting Tax & Revenue endpoints. Pre-scaling recommended.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
