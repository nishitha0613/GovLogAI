export const mockThroughputData = [
  { time: '00:00', eventsPerSec: 18400, bandwidthMbps: 42.1, threatsPerSec: 12 },
  { time: '02:00', eventsPerSec: 14200, bandwidthMbps: 35.8, threatsPerSec: 8 },
  { time: '04:00', eventsPerSec: 12100, bandwidthMbps: 29.4, threatsPerSec: 5 },
  { time: '06:00', eventsPerSec: 16500, bandwidthMbps: 38.0, threatsPerSec: 15 },
  { time: '08:00', eventsPerSec: 28900, bandwidthMbps: 68.4, threatsPerSec: 42 },
  { time: '10:00', eventsPerSec: 41200, bandwidthMbps: 94.2, threatsPerSec: 88 },
  { time: '12:00', eventsPerSec: 48600, bandwidthMbps: 112.8, threatsPerSec: 145 },
  { time: '14:00', eventsPerSec: 52400, bandwidthMbps: 124.5, threatsPerSec: 198 },
  { time: '16:00', eventsPerSec: 46100, bandwidthMbps: 105.2, threatsPerSec: 92 },
  { time: '18:00', eventsPerSec: 38200, bandwidthMbps: 84.1, threatsPerSec: 54 },
  { time: '20:00', eventsPerSec: 29400, bandwidthMbps: 62.9, threatsPerSec: 31 },
  { time: '22:00', eventsPerSec: 22100, bandwidthMbps: 48.7, threatsPerSec: 18 },
];

export const mockStatusDistribution = [
  { name: '200 OK (Healthy)', count: 38450100, color: '#10b981' },
  { name: '304 Not Modified', count: 2840200, color: '#3b82f6' },
  { name: '401 Unauthorized', count: 892400, color: '#f59e0b' },
  { name: '403 Forbidden (Blocked)', count: 482100, color: '#ec4899' },
  { name: '429 Rate Limited', count: 182300, color: '#8b5cf6' },
  { name: '500 Server Error', count: 42800, color: '#ef4444' },
  { name: '503 Gateway Timeout', count: 11400, color: '#dc2626' },
];

export const mockCategoryBreakdown = [
  { category: 'Authentication', count: 18450200, percentage: 43.0, color: '#06b6d4' },
  { category: 'API Security', count: 12140800, percentage: 28.3, color: '#3b82f6' },
  { category: 'Database Query', count: 6890400, percentage: 16.1, color: '#f59e0b' },
  { category: 'Biometrics', count: 3120000, percentage: 7.3, color: '#ec4899' },
  { category: 'Privilege Escalation', count: 1420000, percentage: 3.3, color: '#f43f5e' },
  { category: 'System Maintenance', count: 869640, percentage: 2.0, color: '#10b981' },
];

export const mockServiceStats = [
  { name: 'National Identity Gateway (GovID)', errorRate: '0.42%', incidents: 1, latencyP99: '110ms', sla: '99.98%', status: 'Healthy' },
  { name: 'Central Tax & Revenue Gateway', errorRate: '4.85%', incidents: 2, latencyP99: '1250ms', sla: '99.45%', status: 'Degraded' },
  { name: 'Border Control & Visa Gateway', errorRate: '1.24%', incidents: 1, latencyP99: '3400ms', sla: '99.88%', status: 'Healthy' },
  { name: 'Public Treasury Settlement API', errorRate: '0.08%', incidents: 1, latencyP99: '78ms', sla: '99.99%', status: 'Healthy' },
  { name: 'Land Registry & Cadastral DB', errorRate: '0.94%', incidents: 1, latencyP99: '290ms', sla: '99.92%', status: 'Healthy' },
];

export const mockIncidentTrends = [
  { day: 'Mon', critical: 12, high: 28, mttrSeconds: 1.8 },
  { day: 'Tue', critical: 8, high: 22, mttrSeconds: 1.6 },
  { day: 'Wed', critical: 18, high: 34, mttrSeconds: 1.4 },
  { day: 'Thu', critical: 14, high: 26, mttrSeconds: 1.4 },
  { day: 'Fri', critical: 22, high: 41, mttrSeconds: 1.3 },
  { day: 'Sat', critical: 6, high: 14, mttrSeconds: 1.2 },
  { day: 'Sun', critical: 9, high: 18, mttrSeconds: 1.4 },
];

