import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Copy, Check, Code, Play, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AiLogInspector: React.FC = () => {
  const { selectedLog, setSelectedLog } = useApp();
  const [copied, setCopied] = useState(false);
  const [executed, setExecuted] = useState(false);

  if (!selectedLog) return null;

  const handleCopyScript = () => {
    if (selectedLog.mitigationScript) {
      navigator.clipboard.writeText(selectedLog.mitigationScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExecuteRemediation = () => {
    setExecuted(true);
    setTimeout(() => setExecuted(false), 3000);
  };

  return (
    <Modal
      isOpen={!!selectedLog}
      onClose={() => setSelectedLog(null)}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>GovLogAI Neural Log Inspector</span>
          <Badge variant={selectedLog.level === 'CRITICAL' ? 'critical' : 'info'} size="sm">
            {selectedLog.level}
          </Badge>
        </div>
      }
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top AI Summary Callout */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-purple-300 font-bold">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Neural Threat Analysis
            </span>
            <span>Anomaly Score: {selectedLog.anomalyScore}%</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {selectedLog.aiSummary || 'Automated log analyzer completed signature inspection.'}
          </p>
          {selectedLog.threatVector && (
            <div className="pt-2 text-xs font-mono text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Threat Vector: {selectedLog.threatVector}</span>
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500 mb-0.5">Service Endpoint</div>
            <div className="text-white font-bold truncate">{selectedLog.service}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500 mb-0.5">HTTP Method & Code</div>
            <div className="text-cyan-400 font-bold">
              {selectedLog.method} • Status {selectedLog.statusCode}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500 mb-0.5">Source IP / Location</div>
            <div className="text-slate-200 font-semibold truncate">{selectedLog.ipAddress}</div>
            <div className="text-[10px] text-slate-400 truncate">{selectedLog.location}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500 mb-0.5">Response Time</div>
            <div className="text-emerald-400 font-bold">{selectedLog.responseTimeMs} ms</div>
          </div>
        </div>

        {/* JSON Payload Code Block */}
        {selectedLog.payloadJson && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-cyan-400" />
                Raw Request Payload JSON:
              </span>
            </div>
            <pre className="p-4 rounded-xl bg-[#060a12] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-48">
              {selectedLog.payloadJson}
            </pre>
          </div>
        )}

        {/* Auto Generated Mitigation Script */}
        {selectedLog.mitigationScript && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Zap className="w-4 h-4" />
                Auto-Generated GovLogAI Mitigation Playbook CLI:
              </span>

              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-emerald-900/60 text-xs font-mono text-emerald-400 overflow-x-auto">
              {selectedLog.mitigationScript}
            </pre>

            <div className="flex justify-end pt-2">
              <Button
                variant={executed ? 'secondary' : 'danger'}
                size="md"
                onClick={handleExecuteRemediation}
                icon={<Play className="w-4 h-4" />}
              >
                {executed ? 'Remediation Playbook Executed ✓' : 'Execute Mitigation Playbook Now'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
