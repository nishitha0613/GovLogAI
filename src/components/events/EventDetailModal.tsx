import React, { useState } from 'react';
import { Flame, Sparkles, Terminal, Play, Zap, Copy, Check, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const EventDetailModal: React.FC = () => {
  const { selectedEvent, setSelectedEvent, setCurrentRoute, setSelectedLog } = useApp();
  const [executed, setExecuted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!selectedEvent) return null;

  const handleCopyPlaybook = () => {
    if (selectedEvent.mitigationPlaybook) {
      navigator.clipboard.writeText(selectedEvent.mitigationPlaybook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExecutePlaybook = () => {
    setExecuted(true);
    setTimeout(() => setExecuted(false), 3500);
  };

  return (
    <Modal
      isOpen={!!selectedEvent}
      onClose={() => setSelectedEvent(null)}
      title={
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-400" />
          <span>Incident Investigation Panel: {selectedEvent.id}</span>
          <Badge variant={selectedEvent.severity.includes('P1') ? 'critical' : 'warn'} size="sm">
            {selectedEvent.severity}
          </Badge>
        </div>
      }
      maxWidth="4xl"
    >
      <div className="space-y-6 font-mono text-xs">
        {/* Title & Metadata Grid */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">{selectedEvent.title}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 mb-0.5">Affected Service</div>
              <div className="text-white font-bold truncate">{selectedEvent.affectedService}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 mb-0.5">Threat Actor IP & Geo</div>
              <div className="text-rose-400 font-bold">{selectedEvent.threatActorIp}</div>
              <div className="text-[10px] text-slate-500 truncate">{selectedEvent.country}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 mb-0.5">Correlated Logs</div>
              <div className="text-emerald-400 font-bold">{selectedEvent.occurrences.toLocaleString()} entries</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 mb-0.5">Incident Time Window</div>
              <div className="text-slate-200">{selectedEvent.firstSeen} – {selectedEvent.lastSeen}</div>
            </div>
          </div>
        </div>

        {/* 1. "Why Was This Grouped?" AI Explanation Callout */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Why Was This Grouped? (GovLogAI Pattern Correlation Analysis)</span>
          </div>
          <p className="text-slate-200 font-sans text-xs leading-relaxed">
            {selectedEvent.whyGroupedExplanation}
          </p>
        </div>

        {/* 2. Visual Event Timeline */}
        <div className="space-y-3">
          <div className="text-xs text-cyan-400 uppercase tracking-wider font-bold">
            Visual Chronological Event Timeline:
          </div>

          <div className="relative pl-6 space-y-3 border-l-2 border-slate-800">
            {selectedEvent.timeline.map((step) => (
              <div key={step.id} className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                    step.type === 'ai_detect'
                      ? 'bg-purple-400'
                      : step.type === 'auto_block'
                      ? 'bg-emerald-400'
                      : step.type === 'human_action'
                      ? 'bg-cyan-400'
                      : 'bg-rose-500'
                  }`}
                />

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-cyan-400 font-bold">{step.time}</span>
                    <span className="text-slate-500">{step.actor}</span>
                  </div>
                  <div className="text-slate-200 font-sans text-xs">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Related Log Entries */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Related Log Entries in Cluster ({selectedEvent.relatedLogs?.length || 0}):
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {selectedEvent.relatedLogs?.map((log) => (
              <div
                key={log.id}
                onClick={() => {
                  setSelectedLog(log);
                  setSelectedEvent(null);
                  setCurrentRoute('logs');
                }}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-2 cursor-pointer transition text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-cyan-400 font-bold">{log.method}</span>
                  <span className="text-slate-200 truncate">{log.endpoint}</span>
                  <span className="text-slate-400">IP: {log.ipAddress}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-rose-400 font-bold">{log.statusCode}</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Recommended Action Section */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>AI Recommended Action Plan:</span>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-200 font-sans list-disc list-inside">
            {selectedEvent.recommendedActions?.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>

          {/* Executable CLI Playbook */}
          {selectedEvent.mitigationPlaybook && (
            <div className="pt-2 space-y-2 border-t border-slate-800 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">GovLogAI CLI Remediation Playbook:</span>
                <button
                  onClick={handleCopyPlaybook}
                  className="flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-slate-950 border border-emerald-900/60 text-emerald-400 text-[11px] overflow-x-auto">
                {selectedEvent.mitigationPlaybook}
              </pre>

              <div className="flex justify-end pt-1">
                <Button
                  variant={executed ? 'secondary' : 'danger'}
                  size="md"
                  onClick={handleExecutePlaybook}
                  icon={<Play className="w-4 h-4" />}
                >
                  {executed ? 'Remediation Playbook Executed ✓' : 'Execute Recommended Action'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
