import React, { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

export const LiveLogTeaser: React.FC = () => {
  const { logs, setSelectedLog, setCurrentRoute } = useApp();
  const [activeTab, setActiveTab] = useState<'stream' | 'ai_explanation'>('stream');

  const highlightedLog = logs.find(l => l.level === 'CRITICAL') || logs[0];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Live Autonomous Log Stream & Threat Detection
        </h2>
        <p className="text-slate-400 text-sm mt-2 font-mono">
          See how GovLogAI continuously scans incoming server logs across public sector endpoints.
        </p>
      </div>

      <div className="glass-panel-glow rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span className="text-xs font-mono text-slate-400 ml-2">govlog-node-east-01.gov.internal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === 'stream' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              Log Stream
            </button>
            <button
              onClick={() => setActiveTab('ai_explanation')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                activeTab === 'ai_explanation' ? 'bg-purple-950 text-purple-300 border border-purple-700/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              AI Threat Diagnosis
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {activeTab === 'stream' ? (
          <div className="p-4 bg-[#080c14] font-mono text-xs space-y-2 max-h-[380px] overflow-y-auto">
            {logs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                onClick={() => {
                  setSelectedLog(log);
                  setCurrentRoute('logs');
                }}
                className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-cyan-500/50 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-slate-500 shrink-0">{log.timestamp.split('T')[1].slice(0, 8)}</span>
                  <Badge variant={log.level === 'CRITICAL' ? 'critical' : log.level === 'ERROR' ? 'error' : log.level === 'WARN' ? 'warn' : 'info'} size="sm">
                    {log.level}
                  </Badge>
                  <span className="text-cyan-400 font-bold shrink-0">{log.method}</span>
                  <span className="text-slate-200 truncate">{log.endpoint}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px]">
                  <span>IP: {log.ipAddress}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Anomaly: {log.anomalyScore}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#080c14] space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-950/40 border border-purple-800/50">
              <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-purple-200">GovLogAI Neural Diagnosis Model</h4>
                <p className="text-xs text-purple-300/80 mt-1">
                  {highlightedLog.aiSummary || 'Zero-day SQL injection payload detected in visa verification parameters.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 mb-1">Vector Classification:</div>
                <div className="text-rose-400 font-bold">{highlightedLog.threatVector || 'CWE-89: SQL Injection'}</div>
                <div className="text-slate-400 mt-3 mb-1">Target Microservice:</div>
                <div className="text-white font-semibold">{highlightedLog.service}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 mb-1">Automated Auto-Mitigation Command:</div>
                <pre className="text-emerald-400 bg-slate-950 p-2 rounded text-[11px] overflow-x-auto">
                  {highlightedLog.mitigationScript || 'govlog-cli waf block-ip 185.220.101.44'}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
