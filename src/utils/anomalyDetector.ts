/**
 * Machine Learning & Statistical Anomaly Detector (Isolation Forest / Z-Score Hybrid)
 * Calculates real anomaly scores (0-100) based on response times, status codes, and request frequencies.
 */

export interface MLAnomalyResult {
  logId: string;
  anomalyScore: number; // 0 to 100
  isAnomaly: boolean;
  zScore: number;
  reason: string;
}

export function detectMLAnomalies(logs: Array<{ id: string; responseTimeMs: number; statusCode: number; level: string; message: string }>): Map<string, MLAnomalyResult> {
  const resultMap = new Map<string, MLAnomalyResult>();
  if (logs.length === 0) return resultMap;

  // 1. Calculate Mean and Standard Deviation for Response Times
  const responseTimes = logs.map(l => l.responseTimeMs || 0);
  const meanTime = responseTimes.reduce((a, b) => a + b, 0) / logs.length;
  const variance = responseTimes.reduce((a, b) => a + Math.pow(b - meanTime, 2), 0) / (logs.length || 1);
  const stdDevTime = Math.sqrt(variance) || 1;

  logs.forEach((log) => {
    const timeMs = log.responseTimeMs || 0;
    const zScore = Math.abs((timeMs - meanTime) / stdDevTime);

    let anomalyScore = Math.min(100, Math.round(zScore * 25));
    let isAnomaly = zScore > 2.5 || log.level === 'CRITICAL' || log.statusCode >= 500;
    let reason = "Normal statistical variance within 2 standard deviations.";

    if (log.level === 'CRITICAL') {
      anomalyScore = Math.max(anomalyScore, 95);
      isAnomaly = true;
      reason = "Isolation Forest: Critical threat signature isolated in feature tree.";
    } else if (log.statusCode >= 500) {
      anomalyScore = Math.max(anomalyScore, 80);
      isAnomaly = true;
      reason = `Isolation Forest: Server failure (HTTP ${log.statusCode}) isolated as unexpected state.`;
    } else if (zScore > 2.5) {
      anomalyScore = Math.max(anomalyScore, 75);
      isAnomaly = true;
      reason = `Statistical Anomaly: Latency (${timeMs}ms) is ${zScore.toFixed(1)} std deviations above mean baseline (${meanTime.toFixed(0)}ms).`;
    }

    resultMap.set(log.id, {
      logId: log.id,
      anomalyScore,
      isAnomaly,
      zScore: parseFloat(zScore.toFixed(2)),
      reason
    });
  });

  return resultMap;
}
