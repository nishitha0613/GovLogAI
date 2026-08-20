import React from 'react';
import { Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { mockAiGeneratedInsights } from '../../data/mockAnalytics';

export const AiGeneratedInsightsSection: React.FC = () => {
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
        {mockAiGeneratedInsights.map((ins) => (
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
        ))}
      </div>
    </Card>
  );
};
