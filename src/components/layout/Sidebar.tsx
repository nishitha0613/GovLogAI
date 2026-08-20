import React from 'react';
import { 
  Shield, 
  Terminal, 
  Bell, 
  BarChart3, 
  Settings, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Lock
} from 'lucide-react';
import { useApp, type RouteType } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

interface NavItem {
  id: RouteType;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'critical' | 'warn' | 'info' | 'purple';
}

export const Sidebar: React.FC = () => {
  const { currentRoute, setCurrentRoute, sidebarCollapsed, setSidebarCollapsed, alerts, logs, events } = useApp();

  const openAlertsCount = alerts.filter(a => a.status === 'Open' || a.status === 'Investigating').length;
  const criticalLogsCount = logs.filter(l => l.level === 'CRITICAL' || l.level === 'FATAL').length;

  const navItems: NavItem[] = [
    {
      id: 'landing',
      label: 'Landing Portal',
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: 'logs',
      label: 'Log Explorer',
      icon: <Terminal className="w-5 h-5" />,
      badge: criticalLogsCount > 0 ? `${criticalLogsCount} Critical` : undefined,
      badgeVariant: 'critical',
    },
    {
      id: 'security-alerts',
      label: 'Security & Alerts',
      icon: <Bell className="w-5 h-5" />,
      badge: (events.length + openAlertsCount) > 0 ? `${events.length + openAlertsCount}` : undefined,
      badgeVariant: 'warn',
    },
    {
      id: 'analytics',
      label: 'System Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Agency Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className={`relative sticky top-0 h-screen bg-[#090d16] border-r border-slate-800/80 flex flex-col transition-all duration-300 z-30 shrink-0 select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0c121e]">
        <div 
          onClick={() => setCurrentRoute('landing')} 
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-950 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-slate-950"></span>
            </span>
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  GovLog<span className="text-cyan-400 font-black">AI</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  v4.2
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wide truncate">
                SOVEREIGN SEC-OPS
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2 font-mono">
          {!sidebarCollapsed ? 'Core Intelligence' : '•••'}
        </div>

        {navItems.map((item) => {
          const isActive = currentRoute === item.id || (item.id === 'security-alerts' && (currentRoute === 'events' || currentRoute === 'alerts'));
          return (
            <button
              key={item.id}
              onClick={() => setCurrentRoute(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-cyan-300 font-semibold border-l-4 border-cyan-400 pl-2.5 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border-l-4 border-transparent pl-2.5'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && <span className="truncate font-sans tracking-wide">{item.label}</span>}
              </div>

              {!sidebarCollapsed && item.badge && (
                <Badge variant={item.badgeVariant || 'info'} size="sm">
                  {item.badge}
                </Badge>
              )}

              {sidebarCollapsed && item.badge && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Air-Gapped Security Status Card */}
      {!sidebarCollapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>AIR-GAP NODE</span>
            </span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[94%]" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>FedRAMP HIGH</span>
            <span>FISMA Compliant</span>
          </div>
        </div>
      )}

      {/* Footer User Info */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0c121e] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-700/50 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
            GC
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">GovCert Analyst</span>
              <span className="text-[10px] text-slate-400 font-mono truncate">Dept of Cyber Defense</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
