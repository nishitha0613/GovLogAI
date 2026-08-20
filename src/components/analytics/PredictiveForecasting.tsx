import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

export const PredictiveForecasting: React.FC = () => {
  const { logs, events } = useApp();

  const hasCritical = events.some((e) => e.severity.includes('P1'));

  return (
    <Card className="glass-panel-glow border border-purple-500/40 bg-slate-900/90 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-800/50 mb-4">
        <div>
          <div className="flex items-center gap-2 text-purple-300 font-mono text-xs font-bold uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Neural Predictive Forecasting</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight font-sans">
            Traffic Forecast & Proactive Anomaly Detection
          </h3>
        </div>

        {hasCritical ? (
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/60">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>High Risk Threat Vector Detected</span>
          </div>
        ) : (
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/60">
            <span>Standard SLA Operations</span>
          </div>
        )}
      </div>

      <div className="h-64 w-full font-mono text-xs flex items-center justify-center">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-sans">
            <Sparkles className="w-8 h-8 text-purple-400/60 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-300">No predictive forecast data available yet.</div>
            <div className="text-xs text-slate-500 mt-1">Upload a log file in Log Explorer to trigger neural traffic forecasting.</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={logs.map((l, i) => ({ time: l.timestamp.slice(11, 16) || `#${i+1}`, actual: 1, predicted: 1 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} name="Actual Traffic" />
              <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" name="AI Predicted" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
