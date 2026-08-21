import React, { useState } from 'react';
import { Sparkles, ShieldAlert, ShieldCheck, AlertTriangle, RefreshCw, Copy, Check, Code, Play, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AiLogInspector: React.FC = () => {
  const { selectedLog, setSelectedLog, tamperWithLog, recalculateAndSignChain } = useApp();

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

        {/* Cryptographic Audit Trail Inspector Card */}
        <div className={`p-4 rounded-xl border font-mono space-y-4 ${
          selectedLog.isTampered
            ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
            : 'bg-slate-900/90 border-emerald-900/60 text-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
              {selectedLog.isTampered ? (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span>Cryptographic Audit Trail & SHA-256 Hash Chain</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                selectedLog.isTampered
                  ? 'bg-rose-900/80 text-rose-300 border border-rose-700'
                  : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
              }`}>
                {selectedLog.isTampered ? 'TAMPERED / CHAIN BROKEN' : 'VERIFIED (TAMPER-PROOF)'}
              </span>
            </div>
          </div>

          {/* Mismatch Warning Alert if Tampered */}
          {selectedLog.isTampered && (
            <div className="p-3 rounded-lg bg-rose-950 border border-rose-800 text-xs text-rose-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Audit Chain Integrity Warning:</span>
              </div>
              <p className="font-sans text-rose-200/90">
                {selectedLog.tamperReason || 'Log event message payload does not match stored SHA-256 signature block.'}
              </p>
            </div>
          )}

          {/* Hashes Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[11px] font-bold uppercase flex items-center justify-between">
                <span>Current SHA-256 Block Hash:</span>
                <button
                  onClick={() => {
                    if (selectedLog.hash) navigator.clipboard.writeText(selectedLog.hash);
                  }}
                  className="text-cyan-400 hover:text-white text-[10px]"
                >
                  Copy
                </button>
              </div>
              <div className="text-emerald-400 font-mono text-[11px] break-all select-all font-semibold">
                {selectedLog.hash || 'SHA256-PENDING'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[11px] font-bold uppercase flex items-center justify-between">
                <span>Previous Block Hash (prevHash):</span>
                <button
                  onClick={() => {
                    if (selectedLog.prevHash) navigator.clipboard.writeText(selectedLog.prevHash);
                  }}
                  className="text-cyan-400 hover:text-white text-[10px]"
                >
                  Copy
                </button>
              </div>
              <div className="text-cyan-400 font-mono text-[11px] break-all select-all font-semibold">
                {selectedLog.prevHash || '0000000000000000000000000000000000000000000000000000000000000000'}
              </div>
            </div>
          </div>

          {/* Payload String Input */}
          <div className="text-[11px] text-slate-400 space-y-1">
            <div className="text-slate-400 font-bold">Cryptographic Payload Input Stream:</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-slate-300 text-[10px] break-all">
              {`${selectedLog.prevHash || 'GENESIS'}|${selectedLog.id}|${selectedLog.timestamp}|${selectedLog.message}`}
            </div>
          </div>

          {/* Interactive Test Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Audit Engine Interactive Controls:</span>
            <div className="flex items-center gap-2">
              {!selectedLog.isTampered ? (
                <button
                  onClick={() => tamperWithLog(selectedLog.id)}
                  className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] transition flex items-center gap-1 cursor-pointer"
                  title="Simulate unauthorized message edit to test tamper detection"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Simulate Log Tampering
                </button>
              ) : (
                <button
                  onClick={recalculateAndSignChain}
                  className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[11px] transition flex items-center gap-1 cursor-pointer"
                  title="Re-sign cryptographic hash chain and restore verified status"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  Re-Sign Hash Chain
                </button>
              )}
            </div>
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
