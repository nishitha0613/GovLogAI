import type { SecurityEvent } from '../types/log';
import { mockLogEntries } from './mockLogs';

export const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'EVT-901',
    timestamp: '2026-08-20T14:15:00Z',
    firstSeen: '14:12:10',
    lastSeen: '14:15:00',
    title: 'JWT Algorithm Manipulation Attack targeting Public Treasury API',
    category: 'Privilege Escalation',
    severity: 'P1 Critical',
    affectedService: 'Public Treasury Settlement API',
    occurrences: 14,
    logsCount: 14,
    status: 'Active',
    aiRootCause: 'An external adversary (IP 45.154.255.89) attempted to exploit unvalidated JWT signatures by setting header algorithm to "none". Attack correlated across 14 logs within 3 minutes.',
    whyGroupedExplanation: 'Grouped via IP correlation (45.154.255.89) + shared endpoint target (/api/v1/treasury/authorize-disbursement) + consecutive HTTP 401 & 403 authorization failures with identical "alg: none" header fingerprint.',
    recommendedActions: [
      'Enforce strict JWT signature verification disallowing "alg: none" across all gateway pods.',
      'Auto-block source CIDR 45.154.255.0/24 on Cloudflare Enterprise WAF.',
      'Revoke active session tokens for associated public officer role "Chief_Treasury_Auditor".',
      'Escalate incident report to GovCert Senior Threat Analyst.'
    ],
    threatActorIp: '45.154.255.89',
    country: 'Poland (VPN / Compromised Exit Node)',
    mitigationExecuted: true,
    mitigationPlaybook: 'govlog-cli jwt-policy enforce --disallow-none-alg true && govlog-cli firewall block-ip 45.154.255.89',
    timeline: [
      { id: 't-1', time: '14:12:10', description: 'Reconnaissance probe on /api/v1/treasury/authorize-disbursement', actor: '45.154.255.89', type: 'log' },
      { id: 't-2', time: '14:13:45', description: 'Malformed JWT payload with "alg: none" sent to authorization endpoint', actor: '45.154.255.89', type: 'log' },
      { id: 't-3', time: '14:13:48', description: 'GovLogAI Engine detected zero-day privilege escalation pattern (Confidence: 99%)', actor: 'GovLogAI Neural Engine', type: 'ai_detect' },
      { id: 't-4', time: '14:14:02', description: 'Automated Playbook #804 Triggered: Blocked CIDR 45.154.255.0/24 on Cloudflare Enterprise WAF', actor: 'Automated Playbook', type: 'auto_block' },
      { id: 't-5', time: '14:15:00', description: 'Incident assigned to GovCert Senior Threat Analyst J. Miller', actor: 'System', type: 'human_action' }
    ],
    relatedLogs: [mockLogEntries[5], mockLogEntries[0]]
  },
  {
    id: 'EVT-902',
    timestamp: '2026-08-20T13:42:12Z',
    firstSeen: '13:30:00',
    lastSeen: '13:42:12',
    title: 'Distributed Credential Stuffing Campaign on National Identity Portal',
    category: 'Authentication',
    severity: 'P2 High',
    affectedService: 'National Identity Gateway (GovID)',
    occurrences: 4280,
    logsCount: 4280,
    status: 'Investigating',
    aiRootCause: 'Coordinated botnet distributing credential validation requests across 120 proxy nodes targeting citizen MFA accounts.',
    whyGroupedExplanation: 'Grouped via spike pattern recognition (4,280 requests/min) + sequential citizen ID query payloads + high ratio of HTTP 429 & 401 responses on /api/v1/auth/mfa-verify.',
    recommendedActions: [
      'Activate Cloudflare Bot Management Challenge Mode for GovID login portal.',
      'Set API rate limit to max 5 requests per 60 seconds per citizen ID.',
      'Enforce mandatory Captcha challenge for sequential authentication retries.'
    ],
    threatActorIp: '194.26.29.112 (+119 IP addresses)',
    country: 'Multi-region Botnet Cluster',
    mitigationExecuted: true,
    mitigationPlaybook: 'govlog-cli rate-limit set --endpoint "/api/v1/auth/mfa-verify" --max-requests 5 --window 60s',
    timeline: [
      { id: 't-10', time: '13:30:00', description: 'Spike in HTTP 429 & 401 responses on /api/v1/auth/mfa-verify', actor: 'Multi-IP Botnet', type: 'log' },
      { id: 't-11', time: '13:35:12', description: 'GovLogAI correlation engine linked 4,280 request logs to single credential stuffing pattern', actor: 'GovLogAI Neural Engine', type: 'ai_detect' },
      { id: 't-12', time: '13:36:00', description: 'Activated Cloudflare Bot Management Challenge Mode for GovID portal', actor: 'Automated Playbook', type: 'auto_block' }
    ],
    relatedLogs: [mockLogEntries[1], mockLogEntries[7]]
  },
  {
    id: 'EVT-903',
    timestamp: '2026-08-20T11:05:30Z',
    firstSeen: '11:00:15',
    lastSeen: '11:05:30',
    title: 'SQL Injection Biometric Extraction Attack on Border Control Gateway',
    category: 'API Security',
    severity: 'P1 Critical',
    affectedService: 'Border Control & Visa Gateway',
    occurrences: 86,
    logsCount: 86,
    status: 'Mitigated',
    aiRootCause: 'Malicious query payloads targeting passport verification API. AI Engine isolated endpoint container before data extraction occurred.',
    whyGroupedExplanation: 'Grouped via signature matching (UNION SELECT payloads) + IP 185.220.101.44 (Tor Exit Node) + 86 consecutive HTTP 403 blocks on /api/v2/visa/verify-passport.',
    recommendedActions: [
      'Isolate compromised K8s pod border-visa-gateway-77d9.',
      'Block Tor Exit Node 185.220.101.44 on WAF for 72 hours.',
      'Audit passport verification SQL queries for parameterized binding.'
    ],
    threatActorIp: '185.220.101.44',
    country: 'Germany (Tor Exit Node)',
    mitigationExecuted: true,
    mitigationPlaybook: 'govlog-cli waf block-ip 185.220.101.44 --duration 72h',
    timeline: [
      { id: 't-20', time: '11:00:15', description: 'Multiple UNION SELECT payloads detected in passport verification POST body', actor: '185.220.101.44', type: 'log' },
      { id: 't-21', time: '11:02:40', description: 'GovLogAI AI Copilot classified attack vector as high-severity biometric database extraction attempt', actor: 'GovLogAI Neural Engine', type: 'ai_detect' },
      { id: 't-22', time: '11:03:00', description: 'Container pod border-visa-gateway-77d9 Isolated & IP auto-blocked', actor: 'Automated Playbook', type: 'auto_block' }
    ],
    relatedLogs: [mockLogEntries[0], mockLogEntries[6]]
  },
  {
    id: 'EVT-904',
    timestamp: '2026-08-20T10:14:00Z',
    firstSeen: '10:10:00',
    lastSeen: '10:14:00',
    title: 'Postgres Connection Pool 100% Starvation on Central Tax Gateway',
    category: 'Database Failure',
    severity: 'P2 High',
    affectedService: 'Central Tax & Revenue Gateway',
    occurrences: 250,
    logsCount: 250,
    status: 'Active',
    aiRootCause: 'Unindexed query in tax calculation microservice holding 250/250 DB connection sockets during peak tax submission window.',
    whyGroupedExplanation: 'Grouped via error cascade (HTTP 500 DB connection timeouts) + shared database cluster pod + unindexed query signature across 250 concurrent requests.',
    recommendedActions: [
      'Execute SQL reindex on corporate_filings table.',
      'Scale K8s horizontal pod autoscaler DB pool capacity from 250 to 500.',
      'Restart tax calculation microservice worker pods.'
    ],
    threatActorIp: '10.240.12.89 (Internal Pod)',
    country: 'Internal GovCloud K8s Cluster',
    mitigationExecuted: false,
    mitigationPlaybook: 'kubectl patch deployment/tax-revenue-gateway -n egov-tax --patch \'{"spec":{"replicas":16}}\'',
    timeline: [
      { id: 't-30', time: '10:10:00', description: 'DB connection wait time spiked to 2,450ms', actor: '10.240.12.89', type: 'log' },
      { id: 't-31', time: '10:12:00', description: 'GovLogAI flagged Postgres connection starvation bottleneck', actor: 'GovLogAI Neural Engine', type: 'ai_detect' }
    ],
    relatedLogs: [mockLogEntries[2]]
  },
  {
    id: 'EVT-905',
    timestamp: '2026-08-20T09:12:00Z',
    firstSeen: '09:05:00',
    lastSeen: '09:12:00',
    title: 'Unauthorized Bulk Spatial Data Export from Land Registry Cadastral DB',
    category: 'Unauthorized Access',
    severity: 'P3 Medium',
    affectedService: 'Land Registry & Cadastral DB',
    occurrences: 154,
    logsCount: 154,
    status: 'Resolved',
    aiRootCause: 'Exceeded API query rate limits for commercial spatial data vendor key. No sensitive citizen data compromised.',
    whyGroupedExplanation: 'Grouped via API key tracking (vendor_key_99201) + 10,000 spatial parcel export payload size + consecutive quota warnings.',
    recommendedActions: [
      'Apply rate throttle tier to vendor API key.',
      'Send formal compliance reminder to commercial partner.',
      'Enforce paginated spatial boundary queries.'
    ],
    threatActorIp: '103.21.244.78',
    country: 'Singapore',
    mitigationExecuted: true,
    mitigationPlaybook: 'govlog-cli quota-enforce --key "vendor_key_99201" --throttle 50',
    timeline: [
      { id: 't-40', time: '09:05:00', description: '10,000 GeoJSON parcel records requested in single query', actor: '103.21.244.78', type: 'log' },
      { id: 't-41', time: '09:12:00', description: 'Applied rate limit tier to partner key', actor: 'System', type: 'human_action' }
    ],
    relatedLogs: [mockLogEntries[4]]
  }
];
