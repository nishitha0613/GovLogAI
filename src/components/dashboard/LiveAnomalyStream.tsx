import React from 'react';
import { Terminal, Sparkles, ChevronRight, Play, Pause } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const LiveAnomalyStream: React.FC = () => {
  const { logs, setSelectedLog, setCurrentRoute, liveStreaming, toggleLiveStreaming } = useApp();

  const anomalyLogs = logs.filter((l) => l.anomalyScore > 50 || l.level === 'CRITICAL' || l.level === 'ERROR');

  return (
    <Card className="bg-slate-900/90 border border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
            Live AI Anomaly Stream
          </h3>
          <Badge variant="purple" size="sm">
            Neural Scan Active
          </Badge>
        </div>

        <button
          onClick={toggleLiveStreaming}
          className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1.5"
        >
          {liveStreaming ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
          <span>{liveStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
        </button>
      </div>

      {/* Stream List */}
      <div className="my-3 space-y-2 flex-1 overflow-y-auto max-h-[320px] pr-1">
        {anomalyLogs.map((log) => (
          <div
            key={log.id}
            onClick={() => {
              setSelectedLog(log);
              setCurrentRoute('logs');
            }}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer flex items-center justify-between gap-3 font-mono text-xs"
          >
            <div className="space-y-1 truncate">
              <div className="flex items-center gap-2">
                <Badge variant={log.level === 'CRITICAL' ? 'critical' : log.level === 'ERROR' ? 'error' : 'warn'} size="sm">
                  {log.level}
                </Badge>
                <span className="text-cyan-400 font-bold">{log.service}</span>
                <span className="text-slate-400">({log.endpoint})</span>
              </div>
              <p className="text-slate-200 truncate">{log.message}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-rose-400 font-bold">{log.anomalyScore}% Risk</div>
                <div className="text-[10px] text-slate-500">{log.ipAddress}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer link to Log Explorer */}
      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentRoute('logs')}
          icon={<Terminal className="w-4 h-4 text-cyan-400" />}
        >
          Open Full Log Explorer
        </Button>
      </div>
    </Card>
  );
};
