import React, { useState } from 'react';
import { Terminal, Copy, Check, Search, Maximize2, Minimize2 } from 'lucide-react';
import type { LogEntry } from '../../types/log';
import { Card } from '../ui/Card';

interface RawLogTerminalProps {
  customLogs?: LogEntry[];
  customRawText?: string;
}

export const RawLogTerminal: React.FC<RawLogTerminalProps> = ({ customLogs = [], customRawText }) => {
  const logsToDisplay = customLogs;

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [terminalSearch, setTerminalSearch] = useState('');

  const activeLogs = logsToDisplay.filter(
    l => !terminalSearch || l.message.toLowerCase().includes(terminalSearch.toLowerCase()) || l.endpoint.includes(terminalSearch)
  );

  const rawLogsText = customRawText || activeLogs
    .map(l => `[${l.timestamp}] [${l.level}] [${l.service}] ${l.method} ${l.endpoint} - ${l.statusCode} (${l.responseTimeMs}ms) IP:${l.ipAddress} msg="${l.message}"`)
    .join('\n');

  const handleCopy = () => {
    if (!rawLogsText) return;
    navigator.clipboard.writeText(rawLogsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-[#05080f] border border-slate-800 p-0 overflow-hidden font-mono text-xs shadow-2xl">
      {/* Terminal Header Bar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          <span className="text-xs text-slate-400 ml-2 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Raw Ingested Stream Buffer (TTY / stdout)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Terminal Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search raw stream..."
              value={terminalSearch}
              onChange={(e) => setTerminalSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-8 pr-3 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleCopy}
            disabled={!rawLogsText}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition ${
              !rawLogsText
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer'
            }`}
            title="Copy Raw Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className={`p-4 bg-[#05080f] font-mono text-xs overflow-x-auto ${expanded ? 'max-h-[600px]' : 'max-h-[260px]'}`}>
        {activeLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-1.5">
            <Terminal className="w-5 h-5 text-slate-600 mb-1" />
            <span className="text-slate-400 font-semibold">No raw log stream loaded in buffer.</span>
            <span className="text-slate-500 text-[11px]">Upload a log file to view raw ingested output.</span>
          </div>
        ) : (
          activeLogs.map((log, index) => {
            const isCritical = log.level === 'CRITICAL' || log.level === 'FATAL';
            const isWarn = log.level === 'WARN';
            const isError = log.level === 'ERROR';

            return (
              <div key={log.id} className="flex items-start gap-3 py-0.5 hover:bg-slate-900/60 rounded px-1 group">
                <span className="text-slate-600 select-none text-[11px] w-8 text-right shrink-0">{index + 1}</span>
                <span className="text-slate-500 shrink-0">[{log.timestamp.split('T')[1]?.slice(0, 12) || log.timestamp.slice(0, 12)}]</span>
                <span
                  className={`font-bold shrink-0 ${
                    isCritical ? 'text-rose-400' : isError ? 'text-rose-300' : isWarn ? 'text-amber-400' : 'text-cyan-400'
                  }`}
                >
                  [{log.level}]
                </span>
                <span className="text-slate-300 font-semibold shrink-0">[{log.service}]</span>
                <span className="text-cyan-400 font-bold shrink-0">{log.method}</span>
                <span className="text-slate-200 truncate">{log.endpoint}</span>
                <span className={`shrink-0 font-bold ${log.statusCode >= 400 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {log.statusCode}
                </span>
                <span className="text-slate-400 truncate hidden md:inline">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
