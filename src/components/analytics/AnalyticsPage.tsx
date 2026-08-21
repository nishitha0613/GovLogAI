import React from 'react';
import { BarChart3, PieChart as PieIcon, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';

const LEVEL_COLORS: Record<string, string> = {
  'INFO': '#06b6d4',
  'WARN': '#f59e0b',
  'ERROR': '#f97316',
  'CRITICAL': '#f43f5e',
};

export const AnalyticsPage: React.FC = () => {
  const { logs, setCurrentRoute } = useApp();

  const totalLogs = logs.length;

  // Real log volume trend grouping over time buckets strictly from uploaded log timestamps
  const timeBucketsMap = new Map<string, { time: string; count: number; errors: number; criticals: number }>();
  logs.forEach((log, index) => {
    let timeLabel = `Line #${index + 1}`;
    if (log.timestamp) {
      if (log.timestamp.length >= 19 && log.timestamp.includes('T')) {
        timeLabel = log.timestamp.slice(11, 19);
      } else if (log.timestamp.length >= 16 && log.timestamp.includes('T')) {
        timeLabel = log.timestamp.slice(11, 16);
      } else if (log.timestamp.length > 5) {
        timeLabel = log.timestamp;
      }
    }
    if (!timeBucketsMap.has(timeLabel)) {
      timeBucketsMap.set(timeLabel, { time: timeLabel, count: 0, errors: 0, criticals: 0 });
    }
    const bucket = timeBucketsMap.get(timeLabel)!;
    bucket.count += 1;
    if (log.level === 'ERROR' || log.statusCode >= 500) {
      bucket.errors += 1;
    }
    if (log.level === 'CRITICAL' || log.level === 'FATAL') {
      bucket.criticals += 1;
    }
  });

  const chartData = Array.from(timeBucketsMap.values());

  // Log level categorization breakdown from actual uploaded log entries
  const levelCounts = {
    INFO: logs.filter(l => l.level === 'INFO').length,
    WARN: logs.filter(l => l.level === 'WARN').length,
    ERROR: logs.filter(l => l.level === 'ERROR').length,
    CRITICAL: logs.filter(l => l.level === 'CRITICAL' || l.level === 'FATAL').length,
  };

  const levelPieData = (['INFO', 'WARN', 'ERROR', 'CRITICAL'] as const)
    .map(lvl => {
      const count = levelCounts[lvl];
      const rawPct = totalLogs > 0 ? (count / totalLogs) * 100 : 0;
      const percentage = rawPct % 1 === 0 ? rawPct.toFixed(0) : rawPct.toFixed(1);
      return {
        name: lvl,
        count,
        percentage,
        color: LEVEL_COLORS[lvl],
      };
    })
    .filter(item => item.count > 0);

  return (
    <div className="p-4 md:p-6 max-w-[1500px] mx-auto space-y-6 font-sans">
      {/* 1. Log Volume & Error/Critical Trend Over Time (Area Chart) */}
      <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-5 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase font-sans tracking-wide">
              Log Ingestion Volume & Error Trend Over Time
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{totalLogs} Processed Items</span>
        </div>

        <div className="h-72 w-full flex items-center justify-center font-mono text-xs">
          {totalLogs === 0 ? (
            <div className="text-center py-12 text-slate-500 font-sans space-y-3">
              <BarChart3 className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No log data available yet.</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload and process a log file in Log Explorer to analyze ingestion throughput and error distributions over time.
              </p>
              <button
                onClick={() => setCurrentRoute('logs')}
                className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                <span>Upload Logs in Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCriticals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" name="Total Ingested Logs" />
                <Area type="monotone" dataKey="errors" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorErrors)" name="Log Errors / 5xx Status" />
                <Area type="monotone" dataKey="criticals" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorCriticals)" name="Critical Threats" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* 3. Log Categories Breakdown Donut/Pie Chart (INFO, WARN, ERROR, CRITICAL) */}
      <Card className="bg-[#0c121e]/90 border border-slate-800/80 p-5 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase font-sans tracking-wide">
              Log Categories Breakdown (INFO, WARN, ERROR, CRITICAL)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{totalLogs} Total Logs</span>
        </div>

        {totalLogs === 0 ? (
          <div className="py-12 text-center text-slate-500 font-sans space-y-2">
            <PieIcon className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-slate-300">No log categories breakdown data available yet.</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upload a log file in Log Explorer to analyze severity levels and render log breakdown charts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Donut/Pie Chart */}
            <div className="h-72 w-full flex items-center justify-center font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="count"
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1).replace(/\.0$/, '')}%`}
                  >
                    {levelPieData.map((entry, index) => (
                      <Cell key={`lvl-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Level Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {levelPieData.map((item) => (
                <div key={item.name} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-200 font-sans font-bold">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs" style={{ color: item.color }}>
                      {item.count} {item.count === 1 ? 'log' : 'logs'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>Share of Total:</span>
                    <strong className="text-slate-200">{item.percentage}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
