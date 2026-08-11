import React, { useState, useMemo } from 'react';
import { Language, Player, Position } from '../types';
import { TRANSLATIONS } from '../lib/i18n';
import { PlayerAvatar } from './PlayerAvatar';
import { 
  ArrowUpDown, 
  Search, 
  Star, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart2,
  ChevronRight
} from 'lucide-react';

interface MarketScannerTableProps {
  players: Player[];
  selectedPlayer: Player | null;
  watchlist: number[];
  onToggleWatchlist: (playerId: number) => void;
  onSelectPlayer: (player: Player) => void;
  onNavigateToChart: (player: Player) => void;
  language: Language;
}

type SortField = 'webName' | 'currentPrice' | 'xP' | 'arbitrageScore' | 'form' | 'totalPoints';
type SortOrder = 'asc' | 'desc';

export const MarketScannerTable: React.FC<MarketScannerTableProps> = ({
  players,
  selectedPlayer,
  watchlist,
  onToggleWatchlist,
  onSelectPlayer,
  onNavigateToChart,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [selectedPos, setSelectedPos] = useState<string>('ALL');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('ALL');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('arbitrageScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Distinct team list
  const teams = useMemo(() => {
    const set = new Set(players.map(p => p.teamShort));
    return ['ALL', ...Array.from(set).sort()];
  }, [players]);

  // Filtering
  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      if (onlyFavorites && !watchlist.includes(p.id)) return false;
      if (selectedPos !== 'ALL' && p.position !== selectedPos) return false;
      if (selectedTeam !== 'ALL' && p.teamShort !== selectedTeam) return false;
      if (selectedVerdict !== 'ALL' && p.verdict !== selectedVerdict) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        const matches = 
          p.webName.toLowerCase().includes(q) ||
          p.fullName.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.teamShort.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [players, selectedPos, selectedTeam, selectedVerdict, onlyFavorites, watchlist, searchFilter]);

  // Sorting
  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredPlayers, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-surface border border-outline/20 rounded-xl flex flex-col h-full overflow-hidden shadow-lg">
      {/* Filters Toolbar */}
      <div className="p-2.5 sm:p-3 border-b border-outline/20 bg-surface-container-low flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder={t.filterPlayerPlaceholder}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full sm:w-36 bg-surface-container-high border border-outline/20 rounded-lg pl-8 pr-2.5 py-1 text-xs text-on-surface focus:outline-none focus:border-primary/50 font-mono"
            />
          </div>

          {/* Favorites Toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-sans text-xs ${
              onlyFavorites
                ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/40 font-bold shadow-sm'
                : 'bg-surface-container-high text-outline hover:text-yellow-400 border-outline/20'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-yellow-400' : ''}`} />
            <span className="hidden xs:inline">{t.filterFavorites}</span> ({watchlist.length})
          </button>

          {/* Position Selector */}
          <div className="flex bg-surface-container-high border border-outline/20 rounded-lg p-0.5 font-mono text-[11px] overflow-x-auto">
            {(['ALL', 'GKP', 'DEF', 'MID', 'FWD'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  selectedPos === pos 
                    ? 'bg-surface-variant text-primary font-bold border border-primary/20' 
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                {pos === 'ALL' ? t.filterAll : pos}
              </button>
            ))}
          </div>

          {/* Verdict Filter */}
          <div className="hidden md:flex bg-surface-container-high border border-outline/20 rounded-lg p-0.5 font-sans font-medium text-[11px]">
            <button
              onClick={() => setSelectedVerdict('ALL')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                selectedVerdict === 'ALL' ? 'bg-surface-variant text-on-surface font-bold' : 'text-outline hover:text-on-surface'
              }`}
            >
              {t.filterAllVerdicts}
            </button>
            <button
              onClick={() => setSelectedVerdict('ACHETER')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                selectedVerdict === 'ACHETER' ? 'bg-primary text-background font-bold' : 'text-primary hover:bg-primary/10'
              }`}
            >
              {t.verdictBuy}
            </button>
            <button
              onClick={() => setSelectedVerdict('A_SURVEILLER')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                selectedVerdict === 'A_SURVEILLER' ? 'bg-amber-500 text-background font-bold' : 'text-amber-500 hover:bg-amber-500/10'
              }`}
            >
              {t.verdictWatch}
            </button>
            <button
              onClick={() => setSelectedVerdict('VENDRE')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                selectedVerdict === 'VENDRE' ? 'bg-secondary text-white font-bold' : 'text-secondary hover:bg-secondary/10'
              }`}
            >
              {t.verdictSell}
            </button>
          </div>
        </div>

        {/* Club Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-surface-container-high border border-outline/20 rounded-lg px-2 py-1 text-xs text-on-surface focus:outline-none font-sans"
          >
            <option value="ALL">{t.filterAllClubs} ({teams.length - 1})</option>
            {teams.filter(t => t !== 'ALL').map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="text-[10px] sm:text-[11px] font-mono text-outline">
            {sortedPlayers.length} {t.playersCount}
          </span>
        </div>
      </div>

      {/* Table Data */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[540px] sm:min-w-0">
          <thead className="bg-surface-container-highest/40 sticky top-0 z-10 text-[10px] sm:text-[11px] text-outline font-mono border-b border-outline/20 select-none">
            <tr>
              <th className="py-2.5 px-2 text-center w-7 sm:w-8">{t.colStar}</th>
              <th 
                className="py-2.5 px-2.5 sm:px-3 cursor-pointer hover:text-on-surface font-sans"
                onClick={() => handleSort('webName')}
              >
                <div className="flex items-center gap-1 font-semibold">
                  {t.colPlayer} <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-1.5 sm:px-2 text-center font-sans">{t.colPosition}</th>
              <th 
                className="py-2.5 px-2 sm:px-3 cursor-pointer hover:text-on-surface text-right font-sans"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center justify-end gap-1 font-semibold">
                  {t.colPrice} <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                className="py-2.5 px-2 sm:px-3 cursor-pointer hover:text-on-surface text-right font-sans"
                onClick={() => handleSort('xP')}
              >
                <div className="flex items-center justify-end gap-1 font-semibold text-primary">
                  {t.colXP} <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                className="py-2.5 px-2 sm:px-3 cursor-pointer hover:text-on-surface text-center font-sans"
                onClick={() => handleSort('arbitrageScore')}
              >
                <div className="flex items-center justify-center gap-1 font-semibold">
                  {t.colVerdict} <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                className="py-2.5 px-2 sm:px-3 cursor-pointer hover:text-on-surface text-right font-sans"
                onClick={() => handleSort('form')}
              >
                <div className="flex items-center justify-end gap-1 font-semibold">
                  {t.colForm} <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-2.5 px-2 sm:px-3 text-right font-sans">{t.colAnalysis}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/10 font-mono">
            {sortedPlayers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-outline font-sans">
                  {t.noPlayersFound}
                </td>
              </tr>
            ) : (
              sortedPlayers.map((player) => {
                const isSelected = selectedPlayer?.id === player.id;
                const isFav = watchlist.includes(player.id);
                const isBuy = player.verdict === 'ACHETER';
                const isSell = player.verdict === 'VENDRE';

                return (
                  <tr
                    key={player.id}
                    onClick={() => onSelectPlayer(player)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected 
                        ? 'bg-primary/10 border-l-2 border-l-primary' 
                        : 'hover:bg-surface-container-high/60'
                    }`}
                  >
                    {/* Star Favorite */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(player.id);
                        }}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          isFav ? 'text-yellow-400' : 'text-outline hover:text-yellow-400'
                        }`}
                        title={isFav ? "Remove from watchlist" : "Add to watchlist"}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-yellow-400' : ''}`} />
                      </button>
                    </td>

                    {/* Name & Club */}
                    <td className="py-2.5 px-2.5 sm:px-3">
                      <div className="flex items-center gap-2">
                        <PlayerAvatar
                          photoUrl={player.photoUrl}
                          name={player.webName}
                          teamShort={player.teamShort}
                          size="sm"
                        />
                        <div>
                          <div className="font-display font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5 font-sans">
                            {player.webName}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-outline font-sans">
                            {player.team}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-2.5 px-1.5 sm:px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-surface-container-highest text-outline">
                        {player.position}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-2.5 px-2 sm:px-3 text-right font-bold text-on-surface text-xs">
                      £{player.currentPrice}m
                    </td>

                    {/* xP */}
                    <td className="py-2.5 px-2 sm:px-3 text-right">
                      <span className="text-primary font-bold text-xs">{player.xP} pts</span>
                    </td>

                    {/* Verdict */}
                    <td className="py-2.5 px-2 sm:px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold font-sans ${
                        isBuy 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : isSell 
                          ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isBuy ? <ArrowUpRight className="w-3 h-3 stroke-[3]" /> : isSell ? <ArrowDownRight className="w-3 h-3 stroke-[3]" /> : <Eye className="w-3 h-3 stroke-[3]" />}
                        <span>{isBuy ? t.verdictBuy : isSell ? t.verdictSell : t.verdictWatch}</span>
                      </span>
                    </td>

                    {/* Form */}
                    <td className="py-2.5 px-2 sm:px-3 text-right font-semibold text-on-surface text-xs">
                      {player.form}
                    </td>

                    {/* Deep Dive Action */}
                    <td className="py-2.5 px-2 sm:px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPlayer(player);
                          onNavigateToChart(player);
                        }}
                        className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer font-sans"
                        title={t.btnChart}
                      >
                        <BarChart2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">{t.btnChart}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
