/**
 * Local Threat Intelligence Correlation Engine
 * Correlates extracted IPs and user agents against local Indicator of Compromise (IoC) databases.
 * Labeled clearly as: "Local IoC Threat Feed"
 */

export interface ThreatIntelMatch {
  ip: string;
  isBlacklisted: boolean;
  threatCategory: string;
  reputationScore: number; // 0 (Clean) to 100 (Malicious)
  feedName: string;
}

// Local IoC Database (Extensible to STIX/TAXII feed ingestion)
const LOCAL_IOC_DB: Record<string, { category: string; score: number; feed: string }> = {
  '185.220.101.44': { category: 'Tor Exit Node / Scanner', score: 95, feed: 'Local Tor Exit List IoC' },
  '185.220.100.240': { category: 'Known Malicious Scanner', score: 90, feed: 'GovCert Threat Feed v4' },
  '198.51.100.42': { category: 'Automated Botnet IP', score: 85, feed: 'GovCert Threat Feed v4' },
};

export function correlateThreatIntel(ip: string): ThreatIntelMatch {
  if (LOCAL_IOC_DB[ip]) {
    const match = LOCAL_IOC_DB[ip];
    return {
      ip,
      isBlacklisted: true,
      threatCategory: match.category,
      reputationScore: match.score,
      feedName: match.feed,
    };
  }

  // Check if Tor IP range or external IP
  const isTorRange = ip.startsWith('185.220.');
  if (isTorRange) {
    return {
      ip,
      isBlacklisted: true,
      threatCategory: 'Tor Exit Node Subnet',
      reputationScore: 88,
      feedName: 'Local Tor Subnet IoC Feed',
    };
  }

  return {
    ip,
    isBlacklisted: false,
    threatCategory: 'Clean / Internal Ingress',
    reputationScore: 0,
    feedName: 'Local Sovereign IoC Database',
  };
}
