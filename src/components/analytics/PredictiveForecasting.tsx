import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockPredictiveForecast } from '../../data/mockAnalytics';

export const PredictiveForecasting: React.FC = () => {
  return (
    <Card className="glass-panel-glow border border-purple-500/40 bg-slate-900/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-800/50 mb-4">
        <div>
          <div className="flex items-center gap-2 text-purple-300 font-mono text-xs font-bold uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Neural Predictive Forecasting</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            12-Hour Traffic Forecast & Proactive Attack Probability
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/60">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Predicted DDoS Spike at 19:00 (88% Prob)</span>
        </div>
      </div>

      <div className="h-64 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockPredictiveForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
            <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} name="Actual Traffic" />
            <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" name="AI Predicted Traffic" />
            <Line type="monotone" dataKey="anomalyProbability" stroke="#f43f5e" strokeWidth={2} name="Attack Risk %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs font-mono text-slate-300 flex items-center justify-between">
        <span>AI Action Recommendation: Pre-scale Tax Gateway K8s Pods by +8 replicas prior to 18:30.</span>
        <button className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition">
          Approve Auto-Scale
        </button>
      </div>
    </Card>
  );
};
