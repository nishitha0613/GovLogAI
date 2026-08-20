import React from 'react';
import { Search, Filter, Radio, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { LogLevel } from '../../types/log';

interface LogFiltersProps {
  selectedLevel: LogLevel | 'ALL';
  setSelectedLevel: (level: LogLevel | 'ALL') => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  selectedStatusCode: string;
  setSelectedStatusCode: (code: string) => void;
  availableServices?: string[];
}

export const LogFilters: React.FC<LogFiltersProps> = ({
  selectedLevel,
  setSelectedLevel,
  selectedService,
  setSelectedService,
  availableServices = [],
}) => {
  const { searchQuery, setSearchQuery, liveStreaming, toggleLiveStreaming, services } = useApp();

  const levels: (LogLevel | 'ALL')[] = ['ALL', 'INFO', 'WARN', 'ERROR', 'CRITICAL', 'FATAL'];
  const serviceOptions = availableServices.length > 0
    ? availableServices
    : services.map(s => s.name);

  return (
    <div className="bg-[#0c121e]/90 p-3.5 rounded-xl border border-slate-800/80 space-y-3 shadow-sm">
      {/* Search Input Bar & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter logs by keyword, IP address, payload query..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-9 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={toggleLiveStreaming}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer ${
              liveStreaming
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveStreaming ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{liveStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Microservices</option>
            {serviceOptions.map((svc) => (
              <option key={svc} value={svc}>
                {svc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Level Pills & Quick Syntax Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-slate-500 mr-1 text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Level:
          </span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2 py-0.5 rounded transition text-xs font-medium cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Preset Syntax Quick Filters */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 overflow-x-auto">
          <span className="text-slate-500">Quick Filters:</span>
          <button
            onClick={() => setSearchQuery('CRITICAL')}
            className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 hover:bg-rose-900/80 transition"
          >
            SQLi / Exploit
          </button>
          <button
            onClick={() => setSearchQuery('429')}
            className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 hover:bg-amber-900/80 transition"
          >
            Rate Limited 429
          </button>
          <button
            onClick={() => setSearchQuery('500')}
            className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 hover:bg-purple-900/80 transition"
          >
            DB Exhaustion 500
          </button>
        </div>
      </div>
    </div>
  );
};
