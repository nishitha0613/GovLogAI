import React, { useState } from 'react';
import { Filter, Radio, LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricsOverview } from './MetricsOverview';
import { SystemHealthCards } from './SystemHealthCards';
import { DashboardCharts } from './DashboardCharts';
import { AiInsightsPanel } from './AiInsightsPanel';
import { RecentCriticalEventsTable } from './RecentCriticalEventsTable';
import { ThreatRadarMap } from './ThreatRadarMap';
import { EventDetailModal } from '../events/EventDetailModal';
import { AiLogInspector } from '../logs/AiLogInspector';

export const DashboardPage: React.FC = () => {
  const { liveStreaming, toggleLiveStreaming, services } = useApp();
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('ALL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  return (
    <div className="space-y-5">
      {/* Dashboard Control Toolbar */}
      <div className="bg-[#0c121e]/90 p-3.5 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-bold font-sans tracking-wide">
            Executive Command Center
          </span>
          <span className="text-[11px] text-slate-400 hidden lg:inline font-mono">
            • Sovereign Observability Matrix
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* E-Gov Service Filter */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedServiceFilter}
              onChange={(e) => setSelectedServiceFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Microservices</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            {(['1h', '24h', '7d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition cursor-pointer font-mono ${
                  selectedTimeframe === tf
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Live Stream Toggle */}
          <button
            onClick={toggleLiveStreaming}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition cursor-pointer ${
              liveStreaming
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveStreaming ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{liveStreaming ? 'STREAM: LIVE' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Cards */}
      <MetricsOverview />

      {/* 2. System Health Cards */}
      <SystemHealthCards />

      {/* 3. Charts */}
      <DashboardCharts />

      {/* 4. AI Insights Panel */}
      <AiInsightsPanel />

      {/* 5. Middle Grid: Recent Critical Events Table & Threat Origin Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentCriticalEventsTable />
        </div>
        <div>
          <ThreatRadarMap />
        </div>
      </div>

      {/* Interactive Modals */}
      <EventDetailModal />
      <AiLogInspector />
    </div>
  );
};
