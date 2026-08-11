import { BudgetOptimizerResult, Player, Position } from '../types';

// Extract best value gems (high xP/price ratio & strong arbitrage score)
export function extractGemDeals(players: Player[], maxPrice = 8.5): Player[] {
  return [...players]
    .filter(p => p.currentPrice <= maxPrice && p.status === 'available')
    .sort((a, b) => {
      const scoreA = (a.xP / a.currentPrice) * a.arbitrageScore;
      const scoreB = (b.xP / b.currentPrice) * b.arbitrageScore;
      return scoreB - scoreA;
    });
}

// Generate optimal 11-player squad under specified budget constraint
export function optimizeSquadForBudget(players: Player[], targetBudget = 100.0): BudgetOptimizerResult {
  const availablePlayers = players.filter(p => p.status === 'available' || p.status === 'doubtful');

  const gkps = availablePlayers.filter(p => p.position === 'GKP').sort((a, b) => b.valueRatio - a.valueRatio);
  const defs = availablePlayers.filter(p => p.position === 'DEF').sort((a, b) => b.valueRatio - a.valueRatio);
  const mids = availablePlayers.filter(p => p.position === 'MID').sort((a, b) => b.valueRatio - a.valueRatio);
  const fwds = availablePlayers.filter(p => p.position === 'FWD').sort((a, b) => b.valueRatio - a.valueRatio);

  const selectedGkp: Player[] = [];
  const selectedDef: Player[] = [];
  const selectedMid: Player[] = [];
  const selectedFwd: Player[] = [];

  let currentSpent = 0;

  if (gkps.length > 0) {
    selectedGkp.push(gkps[0]);
    currentSpent += gkps[0].currentPrice;
  }

  for (const def of defs) {
    if (selectedDef.length >= 4) break;
    if (!selectedDef.some(p => p.id === def.id)) {
      selectedDef.push(def);
      currentSpent += def.currentPrice;
    }
  }

  for (const mid of mids) {
    if (selectedMid.length >= 4) break;
    if (!selectedMid.some(p => p.id === mid.id)) {
      selectedMid.push(mid);
      currentSpent += mid.currentPrice;
    }
  }

  for (const fwd of fwds) {
    if (selectedFwd.length >= 2) break;
    if (!selectedFwd.some(p => p.id === fwd.id)) {
      selectedFwd.push(fwd);
      currentSpent += fwd.currentPrice;
    }
  }

  // Adjust selections if over budget by swapping highest cost players with cheaper high-value alternatives
  let iterations = 0;
  while (currentSpent > targetBudget && iterations < 30) {
    iterations++;

    const allSelected = [
      ...selectedDef.map(p => ({ player: p, type: 'DEF' as Position })),
      ...selectedMid.map(p => ({ player: p, type: 'MID' as Position })),
      ...selectedFwd.map(p => ({ player: p, type: 'FWD' as Position }))
    ].sort((a, b) => b.player.currentPrice - a.player.currentPrice);

    if (allSelected.length === 0) break;
    const targetToSwap = allSelected[0];

    const candidates = availablePlayers
      .filter(p => p.position === targetToSwap.type && p.currentPrice < targetToSwap.player.currentPrice)
      .filter(p => ![...selectedDef, ...selectedMid, ...selectedFwd, ...selectedGkp].some(s => s.id === p.id))
      .sort((a, b) => b.valueRatio - a.valueRatio);

    if (candidates.length > 0) {
      const replacement = candidates[0];
      currentSpent = currentSpent - targetToSwap.player.currentPrice + replacement.currentPrice;

      if (targetToSwap.type === 'DEF') {
        const idx = selectedDef.findIndex(p => p.id === targetToSwap.player.id);
        if (idx !== -1) selectedDef[idx] = replacement;
      } else if (targetToSwap.type === 'MID') {
        const idx = selectedMid.findIndex(p => p.id === targetToSwap.player.id);
        if (idx !== -1) selectedMid[idx] = replacement;
      } else if (targetToSwap.type === 'FWD') {
        const idx = selectedFwd.findIndex(p => p.id === targetToSwap.player.id);
        if (idx !== -1) selectedFwd[idx] = replacement;
      }
    } else {
      break;
    }
  }

  const allSquad = [...selectedGkp, ...selectedDef, ...selectedMid, ...selectedFwd];
  const totalSpent = Number(allSquad.reduce((acc, p) => acc + p.currentPrice, 0).toFixed(1));
  const remainingCash = Number(Math.max(0, targetBudget - totalSpent).toFixed(1));
  const totalPredictedPoints = Number(allSquad.reduce((acc, p) => acc + p.xP, 0).toFixed(1));
  const averageArbitrageIndex = allSquad.length > 0 
    ? Number((allSquad.reduce((acc, p) => acc + p.arbitrageScore, 0) / allSquad.length).toFixed(2)) 
    : 1.0;

  const gemDeals = extractGemDeals(players, targetBudget >= 90 ? 8.5 : 6.5).slice(0, 8);

  return {
    budget: targetBudget,
    totalSpent,
    remainingCash,
    totalPredictedPoints,
    averageArbitrageIndex,
    squad: {
      gkp: selectedGkp,
      def: selectedDef,
      mid: selectedMid,
      fwd: selectedFwd
    },
    gemDeals
  };
}
