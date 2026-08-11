import React, { useState, useEffect, useCallback } from 'react';
import { Language, Player, User } from './types';
import { fetchFPLPlayers } from './lib/fplService';
import { getCurrentUser, logoutUser } from './lib/authService';
import { TRANSLATIONS } from './lib/i18n';
import { TopNavBar, ActiveTab } from './components/TopNavBar';
import { MarketScannerTable } from './components/MarketScannerTable';
import { DivergenceChart } from './components/DivergenceChart';
import { BudgetSquadBuilder } from './components/BudgetSquadBuilder';
import { AuthModal } from './components/AuthModal';
import { Star, Activity, LineChart, Sparkles } from 'lucide-react';

export function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  // Internationalization State (FR / EN)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('alphapitch_lang');
      return (saved === 'FR' || saved === 'EN') ? saved : 'FR';
    } catch {
      return 'FR';
    }
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'FR' ? 'EN' : 'FR';
      try {
        localStorage.setItem('alphapitch_lang', next);
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const t = TRANSLATIONS[language];

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [gatekeeperReason, setGatekeeperReason] = useState<string | null>(null);
  const [pendingFavoriteId, setPendingFavoriteId] = useState<number | null>(null);

  // Watchlist persisted in localStorage
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('alphapitch_watchlist');
      return saved ? JSON.parse(saved) : [12, 411, 154, 4];
    } catch {
      return [12, 411, 154, 4];
    }
  });

  const executeToggleWatchlist = (playerId: number) => {
    setWatchlist((prev) => {
      const updated = prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId];
      try {
        localStorage.setItem('alphapitch_watchlist', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Gatekeeper: Require verified email login before adding/removing from watchlist
  const handleToggleWatchlist = (playerId: number) => {
    if (!currentUser) {
      setGatekeeperReason(t.authModalGatekeeperMessage);
      setPendingFavoriteId(playerId);
      setIsAuthModalOpen(true);
      return;
    }
    executeToggleWatchlist(playerId);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (pendingFavoriteId !== null) {
      executeToggleWatchlist(pendingFavoriteId);
      setPendingFavoriteId(null);
    }
    setGatekeeperReason(null);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Load real player data from official FPL API
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    const result = await fetchFPLPlayers();
    setPlayers(result.players);
    setIsLiveApi(result.isLive);
    if (!selectedPlayer && result.players.length > 0) {
      const bestOpportunity = [...result.players].sort((a, b) => b.arbitrageScore - a.arbitrageScore)[0];
      setSelectedPlayer(bestOpportunity);
    }
    setIsRefreshing(false);
  }, [selectedPlayer]);

  useEffect(() => {
    loadData();
  }, []);

  // Filter players by search query
  const displayedPlayers = players.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.webName.toLowerCase().includes(q) ||
      p.fullName.toLowerCase().includes(q) ||
      p.team.toLowerCase().includes(q) ||
      p.teamShort.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q)
    );
  });

  const handleNavigateToChart = (player: Player) => {
    setSelectedPlayer(player);
    setActiveTab('divergence');
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans terminal-grid-bg pb-16 lg:pb-0">
      {/* 1. Header Navigation */}
      <TopNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        isLiveApi={isLiveApi}
        totalPlayersCount={players.length}
        watchlistCount={watchlist.length}
        language={language}
        onToggleLanguage={toggleLanguage}
        user={currentUser}
        onOpenAuthModal={() => {
          setGatekeeperReason(null);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Views (Max Width 1800px for 4K / TV / Ultrawide) */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 max-w-[1800px] w-full mx-auto space-y-4">
        {/* PART 1: SCANNER & PLAYER SELECTION */}
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-[580px] lg:min-h-[640px] 2xl:min-h-[720px]">
            <div className="xl:col-span-7 h-[500px] sm:h-[580px] lg:h-[640px] 2xl:h-[720px]">
              <MarketScannerTable
                players={displayedPlayers}
                selectedPlayer={selectedPlayer}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSelectPlayer={setSelectedPlayer}
                onNavigateToChart={handleNavigateToChart}
                language={language}
              />
            </div>

            <div className="xl:col-span-5 h-[460px] sm:h-[580px] lg:h-[640px] 2xl:h-[720px]">
              <DivergenceChart
                player={selectedPlayer}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                language={language}
              />
            </div>
          </div>
        )}

        {/* PART 2: DEDICATED FULL CHART & DECISION VERDICT */}
        {activeTab === 'divergence' && (
          <div className="h-[520px] sm:h-[620px] lg:h-[700px] 2xl:h-[800px]">
            <DivergenceChart
              player={selectedPlayer}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              language={language}
            />
          </div>
        )}

        {/* PART 3: BUDGET BUILDER & GEMS */}
        {activeTab === 'builder' && (
          <div>
            <BudgetSquadBuilder
              players={players}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onSelectPlayer={setSelectedPlayer}
              onNavigateToChart={handleNavigateToChart}
              language={language}
            />
          </div>
        )}

        {/* FAVORITES / WATCHLIST VIEW */}
        {activeTab === 'watchlist' && (
          <div className="space-y-4">
            <div className="bg-surface border border-outline/20 rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                  <Star className="w-5 h-5 fill-yellow-400" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm sm:text-base text-on-surface font-sans">
                    {t.watchlistTitle} ({watchlist.length})
                  </h2>
                  <p className="text-xs text-outline mt-0.5 font-sans">
                    {t.watchlistSubtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-[500px] sm:min-h-[580px] 2xl:min-h-[680px]">
              <div className="xl:col-span-7 h-[500px] sm:h-[580px] 2xl:h-[680px]">
                <MarketScannerTable
                  players={displayedPlayers.filter(p => watchlist.includes(p.id))}
                  selectedPlayer={selectedPlayer}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onSelectPlayer={setSelectedPlayer}
                  onNavigateToChart={handleNavigateToChart}
                  language={language}
                />
              </div>
              <div className="xl:col-span-5 h-[460px] sm:h-[580px] 2xl:h-[680px]">
                <DivergenceChart
                  player={selectedPlayer}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  language={language}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Mobile Bottom Navigation Bar (Visible only on smartphone < 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline/20 px-2 py-1.5 flex items-center justify-around select-none">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'scanner' ? 'text-primary' : 'text-outline hover:text-on-surface'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.tab1.split('. ')[1] || t.tab1}</span>
        </button>

        <button
          onClick={() => setActiveTab('divergence')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'divergence' ? 'text-primary' : 'text-outline hover:text-on-surface'
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>{t.tab2.split('. ')[1] || t.tab2}</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'builder' ? 'text-primary' : 'text-outline hover:text-on-surface'
          }`}
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{t.tab3.split('. ')[1] || t.tab3}</span>
        </button>

        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            activeTab === 'watchlist' ? 'text-yellow-400' : 'text-outline hover:text-yellow-400'
          }`}
        >
          <div className="relative">
            <Star className={`w-4 h-4 ${activeTab === 'watchlist' ? 'fill-yellow-400' : ''}`} />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-yellow-400 text-background text-[8px] font-black rounded-full px-1 py-0.2 leading-none">
                {watchlist.length}
              </span>
            )}
          </div>
          <span>{t.tabWatchlist}</span>
        </button>
      </div>

      {/* 4. Secure Auth Modal with OTP Verification */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setGatekeeperReason(null);
          setPendingFavoriteId(null);
        }}
        onSuccess={handleAuthSuccess}
        language={language}
        gatekeeperReason={gatekeeperReason}
      />
    </div>
  );
}

export default App;
