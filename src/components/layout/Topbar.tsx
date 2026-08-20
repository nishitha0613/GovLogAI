import React from 'react';
import { 
  Search, 
  Sparkles, 
  Radio, 
  Bell, 
  ShieldCheck, 
  Command
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

export const Topbar: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    liveStreaming, 
    toggleLiveStreaming, 
    aiCopilotActive, 
    setAiCopilotActive, 
    setQuickSearchOpen,
    alerts 
  } = useApp();

  const openAlerts = alerts.filter(a => a.status === 'Open' || a.status === 'Investigating');

  const routeTitles: Record<string, { title: string; subtitle: string }> = {
    landing: { title: 'Sovereign E-Governance Portal', subtitle: 'AI-Powered Log Intelligence & Zero-Trust Audit Matrix' },
    dashboard: { title: 'Executive Command Center', subtitle: 'Real-time threat radar & sovereign infrastructure monitoring' },
    logs: { title: 'Log Explorer & Inspector', subtitle: 'Live log stream query builder with AI anomaly diagnosis' },
    'security-alerts': { title: 'Security & Alert Center', subtitle: 'Prioritized security events, real-time threat triage & automated playbooks' },
    events: { title: 'Security & Alert Center', subtitle: 'Prioritized security events, real-time threat triage & automated playbooks' },
    alerts: { title: 'Security & Alert Center', subtitle: 'Prioritized security events, real-time threat triage & automated playbooks' },
    analytics: { title: 'Deep Infrastructure Analytics', subtitle: 'Latency percentiles, throughput trends & threat forecasting' },
    settings: { title: 'Agency Security Settings', subtitle: 'AI model parameters, log ingestion collectors & RBAC controls' },
  };

  const activeInfo = routeTitles[currentRoute] || routeTitles.logs;

  return (
    <header className="sticky top-0 z-20 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 font-mono">
      {/* Left: Page Title & Subtitle */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight font-sans truncate">{activeInfo.title}</h1>
            <Badge variant="info" size="sm" className="hidden sm:inline-flex shrink-0">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>SECURED</span>
            </Badge>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block font-mono truncate">{activeInfo.subtitle}</p>
        </div>
      </div>

      {/* Right: Quick Search, Controls & Notifications */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Cmd+K Search trigger */}
        <button
          onClick={() => setQuickSearchOpen(true)}
          className="hidden md:flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Search logs, IPs, CVEs...</span>
          <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-700 flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Live Stream Toggle */}
        {currentRoute !== 'landing' && (
          <button
            onClick={toggleLiveStreaming}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer ${
              liveStreaming
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/60'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
            title="Toggle Log Ingestion Stream"
          >
            <Radio className={`w-3.5 h-3.5 ${liveStreaming ? 'animate-pulse text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{liveStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>
        )}

        {/* AI Copilot Status Toggle */}
        <button
          onClick={() => setAiCopilotActive(!aiCopilotActive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
            aiCopilotActive
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
          title="Toggle AI Copilot Anomaly Engine"
        >
          <Sparkles className={`w-3.5 h-3.5 ${aiCopilotActive ? 'text-cyan-400 animate-spin-slow' : ''}`} />
          <span className="hidden md:inline">AI COPILOT</span>
        </button>

        {/* Alert Bell Trigger */}
        <button
          onClick={() => setCurrentRoute('alerts')}
          className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <Bell className="w-4 h-4 text-purple-400" />
          {openAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
              {openAlerts.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
