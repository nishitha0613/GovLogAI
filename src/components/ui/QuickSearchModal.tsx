import React, { useState } from 'react';
import { Search, ShieldAlert, Terminal, Layers, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Badge } from './Badge';

export const QuickSearchModal: React.FC = () => {
  const { quickSearchOpen, setQuickSearchOpen, logs, events, services, setCurrentRoute, setSelectedLog, setSelectedEvent } = useApp();
  const [query, setQuery] = useState('');

  if (!quickSearchOpen) return null;

  const filteredLogs = logs.filter(
    (l) => l.message.toLowerCase().includes(query.toLowerCase()) || l.endpoint.toLowerCase().includes(query.toLowerCase()) || l.ipAddress.includes(query)
  ).slice(0, 3);

  const filteredEvents = events.filter(
    (e) => e.title.toLowerCase().includes(query.toLowerCase()) || e.affectedService.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 2);

  const filteredServices = services.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.agency.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <Modal
      isOpen={quickSearchOpen}
      onClose={() => setQuickSearchOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          <span>GovLogAI Global Intelligence Search</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search logs, e-gov services, CVE vectors, IP addresses (Cmd+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>

        {/* Quick Nav Suggestions */}
        <div className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto pb-2">
          <span className="shrink-0 text-slate-500">Quick Jump:</span>
          <button onClick={() => { setCurrentRoute('logs'); setQuickSearchOpen(false); }} className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-400 transition">Log Explorer</button>
          <button onClick={() => { setCurrentRoute('events'); setQuickSearchOpen(false); }} className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-purple-400 transition">Security Events</button>
          <button onClick={() => { setCurrentRoute('alerts'); setQuickSearchOpen(false); }} className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-rose-400 transition">Alert Triage</button>
          <button onClick={() => { setCurrentRoute('analytics'); setQuickSearchOpen(false); }} className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 transition">Analytics</button>
        </div>

        {/* Results Sections */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Services Section */}
          {filteredServices.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>E-Gov Microservices</span>
              </div>
              <div className="space-y-1.5">
                {filteredServices.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setCurrentRoute('dashboard');
                      setQuickSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        {s.name}
                        <Badge variant={s.status === 'Healthy' ? 'success' : s.status === 'Degraded' ? 'warn' : 'critical'} size="sm">
                          {s.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">{s.agency} • {s.latencyMs}ms latency</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Events Section */}
          {filteredEvents.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Correlated Security Events</span>
              </div>
              <div className="space-y-1.5">
                {filteredEvents.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      setSelectedEvent(e);
                      setCurrentRoute('events');
                      setQuickSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        {e.title}
                        <Badge variant={e.severity.includes('P1') ? 'critical' : 'warn'} size="sm">
                          {e.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">{e.affectedService} • Actor: {e.threatActorIp}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logs Section */}
          {filteredLogs.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Matching Server Logs</span>
              </div>
              <div className="space-y-1.5">
                {filteredLogs.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      setSelectedLog(l);
                      setCurrentRoute('logs');
                      setQuickSearchOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition font-mono text-xs"
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-cyan-400 font-bold">{l.method}</span>
                        <span className="text-slate-100 truncate">{l.endpoint}</span>
                        <Badge variant={l.level === 'CRITICAL' ? 'critical' : l.level === 'ERROR' ? 'error' : 'info'} size="sm">
                          {l.statusCode}
                        </Badge>
                      </div>
                      <div className="text-slate-400 truncate mt-0.5">{l.message}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
