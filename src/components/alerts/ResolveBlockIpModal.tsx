import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ShieldOff, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ResolveBlockIpModal: React.FC = () => {
  const { resolveIpPrompt, closeResolveIpPrompt, blockIp } = useApp();
  const [blockedNotification, setBlockedNotification] = useState<string | null>(null);

  if (!resolveIpPrompt || !resolveIpPrompt.isOpen) {
    return null;
  }

  const handleSimulatedBlockIp = () => {
    const ipToBlock = resolveIpPrompt.ip || '192.168.10.45';
    blockIp(ipToBlock, `Blocked following CRITICAL event resolution: ${resolveIpPrompt.title}`);
    setBlockedNotification(`Simulated WAF Block: IP ${ipToBlock} added to WAF blocklist.`);
    
    setTimeout(() => {
      setBlockedNotification(null);
      closeResolveIpPrompt();
    }, 1800);
  };

  const handleKeepIp = () => {
    closeResolveIpPrompt();
  };

  return (
    <Modal
      isOpen={resolveIpPrompt.isOpen}
      onClose={closeResolveIpPrompt}
      title={
        <div className="flex items-center gap-2 text-white font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Issue Resolved</span>
        </div>
      }
      maxWidth="md"
    >
      <div className="space-y-5 font-mono text-xs text-slate-200">
        {/* Blocked Toast Alert */}
        {blockedNotification ? (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 space-y-2 text-center animate-fade-in font-sans">
            <div className="flex items-center justify-center gap-2 font-bold text-sm">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>{blockedNotification}</span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              (Simulated Block - Local Air-Gap Sandbox)
            </p>
          </div>
        ) : (
          <>
            {/* Resolution Confirmation Header */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Security Incident Resolved Successfully</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Incident <strong className="text-white font-mono">{resolveIpPrompt.targetId}</strong> ({resolveIpPrompt.title}) has been marked as resolved.
              </p>
            </div>

            {/* IP Block Prompt Callout */}
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-3 font-sans">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Administrator Confirmation Required</span>
              </div>

              <p className="text-white text-sm font-semibold leading-relaxed">
                Issue resolved. Do you want to block the source IP <span className="text-rose-400 font-mono font-bold bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">{resolveIpPrompt.ip || '192.168.10.45'}</span>?
              </p>

              <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                ⚠️ Note: This action performs a <strong className="text-amber-300">Simulated Block</strong> on the WAF firewall rule engine in your local air-gapped environment.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 font-mono">
              <Button
                variant="secondary"
                size="md"
                onClick={handleKeepIp}
                icon={<ShieldOff className="w-4 h-4 text-slate-400" />}
              >
                Keep IP / No
              </Button>

              <Button
                variant="danger"
                size="md"
                onClick={handleSimulatedBlockIp}
                icon={<ShieldAlert className="w-4 h-4" />}
              >
                Simulated Block IP
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