export const mockRecurringIssues = [
  {
    id: 'rec-1',
    signature: 'CWE-89: SQL Injection / UNION SELECT Payload',
    service: 'Border Control & Visa Gateway',
    occurrences: 86,
    trend: '+12%',
    impact: 'Biometric DB Probe Attempt',
    severity: 'P1 Critical'
  },
  {
    id: 'rec-2',
    signature: 'Operational: Postgres Socket Pool 100% Starvation',
    service: 'Central Tax & Revenue Gateway',
    occurrences: 250,
    trend: '+45%',
    impact: 'Corporate Return Submission Timeout',
    severity: 'P2 High'
  },
  {
    id: 'rec-3',
    signature: 'CWE-307: Credential Stuffing / MFA Spray',
    service: 'National Identity Gateway (GovID)',
    occurrences: 4280,
    trend: '+180%',
    impact: 'Citizen Account Lockout Risk',
    severity: 'P2 High'
  },
  {
    id: 'rec-4',
    signature: 'CWE-347: JWT "alg: none" Signature Manipulation',
    service: 'Public Treasury Settlement API',
    occurrences: 14,
    trend: 'New Attack',
    impact: 'Payout Clearance Authorization Bypass',
    severity: 'P1 Critical'
  }
];

export const mockAiGeneratedInsights = [
  {
    id: 'ai-ins-1',
    type: 'Threat Anomaly Pattern',
    title: 'Tor Exit Node Correlation across Border & Treasury endpoints',
    impact: 'Adversary IP 185.220.101.44 executed preliminary port scans on Treasury before launching SQLi payload on Visa lookup.',
    recommendation: 'Apply unified IP blacklisting rule across all ingress gateway routers.',
    confidence: '99.4%'
  },
  {
    id: 'ai-ins-2',
    type: 'Capacity Bottleneck',
    title: 'Postgres Connection Exhaustion pattern during 14:00 tax window',
    impact: 'Unindexed corporate_filings table query causes connection sockets to stay open 12x longer than baseline.',
    recommendation: 'Execute database reindex and auto-scale K8s DB pool replicas to 16.',
    confidence: '96.8%'
  },
  {
    id: 'ai-ins-3',
    type: 'Predictive Anomaly Warning',
    title: '88% Probability DDoS spike predicted between 18:00–19:00',
    impact: 'Botnet ping activity detected on GovID authentication endpoints matching historical DDoS signature pre-cursors.',
    recommendation: 'Pre-scale GovID K8s pods to 32 replicas and activate WAF aggressive rate limiting.',
    confidence: '91.2%'
  }
];

export const mockLatencyPercentiles = [
  { service: 'GovID Auth', p50: 24, p90: 48, p99: 110 },
  { service: 'Tax Gateway', p50: 180, p90: 420, p99: 1250 },
  { service: 'Health Exchange', p50: 38, p90: 72, p99: 140 },
  { service: 'Land Registry', p50: 62, p90: 115, p99: 290 },
  { service: 'Border Gateway', p50: 410, p90: 1120, p99: 3400 },
  { service: 'Treasury API', p50: 18, p90: 35, p99: 78 },
];

export const mockThreatOriginData = [
  { country: 'Tor Exit Nodes (DE/NL)', attackCount: 14250, threatType: 'SQLi & Port Scans' },
  { country: 'Russian Federation', attackCount: 9820, threatType: 'Credential Stuffing' },
  { country: 'Poland / Eastern EU', attackCount: 4120, threatType: 'JWT Forgery' },
  { country: 'Southeast Asia Proxies', attackCount: 3840, threatType: 'Data Scraping' },
  { country: 'Internal Rogue Pods', attackCount: 420, threatType: 'Misconfiguration' },
];

export const mockPredictiveForecast = [
  { time: '15:00', actual: 52400, predicted: 51800, anomalyProbability: 12 },
  { time: '16:00', actual: 46100, predicted: 47000, anomalyProbability: 18 },
  { time: '17:00', actual: null, predicted: 43200, anomalyProbability: 25 },
  { time: '18:00', actual: null, predicted: 39500, anomalyProbability: 64 },
  { time: '19:00', actual: null, predicted: 48900, anomalyProbability: 88 },
  { time: '20:00', actual: null, predicted: 32100, anomalyProbability: 40 },
  { time: '21:00', actual: null, predicted: 26400, anomalyProbability: 15 },
];
