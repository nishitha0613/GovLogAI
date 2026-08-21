export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | 'FATAL';

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: LogLevel;
  message: string;
  statusCode: number;
  ipAddress: string;
  location: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  responseTimeMs: number;
  anomalyScore: number; // 0 to 100
  confidenceScore?: number; // 0 to 100 percentage
  category?: 'Authentication' | 'API Security' | 'Database Query' | 'Biometrics' | 'Privilege Escalation' | 'Network' | 'System Maintenance';
  aiSummary?: string;
  threatVector?: string;
  payloadJson?: string;
  mitigationScript?: string;
  hash?: string;
  prevHash?: string;
  isTampered?: boolean;
  tamperReason?: string;
  threatIntelFeed?: string;
}

export type EventSeverity = 'P1 Critical' | 'P2 High' | 'P3 Medium' | 'P4 Low';
export type EventStatus = 'Active' | 'Investigating' | 'Mitigated' | 'Resolved';

export interface EventTimelineItem {
  id: string;
  time: string;
  description: string;
  actor: string;
  type: 'log' | 'ai_detect' | 'auto_block' | 'human_action';
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  firstSeen: string;
  lastSeen: string;
  title: string;
  category: 'Authentication' | 'API Security' | 'Database Failure' | 'Privilege Escalation' | 'Unauthorized Access' | 'Network';
  severity: EventSeverity;
  affectedService: string;
  occurrences: number;
  logsCount: number;
  status: EventStatus;
  aiRootCause: string;
  whyGroupedExplanation: string;
  xaiExplanation?: string;
  recommendedActions: string[];
  threatActorIp: string;
  country: string;
  timeline: EventTimelineItem[];
  relatedLogs: LogEntry[];
  mitigationExecuted: boolean;
  mitigationPlaybook: string;
}

export type AlertStatus = 'Open' | 'Acknowledged' | 'Investigating' | 'Resolved' | 'Muted';

export interface AlertTimelineStep {
  time: string;
  text: string;
  author: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: EventSeverity;
  service: string;
  status: AlertStatus;
  assignedTo?: string;
  autoMitigated?: boolean;
  ruleTriggered: string;
  actionTaken?: string;
  aiRecommendedResponse: string;
  cliPlaybook?: string;
  relatedEventId?: string;
  timeline?: AlertTimelineStep[];
}

export interface LogMetrics {
  totalLogs: number;
  infoCount: number;
  warnCount: number;
  errorCount: number;
  criticalCount: number;
  criticalEventsCount: number;
  correlatedEventGroupsCount: number;
  securityEvents: SecurityEvent[];
}

export interface IngestionSource {
  id: string;
  name: string;
  type: string;
  status: string;
  eventsPerSec: number;
  nodesConnected?: number;
  bandwidthMbps?: number;
  lastHeartbeat?: string;
}

export interface SecurityMetrics {
  totalAnalyzed?: number;
  threatsDetected?: number;
  autoRemediated?: number;
  totalLogsToday?: string | number;
  threatAnomalyScore?: number;
  activeIncidentsCount?: number;
  avgAiMttrSeconds?: number;
  complianceIndex?: number;
  logVolumeGb?: number;
}

export interface EGovService {
  id: string;
  name: string;
  agency: string;
  category: string;
  status: 'Healthy' | 'Degraded' | 'Critical';
  latencyMs: number;
  uptimePercent?: number;
  errorRatePercent?: number;
  errorRate?: number | string;
  podsCount?: string;
  requestCount24h?: string;
  nodesActive?: number;
  totalNodes?: number;
}
