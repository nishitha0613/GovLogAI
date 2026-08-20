/**
 * Deterministic Live Threat Score Engine (0-100 Scale)
 * Calculates current system risk strictly from active/unresolved security incidents.
 */

export interface ActiveIncidentItem {
  id: string;
  severity: string;
  status: string;
}

export interface ThreatScoreResult {
  score: number; // 0 to 100
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';
  explanation: string;
  activeCriticalCount: number;
  activeHighCount: number;
  activeMediumCount: number;
  activeLowCount: number;
}

export function computePredictiveThreatScore(incidents: ActiveIncidentItem[]): ThreatScoreResult {
  // Filter ONLY active/unresolved incidents
  const activeIncidents = incidents.filter(
    (item) => item.status !== 'Resolved' && item.status !== 'Dismissed' && item.status !== 'Mitigated'
  );

  let activeCriticalCount = 0;
  let activeHighCount = 0;
  let activeMediumCount = 0;
  let activeLowCount = 0;

  activeIncidents.forEach((item) => {
    const sev = item.severity.toLowerCase();
    if (sev.includes('p1') || sev.includes('critical')) {
      activeCriticalCount += 1;
    } else if (sev.includes('p2') || sev.includes('high')) {
      activeHighCount += 1;
    } else if (sev.includes('p3') || sev.includes('medium')) {
      activeMediumCount += 1;
    } else {
      activeLowCount += 1;
    }
  });

  // Risk weighting per active threat severity: Critical = 40, High = 25, Medium = 15, Low = 5
  const rawRiskPoints =
    activeCriticalCount * 40 +
    activeHighCount * 25 +
    activeMediumCount * 15 +
    activeLowCount * 5;

  const score = Math.min(100, rawRiskPoints);

  // Risk level rating
  let riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk' = 'Low Risk';
  if (score > 85) {
    riskLevel = 'Critical Risk';
  } else if (score > 65) {
    riskLevel = 'High Risk';
  } else if (score > 35) {
    riskLevel = 'Moderate Risk';
  } else {
    riskLevel = 'Low Risk';
  }

  // Dynamic explanation text generation
  const parts: string[] = [];
  if (activeCriticalCount > 0) {
    parts.push(`${activeCriticalCount} active Critical threat${activeCriticalCount > 1 ? 's' : ''}`);
  }
  if (activeHighCount > 0) {
    parts.push(`${activeHighCount} active High threat${activeHighCount > 1 ? 's' : ''}`);
  }
  if (activeMediumCount > 0) {
    parts.push(`${activeMediumCount} active Medium threat${activeMediumCount > 1 ? 's' : ''}`);
  }
  if (activeLowCount > 0) {
    parts.push(`${activeLowCount} active Low threat${activeLowCount > 1 ? 's' : ''}`);
  }

  let explanation = 'No active security threats detected. System posture is normal.';
  if (parts.length > 0) {
    if (parts.length === 1) {
      explanation = `Based on ${parts[0]}.`;
    } else if (parts.length === 2) {
      explanation = `Based on ${parts[0]} and ${parts[1]}.`;
    } else {
      explanation = `Based on ${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}.`;
    }
  }

  return {
    score,
    riskLevel,
    explanation,
    activeCriticalCount,
    activeHighCount,
    activeMediumCount,
    activeLowCount,
  };
}
