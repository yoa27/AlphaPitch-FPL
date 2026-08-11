import { Player, Position, TelemetryPoint } from '../types';
import {
  calculateArbitrageIndex,
  calculateExpectedPoints,
  determineVerdict,
  enrichTelemetryWithAnomalies
} from './arbitrageEngine';

// Mapping from FPL element_type integer to position string
const POSITION_MAP: Record<number, Position> = {
  1: 'GKP',
  2: 'DEF',
  3: 'MID',
  4: 'FWD'
};

interface FPLTeam {
  id: number;
  name: string;
  short_name: string;
}

interface FPLElement {
  id: number;
  web_name: string;
  first_name: string;
  second_name: string;
  team: number;
  element_type: number;
  now_cost: number;
  cost_change_event: number;
  selected_by_percent: string;
  expected_goals: string;
  expected_assists: string;
  ict_index: string;
  minutes: number;
  form: string;
  total_points: number;
  status: string;
  code: number;
}

interface FPLBootstrapResponse {
  elements: FPLElement[];
  teams: FPLTeam[];
}

// Fallback dataset if external network is entirely unreachable
const BACKUP_PLAYERS_SEED: Array<Omit<Player, 'xP' | 'arbitrageScore' | 'verdict' | 'verdictReasonFR' | 'verdictReasonEN' | 'valueRatio'>> = [
  {
    id: 12,
    webName: "Saka",
    fullName: "Bukayo Saka",
    team: "Arsenal",
    teamShort: "ARS",
    position: "MID",
    currentPrice: 9.5,
    previousPrice: 9.6,
    ownershipPct: 38.9,
    xG: 7.57,
    xA: 7.16,
    ictIndex: 195.0,
    minutesPct: 88,
    fdrAverage: 2.33,
    form: 8.2,
    totalPoints: 157,
    status: "available",
    photoUrl: "https://resources.premierleague.com/premierleague/photos/players/250x250/p246669.png",
    priceHistory: [
      { gameweek: "GW21", price: 9.6, xP: 15.0, points: 7, xG: 0.70, xA: 0.80, fdr: 3, opponent: "BHA (A)" },
      { gameweek: "GW22", price: 9.5, xP: 16.8, points: 10, xG: 0.90, xA: 0.95, fdr: 2, opponent: "IPS (H)" },
      { gameweek: "GW23", price: 9.5, xP: 18.2, points: 11, xG: 1.00, xA: 1.05, fdr: 2, opponent: "WOL (A)" },
      { gameweek: "GW24", price: 9.5, xP: 17.9, points: 6, xG: 0.75, xA: 0.70, fdr: 4, opponent: "MCI (H)" },
      { gameweek: "GW25", price: 9.5, xP: 19.1, points: 12, xG: 1.10, xA: 0.90, fdr: 2, opponent: "LEI (A)", isAnomaly: true }
    ]
  },
  {
    id: 411,
    webName: "Haaland",
    fullName: "Erling Haaland",
    team: "Man City",
    teamShort: "MCI",
    position: "FWD",
    currentPrice: 15.5,
    previousPrice: 15.5,
    ownershipPct: 68.4,
    xG: 25.50,
    xA: 2.67,
    ictIndex: 210.2,
    minutesPct: 94,
    fdrAverage: 2.67,
    form: 7.2,
    totalPoints: 239,
    status: "available",
    photoUrl: "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png",
    priceHistory: [
      { gameweek: "GW21", price: 15.6, xP: 19.0, points: 8, xG: 1.20, xA: 0.20, fdr: 3, opponent: "BRE (A)" },
      { gameweek: "GW22", price: 15.5, xP: 17.5, points: 2, xG: 0.50, xA: 0.10, fdr: 4, opponent: "ARS (A)" },
      { gameweek: "GW23", price: 15.5, xP: 18.2, points: 6, xG: 0.95, xA: 0.15, fdr: 3, opponent: "NEW (H)" },
      { gameweek: "GW24", price: 15.5, xP: 17.8, points: 4, xG: 0.70, xA: 0.10, fdr: 4, opponent: "TOT (A)" },
      { gameweek: "GW25", price: 15.5, xP: 18.0, points: 9, xG: 1.10, xA: 0.20, fdr: 3, opponent: "AVL (H)" }
    ]
  },
  {
    id: 154,
    webName: "Palmer",
    fullName: "Cole Palmer",
    team: "Chelsea",
    teamShort: "CHE",
    position: "MID",
    currentPrice: 9.5,
    previousPrice: 9.6,
    ownershipPct: 52.1,
    xG: 10.55,
    xA: 2.49,
    ictIndex: 202.8,
    minutesPct: 92,
    fdrAverage: 2.33,
    form: 9.4,
    totalPoints: 114,
    status: "available",
    photoUrl: "https://resources.premierleague.com/premierleague/photos/players/250x250/p448045.png",
    priceHistory: [
      { gameweek: "GW21", price: 9.6, xP: 16.5, points: 6, xG: 0.60, xA: 0.40, fdr: 3, opponent: "CRY (A)" },
      { gameweek: "GW22", price: 9.5, xP: 18.0, points: 10, xG: 0.90, xA: 0.75, fdr: 2, opponent: "BOU (H)" },
      { gameweek: "GW23", price: 9.5, xP: 19.8, points: 14, xG: 1.20, xA: 0.90, fdr: 2, opponent: "WOL (H)", isAnomaly: true },
      { gameweek: "GW24", price: 9.5, xP: 22.1, points: 12, xG: 1.10, xA: 0.85, fdr: 2, opponent: "WHU (A)" },
      { gameweek: "GW25", price: 9.5, xP: 23.5, points: 16, xG: 1.40, xA: 1.15, fdr: 2, opponent: "SOU (H)", isAnomaly: true }
    ]
  }
];

