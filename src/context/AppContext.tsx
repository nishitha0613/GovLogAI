import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LogEntry, SecurityEvent, AlertItem, EGovService, LogMetrics } from '../types/log';
import type { ParsedAnalysisResult } from '../utils/logParser';
import { mockEGovServices } from '../data/mockServices';
import { verifyLogHashChain, computeLogHashChain } from '../utils/cryptoHasher';

export type RouteType = 'landing' | 'dashboard' | 'logs' | 'security-alerts' | 'analytics' | 'settings' | 'events' | 'alerts';

export interface IpBlockPromptData {
  isOpen: boolean;
  ipAddress: string;
  sourceTitle: string;
  eventId: string;
  severity: string;
}

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
  dismissAlert: (id: string) => void;
  dismissEvent: (id: string) => void;
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

  // Cryptographic Audit Trail Engine State & Handlers
  auditResult: {
    isChainValid: boolean;
    totalLogs: number;
    verifiedCount: number;
    tamperedCount: number;
    tamperedLogIds: string[];
  };
  tamperWithLog: (logId: string, newMessage?: string) => void;
  recalculateAndSignChain: () => void;
  verifyCurrentLogs: () => void;

  // IP Block Workflow (CRITICAL Events Only)
  blockedIps: string[];
  isIpBlocked: (ip: string) => boolean;
  ipBlockPrompt: IpBlockPromptData | null;
  confirmIpBlock: (shouldBlock: boolean) => void;
  resolveEventOrAlert: (target: any) => void;
  blockToastMessage: string | null;
  dismissBlockToast: () => void;
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
      const validRoutes: RouteType[] = ['landing', 'dashboard', 'logs', 'security-alerts', 'events', 'alerts', 'analytics', 'settings'];
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

  // IP Block Workflow (CRITICAL Events Only)
  const [blockedIps, setBlockedIps] = useState<string[]>([]);
  const [ipBlockPrompt, setIpBlockPrompt] = useState<IpBlockPromptData | null>(null);
  const [blockToastMessage, setBlockToastMessage] = useState<string | null>(null);

  const isIpBlocked = (ip: string) => blockedIps.includes(ip);

  const resolveEventOrAlert = (target: any) => {
    if (!target) return;

    let targetId = typeof target === 'string' ? target : target.id;
    let targetSeverity = '';
    let targetTitle = 'Security Event / Alert';
    let sourceIp = '192.168.10.45';

    if (typeof target === 'string') {
      const foundEvt = events.find(e => e.id === target);
      const foundAlt = alerts.find(a => a.id === target);
      if (foundEvt) {
        targetSeverity = foundEvt.severity;
        targetTitle = foundEvt.title;
        sourceIp = foundEvt.threatActorIp || (foundEvt.relatedLogs && foundEvt.relatedLogs[0]?.ipAddress) || sourceIp;
      } else if (foundAlt) {
        targetSeverity = foundAlt.severity;
        targetTitle = foundAlt.title;
        sourceIp = (foundAlt.relatedEventId && events.find(e => e.id === foundAlt.relatedEventId)?.threatActorIp) || sourceIp;
      }
    } else {
      targetId = target.id;
      targetSeverity = target.severity || target.level || '';
      targetTitle = target.title || target.message || 'Security Event';
      sourceIp = target.threatActorIp || target.ipAddress || (target.relatedLogs && target.relatedLogs[0]?.ipAddress) || sourceIp;
    }

    const sevUpper = targetSeverity.toUpperCase();
    const isCritical = sevUpper.includes('P1') || sevUpper.includes('CRITICAL') || sevUpper.includes('FATAL');

    // 1. Mark event/alert status as Resolved
    setEvents((prev) =>
      prev.map((evt) => (evt.id === targetId || evt.id === `EVT-${targetId.replace(/\D/g, '')}` || targetId.includes(evt.id) ? { ...evt, status: 'Resolved' } : evt))
    );
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === targetId || alert.relatedEventId === targetId ? { ...alert, status: 'Resolved' } : alert))
    );

    if (selectedEvent && (selectedEvent.id === targetId || selectedEvent.id.includes(targetId))) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: 'Resolved' } : null));
    }
    if (selectedAlert && (selectedAlert.id === targetId || selectedAlert.relatedEventId === targetId)) {
      setSelectedAlert((prev) => (prev ? { ...prev, status: 'Resolved' } : null));
    }

    // 2. CRITICAL Events ONLY: prompt administrator for confirmation whether to block source IP
    // For HIGH, MEDIUM, LOW, and INFO events: resolve quietly without prompting
    if (isCritical) {
      setIpBlockPrompt({
        isOpen: true,
        ipAddress: sourceIp,
        sourceTitle: targetTitle,
        eventId: targetId,
        severity: targetSeverity || 'P1 Critical',
      });
    }
  };

  const resolveAlert = (id: string) => {
    resolveEventOrAlert(id);
  };

  const confirmIpBlock = (shouldBlock: boolean) => {
    if (!ipBlockPrompt) return;

    const targetIp = ipBlockPrompt.ipAddress;

    if (shouldBlock) {
      setBlockedIps((prev) => (prev.includes(targetIp) ? prev : [...prev, targetIp]));
      setBlockToastMessage(`IP ${targetIp} marked as Blocked (Simulated WAF Rule).`);
      setTimeout(() => setBlockToastMessage(null), 5000);
    }

    setIpBlockPrompt(null);
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const dismissEvent = (id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
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

  // Dynamic Cryptographic Audit Trail Verification
  const auditVerification = verifyLogHashChain(logs);

  const auditResult = {
    isChainValid: auditVerification.isChainValid,
    totalLogs: auditVerification.totalLogs,
    verifiedCount: auditVerification.verifiedCount,
    tamperedCount: auditVerification.tamperedCount,
    tamperedLogIds: auditVerification.tamperedLogIds,
  };

  const tamperWithLog = (logId: string, newMessage?: string) => {
    setLogs((prevLogs) => {
      const updated = prevLogs.map((log) => {
        if (log.id === logId) {
          const tamperedMsg = newMessage || `${log.message} [UNAUTHORIZED EDIT / PAYLOAD TAMPERED]`;
          return {
            ...log,
            message: tamperedMsg,
          };
        }
        return log;
      });
      const verifiedResult = verifyLogHashChain(updated);
      return verifiedResult.verifiedLogs;
    });

    if (selectedLog && selectedLog.id === logId) {
      setSelectedLog((prev) =>
        prev
          ? {
              ...prev,
              message: newMessage || `${prev.message} [UNAUTHORIZED EDIT / PAYLOAD TAMPERED]`,
              isTampered: true,
              tamperReason: 'Cryptographic signature mismatch: Log message modified after hash signing',
            }
          : null
      );
    }
  };

  const recalculateAndSignChain = () => {
    setLogs((prevLogs) => {
      const hashBlocks = computeLogHashChain(prevLogs.map((l) => ({ id: l.id, raw: l.message, timestamp: l.timestamp })));
      const reSigned = prevLogs.map((l, idx) => ({
        ...l,
        hash: hashBlocks[idx].hash,
        prevHash: hashBlocks[idx].prevHash,
        isTampered: false,
        tamperReason: undefined,
      }));
      return reSigned;
    });

    if (selectedLog) {
      setSelectedLog((prev) => (prev ? { ...prev, isTampered: false, tamperReason: undefined } : null));
    }
  };

  const verifyCurrentLogs = () => {
    setLogs((prev) => {
      const verified = verifyLogHashChain(prev);
      return verified.verifiedLogs;
    });
  };

  const dismissBlockToast = () => setBlockToastMessage(null);

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
        dismissAlert,
        dismissEvent,
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
        auditResult,
        tamperWithLog,
        recalculateAndSignChain,
        verifyCurrentLogs,
        blockedIps,
        isIpBlocked,
        ipBlockPrompt,
        confirmIpBlock,
        resolveEventOrAlert,
        blockToastMessage,
        dismissBlockToast,
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
