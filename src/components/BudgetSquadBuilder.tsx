import React, { useState, useMemo } from 'react';
import { Language, Player, Position } from '../types';
import { TRANSLATIONS } from '../lib/i18n';
import { optimizeSquadForBudget } from '../lib/budgetOptimizer';
import { PlayerAvatar } from './PlayerAvatar';
import { 
  Sparkles, 
  DollarSign, 
  Star, 
  Shield, 
  Users, 
  Award, 
  ChevronRight, 
  BarChart2
} from 'lucide-react';

interface BudgetSquadBuilderProps {
  players: Player[];
  watchlist: number[];
  onToggleWatchlist: (playerId: number) => void;
  onSelectPlayer: (player: Player) => void;
  onNavigateToChart: (player: Player) => void;
  language: Language;
}

export const BudgetSquadBuilder: React.FC<BudgetSquadBuilderProps> = ({
  players,
  watchlist,
  onToggleWatchlist,
  onSelectPlayer,
  onNavigateToChart,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [budget, setBudget] = useState<number>(100.0);
  const [activeView, setActiveView] = useState<'gems' | 'squad'>('gems');
  const [positionFilter, setPositionFilter] = useState<'ALL' | Position>('ALL');

  const optimizerResult = useMemo(() => {
    return optimizeSquadForBudget(players, budget);
  }, [players, budget]);

  const filteredGems = useMemo(() => {
    if (positionFilter === 'ALL') return optimizerResult.gemDeals;
    return optimizerResult.gemDeals.filter(p => p.position === positionFilter);
  }, [optimizerResult.gemDeals, positionFilter]);

  const budgetPresets = [80.0, 90.0, 100.0, 105.0];

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Budget Control Card */}
      <div className="bg-surface border border-outline/20 rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="font-display font-bold text-base sm:text-lg text-on-surface font-sans">
                {t.builderTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-outline mt-1 font-sans">
              {t.builderSubtitle}
            </p>
          </div>

          {/* Budget Input & Presets */}
          <div className="flex flex-wrap items-center gap-2 bg-surface-container-low p-2 rounded-xl border border-outline/20 font-mono">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-surface-container-highest rounded-lg border border-outline/20">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs text-outline font-semibold font-sans">{t.budgetLabel}</span>
              <input
                type="number"
                step="0.5"
                min="40"
                max="150"
                value={budget}
                onChange={(e) => setBudget(Math.max(40, Math.min(150, parseFloat(e.target.value) || 100)))}
                className="w-14 sm:w-16 bg-transparent text-right font-bold text-on-surface text-sm focus:outline-none"
              />
              <span className="text-xs font-bold text-primary">£m</span>
            </div>

            <div className="flex items-center gap-1">
              {budgetPresets.map(preset => (
                <button
                  key={preset}
                  onClick={() => setBudget(preset)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    budget === preset
                      ? 'bg-primary text-background font-bold shadow-sm'
                      : 'bg-surface-container-high text-outline hover:text-on-surface'
                  }`}
                >
                  £{preset}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mt-4 pt-4 border-t border-outline/10 flex flex-col gap-2 font-mono">
          <div className="flex justify-between text-[11px] sm:text-xs text-outline font-sans">
            <span>{t.budgetMin}</span>
            <span className="text-primary font-bold">{t.budgetSelection} £{budget.toFixed(1)}m</span>
            <span>{t.budgetMax}</span>
          </div>
          <input
            type="range"
            min="40"
            max="150"
            step="1"
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.target.value))}
            className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Telemetry KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-4 font-mono">
          <div className="bg-surface-container-low border border-outline/20 rounded-lg p-2.5 sm:p-3">
            <div className="text-[10px] sm:text-[11px] text-outline font-sans">{t.totalCostEstimated}</div>
            <div className="text-sm sm:text-base font-bold text-on-surface mt-0.5">
              £{optimizerResult.totalSpent}m <span className="text-[10px] text-outline font-normal">/ £{budget}m</span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline/20 rounded-lg p-2.5 sm:p-3">
            <div className="text-[10px] sm:text-[11px] text-outline font-sans">{t.remainingCash}</div>
            <div className="text-sm sm:text-base font-bold text-primary mt-0.5">
              £{optimizerResult.remainingCash}m
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline/20 rounded-lg p-2.5 sm:p-3">
            <div className="text-[10px] sm:text-[11px] text-outline font-sans">{t.expectedPoints3GWs}</div>
            <div className="text-sm sm:text-base font-bold text-primary mt-0.5">
              {optimizerResult.totalPredictedPoints} pts
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline/20 rounded-lg p-2.5 sm:p-3">
            <div className="text-[10px] sm:text-[11px] text-outline font-sans">{t.avgArbitrageScore}</div>
            <div className="text-sm sm:text-base font-bold text-primary mt-0.5">
              {optimizerResult.averageArbitrageIndex}x
            </div>
          </div>
        </div>
      </div>

      {/* Switcher & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline/20 pb-3 font-sans">
        <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline/20 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('gems')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'gems'
                ? 'bg-primary text-background shadow-md'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tabTopGems} ({optimizerResult.gemDeals.length})</span>
          </button>
          <button
            onClick={() => setActiveView('squad')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'squad'
                ? 'bg-primary text-background shadow-md'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.tabBestXI}</span>
          </button>
        </div>

        {activeView === 'gems' && (
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline/20 font-mono overflow-x-auto">
            {(['ALL', 'GKP', 'DEF', 'MID', 'FWD'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer ${
                  positionFilter === pos
                    ? 'bg-surface-container-highest text-primary border border-primary/30 font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                {pos === 'ALL' ? t.filterAll : pos}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1. TOP GEMS VIEW (Responsive Grid 1 to 5 cols) */}
      {activeView === 'gems' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredGems.map((player) => {
            const isFav = watchlist.includes(player.id);
            const reasonText = language === 'FR' ? player.verdictReasonFR : player.verdictReasonEN;

            return (
              <div
                key={player.id}
                className="bg-surface border border-outline/20 hover:border-primary/50 transition-all rounded-xl p-3.5 sm:p-4 flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <PlayerAvatar
                        photoUrl={player.photoUrl}
                        name={player.fullName}
                        teamShort={player.teamShort}
                        size="md"
                      />
                      <div>
                        <h3 className="font-display font-bold text-xs sm:text-sm text-on-surface leading-tight font-sans">
                          {player.fullName}
                        </h3>
                        <div className="text-[10px] sm:text-[11px] font-mono text-outline mt-0.5">
                          <span className="text-primary font-bold">{player.position}</span> • {player.team}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleWatchlist(player.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isFav 
                          ? 'text-yellow-400 bg-yellow-400/10' 
                          : 'text-outline hover:text-yellow-400 hover:bg-surface-container-highest'
                      }`}
                      title={isFav ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-yellow-400' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline/10 font-mono">
                    <div>
                      <div className="text-[9px] sm:text-[10px] text-outline uppercase font-semibold font-sans">{t.marketPrice}</div>
                      <div className="font-bold text-sm sm:text-base text-on-surface">£{player.currentPrice}m</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] sm:text-[10px] text-outline uppercase font-semibold font-sans">{t.expectedPoints}</div>
                      <div className="font-bold text-sm sm:text-base text-primary">{player.xP} pts</div>
                    </div>
                  </div>

                  <div className="mt-2.5 p-2 bg-surface-container-low rounded-lg border border-outline/15 text-[10px] sm:text-[11px] text-outline leading-snug font-sans">
                    {reasonText}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 border-t border-outline/10 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectPlayer(player);
                      onNavigateToChart(player);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold transition-colors cursor-pointer font-sans"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    {t.seeChart}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. OPTIMAL BEST XI SQUAD VIEW */}
      {activeView === 'squad' && (
        <div className="bg-surface border border-outline/20 rounded-xl p-4 sm:p-5 flex flex-col gap-5 sm:gap-6 font-sans shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-on-surface">
                {t.squad11Title}
              </h3>
              <p className="text-xs text-outline mt-0.5">
                {t.squad11Subtitle} £{budget}m
              </p>
            </div>
            <span className="px-2 sm:px-2.5 py-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-bold rounded-lg border border-primary/20 font-mono">
              {t.squad11Badge}
            </span>
          </div>

          {/* GKP Line */}
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" /> {t.gkpLine}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {optimizerResult.squad.gkp.map(p => (
                <SquadPlayerCard 
                  key={p.id} 
                  player={p} 
                  isFav={watchlist.includes(p.id)}
                  onToggleWatchlist={onToggleWatchlist}
                  onNavigateToChart={onNavigateToChart}
                  onSelectPlayer={onSelectPlayer}
                  seeChartText={t.btnChart}
                />
              ))}
            </div>
          </div>

          {/* DEF Line */}
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-tertiary" /> {t.defLine}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              {optimizerResult.squad.def.map(p => (
                <SquadPlayerCard 
                  key={p.id} 
                  player={p} 
                  isFav={watchlist.includes(p.id)}
                  onToggleWatchlist={onToggleWatchlist}
                  onNavigateToChart={onNavigateToChart}
                  onSelectPlayer={onSelectPlayer}
                  seeChartText={t.btnChart}
                />
              ))}
            </div>
          </div>

          {/* MID Line */}
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> {t.midLine}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              {optimizerResult.squad.mid.map(p => (
                <SquadPlayerCard 
                  key={p.id} 
                  player={p} 
                  isFav={watchlist.includes(p.id)}
                  onToggleWatchlist={onToggleWatchlist}
                  onNavigateToChart={onNavigateToChart}
                  onSelectPlayer={onSelectPlayer}
                  seeChartText={t.btnChart}
                />
              ))}
            </div>
          </div>

          {/* FWD Line */}
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-outline uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-secondary" /> {t.fwdLine}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {optimizerResult.squad.fwd.map(p => (
                <SquadPlayerCard 
                  key={p.id} 
                  player={p} 
                  isFav={watchlist.includes(p.id)}
                  onToggleWatchlist={onToggleWatchlist}
                  onNavigateToChart={onNavigateToChart}
                  onSelectPlayer={onSelectPlayer}
                  seeChartText={t.btnChart}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SquadPlayerCardProps {
  player: Player;
  isFav: boolean;
  onToggleWatchlist: (id: number) => void;
  onNavigateToChart: (player: Player) => void;
  onSelectPlayer: (player: Player) => void;
  seeChartText: string;
}

