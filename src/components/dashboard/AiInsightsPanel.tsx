import React, { useState } from 'react';
import { Sparkles, Zap, CheckCircle2, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AiInsightsPanel: React.FC = () => {
  const { logs, events, alerts } = useApp();
  const [executedIds, setExecutedIds] = useState<string[]>([]);

  // 1. Calculate Most Common Log Category
  const categoryCounts: Record<string, number> = {};
  logs.forEach((log) => {
    const cat = log.category || 'System Maintenance';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  let mostCommonCategory = 'API Security';
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCatCount) {
      maxCatCount = count;
      mostCommonCategory = cat;
    }
  });

  // 2. Highest Detected Severity
  const hasCritical = logs.some((l) => l.level === 'CRITICAL' || l.level === 'FATAL') || events.some((e) => e.severity === 'P1 Critical');
  const hasError = logs.some((l) => l.level === 'ERROR') || events.some((e) => e.severity === 'P2 High');
  const highestSeverity = hasCritical ? 'CRITICAL (P1)' : hasError ? 'ERROR (P2)' : 'WARN (P3)';

  // 3. Number of Grouped Incidents
  const groupedIncidentsCount = events.length;

  // 4. Recent Critical Event
  const recentCriticalEvent = events.find((e) => e.severity === 'P1 Critical') || events[0] || null;

  // Generate dynamic insights list
  const insights = [
    {
      id: 'ins-101',
      title: recentCriticalEvent
        ? `RECENT CRITICAL: ${recentCriticalEvent.title}`
        : 'CRITICAL: Biometric Extraction SQLi Attack Target on Border Gateway',
      vector: recentCriticalEvent ? `Category: ${recentCriticalEvent.category}` : 'OWASP A03:2021 SQL Injection / CWE-89',
      severity: recentCriticalEvent ? recentCriticalEvent.severity : 'P1 Critical',
      affected: recentCriticalEvent ? recentCriticalEvent.affectedService : 'Border Control & Visa Gateway',
      summary: recentCriticalEvent
        ? recentCriticalEvent.aiRootCause
        : 'Adversary IP 185.220.101.44 (Tor Exit Node) executed UNION SELECT query payload against passport lookup microservice.',
      actionLabel: 'Apply WAF Block & Scale Replicas',
      script: recentCriticalEvent?.mitigationPlaybook || 'govlog-cli waf block-ip 185.220.101.44 --duration 72h',
      badgeVariant: 'critical' as const,
    },
    {
      id: 'ins-102',
      title: `PATTERN DETECTED: Spike in ${mostCommonCategory} Log Stream`,
      vector: `Dominant Category: ${mostCommonCategory}`,
      severity: 'P2 High',
      affected: 'Multi-Microservice Cluster',
      summary: `${mostCommonCategory} accounts for ${Math.round((maxCatCount / (logs.length || 1)) * 100)}% of all ingested log entries. Pattern analysis recommends adjusting rate limits.`,
      actionLabel: `Enforce ${mostCommonCategory} Rate Policy`,
      script: `govlog-cli policy enforce --category "${mostCommonCategory}" --rate 500r/m`,
      badgeVariant: 'warn' as const,
    },
    {
      id: 'ins-103',
      title: `CORRELATION SUMMARY: ${groupedIncidentsCount} Synthesized Incident Groups`,
      vector: `Log-to-Event Correlation: ${Math.round((logs.length || 1) / (groupedIncidentsCount || 1))}:1 Ratio`,
      severity: 'P3 Medium',
      affected: `${alerts.length} Active Alerts Triggered`,
      summary: `GovLogAI correlation engine grouped ${logs.length} raw log lines into ${groupedIncidentsCount} security event timelines with ${highestSeverity} maximum severity.`,
      actionLabel: 'Review Correlated Attack Graph',
      script: 'govlog-cli events export --format json --output incident_summary.json',
      badgeVariant: 'purple' as const,
    },
  ];

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
              AI Security Intelligence & Automated Playbooks
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Context-driven insights synthesized from live log stream & correlation matrix
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
        {insights.map((ins) => {
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
        })}
      </div>
    </Card>
  );
};
