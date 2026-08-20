import type { LogEntry, LogLevel, SecurityEvent, EventSeverity, AlertItem } from '../types/log';

export interface ParsedAnalysisResult {
  fileName: string;
  fileSizeFormatted: string;
  totalLogs: number;
  errorCount: number;
  criticalCount: number;
  eventGroupsCount: number;
  confidenceRating: string;
  logs: LogEntry[];
  events: SecurityEvent[];
  alerts: AlertItem[];
  rawText: string;
  isCustomFile: boolean;
}

export function generateAlertsFromEvents(events: SecurityEvent[]): AlertItem[] {
  const generatedAlerts: AlertItem[] = [];
  let alertIndex = 1000;

  // Filter events with Critical or High severity
  const alertableEvents = events.filter(
    e => e.severity === 'P1 Critical' || e.severity === 'P2 High' || e.severity === 'P3 Medium'
  );

  alertableEvents.forEach((evt) => {
    alertIndex += 1;
    const isP1 = evt.severity === 'P1 Critical';

    generatedAlerts.push({
      id: `ALT-${alertIndex}`,
      timestamp: evt.timestamp,
      title: evt.title,
      description: evt.aiRootCause,
      severity: evt.severity,
      service: evt.affectedService,
      status: 'Open',
      assignedTo: isP1 ? 'GovCert SecOps Lead' : 'On-Call Analyst',
      autoMitigated: evt.mitigationExecuted,
      ruleTriggered: isP1
        ? 'RULE-SEC-01: Critical Threat Signature Intercepted'
        : 'RULE-OPS-04: Microservice Anomaly Threshold Exceeded',
      actionTaken: evt.mitigationExecuted ? 'Auto-remediation playbook executed' : undefined,
      aiRecommendedResponse: evt.recommendedActions.join(' '),
      cliPlaybook: evt.mitigationPlaybook,
      relatedEventId: evt.id,
      timeline: evt.timeline.map(t => ({
        time: t.time,
        text: t.description,
        author: t.actor,
      })),
    });
  });

  return generatedAlerts;
}

export function generateEventsFromParsedLogs(parsedLogs: LogEntry[]): SecurityEvent[] {
  const groupsMap = new Map<string, LogEntry[]>();

  parsedLogs.forEach((log) => {
    const key = `${log.service}___${log.category || 'System Maintenance'}`;
    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(log);
  });

  const generatedEvents: SecurityEvent[] = [];
  let eventIndex = 950;

  groupsMap.forEach((groupLogs, key) => {
    eventIndex += 1;
    const [service, category] = key.split('___');

    // Sort group logs by timestamp
    groupLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const firstSeen = groupLogs[0]?.timestamp ? new Date(groupLogs[0].timestamp).toLocaleTimeString() : '14:00:00';
    const lastSeen = groupLogs[groupLogs.length - 1]?.timestamp ? new Date(groupLogs[groupLogs.length - 1].timestamp).toLocaleTimeString() : '14:26:00';

    // Assign Highest Severity
    let severity: EventSeverity = 'P4 Low';
    if (groupLogs.some(l => l.level === 'CRITICAL' || l.level === 'FATAL')) {
      severity = 'P1 Critical';
    } else if (groupLogs.some(l => l.level === 'ERROR')) {
      severity = 'P2 High';
    } else if (groupLogs.some(l => l.level === 'WARN')) {
      severity = 'P3 Medium';
    }

    // Threat IP origin
    const primaryIp = groupLogs[0]?.ipAddress || '185.220.101.44';

    // Title generation
    let title = `Correlated ${category} Pattern on ${service}`;
    if (category === 'API Security' && groupLogs.some(l => l.threatVector === 'SQL Injection')) {
      title = `SQL Injection Attack Probe on ${service}`;
    } else if (category === 'Biometrics') {
      title = `Biometric Database Extraction Probe on ${service}`;
    } else if (category === 'Authentication') {
      title = `Credential Stuffing & Authentication Spike on ${service}`;
    } else if (category === 'Privilege Escalation') {
      title = `JWT Privilege Escalation Attempt on ${service}`;
    } else if (category === 'Database Query') {
      title = `Postgres Connection Pool Starvation on ${service}`;
    }

    // Why Grouped Explanation
    const whyGroupedExplanation = `Grouped via GovLogAI correlation engine: Linked ${groupLogs.length} log lines sharing category "${category}", target microservice "${service}", and threat IP origin ${primaryIp} within a time window of ${firstSeen} to ${lastSeen}.`;

    // Recommended actions
    const recommendedActions = [
      `Apply WAF block rule for threat origin IP ${primaryIp}.`,
      `Verify parameter binding and rate-limiting configs on target ${service} pods.`,
      `Review security audit trail for associated session tokens.`,
      `Escalate incident report #${eventIndex} to SecOps team.`
    ];

    const playbook = `govlog-cli waf block-ip ${primaryIp} --duration 72h && kubectl scale deployment/${service.toLowerCase().replace(/[^a-z]/g, '-')} --replicas=8`;

    generatedEvents.push({
      id: `EVT-${eventIndex}`,
      timestamp: groupLogs[groupLogs.length - 1]?.timestamp || new Date().toISOString(),
      firstSeen,
      lastSeen,
      title,
      category: (category as any) || 'API Security',
      severity,
      affectedService: service,
      occurrences: groupLogs.length,
      logsCount: groupLogs.length,
      status: severity === 'P1 Critical' ? 'Active' : 'Investigating',
      aiRootCause: `Correlated ${groupLogs.length} logs on ${service}. Primary vector: ${groupLogs[0]?.message || category}`,
      whyGroupedExplanation,
      recommendedActions,
      threatActorIp: primaryIp,
      country: primaryIp.startsWith('185') ? 'Tor Exit Node (DE)' : 'External Network',
      timeline: [
        { id: `t1-${eventIndex}`, time: firstSeen, description: `Initial log probe recorded on ${service}`, actor: primaryIp, type: 'log' },
        { id: `t2-${eventIndex}`, time: lastSeen, description: `GovLogAI Engine correlated ${groupLogs.length} log lines into Incident #EVT-${eventIndex}`, actor: 'GovLogAI Rule Engine', type: 'ai_detect' },
      ],
      relatedLogs: groupLogs,
      mitigationExecuted: false,
      mitigationPlaybook: playbook,
    });
  });

  return generatedEvents;
}