// Transform raw FPL elements into enriched domain models
function transformFPLElements(data: FPLBootstrapResponse): Player[] {
  const teamsMap = new Map<number, FPLTeam>();
  (data.teams || []).forEach(team => teamsMap.set(team.id, team));

  return data.elements
    .filter(el => el.now_cost > 0 && (el.total_points > 0 || parseFloat(el.selected_by_percent) > 0.5))
    .map(el => {
      const teamObj = teamsMap.get(el.team) || { id: el.team, name: 'Unknown', short_name: 'UNK' };
      const position = POSITION_MAP[el.element_type] || 'MID';
      const currentPrice = Number((el.now_cost / 10).toFixed(1));
      const previousPrice = Number((el.now_cost / 10 + el.cost_change_event / 10).toFixed(1));
      const xG = Number(parseFloat(el.expected_goals || '0').toFixed(2));
      const xA = Number(parseFloat(el.expected_assists || '0').toFixed(2));
      const ictIndex = Number(parseFloat(el.ict_index || '0').toFixed(1));
      const form = Number(parseFloat(el.form || '0').toFixed(1));
      const minutesPct = Math.min(100, Math.round((el.minutes / 2250) * 100));
      const fdrAverage = 2.5;

      const xP = calculateExpectedPoints({
        xG,
        xA,
        minutesPct: minutesPct > 0 ? minutesPct : 70,
        fdrAverage,
        currentPrice,
        form
      });

      const arbitrageScore = calculateArbitrageIndex(xP, currentPrice);
      const { verdict, verdictReasonFR, verdictReasonEN } = determineVerdict({
        arbitrageScore,
        currentPrice,
        xP,
        xG,
        xA,
        fdrAverage,
        minutesPct
      });
      const valueRatio = Number((xP / currentPrice).toFixed(2));

      const history: TelemetryPoint[] = [
        { gameweek: "GW21", price: Number((currentPrice + 0.2).toFixed(1)), xP: Math.max(1.5, Number((xP * 0.75).toFixed(1))), points: Math.max(2, Math.round(xP * 0.7)), xG: Number((xG * 0.15).toFixed(2)), xA: Number((xA * 0.15).toFixed(2)), fdr: 3, opponent: "OPP 1" },
        { gameweek: "GW22", price: Number((currentPrice + 0.1).toFixed(1)), xP: Math.max(1.5, Number((xP * 0.82).toFixed(1))), points: Math.max(2, Math.round(xP * 0.8)), xG: Number((xG * 0.18).toFixed(2)), xA: Number((xA * 0.18).toFixed(2)), fdr: 2, opponent: "OPP 2" },
        { gameweek: "GW23", price: currentPrice, xP: Math.max(1.5, Number((xP * 0.90).toFixed(1))), points: Math.max(3, Math.round(xP * 0.9)), xG: Number((xG * 0.20).toFixed(2)), xA: Number((xA * 0.20).toFixed(2)), fdr: 3, opponent: "OPP 3" },
        { gameweek: "GW24", price: currentPrice, xP: Number((xP * 0.95).toFixed(1)), points: Math.max(3, Math.round(xP * 0.95)), xG: Number((xG * 0.22).toFixed(2)), xA: Number((xA * 0.22).toFixed(2)), fdr: 2, opponent: "OPP 4" },
        { gameweek: "GW25", price: currentPrice, xP: xP, points: Math.max(4, Math.round(xP * 1.05)), xG: Number((xG * 0.25).toFixed(2)), xA: Number((xA * 0.25).toFixed(2)), fdr: 2, opponent: "OPP 5", isAnomaly: arbitrageScore >= 1.20 }
      ];

      return {
        id: el.id,
        webName: el.web_name,
        fullName: `${el.first_name} ${el.second_name}`,
        team: teamObj.name,
        teamShort: teamObj.short_name,
        position,
        currentPrice,
        previousPrice,
        ownershipPct: parseFloat(el.selected_by_percent || '0'),
        xG,
        xA,
        ictIndex,
        minutesPct,
        fdrAverage,
        form,
        totalPoints: el.total_points,
        status: el.status === 'd' ? 'doubtful' : el.status === 'i' ? 'injured' : el.status === 's' ? 'suspended' : 'available',
        photoUrl: `https://resources.premierleague.com/premierleague/photos/players/250x250/p${el.code}.png`,
        xP,
        arbitrageScore,
        verdict,
        verdictReasonFR,
        verdictReasonEN,
        priceHistory: enrichTelemetryWithAnomalies(history),
        valueRatio
      };
    });
}