const SquadPlayerCard: React.FC<SquadPlayerCardProps> = ({
  player,
  isFav,
  onToggleWatchlist,
  onNavigateToChart,
  onSelectPlayer,
  seeChartText
}) => {
  return (
    <div
      onClick={() => onSelectPlayer(player)}
      className="bg-surface-container-low border border-outline/20 hover:border-primary/50 transition-all rounded-xl p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer group font-sans"
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-2">
          <PlayerAvatar
            photoUrl={player.photoUrl}
            name={player.webName}
            teamShort={player.teamShort}
            size="sm"
          />
          <div>
            <div className="font-display font-bold text-xs text-on-surface truncate max-w-[110px]">
              {player.webName}
            </div>
            <div className="text-[9px] sm:text-[10px] text-outline font-mono">
              {player.teamShort} • £{player.currentPrice}m
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(player.id);
          }}
          className={`p-1 rounded transition-colors cursor-pointer ${
            isFav ? 'text-yellow-400' : 'text-outline hover:text-yellow-400'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-yellow-400' : ''}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline/10 text-[10px] sm:text-[11px] font-mono">
        <span className="text-outline">xP: <strong className="text-primary">{player.xP} pts</strong></span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectPlayer(player);
            onNavigateToChart(player);
          }}
          className="text-tertiary hover:underline text-[9px] sm:text-[10px] font-bold flex items-center cursor-pointer font-sans"
        >
          {seeChartText} <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
