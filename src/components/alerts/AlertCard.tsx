import React from 'react';
import { CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AlertItem } from '../../types/log';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AlertCardProps {
  alert: AlertItem;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const { resolveEventOrAlert, triggerRemediation } = useApp();

  const isResolved = alert.status === 'Resolved';
  const isP1 = alert.severity.includes('P1');

  return (
    <Card
      danger={isP1 && !isResolved}
      className={`bg-slate-900/90 border transition ${
        isResolved ? 'opacity-70 border-slate-800' : 'border-slate-800 hover:border-amber-500/40'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isP1 ? 'critical' : alert.severity.includes('P2') ? 'warn' : 'info'} size="sm">
              {alert.severity}
            </Badge>

            <Badge variant={isResolved ? 'success' : 'purple'} size="sm">
              {alert.status}
            </Badge>

            <span className="text-xs font-mono text-slate-400">{alert.timestamp}</span>

            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
              {alert.service}
            </span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">{alert.title}</h3>
          <p className="text-xs text-slate-300 font-sans">{alert.description}</p>

          <div className="text-[11px] font-mono text-slate-400 space-y-1">
            <div><strong className="text-slate-300">Rule Triggered:</strong> {alert.ruleTriggered}</div>
            {alert.actionTaken && (
              <div className="text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Action Taken: {alert.actionTaken}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="shrink-0 flex items-center gap-2">
          {!isResolved ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => triggerRemediation(alert.id)}
                icon={<Zap className="w-3.5 h-3.5" />}
              >
                Run AI Playbook
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => resolveEventOrAlert(alert)}
                icon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Mark Resolved
              </Button>
            </>
          ) : (
            <Badge variant="success" size="md">
              <CheckCircle className="w-3.5 h-3.5" />
              Resolved & Audited
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