// Fetch live official data with multi-tier proxy fallback
export async function fetchFPLPlayers(): Promise<{ players: Player[]; isLive: boolean }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const response = await fetch('/api/fpl/bootstrap-static/', { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data: FPLBootstrapResponse = await response.json();
      if (data && Array.isArray(data.elements) && data.elements.length > 0) {
        return { players: transformFPLElements(data), isLive: true };
      }
    }
  } catch {
    // Continue to next fallback strategy
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://corsproxy.io/?url=https://fantasy.premierleague.com/api/bootstrap-static/', {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data: FPLBootstrapResponse = await response.json();
      if (data && Array.isArray(data.elements) && data.elements.length > 0) {
        return { players: transformFPLElements(data), isLive: true };
      }
    }
  } catch {
    // Continue to backup seed
  }

  const processedBackup: Player[] = BACKUP_PLAYERS_SEED.map(raw => {
    const xP = calculateExpectedPoints({
      xG: raw.xG,
      xA: raw.xA,
      minutesPct: raw.minutesPct,
      fdrAverage: raw.fdrAverage,
      currentPrice: raw.currentPrice,
      form: raw.form
    });
    const arbitrageScore = calculateArbitrageIndex(xP, raw.currentPrice);
    const { verdict, verdictReasonFR, verdictReasonEN } = determineVerdict({
      arbitrageScore,
      currentPrice: raw.currentPrice,
      xP,
      xG: raw.xG,
      xA: raw.xA,
      fdrAverage: raw.fdrAverage,
      minutesPct: raw.minutesPct
    });

    return {
      ...raw,
      xP,
      arbitrageScore,
      verdict,
      verdictReasonFR,
      verdictReasonEN,
      priceHistory: enrichTelemetryWithAnomalies(raw.priceHistory),
      valueRatio: Number((xP / raw.currentPrice).toFixed(2))
    };
  });

  return { players: processedBackup, isLive: false };
}
