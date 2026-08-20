import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { EventSeverity, AlertStatus } from '../../types/log';

interface AlertFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSeverity: EventSeverity | 'ALL';
  setSelectedSeverity: (severity: EventSeverity | 'ALL') => void;
  selectedStatus: AlertStatus | 'ALL';
  setSelectedStatus: (status: AlertStatus | 'ALL') => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
}

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSeverity,
  setSelectedSeverity,
  selectedStatus,
  setSelectedStatus,
  selectedService,
  setSelectedService,
}) => {
  const severities: (EventSeverity | 'ALL')[] = ['ALL', 'P1 Critical', 'P2 High', 'P3 Medium', 'P4 Low'];
  const statuses: (AlertStatus | 'ALL')[] = ['ALL', 'Open', 'Acknowledged', 'Investigating', 'Resolved', 'Muted'];

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
      {/* Search Input & Dropdown Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by title, rule, or microservice source..."
            className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
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

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All E-Gov Microservices</option>
            <option value="Public Treasury Settlement API">Public Treasury Settlement API</option>
            <option value="Central Tax & Revenue Gateway">Central Tax & Revenue Gateway</option>
            <option value="National Identity Gateway (GovID)">National Identity Gateway (GovID)</option>
            <option value="Sovereign Encrypted Storage Vault">Sovereign Log Storage Vault</option>
            <option value="Border Control & Visa Gateway">Border Control & Visa Gateway</option>
            <option value="Land Registry & Cadastral DB">Land Registry & Cadastral DB</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Alert Statuses</option>
            {statuses.filter(s => s !== 'ALL').map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
        <span className="text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Severity:
        </span>
        {severities.map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-2.5 py-1 rounded-lg transition text-xs font-medium cursor-pointer ${
              selectedSeverity === sev
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>
    </div>
  );
};
