import React, { useState } from 'react';
import { Bell, Sparkles, Play, Copy, Check, ChevronRight, RefreshCw, CheckCircle2, Eye, Terminal } from 'lucide-react';
import type { AlertItem } from '../../types/log';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AlertDetailModalProps {
  alert: AlertItem | null;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
  onInvestigate: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onViewEvent?: (eventId: string) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onAcknowledge,
  onInvestigate,
  onResolve,
  onViewEvent,
}) => {
  const { events, setSelectedLog, setCurrentRoute } = useApp();
  const [copied, setCopied] = useState(false);
  const [executed, setExecuted] = useState(false);

  if (!alert) return null;

  const relatedEvent = events.find(e => e.id === alert.relatedEventId) || null;

  const handleCopyPlaybook = () => {
    if (alert.cliPlaybook) {
      navigator.clipboard.writeText(alert.cliPlaybook);
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
      isOpen={!!alert}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" />
          <span>Incident Triage Console: {alert.id}</span>
          <Badge variant={alert.severity.includes('P1') ? 'critical' : 'warn'} size="sm">
            {alert.severity}
          </Badge>
        </div>
      }
      maxWidth="4xl"
    >
      <div className="space-y-6 font-mono text-xs">
        {/* Header & Metadata Grid */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">{alert.title}</h2>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">{alert.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 mb-0.5">Source Microservice</div>
              <div className="text-white font-bold truncate">{alert.service}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 mb-0.5 font-bold text-cyan-400">Trigger Rule</div>
              <div className="text-cyan-400 font-bold truncate">{alert.ruleTriggered}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 mb-0.5">Assigned Analyst</div>
              <div className="text-purple-300 font-bold truncate">{alert.assignedTo || 'Unassigned'}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-slate-500 mb-0.5">Current Status</div>
              <Badge variant={alert.status === 'Resolved' ? 'success' : 'warn'} size="sm">
                {alert.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Triage Bar */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-slate-400 text-xs">
            Triage Workflow Actions:
          </div>

          <div className="flex items-center gap-2">
            {alert.status === 'Open' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAcknowledge(alert.id)}
                icon={<Eye className="w-3.5 h-3.5 text-cyan-400" />}
              >
                Acknowledge Alert
              </Button>
            )}

            {alert.status !== 'Investigating' && alert.status !== 'Resolved' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onInvestigate(alert.id)}
                icon={<RefreshCw className="w-3.5 h-3.5 text-purple-400" />}
              >
                Start Investigation
              </Button>
            )}

            {alert.status !== 'Resolved' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onResolve(alert.id)}
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Mark Alert Resolved
              </Button>
            )}
          </div>
        </div>

        {/* 1. Why Alert Triggered & AI Root Cause */}
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-2">
          <div className="text-xs text-cyan-400 uppercase tracking-wider font-bold">
            Why Was This Alert Triggered?
          </div>
          <p className="text-slate-200 font-sans text-xs leading-relaxed">
            Triggered by security rule <strong className="text-cyan-400">{alert.ruleTriggered}</strong>. Anomaly score evaluation on <strong className="text-white">{alert.service}</strong> matched suspicious parameter patterns requiring analyst intervention.
          </p>
        </div>

        {/* 2. AI Recommended Response Section */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Recommended SecOps Response Plan</span>
          </div>

          <p className="text-slate-200 font-sans text-xs leading-relaxed">
            {alert.aiRecommendedResponse}
          </p>

          {/* CLI Playbook Block */}
          {alert.cliPlaybook && (
            <div className="pt-2 space-y-2 border-t border-purple-900/60 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Automated CLI Remediation Script:</span>
                <button
                  onClick={handleCopyPlaybook}
                  className="flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-slate-950 border border-emerald-900/60 text-emerald-400 text-[11px] overflow-x-auto">
                {alert.cliPlaybook}
              </pre>

              <div className="flex justify-end pt-1">
                <Button
                  variant={executed ? 'secondary' : 'danger'}
                  size="md"
                  onClick={handleExecutePlaybook}
                  icon={<Play className="w-4 h-4" />}
                >
                  {executed ? 'Playbook Executed ✓' : 'Execute AI Remediation'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Related Correlated Event Preview */}
        {relatedEvent && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs text-cyan-400 uppercase tracking-wider font-bold">
              Correlated Incident Event Graph:
            </div>
            <div
              onClick={() => {
                onClose();
                if (onViewEvent) onViewEvent(relatedEvent.id);
              }}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer transition"
            >
              <div>
                <span className="text-purple-400 font-bold mr-2">[{relatedEvent.id}]</span>
                <span className="text-white font-bold">{relatedEvent.title}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {relatedEvent.occurrences} Log Lines • First Seen: {relatedEvent.firstSeen} • Last Seen: {relatedEvent.lastSeen}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        )}

        {/* 4. Related Raw Logs Cluster */}
        {relatedEvent?.relatedLogs && relatedEvent.relatedLogs.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Related Raw Log Cluster ({relatedEvent.relatedLogs.length} Entries)
            </div>

            <div className="p-3 rounded-xl bg-[#05080f] border border-slate-800 space-y-1.5 max-h-44 overflow-y-auto">
              {relatedEvent.relatedLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => {
                    setSelectedLog(log);
                    setCurrentRoute('logs');
                  }}
                  className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-900 hover:border-cyan-500/40 text-[11px] cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <span className="text-rose-400 font-bold mr-2">[{log.level}]</span>
                    <span className="text-cyan-400 mr-2">{log.method}</span>
                    <span className="text-slate-200">{log.endpoint}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0">IP: {log.ipAddress}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Incident Timeline */}
        <div className="space-y-3">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
            Incident Triage Timeline:
          </div>

          <div className="relative pl-6 space-y-2 border-l-2 border-slate-800">
            {alert.timeline?.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950" />
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-0.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-cyan-400 font-bold">{step.time}</span>
                    <span className="text-slate-500">{step.author}</span>
                  </div>
                  <div className="text-slate-200 font-sans text-xs">{step.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
