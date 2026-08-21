import React, { useState } from 'react';
import { Sparkles, Zap, CheckCircle2, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AiInsightsPanel: React.FC = () => {
  const { logs, events, alerts } = useApp();
  const [executedIds, setExecutedIds] = useState<string[]>([]);

  // Calculate stats from actual logs/events
  const categoryCounts: Record<string, number> = {};
  logs.forEach((log) => {
    const cat = log.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  let mostCommonCategory = logs.length > 0 ? 'General' : 'N/A';
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCatCount) {
      maxCatCount = count;
      mostCommonCategory = cat;
    }
  });

  const hasCritical = logs.some((l) => l.level === 'CRITICAL');
  const hasError = logs.some((l) => l.level === 'ERROR') || events.some((e) => e.severity === 'P2 High');
  const highestSeverity = logs.length > 0 ? (hasCritical ? 'CRITICAL (P1)' : hasError ? 'ERROR (P2)' : 'WARN (P3)') : 'N/A';

  const groupedIncidentsCount = events.length;

  // Generate insights ONLY from actual events and logs
  const insights = events.map((evt) => ({
    id: `ins-${evt.id}`,
    title: `INCIDENT ANALYSIS: ${evt.title}`,
    vector: `Vector: ${evt.category}`,
    severity: evt.severity,
    affected: evt.affectedService,
    summary: evt.aiRootCause || `Correlated ${evt.occurrences} log entries into threat incident timeline.`,
    actionLabel: evt.mitigationPlaybook ? 'Execute Containment Playbook' : 'Inspect Correlated Graph',
    script: evt.mitigationPlaybook || `govlog-cli events isolate --event-id "${evt.id}"`,
    badgeVariant: evt.severity.includes('P1') ? ('critical' as const) : ('warn' as const),
  }));

  const handleRunRemediation = (id: string) => {
    setExecutedIds((prev) => [...prev, id]);
  };

  return (
    <Card className="border border-purple-500/30 bg-[#0c121e]/90 p-4 rounded-xl font-mono text-xs space-y-3.5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
          <div>
            <h3 className="text-xs font-bold text-white font-sans uppercase tracking-wider">
              AI Security Intelligence & Playbooks
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Insights synthesized from active log stream & correlation matrix
            </p>
          </div>
        </div>

        <Badge variant="purple" size="sm" className="shrink-0 self-start sm:self-auto">
          AI Copilot Operational
        </Badge>
      </div>

      {/* Dynamic Summary Micro-KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Top Log Category</div>
          <div className="text-xs font-bold text-cyan-400 truncate mt-0.5 font-sans">{mostCommonCategory}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Highest Severity</div>
          <div className="text-xs font-bold text-rose-400 truncate mt-0.5 font-mono">{highestSeverity}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Correlated Events</div>
          <div className="text-xs font-bold text-purple-300 truncate mt-0.5 font-mono">{groupedIncidentsCount} Timelines</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Active Queue</div>
          <div className="text-xs font-bold text-amber-400 truncate mt-0.5 font-mono">{alerts.length} Alerts</div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3 pt-1">
        {insights.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center gap-1.5">
            <Sparkles className="w-6 h-6 text-purple-400/60 mb-1" />
            <span className="text-sm font-bold text-white">No AI security insights available yet.</span>
            <span className="text-slate-400 text-xs max-w-md">Upload a log file in Log Explorer to synthesize real-time threat insights and recommended playbooks.</span>
          </div>
        ) : (
          insights.map((ins) => {
            const isExecuted = executedIds.includes(ins.id);
            return (
              <div
                key={ins.id}
                className={`p-3.5 rounded-xl bg-slate-950 border transition-all space-y-2 ${
                  isExecuted
                    ? 'border-emerald-800/60 bg-emerald-950/20'
                    : ins.badgeVariant === 'critical'
                    ? 'border-rose-900/60 hover:border-rose-600/80'
                    : 'border-slate-800/80 hover:border-purple-500/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant={ins.badgeVariant} size="sm">
                        {ins.severity}
                      </Badge>
                      <span className="text-purple-300 font-semibold font-sans">{ins.vector}</span>
                      <span className="text-slate-400">• {ins.affected}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white font-sans">{ins.title}</h4>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">{ins.summary}</p>
                  </div>
                </div>

                {/* Remediation Bar */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] text-cyan-300 flex items-center gap-1.5 truncate">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate font-sans font-medium">Action: {ins.actionLabel}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <pre className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 text-[10px] font-mono truncate max-w-[260px] hidden lg:block border border-slate-800">
                      {ins.script}
                    </pre>

                    <Button
                      variant={isExecuted ? 'secondary' : 'primary'}
                      size="sm"
                      disabled={isExecuted}
                      onClick={() => handleRunRemediation(ins.id)}
                      icon={isExecuted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5" />}
                    >
                      {isExecuted ? 'Executed' : 'Execute Remediation'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
