export type Position = 'GKP' | 'DEF' | 'MID' | 'FWD';

export type VerdictType = 'ACHETER' | 'VENDRE' | 'A_SURVEILLER';

export type Language = 'FR' | 'EN';

export interface User {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export interface TelemetryPoint {
  gameweek: string;
  price: number;
  xP: number;
  points: number;
  xG: number;
  xA: number;
  fdr: number;
  opponent: string;
  isAnomaly?: boolean;
}

export interface Player {
  id: number;
  webName: string;
  fullName: string;
  team: string;
  teamShort: string;
  position: Position;
  currentPrice: number;
  previousPrice: number;
  ownershipPct: number;
  xG: number;
  xA: number;
  ictIndex: number;
  minutesPct: number;
  fdrAverage: number;
  xP: number;
  arbitrageScore: number;
  verdict: VerdictType;
  verdictReasonFR: string;
  verdictReasonEN: string;
  priceHistory: TelemetryPoint[];
  status: 'available' | 'doubtful' | 'injured' | 'suspended';
  photoUrl?: string;
  form: number;
  totalPoints: number;
  valueRatio: number;
}

export interface BudgetOptimizerResult {
  budget: number;
  totalSpent: number;
  remainingCash: number;
  totalPredictedPoints: number;
  averageArbitrageIndex: number;
  squad: {
    gkp: Player[];
    def: Player[];
    mid: Player[];
    fwd: Player[];
  };
  gemDeals: Player[];
}
