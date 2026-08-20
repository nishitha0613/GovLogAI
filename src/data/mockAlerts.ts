import type { AlertItem } from '../types/log';

export const mockAlerts: AlertItem[] = [
  {
    id: 'ALT-1001',
    timestamp: '2026-08-20T14:15:00Z',
    title: 'Unauthorized Access & JWT Forgery Attempt',
    description: 'Critical detection: Adversary IP 45.154.255.89 attempted to bypass public treasury authorization using forged JWT header with "alg": "none".',
    severity: 'P1 Critical',
    service: 'Public Treasury Settlement API',
    status: 'Open',
    assignedTo: 'GovCert SecOps Lead',
    autoMitigated: true,
    ruleTriggered: 'RULE-SEC-09: Invalid Cryptographic Header Pattern',
    actionTaken: 'Blocked CIDR 45.154.255.0/24 on WAF & Revoked active sessions',
    aiRecommendedResponse: 'Validate strict JWT algorithm whitelist across all Treasury API gateways. Ensure public key signature verification is enforced at the mesh ingress level.',
    cliPlaybook: 'govlog-cli jwt-policy enforce --disallow-none-alg true && govlog-cli waf block-ip 45.154.255.89',
    relatedEventId: 'EVT-901',
    timeline: [
      { time: '14:15:00', text: 'Alert triggered by Neural Ingestion Rule #SEC-09', author: 'GovLogAI Engine' },
      { time: '14:15:02', text: 'Auto-mitigation playbook executed: WAF IP block active', author: 'Automated Playbook' }
    ]
  },
  {
    id: 'ALT-1002',
    timestamp: '2026-08-20T14:10:00Z',
    title: 'Database Connection Failure & Socket Exhaustion',
    description: 'Postgres connection pool reached 100% capacity (250/250 DB sockets) on tax revenue microservice cluster during peak return window.',
    severity: 'P1 Critical',
    service: 'Central Tax & Revenue Gateway',
    status: 'Open',
    assignedTo: 'DBA On-Call Engineer',
    autoMitigated: false,
    ruleTriggered: 'RULE-OPS-03: DB Socket Pool > 95% Capacity',
    aiRecommendedResponse: 'Execute emergency SQL table reindex on corporate_filings table and scale K8s horizontal pod autoscaler DB pool limits from 250 to 500.',
    cliPlaybook: 'kubectl patch deployment/tax-revenue-gateway -n egov-tax --patch \'{"spec":{"replicas":16}}\'',
    relatedEventId: 'EVT-904',
    timeline: [
      { time: '14:10:00', text: 'DB pool connection wait time exceeded 2,400ms threshold', author: 'K8s Monitor' }
    ]
  },
  {
    id: 'ALT-1003',
    timestamp: '2026-08-20T13:45:00Z',
    title: 'Authentication Failure Spike & Credential Stuffing',
    description: '4,280 failed MFA authentication requests within 60s across 120 proxy IPs targeting sequential citizen GovID accounts.',
    severity: 'P2 High',
    service: 'National Identity Gateway (GovID)',
    status: 'Acknowledged',
    assignedTo: 'Identity Security Analyst',
    autoMitigated: true,
    ruleTriggered: 'RULE-AUTH-12: Citizen MFA Failure Rate > 500/min',
    actionTaken: 'Enforced Captcha challenge tier-3 & set API rate limit to 5 req/min',
    aiRecommendedResponse: 'Maintain strict rate limiting per citizen ID. Enable Cloudflare Bot Management Challenge Mode for all GovID login portals.',
    cliPlaybook: 'govlog-cli rate-limit set --endpoint "/api/v1/auth/mfa-verify" --max-requests 5 --window 60s',
    relatedEventId: 'EVT-902',
    timeline: [
      { time: '13:45:00', text: 'MFA failure spike detected across 120 proxy IPs', author: 'GovLogAI Engine' },
      { time: '13:46:12', text: 'Acknowledged by Identity Analyst M. Taylor', author: 'M. Taylor' }
    ]
  },
  {
    id: 'ALT-1004',
    timestamp: '2026-08-20T12:30:00Z',
    title: 'Disk Usage Critical (94% Storage Capacity)',
    description: 'Sovereign Log Storage Vault Node #4 reached 94% storage capacity threshold (342GB out of 360GB max allocated volume).',
    severity: 'P2 High',
    service: 'Sovereign Encrypted Storage Vault',
    status: 'Open',
    assignedTo: 'Infrastructure Admin',
    autoMitigated: false,
    ruleTriggered: 'RULE-INFRA-01: Storage Disk Mount > 90%',
    aiRecommendedResponse: 'Trigger cold storage archive compaction job to flush logs older than 90 days to encrypted Glacier tape storage.',
    cliPlaybook: 'govlog-cli storage compact --older-than 90d --compress zstd',
    timeline: [
      { time: '12:30:00', text: 'Storage volume /mnt/logvault4 mount exceeded 90% threshold', author: 'Disk Sentinel' }
    ]
  },
  {
    id: 'ALT-1005',
    timestamp: '2026-08-20T11:05:00Z',
    title: 'Biometric Extraction SQL Injection Attempt',
    description: 'UNION SELECT SQL injection attempt targeting passport lookup endpoint from Tor Exit Node IP 185.220.101.44.',
    severity: 'P1 Critical',
    service: 'Border Control & Visa Gateway',
    status: 'Acknowledged',
    assignedTo: 'Border Control Cyber Lead',
    autoMitigated: true,
    ruleTriggered: 'RULE-SEC-01: OWASP SQLi Signature Match',
    actionTaken: 'Blocked Tor IP 185.220.101.44 & isolated worker pod',
    aiRecommendedResponse: 'Maintain 72h WAF IP block. Verify parameterized SQL binding on /api/v2/visa/verify-passport endpoint code.',
    cliPlaybook: 'govlog-cli waf block-ip 185.220.101.44 --duration 72h',
    relatedEventId: 'EVT-903',
    timeline: [
      { time: '11:05:00', text: 'SQLi pattern intercepted on Border Gateway', author: 'GovLogAI Engine' },
      { time: '11:06:00', text: 'Acknowledged by Cyber Lead A. Vance', author: 'A. Vance' }
    ]
  },
  {
    id: 'ALT-1006',
    timestamp: '2026-08-20T09:15:00Z',
    title: 'Commercial API Quota Rate Exceeded',
    description: 'Land Registry Cadastral DB API key vendor_key_99201 requested 10,000 spatial GeoJSON records in single query.',
    severity: 'P3 Medium',
    service: 'Land Registry & Cadastral DB',
    status: 'Resolved',
    assignedTo: 'Partner Relations Lead',
    autoMitigated: true,
    ruleTriggered: 'RULE-API-04: Bulk Spatial Query Limit Exceeded',
    actionTaken: 'Enforced query quota throttle tier & notified partner',
    aiRecommendedResponse: 'Ensure commercial API keys enforce max 1,000 records per paginated request.',
    cliPlaybook: 'govlog-cli quota-enforce --key "vendor_key_99201" --throttle 50',
    relatedEventId: 'EVT-905',
    timeline: [
      { time: '09:15:00', text: 'Quota alert triggered for key vendor_key_99201', author: 'API Gateway' },
      { time: '09:30:00', text: 'Marked resolved after partner confirmed quota adjustment', author: 'Partner Team' }
    ]
  }
];
