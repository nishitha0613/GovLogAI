import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LogEntry, SecurityEvent, AlertItem, EGovService, LogMetrics } from '../types/log';
import type { ParsedAnalysisResult } from '../utils/logParser';
import { mockEGovServices } from '../data/mockServices';

export type RouteType = 'landing' | 'dashboard' | 'logs' | 'events' | 'alerts' | 'analytics' | 'settings';

interface AppContextType {
  currentRoute: RouteType;
  setCurrentRoute: (route: RouteType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLog: LogEntry | null;
  setSelectedLog: (log: LogEntry | null) => void;
  selectedEvent: SecurityEvent | null;
  setSelectedEvent: (event: SecurityEvent | null) => void;
  selectedAlert: AlertItem | null;
  setSelectedAlert: (alert: AlertItem | null) => void;
  liveStreaming: boolean;
  setLiveStreaming: (streaming: boolean) => void;
  toggleLiveStreaming: () => void;
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  events: SecurityEvent[];
  setEvents: React.Dispatch<React.SetStateAction<SecurityEvent[]>>;
  alerts: AlertItem[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
  services: EGovService[];
  acknowledgeAlert: (id: string) => void;
  investigateAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  triggerRemediation: (alertId: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  aiCopilotActive: boolean;
  setAiCopilotActive: (active: boolean) => void;
  quickSearchOpen: boolean;
  setQuickSearchOpen: (open: boolean) => void;
  
  // Shared Dataset & Analyzed Metrics
  analysisResult: ParsedAnalysisResult | null;
  setAnalysisResult: (result: ParsedAnalysisResult | null) => void;
  metrics: LogMetrics;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRouteState] = useState<RouteType>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [liveStreaming, setLiveStreaming] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [services] = useState<EGovService[]>(mockEGovServices);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiCopilotActive, setAiCopilotActive] = useState(true);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  // Centralized Shared Analysis Result State
  const [analysisResult, setAnalysisResultState] = useState<ParsedAnalysisResult | null>(null);

  const setAnalysisResult = (result: ParsedAnalysisResult | null) => {
    setAnalysisResultState(result);
    if (result) {
      setLogs(result.logs);
      setEvents(result.events);
      setAlerts(result.alerts);
      setLiveStreaming(false); // Pause background simulated streaming when a custom file is analyzed
    }
  };

  // Dynamically Calculated Metrics Object (Zero Hardcoding)
  const infoCount = logs.filter((l) => l.level === 'INFO').length;
  const warnCount = logs.filter((l) => l.level === 'WARN').length;
  const errorCount = logs.filter((l) => l.level === 'ERROR').length;
  const criticalCount = logs.filter((l) => l.level === 'CRITICAL' || l.level === 'FATAL').length;
  const criticalEventsCount = events.filter((e) => e.severity === 'P1 Critical').length;
  const correlatedEventGroupsCount = events.length;

  const metrics: LogMetrics = {
    totalLogs: logs.length,
    infoCount,
    warnCount,
    errorCount,
    criticalCount,
    criticalEventsCount,
    correlatedEventGroupsCount,
    securityEvents: events,
  };

  // Sync hash or browser URL path
  const setCurrentRoute = (route: RouteType) => {
    setCurrentRouteState(route);
    window.location.hash = route === 'landing' ? '' : route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validRoutes: RouteType[] = ['landing', 'dashboard', 'logs', 'events', 'alerts', 'analytics', 'settings'];
      if (validRoutes.includes(hash as RouteType)) {
        setCurrentRouteState(hash as RouteType);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K for quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated live log generator when live streaming is enabled
  useEffect(() => {
    if (!liveStreaming) return;

    const interval = setInterval(() => {
      const randomService = services[Math.floor(Math.random() * services.length)];
      const levels: LogEntry['level'][] = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const methods: LogEntry['method'][] = ['GET', 'POST', 'POST', 'PUT'];
      const method = methods[Math.floor(Math.random() * methods.length)];

      const isCritical = level === 'CRITICAL' || level === 'ERROR';
      const statusCode = isCritical ? (Math.random() > 0.5 ? 500 : 403) : 200;
      const anomalyScore = isCritical ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 20);

      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        service: randomService.name,
        level,
        message: isCritical 
          ? `High latency spike (${Math.floor(Math.random() * 800) + 200}ms) detected on ${randomService.category} gateway`
          : `Standard API request processed on ${randomService.name}`,
        statusCode,
        ipAddress: `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: isCritical ? 'Suspicious External IP' : 'Internal GovNet Node',
        method,
        endpoint: `/api/v1/${randomService.category.toLowerCase()}/transaction`,
        responseTimeMs: Math.floor(Math.random() * 250) + 15,
        anomalyScore,
        aiSummary: isCritical 
          ? 'Automated GovLogAI stream scanner flagged response time degradation and potential microservice pool contention.'
          : 'Normal execution within 99th percentile SLA threshold.',
      };

      setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 49)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [liveStreaming, services]);

  const toggleLiveStreaming = () => setLiveStreaming((prev) => !prev);

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status: 'Acknowledged', assignedTo: 'Current Analyst' } : alert))
    );
  };

  const investigateAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status: 'Investigating', assignedTo: 'Current Analyst' } : alert))
    );
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status: 'Resolved' } : alert))
    );
  };

  const triggerRemediation = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'Resolved',
              autoMitigated: true,
              actionTaken: 'Executed GovLogAI Auto-Remediation Playbook: Pod restarted & IP blacklisted.',
            }
          : alert
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        searchQuery,
        setSearchQuery,
        selectedLog,
        setSelectedLog,
        selectedEvent,
        setSelectedEvent,
        selectedAlert,
        setSelectedAlert,
        liveStreaming,
        setLiveStreaming,
        toggleLiveStreaming,
        logs,
        setLogs,
        events,
        setEvents,
        alerts,
        setAlerts,
        services,
        acknowledgeAlert,
        investigateAlert,
        resolveAlert,
        triggerRemediation,
        sidebarCollapsed,
        setSidebarCollapsed,
        aiCopilotActive,
        setAiCopilotActive,
        quickSearchOpen,
        setQuickSearchOpen,
        analysisResult,
        setAnalysisResult,
        metrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
