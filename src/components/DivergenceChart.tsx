import React, { useState } from 'react';
import { Language, Player } from '../types';
import { TRANSLATIONS } from '../lib/i18n';
import { PlayerAvatar } from './PlayerAvatar';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Star, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

interface DivergenceChartProps {
  player: Player | null;
  watchlist: number[];
  onToggleWatchlist: (playerId: number) => void;
  language: Language;
}

export const DivergenceChart: React.FC<DivergenceChartProps> = ({ 
  player, 
  watchlist, 
  onToggleWatchlist,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [chartMode, setChartMode] = useState<'xP' | 'xG_xA'>('xP');

  if (!player) {
    return (
      <div className="bg-surface border border-outline/20 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full min-h-[360px] sm:min-h-[420px] shadow-lg">
        <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-outline mb-3 opacity-50" />
        <div className="font-display font-bold text-base sm:text-lg text-on-surface font-sans">
          {t.selectPlayerPrompt}
        </div>
        <p className="text-xs sm:text-[13px] text-outline max-w-sm mt-1 font-sans">
          {t.selectPlayerSubtitle}
        </p>
      </div>
    );
  }

  const isFavorite = watchlist.includes(player.id);
  const isBuy = player.verdict === 'ACHETER';
  const isSell = player.verdict === 'VENDRE';
  const clampedGauge = Math.max(5, Math.min(95, Math.round(((player.arbitrageScore - 0.6) / 1.0) * 100)));
  const anomalyIndex = player.priceHistory.findIndex(p => p.isAnomaly);
  const reasonText = language === 'FR' ? player.verdictReasonFR : player.verdictReasonEN;

  return (
    <div className="bg-surface border border-outline/20 rounded-xl flex flex-col h-full overflow-hidden select-none shadow-lg">
      {/* 1. Header with Player Info and Favorite Toggle */}
      <div className="p-3 sm:p-4 border-b border-outline/20 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <PlayerAvatar
            photoUrl={player.photoUrl}
            name={player.fullName}
            teamShort={player.teamShort}
            size="lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="font-display font-bold text-base sm:text-lg text-on-surface m-0 leading-tight font-sans">
                {player.fullName}
              </h2>
              <span className="text-[10px] sm:text-xs font-mono px-1.5 sm:px-2 py-0.2 rounded bg-surface-container-highest text-primary font-bold">
                {player.position}
              </span>
              <span className="text-[10px] sm:text-xs font-mono px-1.5 sm:px-2 py-0.2 rounded bg-surface-container-highest text-outline font-semibold">
                {player.team}
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-mono text-outline mt-0.5 sm:mt-1 flex flex-wrap items-center gap-2 sm:gap-3 font-sans">
              <span>{t.currentPrice} <strong className="text-on-surface font-mono">£{player.currentPrice}m</strong></span>
              <span>•</span>
              <span>{t.expectedPoints} <strong className="text-primary font-mono">{player.xP} pts</strong></span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline">{t.fplForm} <strong className="text-on-surface font-mono">{player.form}</strong></span>
            </div>
          </div>
        </div>

        {/* Favorite & Mode Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            onClick={() => onToggleWatchlist(player.id)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer font-sans ${
              isFavorite
                ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-sm'
                : 'bg-surface-container-high text-outline hover:text-yellow-400 border-outline/20'
            }`}
          >
            <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-yellow-400' : ''}`} />
            <span className="text-[11px] sm:text-xs">{isFavorite ? t.btnInWatchlist : t.btnAddToWatchlist}</span>
          </button>

          <div className="flex bg-surface-container-high border border-outline/20 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setChartMode('xP')}
              className={`px-2 sm:px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer text-[11px] sm:text-xs ${
                chartMode === 'xP' ? 'bg-primary text-background font-bold shadow-sm' : 'text-outline hover:text-on-surface'
              }`}
            >
              {t.chartModePriceXP}
            </button>
            <button
              onClick={() => setChartMode('xG_xA')}
              className={`px-2 sm:px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer text-[11px] sm:text-xs ${
                chartMode === 'xG_xA' ? 'bg-primary text-background font-bold shadow-sm' : 'text-outline hover:text-on-surface'
              }`}
            >
              {t.chartModePriceXG}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Clear Decision Banner: ACHETER / VENDRE / A SURVEILLER */}
      <div className={`p-3 sm:p-4 border-b border-outline/20 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 ${
        isBuy ? 'bg-primary/10 border-primary/30' : isSell ? 'bg-secondary/10 border-secondary/30' : 'bg-amber-500/10 border-amber-500/30'
      }`}>
        <div className="flex items-start md:items-center gap-2.5 sm:gap-3">
          <div className={`p-2 rounded-xl flex-shrink-0 shadow-sm ${
            isBuy ? 'bg-primary text-background' : isSell ? 'bg-secondary text-white' : 'bg-amber-500 text-background'
          }`}>
            {isBuy ? <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" /> : isSell ? <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-outline font-sans">
                {t.algoVerdictLabel}
              </span>
              <span className={`text-xs sm:text-sm font-display font-black px-2 sm:px-2.5 py-0.5 rounded-md font-sans ${
                isBuy ? 'bg-primary text-background' : isSell ? 'bg-secondary text-white' : 'bg-amber-500 text-background'
              }`}>
                {isBuy ? t.verdictBuy : isSell ? t.verdictSell : t.verdictWatch}
              </span>
            </div>
            <p className="text-xs text-on-surface font-medium mt-1 leading-snug font-sans">
              {reasonText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-outline self-end md:self-center">
          <span>{t.arbitrageScoreLabel} <strong className="text-on-surface">{player.arbitrageScore.toFixed(2)}x</strong></span>
        </div>
      </div>

      {/* 3. Spectrum Meter */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-surface-container-highest/30 border-b border-outline/10">
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono mb-1">
          <span className="text-secondary font-bold flex items-center gap-1 font-sans">
            <TrendingDown className="w-3 h-3" /> <span className="hidden xs:inline">{t.spectrumOversold}</span>
          </span>
          <span className="text-outline text-[9px] sm:text-[10px] uppercase font-semibold font-sans">
            {t.spectrumTitle}
          </span>
          <span className="text-primary font-bold flex items-center gap-1 font-sans">
            <span className="hidden xs:inline">{t.spectrumOverbought}</span> <TrendingUp className="w-3 h-3" />
          </span>
        </div>

        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden relative border border-outline/20">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-amber-500 to-primary opacity-70"></div>
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-[0_0_6px_#ffffff] -ml-1 transition-all duration-300"
            style={{ left: `${clampedGauge}%` }}
          ></div>
        </div>
      </div>

      {/* 4. Chart Visualization */}
      <div className="flex-1 p-2 sm:p-3 relative min-h-[260px] sm:min-h-[300px] 2xl:min-h-[400px]">
        {anomalyIndex !== -1 && (
          <div className="absolute top-3 right-3 z-20 bg-primary/15 border border-primary/40 rounded-lg px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-mono text-primary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            <span className="truncate max-w-[200px] sm:max-w-none">{t.surgeDetected}</span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={player.priceHistory} margin={{ top: 15, right: 10, bottom: 15, left: -15 }}>
            <defs>
              <linearGradient id="xpBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="xgBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#26364a" opacity={0.5} />

            <XAxis
              dataKey="gameweek"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#26364a' }}
            />

            {/* Price Y Axis */}
            <YAxis
              yAxisId="price"
              orientation="left"
              domain={['dataMin - 0.5', 'dataMax + 0.5']}
              stroke="#f43f5e"
              tick={{ fill: '#f43f5e', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(v) => `£${v}m`}
            />

            {/* Performance Y Axis */}
            <YAxis
              yAxisId="stats"
              orientation="right"
              domain={[0, 'auto']}
              stroke="#10b981"
              tick={{ fill: '#10b981', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              tickFormatter={(v) => `${v}`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-surface-container-high border border-outline/40 rounded-xl p-2.5 font-mono text-[11px] shadow-2xl">
                      <div className="font-bold text-on-surface border-b border-outline/20 pb-1 mb-1.5 flex justify-between font-sans">
                        <span>{label} vs {data.opponent}</span>
                        <span className="text-outline">FDR {data.fdr}</span>
                      </div>
                      <div className="space-y-1 font-sans">
                        <div className="text-secondary flex justify-between gap-4">
                          <span>{t.priceLabel}</span>
                          <strong className="font-mono">£{data.price}m</strong>
                        </div>
                        <div className="text-primary flex justify-between gap-4">
                          <span>{t.pointsLabel}</span>
                          <strong className="font-mono">{data.xP} pts</strong>
                        </div>
                        <div className="text-tertiary flex justify-between gap-4">
                          <span>xG / xA :</span>
                          <strong className="font-mono">{data.xG} / {data.xA}</strong>
                        </div>
                        <div className="text-on-surface flex justify-between gap-4 pt-1 border-t border-outline/10">
                          <span>FPL Points :</span>
                          <strong className="font-mono">{data.points} pts</strong>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend wrapperStyle={{ paddingTop: 6, fontSize: 10, fontFamily: 'JetBrains Mono' }} />

            {/* Form Bars */}
            {chartMode === 'xP' ? (
              <Bar
                yAxisId="stats"
                dataKey="xP"
                name={t.pointsLabel}
                fill="url(#xpBarGradient)"
                radius={[3, 3, 0, 0]}
                barSize={20}
              />
            ) : (
              <>
                <Bar
                  yAxisId="stats"
                  dataKey="xG"
                  name="Expected Goals (xG)"
                  fill="url(#xpBarGradient)"
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                />
                <Bar
                  yAxisId="stats"
                  dataKey="xA"
                  name="Expected Assists (xA)"
                  fill="url(#xgBarGradient)"
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                />
              </>
            )}

            {/* Price Line Curve */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              name={t.priceLabel}
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={{ fill: '#f43f5e', r: 3.5, stroke: '#ffffff', strokeWidth: 1 }}
              activeDot={{ r: 5, fill: '#ffffff', stroke: '#f43f5e', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
