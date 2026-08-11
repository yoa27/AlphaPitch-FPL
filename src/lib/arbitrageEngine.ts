import { TelemetryPoint, VerdictType } from '../types';

export interface ArbitrageParams {
  xG: number;
  xA: number;
  minutesPct: number;
  fdrAverage: number;
  currentPrice: number;
  form?: number;
}

// Calculate expected points (xP) over 3 upcoming fixtures
export function calculateExpectedPoints(params: ArbitrageParams): number {
  const { xG, xA, minutesPct, fdrAverage } = params;
  const minutesFactor = (Math.max(0, Math.min(100, minutesPct)) / 100) * 6;
  const attackingReturn = (xG * 4.0) + (xA * 3.0);
  const difficultyPenalty = fdrAverage * 0.55;
  const rawXP = attackingReturn + minutesFactor - difficultyPenalty;
  return Math.max(1.5, Number(rawXP.toFixed(2)));
}

// Calculate arbitrage score (fair value ratio)
export function calculateArbitrageIndex(xP: number, currentPrice: number): number {
  if (currentPrice <= 0) return 1.0;
  const intrinsicValue = xP * 0.68;
  return Number((intrinsicValue / currentPrice).toFixed(2));
}

// Determine clear verdict (ACHETER / VENDRE / A_SURVEILLER) with bilingual rationales
export function determineVerdict(params: {
  arbitrageScore: number;
  currentPrice: number;
  xP: number;
  xG: number;
  xA: number;
  fdrAverage: number;
  minutesPct: number;
}): { verdict: VerdictType; verdictReasonFR: string; verdictReasonEN: string } {
  const { arbitrageScore, currentPrice, xP, xG, xA, fdrAverage, minutesPct } = params;

  if (arbitrageScore >= 1.15) {
    let reasonFR = `Excellente opportunité d'achat. Prix attractif (£${currentPrice}m) comparé au rendement attendu (${xP} pts).`;
    let reasonEN = `Strong buy opportunity. Attractive valuation (£${currentPrice}m) vs expected return (${xP} pts).`;
    
    if (xG + xA >= 2.0) {
      reasonFR += ` Forte implication offensive (xG: ${xG}, xA: ${xA}).`;
      reasonEN += ` High offensive involvement (xG: ${xG}, xA: ${xA}).`;
    }
    if (fdrAverage <= 2.5) {
      reasonFR += ` Calendrier favorable à venir.`;
      reasonEN += ` Favorable upcoming fixtures schedule.`;
    }
    return { verdict: 'ACHETER', verdictReasonFR: reasonFR, verdictReasonEN: reasonEN };
  } else if (arbitrageScore <= 0.75 || (minutesPct < 40 && currentPrice > 6.0)) {
    let reasonFR = `Actif surévalué. Coût élevé (£${currentPrice}m) pour un rendement attendu limité (${xP} pts).`;
    let reasonEN = `Overvalued asset. High market cost (£${currentPrice}m) relative to limited output (${xP} pts).`;
    
    if (fdrAverage >= 3.8) {
      reasonFR += ` Calendrier difficile sur les prochains matchs.`;
      reasonEN += ` Difficult upcoming fixtures schedule.`;
    }
    if (minutesPct < 60) {
      reasonFR += ` Temps de jeu incertain (${minutesPct}%).`;
      reasonEN += ` Uncertain starting minutes (${minutesPct}%).`;
    }
    return { verdict: 'VENDRE', verdictReasonFR: reasonFR, verdictReasonEN: reasonEN };
  } else {
    let reasonFR = `Actif à surveiller. Potentiel de hausse (${xP} pts attendus pour £${currentPrice}m).`;
    let reasonEN = `Watchlist candidate. Upside potential (${xP} expected pts for £${currentPrice}m).`;
    
    if (arbitrageScore > 1.0) {
      reasonFR += ` Tendance positive si la titularisation se confirme.`;
      reasonEN += ` Positive trend if starting minutes remain stable.`;
    } else {
      reasonFR += ` Attendre une confirmation de forme avant achat.`;
      reasonEN += ` Wait for form confirmation before entering.`;
    }
    return { verdict: 'A_SURVEILLER', verdictReasonFR: reasonFR, verdictReasonEN: reasonEN };
  }
}

// Enrich historical telemetry with price divergence anomaly flags
export function enrichTelemetryWithAnomalies(history: TelemetryPoint[]): TelemetryPoint[] {
  return history.map((point, idx) => {
    const prev = idx > 0 ? history[idx - 1] : null;
    let isAnomaly = false;
    if (prev) {
      const priceDropped = point.price <= prev.price;
      const metricsSurged = (point.xG + point.xA) >= (prev.xG + prev.xA) * 1.15 || point.xP >= prev.xP * 1.2;
      isAnomaly = priceDropped && metricsSurged;
    }
    return { ...point, isAnomaly };
  });
}
