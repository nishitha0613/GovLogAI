import type { LogEntry } from '../types/log';

export const mockLogEntries: LogEntry[] = [
  {
    id: 'log-1001',
    timestamp: '2026-08-20T14:26:45.102Z',
    service: 'Border Control & Visa Gateway',
    level: 'CRITICAL',
    category: 'Biometrics',
    message: 'SQL Injection attempt detected in visa passport lookup API payload',
    statusCode: 403,
    ipAddress: '185.220.101.44',
    location: 'Frankfurt, DE (Tor Exit Node)',
    method: 'POST',
    endpoint: '/api/v2/visa/verify-passport',
    responseTimeMs: 84,
    anomalyScore: 97,
    confidenceScore: 99.4,
    aiSummary: 'High-confidence SQLi threat vector detected targeting passport verification query parameter. Input payload contained UNION SELECT statements aiming to dump sovereign citizen biometric metadata.',
    threatVector: 'CWE-89: SQL Injection / OWASP A03:2021',
    payloadJson: JSON.stringify({
      passport_no: "' UNION SELECT 1, citizen_ssn, biometric_hash FROM citizen_db.master_identity --",
      request_origin: "api-client-v1.4",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GovHack/3.1"
    }, null, 2),
    mitigationScript: `# Auto-Generated GovLogAI Mitigation Playbook
govlog-cli waf block-ip 185.220.101.44 --duration 72h --reason "SQLi attack on Border Gateway"
kubectl scale deployment/border-visa-gateway --replicas=16 -n egov-border`
  },
  {
    id: 'log-1002',
    timestamp: '2026-08-20T14:26:42.881Z',
    service: 'National Identity Gateway (GovID)',
    level: 'WARN',
    category: 'Authentication',
    message: 'Abnormal authentication rate spike detected for citizen login portal',
    statusCode: 429,
    ipAddress: '194.26.29.112',
    location: 'Moscow, RU',
    method: 'POST',
    endpoint: '/api/v1/auth/mfa-verify',
    responseTimeMs: 145,
    anomalyScore: 78,
    confidenceScore: 94.2,
    aiSummary: 'Credential stuffing signature detected: 450 failed MFA attempts within 15 seconds targeting sequential citizen identification numbers.',
    threatVector: 'CWE-307: Credential Stuffing / OWASP A07:2021',
    payloadJson: JSON.stringify({
      citizen_id: "NAT-ID-88402911",
      mfa_token: "994012",
      attempt_count: 45
    }, null, 2),
    mitigationScript: `govlog-cli rate-limit set --endpoint "/api/v1/auth/mfa-verify" --max-requests 5 --window 60s
govlog-cli mfa enforce-captcha --tier strict`
  },
  {
    id: 'log-1003',
    timestamp: '2026-08-20T14:26:38.204Z',
    service: 'Central Tax & Revenue Gateway',
    level: 'ERROR',
    category: 'Database Query',
    message: 'Database connection pool exhausted during peak tax return submission',
    statusCode: 500,
    ipAddress: '10.240.12.89',
    location: 'Internal Pod (K8s Cluster East-1)',
    method: 'POST',
    endpoint: '/api/v3/tax/submit-annual-return',
    responseTimeMs: 2450,
    anomalyScore: 65,
    confidenceScore: 91.8,
    aiSummary: 'Internal system bottleneck: Postgres connection pool reached 100% capacity (250/250 connections) due to unindexed query in tax calculation microservice.',
    threatVector: 'Operational Bottleneck / Connection Starvation',
    payloadJson: JSON.stringify({
      tax_year: 2026,
      filing_type: "corporate_annual",
      db_wait_time_ms: 2400,
      active_connections: 250
    }, null, 2),
    mitigationScript: `kubectl patch deployment/tax-revenue-gateway -n egov-tax --patch '{"spec":{"template":{"spec":{"containers":[{"name":"app","env":[{"name":"DB_POOL_MAX","value":"500"}]}]}}}}'
govlog-cli db exec-query "REINDEX TABLE corporate_filings;"`
  },
  {
    id: 'log-1004',
    timestamp: '2026-08-20T14:26:35.019Z',
    service: 'National Health Exchange (EHR)',
    level: 'INFO',
    category: 'API Security',
    message: 'Authorized medical record query by National Hospital Central Node',
    statusCode: 200,
    ipAddress: '10.128.4.15',
    location: 'GovNet Private VPN Node #4',
    method: 'GET',
    endpoint: '/api/v1/patients/EHR-992014/summary',
    responseTimeMs: 38,
    anomalyScore: 4,
    confidenceScore: 99.9,
    aiSummary: 'Normal authorized traffic: Valid SAML assertion from certified hospital practitioner.',
    threatVector: 'None (Legitimate Operation)',
    payloadJson: JSON.stringify({
      practitioner_id: "MD-GOV-44810",
      facility_code: "HOSP-CENTRAL-01",
      saml_session_valid: true
    }, null, 2),
    mitigationScript: `# No action required. Audit log entry recorded.`
  },
  {
    id: 'log-1005',
    timestamp: '2026-08-20T14:26:31.990Z',
    service: 'Land Registry & Cadastral DB',
    level: 'WARN',
    category: 'API Security',
    message: 'Unusual bulk download request of property title GIS boundaries',
    statusCode: 200,
    ipAddress: '103.21.244.78',
    location: 'Singapore, SG',
    method: 'GET',
    endpoint: '/api/v2/cadastral/spatial-export?format=geojson&limit=10000',
    responseTimeMs: 890,
    anomalyScore: 71,
    confidenceScore: 88.5,
    aiSummary: 'Data scraping alert: API key registered to commercial vendor requesting unusually large bulk spatial export exceeding normal daily quotas.',
    threatVector: 'CWE-200: Unsanitized Data Scraping',
    payloadJson: JSON.stringify({
      api_key_id: "vendor_key_99201",
      records_requested: 10000,
      daily_usage_percentage: 92.4
    }, null, 2),
    mitigationScript: `govlog-cli quota-enforce --key "vendor_key_99201" --throttle 50
govlog-cli audit alert --channel secops-slack --msg "Potential land data scraping detected"`
  },
  {
    id: 'log-1006',
    timestamp: '2026-08-20T14:26:28.441Z',
    service: 'Public Treasury Settlement API',
    level: 'CRITICAL',
    category: 'Privilege Escalation',
    message: 'Privilege escalation attempt on treasury disbursement approval endpoint',
    statusCode: 401,
    ipAddress: '45.154.255.89',
    location: 'Warsaw, PL',
    method: 'POST',
    endpoint: '/api/v1/treasury/authorize-disbursement',
    responseTimeMs: 62,
    anomalyScore: 99,
    confidenceScore: 99.8,
    aiSummary: 'Zero-Day exploit signature: JWT algorithm manipulation attack ("alg": "none") paired with forged public officer signature payload aiming to bypass multi-signature payout clearance.',
    threatVector: 'CWE-347: Improper Verification of Cryptographic Signature',
    payloadJson: JSON.stringify({
      token_header: { alg: "none", typ: "JWT" },
      claim: { role: "Chief_Treasury_Auditor", disbursement_id: "DISB-2026-991204", amount: "$4,500,000" }
    }, null, 2),
    mitigationScript: `govlog-cli jwt-policy enforce --disallow-none-alg true
govlog-cli incident trigger --severity P1 --title "CRITICAL: JWT Forgery on Treasury"
govlog-cli firewall block-ip 45.154.255.89`
  },
  {
    id: 'log-1007',
    timestamp: '2026-08-20T14:26:24.118Z',
    service: 'Border Control & Visa Gateway',
    level: 'FATAL',
    category: 'Biometrics',
    message: 'Border node biometric matcher daemon lost connection to HSM key vault',
    statusCode: 503,
    ipAddress: '10.250.0.12',
    location: 'Border Checkpoint International Terminal 1',
    method: 'POST',
    endpoint: '/api/v2/biometrics/match-iris',
    responseTimeMs: 3100,
    anomalyScore: 94,
    confidenceScore: 97.6,
    aiSummary: 'Critical hardware failure / Air-gap disconnect: Hardware Security Module (HSM) socket connection timed out. Iris matcher fallback mode initiated.',
    threatVector: 'Infrastructure Disruption / Key Vault Unreachable',
    payloadJson: JSON.stringify({
      hsm_endpoint: "hsm-vault-cluster.gov.internal:8443",
      error_code: "ETIMEDOUT",
      failover_status: "STANDBY_NODE_SYNCING"
    }, null, 2),
    mitigationScript: `govlog-cli hsm-failover --target hsm-vault-cluster-backup.gov.internal
kubectl rollout restart deployment/biometric-matcher -n egov-border`
  },
  {
    id: 'log-1008',
    timestamp: '2026-08-20T14:26:19.554Z',
    service: 'National Identity Gateway (GovID)',
    level: 'INFO',
    category: 'System Maintenance',
    message: 'Batch citizen digital certificate renewal completed successfully',
    statusCode: 200,
    ipAddress: '10.128.0.5',
    location: 'GovCloud Master Node 1',
    method: 'POST',
    endpoint: '/api/v1/certs/cron-renew-batch',
    responseTimeMs: 412,
    anomalyScore: 2,
    confidenceScore: 99.9,
    aiSummary: 'Scheduled System Task: 1,250 X.509 digital certificates renewed for civic portal authentication.',
    threatVector: 'None (Scheduled Maintenance)',
    payloadJson: JSON.stringify({
      certs_processed: 1250,
      expired: 0,
      renewed: 1250
    }, null, 2),
    mitigationScript: `# Routine job execution completed successfully.`
  }
];
