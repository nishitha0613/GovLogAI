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
}

export const LogFilters: React.FC<LogFiltersProps> = ({
  selectedLevel,
  setSelectedLevel,
  selectedService,
  setSelectedService,
}) => {
  const { searchQuery, setSearchQuery, liveStreaming, toggleLiveStreaming, services } = useApp();

  const levels: (LogLevel | 'ALL')[] = ['ALL', 'INFO', 'WARN', 'ERROR', 'CRITICAL', 'FATAL'];

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
      {/* Search Input Bar & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter logs by keyword, IP address, payload query (e.g., status:500 service:tax)..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={toggleLiveStreaming}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition cursor-pointer ${
              liveStreaming
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveStreaming ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{liveStreaming ? 'LIVE STREAM' : 'STREAM PAUSED'}</span>
          </button>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All E-Gov Microservices</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Level Pills & Quick Syntax Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg transition text-xs font-medium cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
