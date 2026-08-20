import React from 'react';
import { Filter, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AnalyticsFilterBarProps {
  timeframe: string;
  setTimeframe: (tf: string) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (severity: string) => void;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  timeframe,
  setTimeframe,
  selectedService,
  setSelectedService,
  selectedSeverity,
  setSelectedSeverity,
}) => {
  const { services } = useApp();

  const timeframes = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <div>
          <h1 className="text-sm font-bold text-white uppercase tracking-wide">
            Sovereign System Log & Incident Analytics Engine
          </h1>
          <p className="text-slate-400 text-xs font-sans">
            Deep statistical correlation, latency percentiles, and AI pattern insights.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Service Selector */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All E-Gov Microservices</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Selector */}
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="ALL">All Severities</option>
          <option value="P1 Critical">P1 Critical</option>
          <option value="P2 High">P2 High</option>
          <option value="P3 Medium">P3 Medium</option>
          <option value="P4 Low">P4 Low</option>
        </select>

        {/* Date Range Pills */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded transition cursor-pointer text-[11px] ${
                timeframe === tf
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
