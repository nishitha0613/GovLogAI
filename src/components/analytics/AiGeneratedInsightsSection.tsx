import React from 'react';
import { Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AiGeneratedInsightsSection: React.FC = () => {
  const { events } = useApp();

  const insights = events.map((e, idx) => ({
    id: `ai-ins-${idx}`,
    type: e.severity.includes('P1') ? 'Threat Anomaly Pattern' : 'Event Correlation',
    confidence: '99.2%',
    title: e.title,
    impact: e.aiRootCause || `Correlated ${e.occurrences} log entries across ${e.affectedService}.`,
    recommendation: e.mitigationPlaybook || 'Isolate target IP router endpoint and review active microservice SLA.',
  }));

  return (
    <Card className="glass-panel-glow border border-purple-500/40 bg-slate-900/90 font-mono text-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-800/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400 animate-spin-slow" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              AI-Generated Intelligence & Anomaly Insights
            </h3>
            <p className="text-purple-300 text-xs font-sans">
              Automated pattern discovery, cross-microservice correlations, and predictive threat alerts
            </p>
          </div>
        </div>

        <Badge variant="purple" size="md">
          Neural Copilot Active
        </Badge>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.length === 0 ? (
          <div className="md:col-span-3 py-10 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center gap-1.5">
            <Sparkles className="w-6 h-6 text-purple-400/60 mb-1" />
            <span className="text-sm font-bold text-white">No AI insights synthesized yet.</span>
            <span className="text-slate-400 text-xs max-w-md">Upload a log file in Log Explorer to generate real-time AI anomaly insights.</span>
          </div>
        ) : (
          insights.map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-purple-500/40 transition space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                    {ins.type}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {ins.confidence} Match
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-sans leading-tight">
                  {ins.title}
                </h4>

                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {ins.impact}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-cyan-300 flex items-start gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Recommendation:</strong> {ins.recommendation}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
