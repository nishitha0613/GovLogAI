import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  Search, 
  Terminal, 
  ArrowRight,
  Eye,
  Check,
  Trash2,
  X,
  HelpCircle,
  Shield,
  Sparkles,
  Clock,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { SecurityEvent, EventSeverity } from '../../types/log';

import { computePredictiveThreatScore } from '../../utils/threatScore';
import { ResolveBlockIpModal } from './ResolveBlockIpModal';

export const SecurityAlertsPage: React.FC = () => {
  const { 
    logs,
    events, 
    alerts, 
    resolveAlert, 
    dismissAlert, 
    dismissEvent, 
    setCurrentRoute,
    triggerRemediation,
    isIpBlocked
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'P1' | 'P2' | 'P3' | 'resolved'>('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [inspectModalItem, setInspectModalItem] = useState<SecurityEvent | null>(null);
  const [playbookExecuting, setPlaybookExecuting] = useState(false);
  const [playbookExecuted, setPlaybookExecuted] = useState(false);

  // Severity Rank Weighting (Critical > High > Medium > Low)
  const getSeverityRank = (severity: EventSeverity): number => {
    if (severity.includes('P1') || severity.includes('Critical')) return 1;
    if (severity.includes('P2') || severity.includes('High')) return 2;
    if (severity.includes('P3') || severity.includes('Medium')) return 3;
    if (severity.includes('P4') || severity.includes('Low')) return 4;
    return 5;
  };

  // Combine actionable security events and threat alerts cleanly
  const actionableThreats: Array<{
    id: string;
    type: 'event' | 'alert';
    severity: EventSeverity;
    threatTitle: string;
    reasonForDetection: string;
    timestamp: string;
    source: string;
    threatIp: string;
    status: 'New' | 'Investigating' | 'Resolved' | 'Dismissed';
    playbook?: string;
    rawEvent?: SecurityEvent;
  }> = [];

  // Map actionable security events
  events.forEach((evt) => {
    let statusFormatted: 'New' | 'Investigating' | 'Resolved' | 'Dismissed' = 'New';
    if (evt.status === 'Resolved' || evt.status === 'Mitigated') statusFormatted = 'Resolved';
    else if (evt.status === 'Investigating') statusFormatted = 'Investigating';

    actionableThreats.push({
      id: evt.id,
      type: 'event',
      severity: evt.severity,
      threatTitle: evt.title,
      reasonForDetection: evt.xaiExplanation || evt.whyGroupedExplanation || evt.aiRootCause || `Flagged because ${evt.occurrences || 1} security log entries matched threat vector "${evt.category}".`,
      timestamp: evt.timestamp || `${evt.firstSeen} - ${evt.lastSeen}`,
      source: evt.affectedService,
      threatIp: evt.threatActorIp || 'Internal / Unspecified IP',
      status: statusFormatted,
      playbook: evt.mitigationPlaybook,
      rawEvent: evt,
    });
  });

  // Map actionable alerts
  alerts.forEach((alt) => {
    const isMappedToEvent = events.some(e => e.id === alt.relatedEventId || e.id === alt.id);
    if (!isMappedToEvent) {
      let statusFormatted: 'New' | 'Investigating' | 'Resolved' | 'Dismissed' = 'New';
      if (alt.status === 'Resolved') statusFormatted = 'Resolved';
      else if (alt.status === 'Investigating') statusFormatted = 'Investigating';

      actionableThreats.push({
        id: alt.id,
        type: 'alert',
        severity: alt.severity,
        threatTitle: alt.title,
        reasonForDetection: alt.description.startsWith('Flagged because') ? alt.description : `Flagged because automated security rule '${alt.ruleTriggered}' was triggered on ${alt.service}.`,
        timestamp: alt.timestamp,
        source: alt.service,
        threatIp: 'Internal / Unspecified IP',
        status: statusFormatted,
        playbook: alt.cliPlaybook,
      });
    }
  });

  // Prioritize Critical and High severity events at top
  actionableThreats.sort((a, b) => getSeverityRank(a.severity) - getSeverityRank(b.severity));

  // Filter based on active tab and query
  const filteredThreats = actionableThreats.filter((item) => {
    if (activeTab === 'P1' && (!item.severity.includes('P1') && !item.severity.includes('Critical'))) return false;
    if (activeTab === 'P2' && (!item.severity.includes('P2') && !item.severity.includes('High'))) return false;
    if (activeTab === 'P3' && (!item.severity.includes('P3') && !item.severity.includes('Medium'))) return false;
    if (activeTab === 'resolved' && item.status !== 'Resolved') return false;

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return (
        item.threatTitle.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.reasonForDetection.toLowerCase().includes(q) ||
        item.severity.toLowerCase().includes(q) ||
        item.threatIp.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const p1Count = actionableThreats.filter(i => (i.severity.includes('P1') || i.severity.includes('Critical')) && i.status !== 'Resolved').length;
  const p2Count = actionableThreats.filter(i => (i.severity.includes('P2') || i.severity.includes('High')) && i.status !== 'Resolved').length;
  const p3Count = actionableThreats.filter(i => (i.severity.includes('P3') || i.severity.includes('Medium')) && i.status !== 'Resolved').length;
  const activeCount = actionableThreats.filter(i => i.status === 'New' || i.status === 'Investigating').length;
  const resolvedCount = actionableThreats.filter(i => i.status === 'Resolved').length;

  // Deterministic Predictive Threat Score (0-100) based strictly on active unresolved security threats
  const threatScoreResult = computePredictiveThreatScore(actionableThreats);
  const overallThreatScore = threatScoreResult.score;
  const threatScoreExplanation = threatScoreResult.explanation;

  // Real Operational ROI Metrics derived strictly from logs
  const totalLogs = logs.length;
  const hoursSaved = (totalLogs * 0.5 / 60).toFixed(1);
  const falsePositivesFiltered = totalLogs > 0 ? Math.max(0, totalLogs - p1Count) : 0;

  // Problem & Security Severity Distribution Pie Chart Data (CRITICAL, HIGH, MEDIUM only)
  const criticalProblemCount = logs.filter(l => l.level === 'CRITICAL' || l.level === 'FATAL').length;
  const highProblemCount = logs.filter(l => l.level === 'ERROR').length;
  const mediumProblemCount = logs.filter(l => l.level === 'WARN').length;
  const totalProblemLogs = criticalProblemCount + highProblemCount + mediumProblemCount;

  const problemSeverityData = totalProblemLogs > 0 ? [
    { name: 'CRITICAL', count: criticalProblemCount, color: '#f43f5e' },
    { name: 'HIGH', count: highProblemCount, color: '#f97316' },
    { name: 'MEDIUM', count: mediumProblemCount, color: '#f59e0b' },
  ].filter(item => item.count > 0) : [];

  const handleResolve = (id: string) => {
    resolveAlert(id);
  };

  const handleDismiss = (id: string, type: 'event' | 'alert') => {
    if (type === 'alert') {
      dismissAlert(id);
    } else {
      dismissEvent(id);
    }
  };

  const handleExecutePlaybook = () => {
    setPlaybookExecuting(true);
    setTimeout(() => {
      setPlaybookExecuting(false);
      setPlaybookExecuted(true);
      if (inspectModalItem) {
        triggerRemediation(inspectModalItem.id);
        resolveAlert(inspectModalItem.id);
      }
    }, 1200);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-5 font-sans">
      {/* 1. Summary Cards (Live Threat Score & Active Alerts) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 font-mono text-xs">
        <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 font-sans text-xs font-medium">Live Threat Score</div>
              <div className={`text-2xl font-extrabold mt-0.5 ${overallThreatScore > 85 ? 'text-rose-400' : overallThreatScore > 65 ? 'text-orange-400' : overallThreatScore > 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {overallThreatScore} / 100
              </div>
              <div className="text-xs font-bold text-white font-sans mt-0.5">
                {threatScoreResult.riskLevel}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-sans border-t border-slate-800/60 pt-1.5 leading-tight font-medium">
            {threatScoreExplanation}
          </div>
        </Card>

        <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-slate-400 font-sans text-xs font-medium">Active Security Alerts</div>
            <div className="text-2xl font-extrabold text-white mt-1">{activeCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
            <Flame className="w-5 h-5" />
          </div>
        </Card>

        <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-slate-400 font-sans text-xs font-medium">Critical Threats</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{p1Count}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </Card>

        <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-slate-400 font-sans text-xs font-medium">Resolved / Mitigated</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{resolvedCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* 2. Middle Row: Problem Severity Distribution Pie Chart & Operational ROI Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Severity Distribution Pie Chart (CRITICAL, HIGH, MEDIUM Security Concerns Only) */}
        <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-5 rounded-xl space-y-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase font-sans tracking-wide">
                Security Incident Severity Distribution
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{totalProblemLogs} Issue Logs</span>
          </div>

          <div className="h-60 w-full flex items-center justify-center font-mono text-xs">
            {totalProblemLogs === 0 ? (
              <div className="text-center py-8 text-slate-500 font-sans space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-emerald-300">No security issues detected.</div>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  No Critical, High, or Medium severity problem logs have been logged in the active buffer.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={problemSeverityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {problemSeverityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Quantifiable Security ROI Metrics */}
        <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-5 rounded-xl space-y-4 font-mono text-xs shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase font-sans tracking-wide">
                Quantifiable Operational Security ROI
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">Live Telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
              <div className="text-slate-400 font-sans text-xs">Analyst Hours Saved</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{hoursSaved} Hours</div>
              <div className="text-[10px] text-slate-500 mt-1">Calculated from 30s manual triage baseline</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
              <div className="text-slate-400 font-sans text-xs">Noise Signals Avoided</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{falsePositivesFiltered.toLocaleString()} Entries</div>
              <div className="text-[10px] text-slate-500 mt-1">Automated signal noise reduction</div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Actionable Security Incidents Table Card */}
      <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-5 rounded-xl space-y-4 shadow-sm">
        {/* Header & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase font-sans tracking-wide">
              Actionable Security Incidents & Threat Response Queue
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All ({actionableThreats.length})
              </button>
              <button
                onClick={() => setActiveTab('P1')}
                className={`px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer ${
                  activeTab === 'P1'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Critical ({p1Count})
              </button>
              <button
                onClick={() => setActiveTab('P2')}
                className={`px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer ${
                  activeTab === 'P2'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                High ({p2Count})
              </button>
              <button
                onClick={() => setActiveTab('P3')}
                className={`px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer ${
                  activeTab === 'P3'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Medium ({p3Count})
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`px-3 py-1.5 rounded-lg transition font-semibold cursor-pointer ${
                  activeTab === 'resolved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Resolved ({resolvedCount})
              </button>
            </div>

            <div className="relative w-full sm:w-60 font-mono text-xs">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search threat, IP, source..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Clean Empty State or Focused Table */}
        {filteredThreats.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3 font-sans">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="text-base font-bold text-slate-300">
              No actionable security threats or alerts detected yet.
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Upload a log file in Log Explorer to scan for threat vectors, SAML anomalies, SQL injection probes, and failed authentication spikes.
            </p>
            <button
              onClick={() => setCurrentRoute('logs')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              <span>Scan Logs in Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-slate-950/60">
                  <th className="py-3 px-3.5">Threat / Incident</th>
                  <th className="py-3 px-3.5">Severity</th>
                  <th className="py-3 px-3.5 min-w-[290px]">
                    <span className="flex items-center gap-1.5">
                      <span>Reason for Detection ("Why Flagged?")</span>
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    </span>
                  </th>
                  <th className="py-3 px-3.5">Source & IP</th>
                  <th className="py-3 px-3.5">Timestamp</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs font-sans">
                {filteredThreats.map((item) => {
                  const isCritical = item.severity.includes('P1') || item.severity.includes('Critical');
                  const isHigh = item.severity.includes('P2') || item.severity.includes('High');
                  const isResolved = item.status === 'Resolved';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-900/60 transition ${
                        isCritical ? 'bg-rose-950/10' : isHigh ? 'bg-amber-950/5' : ''
                      }`}
                    >
                      {/* Threat / Incident */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-white text-xs">{item.threatTitle}</div>
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{item.id}</div>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-mono">
                        <Badge
                          variant={isCritical ? 'critical' : isHigh ? 'warn' : 'info'}
                          size="sm"
                        >
                          {item.severity}
                        </Badge>
                      </td>

                      {/* Reason for Detection ("Why was this flagged?") */}
                      <td className="py-3.5 px-3.5">
                        <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-sans shadow-inner">
                          <strong className="text-cyan-400 font-mono text-[10px] block mb-0.5 uppercase tracking-wide">
                            Why Flagged:
                          </strong>
                          {item.reasonForDetection}
                        </div>
                      </td>

                      {/* Source & IP */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-mono">
                        <div className="font-bold text-cyan-300 text-xs">{item.source}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <span>IP: {item.threatIp}</span>
                          {isIpBlocked(item.threatIp) && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-bold font-mono">
                              Blocked (Simulated)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                        {item.timestamp}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-mono">
                        <Badge
                          variant={isResolved ? 'success' : isCritical ? 'critical' : 'purple'}
                          size="sm"
                          pulse={!isResolved && isCritical}
                        >
                          {item.status}
                        </Badge>
                      </td>

                      {/* Actions: Investigate, Resolve, Dismiss */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap text-right font-mono">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Investigate */}
                          <button
                            onClick={() => {
                              if (item.rawEvent) {
                                setInspectModalItem(item.rawEvent);
                                setPlaybookExecuted(false);
                              } else {
                                setCurrentRoute('logs');
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Investigate Security Incident Timeline & CLI Playbook"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Investigate</span>
                          </button>

                          {/* Resolve */}
                          {!isResolved && (
                            <button
                              onClick={() => handleResolve(item.id)}
                              className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Mark Incident as Resolved"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Resolve</span>
                            </button>
                          )}

                          {/* Dismiss */}
                          <button
                            onClick={() => handleDismiss(item.id, item.type)}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/60 text-[11px] transition cursor-pointer"
                            title="Dismiss Threat Alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Dismiss</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Investigation Modal */}
      {inspectModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c121e] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative font-sans">
            <button
              onClick={() => setInspectModalItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Badge variant="critical" size="md">
                {inspectModalItem.severity}
              </Badge>
              <span className="text-xs font-mono text-cyan-400">{inspectModalItem.id}</span>
            </div>

            <h3 className="text-lg font-bold text-white font-sans">{inspectModalItem.title}</h3>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
              <div className="text-slate-400">Target Microservice: <strong className="text-cyan-400">{inspectModalItem.affectedService}</strong></div>
              <div className="text-slate-400">Threat IP Origin: <strong className="text-rose-400">{inspectModalItem.threatActorIp || 'Internal / Unspecified IP'}</strong></div>
              <div className="text-slate-400">Time Window: <span>{inspectModalItem.firstSeen} - {inspectModalItem.lastSeen}</span></div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Why Was This Flagged? (Explainable AI - XAI)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800 font-medium">
                {inspectModalItem.xaiExplanation || inspectModalItem.whyGroupedExplanation || inspectModalItem.aiRootCause}
              </p>
            </div>

            {inspectModalItem.mitigationPlaybook && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Automated CLI Remediation Playbook</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                  <code>$ {inspectModalItem.mitigationPlaybook}</code>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {playbookExecuted ? (
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Playbook Executed & Threat Mitigated</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleExecutePlaybook}
                      disabled={playbookExecuting}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className={`w-4 h-4 ${playbookExecuting ? 'animate-spin' : ''}`} />
                      <span>{playbookExecuting ? 'Executing CLI Playbook...' : 'Execute Auto-Remediation Playbook'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Administrator CRITICAL Event Resolve -> Block IP Confirmation Modal */}
      <ResolveBlockIpModal />
    </div>
  );
};
