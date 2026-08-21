import React from 'react';
import { ShieldAlert, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const IpBlockModal: React.FC = () => {
  const { ipBlockPrompt, confirmIpBlock, blockToastMessage, dismissBlockToast } = useApp();

  return (
    <>
      {/* 1. CRITICAL Event Resolve -> Block Confirmation Modal */}
      {ipBlockPrompt && ipBlockPrompt.isOpen && (
        <Modal
          isOpen={true}
          onClose={() => confirmIpBlock(false)}
          title={
            <div className="flex items-center gap-2 text-rose-400 font-mono">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Critical Issue Resolved: Administrator Action Required</span>
            </div>
          }
          maxWidth="md"
        >
          <div className="space-y-5 font-mono text-xs">
            {/* Prompt Question Callout */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                Source Incident: {ipBlockPrompt.sourceTitle}
              </div>
              <h3 className="text-sm font-bold text-white leading-snug font-sans">
                Issue resolved. Do you want to block the source IP{' '}
                <span className="text-rose-400 font-mono text-sm px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800">
                  {ipBlockPrompt.ipAddress}
                </span>
                ?
              </h3>
            </div>

            {/* Simulated Block Explanation Note */}
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simulated Block Notice:</span>
              </div>
              <p className="font-sans text-slate-300 leading-relaxed">
                Selecting <strong>Block IP</strong> will create a simulated WAF firewall rule blocking future ingress traffic from <code>{ipBlockPrompt.ipAddress}</code>. Selecting <strong>Keep IP / No</strong> will keep the IP unblocked.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <Button
                variant="secondary"
                size="md"
                onClick={() => confirmIpBlock(false)}
              >
                Keep IP / No
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => confirmIpBlock(true)}
                icon={<ShieldAlert className="w-4 h-4" />}
              >
                Block IP
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 2. Toast Feedback Banner for Simulated IP Block */}
      {blockToastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-700/80 text-emerald-200 shadow-2xl flex items-center gap-3 font-mono text-xs animate-bounce-short">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-xs">{blockToastMessage}</div>
            <div className="text-[10px] text-emerald-300 font-sans">Action logged to SecOps WAF Audit Trail.</div>
          </div>
          <button
            onClick={dismissBlockToast}
            className="p-1 rounded hover:bg-emerald-900 text-emerald-400 hover:text-white transition ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};