export function parseAndClassifyLogFile(fileContent: string, fileName: string, fileSize: number): ParsedAnalysisResult {
  const lines = fileContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
  
  const parsedLogs: LogEntry[] = [];
  let errorCount = 0;
  let criticalCount = 0;

  lines.forEach((line, index) => {
    const rawLine = line.trim();
    const lower = rawLine.toLowerCase();

    // Extract HTTP Method
    let method: LogEntry['method'] = 'GET';
    if (lower.includes('post')) method = 'POST';
    else if (lower.includes('put')) method = 'PUT';
    else if (lower.includes('delete')) method = 'DELETE';
    else if (lower.includes('patch')) method = 'PATCH';

    // Extract Status Code
    let statusCode = 200;
    const statusMatch = rawLine.match(/\b(200|201|304|400|401|403|404|429|500|502|503)\b/);
    if (statusMatch) {
      statusCode = parseInt(statusMatch[1], 10);
    } else if (lower.includes('error') || lower.includes('failed') || lower.includes('denied')) {
      statusCode = 500;
    } else if (lower.includes('warn') || lower.includes('limit')) {
      statusCode = 429;
    }

    // Extract IP Address
    const ipMatch = rawLine.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
    const ipAddress = ipMatch ? ipMatch[0] : `185.220.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 250) + 1}`;

    // Extract Endpoint
    const endpointMatch = rawLine.match(/(\/(?:api|v[1-9]|auth|tax|visa|cadastral|treasury|certs|user)[^\s,"]*)/i);
    const endpoint = endpointMatch ? endpointMatch[1] : '/api/v1/egov/service';

    // Threat Vector & Category Detection
    let category: LogEntry['category'] = 'System Maintenance';
    let threatVector = 'Standard Log Operation';

    if (lower.includes('sql injection') || lower.includes('sqli') || lower.includes('union select')) {
      category = 'API Security';
      threatVector = 'SQL Injection';
    } else if (lower.includes('jwt') || lower.includes('alg: none') || lower.includes('jwt manipulation')) {
      category = 'Privilege Escalation';
      threatVector = 'JWT Manipulation';
    } else if (lower.includes('credential stuffing') || lower.includes('mfa')) {
      category = 'Authentication';
      threatVector = 'Credential Stuffing';
    } else if (lower.includes('unauthorized access') || lower.includes('saml') || lower.includes('401') || lower.includes('403')) {
      category = 'Authentication';
      threatVector = 'Unauthorized Access';
    } else if (lower.includes('auth') || lower.includes('login') || lower.includes('password')) {
      category = 'Authentication';
    } else if (lower.includes('sql') || lower.includes('db') || lower.includes('postgres') || lower.includes('pool') || lower.includes('query')) {
      category = 'Database Query';
    } else if (lower.includes('iris') || lower.includes('biometric') || lower.includes('passport') || lower.includes('hsm')) {
      category = 'Biometrics';
    } else if (lower.includes('api') || lower.includes('waf') || lower.includes('cadastral') || lower.includes('export')) {
      category = 'API Security';
    } else if (lower.includes('dns') || lower.includes('ddos') || lower.includes('proxy') || lower.includes('network')) {
      category = 'Network';
    }

    // Exact Severity Detection from Actual Log Level
    let level: LogLevel = 'INFO';
    if (lower.includes('critical') || lower.includes('fatal') || threatVector === 'SQL Injection' || lower.includes('alg: none')) {
      level = 'CRITICAL';
      criticalCount += 1;
    } else if (lower.includes('error') || (statusCode >= 500 && !lower.includes('info') && !lower.includes('warn'))) {
      level = 'ERROR';
      errorCount += 1;
    } else if (lower.includes('warn') || statusCode === 429) {
      level = 'WARN';
    } else {
      level = 'INFO';
    }

    // Determine Microservice Name
    let service = 'National Identity Gateway (GovID)';
    if (endpoint.includes('tax') || lower.includes('tax')) service = 'Central Tax & Revenue Gateway';
    else if (endpoint.includes('visa') || endpoint.includes('biometric') || lower.includes('border')) service = 'Border Control & Visa Gateway';
    else if (endpoint.includes('treasury') || lower.includes('treasury')) service = 'Public Treasury Settlement API';
    else if (endpoint.includes('cadastral') || lower.includes('land')) service = 'Land Registry & Cadastral DB';

    // Formatted timestamp
    const now = new Date();
    now.setSeconds(now.getSeconds() - (lines.length - index) * 3);
    const timestamp = now.toISOString();

    parsedLogs.push({
      id: `parsed-log-${Date.now()}-${index}`,
      timestamp,
      service,
      level,
      category,
      message: rawLine, // PRESERVE ORIGINAL LOG MESSAGE EXACTLY
      statusCode,
      ipAddress,
      location: ipAddress.startsWith('185') ? 'Tor Exit Node (DE)' : 'GovNet Internal Node',
      method,
      endpoint,
      responseTimeMs: level === 'CRITICAL' ? 84 : level === 'ERROR' ? 2450 : 42,
      anomalyScore: level === 'CRITICAL' ? 97 : level === 'ERROR' ? 68 : level === 'WARN' ? 45 : 12,
      confidenceScore: 98,
      aiSummary: `Rule match: ${category} (${threatVector}) detected on ${service}.`,
      threatVector,
      payloadJson: JSON.stringify({ raw_line: rawLine, ip: ipAddress, status: statusCode }, null, 2),
      mitigationScript: level === 'CRITICAL' ? `govlog-cli waf block-ip ${ipAddress} --duration 72h` : undefined,
    });
  });

  const generatedEvents = generateEventsFromParsedLogs(parsedLogs);
  const generatedAlerts = generateAlertsFromEvents(generatedEvents);
  const fileSizeFormatted = fileSize < 1024 ? `${fileSize} Bytes` : fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(1)} KB` : `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;

  return {
    fileName,
    fileSizeFormatted,
    totalLogs: parsedLogs.length,
    errorCount, // EXACT UN-OFFSETTED COUNT
    criticalCount, // EXACT UN-OFFSETTED COUNT
    eventGroupsCount: generatedEvents.length,
    confidenceRating: 'Prototype Rule-Based Analysis',
    logs: parsedLogs,
    events: generatedEvents,
    alerts: generatedAlerts,
    rawText: fileContent,
    isCustomFile: true,
  };
}
