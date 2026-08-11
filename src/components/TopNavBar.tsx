import React, { useState } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../lib/i18n';
import { 
  Search, 
  RefreshCw, 
  Activity, 
  Sparkles, 
  Star, 
  LineChart, 
  LogIn, 
  LogOut, 
  Globe, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export type ActiveTab = 'scanner' | 'divergence' | 'builder' | 'watchlist';

interface TopNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLiveApi: boolean;
  totalPlayersCount: number;
  watchlistCount: number;
  language: Language;
  onToggleLanguage: () => void;
  user: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing,
  isLiveApi,
  totalPlayersCount,
  watchlistCount,
  language,
  onToggleLanguage,
  user,
  onOpenAuthModal,
  onLogout
}) => {
  const t = TRANSLATIONS[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleTabClick = (tab: ActiveTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-surface-container-lowest border-b border-outline/20 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 select-none sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Live Indicator */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-xs sm:text-sm shadow-[0_0_10px_rgba(16,185,129,0.25)] flex-shrink-0">
              αP
            </div>
            <div>
              <h1 className="font-display font-black text-sm sm:text-base text-on-surface tracking-tight leading-none font-sans flex items-center gap-1.5">
                <span>{t.appName}</span>
                <span className="text-primary text-[10px] sm:text-xs font-bold font-mono px-1 py-0.2 rounded bg-primary/10 border border-primary/30">MVP</span>
              </h1>
              <div className="text-[9px] sm:text-[10px] text-outline font-mono mt-0.5 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isLiveApi ? 'bg-primary animate-pulse' : 'bg-amber-400'}`}></span>
                <span className={isLiveApi ? 'text-primary font-bold' : 'text-amber-400'}>
                  {isLiveApi ? `${t.liveApiStatus} (${totalPlayersCount})` : t.offlineStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop & Tablet Navigation Tabs (Hidden on mobile < 1024px) */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline/20">
            <button
              onClick={() => onTabChange('scanner')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-sans ${
                activeTab === 'scanner'
                  ? 'bg-primary text-background shadow-md'
                  : 'text-outline hover:text-on-surface hover:bg-surface-container-highest/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {t.tab1}
            </button>

            <button
              onClick={() => onTabChange('divergence')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-sans ${
                activeTab === 'divergence'
                  ? 'bg-primary text-background shadow-md'
                  : 'text-outline hover:text-on-surface hover:bg-surface-container-highest/50'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              {t.tab2}
            </button>

            <button
              onClick={() => onTabChange('builder')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-sans ${
                activeTab === 'builder'
                  ? 'bg-primary text-background shadow-md'
                  : 'text-outline hover:text-on-surface hover:bg-surface-container-highest/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              {t.tab3}
            </button>

            <button
              onClick={() => onTabChange('watchlist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-sans ${
                activeTab === 'watchlist'
                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 shadow-sm'
                  : 'text-outline hover:text-yellow-400 hover:bg-surface-container-highest/50'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {t.tabWatchlist} ({watchlistCount})
            </button>
          </nav>
        </div>

        {/* Right: Search, Language, Auth & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Search Box (Desktop & Tablet) */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-surface-container-high border border-outline/20 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary/50 w-44 lg:w-56 font-mono"
            />
          </div>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline/20 text-xs font-mono text-outline hover:text-on-surface transition-colors cursor-pointer"
            title={t.syncButton}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span className="hidden xl:inline">{t.syncButton}</span>
          </button>

          {/* Language Switcher (FR / EN) */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline/20 text-xs font-mono text-on-surface font-bold transition-all cursor-pointer hover:border-primary/40"
            title={language === 'FR' ? 'Switch to English' : 'Passer en Français'}
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] sm:text-xs">{language === 'FR' ? 'FR 🇫🇷' : 'EN 🇬🇧'}</span>
          </button>

          {/* User Auth Section (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center">
            {user ? (
              <div className="flex items-center gap-2 bg-surface-container-high px-2.5 py-1 rounded-lg border border-primary/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black font-mono">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-on-surface font-medium truncate max-w-[90px] lg:max-w-[120px]" title={user.email}>
                    {user.email.split('@')[0]}
                  </span>
                  <span className="hidden lg:flex items-center gap-0.5 text-[9px] font-bold text-primary bg-primary/10 px-1 py-0.2 rounded border border-primary/20">
                    <ShieldCheck className="w-3 h-3" />
                    {t.verifiedBadge}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1 rounded text-outline hover:text-secondary transition-colors cursor-pointer ml-0.5"
                  title={t.logoutButton}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-background font-bold text-xs transition-all shadow-md cursor-pointer font-sans"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.loginButton}</span>
              </button>
            )}
          </div>

          {/* Mobile Burger Menu Button (Visible on screens < 1024px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-surface-container-high border border-outline/20 text-on-surface hover:text-primary transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Over Menu (< 1024px) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[53px] sm:top-[57px] z-50 bg-black/80 backdrop-blur-lg animate-in slide-in-from-top-2 duration-150 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Mobile Search Input */}
            <div className="relative md:hidden">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-surface-container-high border border-outline/30 rounded-xl pl-9 pr-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1.5">
              <button
                onClick={() => handleTabClick('scanner')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'scanner'
                    ? 'bg-primary text-background shadow-md'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4" />
                  <span>{t.tab1}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('divergence')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'divergence'
                    ? 'bg-primary text-background shadow-md'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LineChart className="w-4 h-4" />
                  <span>{t.tab2}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('builder')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'builder'
                    ? 'bg-primary text-background shadow-md'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>{t.tab3}</span>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('watchlist')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'watchlist'
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 shadow-sm'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span>{t.tabWatchlist}</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-highest text-yellow-400">
                  {watchlistCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Bottom Profile & Sync */}
          <div className="pt-4 border-t border-outline/20 space-y-3 mt-6">
            <button
              onClick={() => {
                onRefresh();
                setIsMobileMenuOpen(false);
              }}
              disabled={isRefreshing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-container-high border border-outline/20 text-xs font-mono text-on-surface"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
              <span>{t.syncButton}</span>
            </button>

            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high border border-primary/30">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black font-mono">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="text-xs font-mono text-on-surface font-semibold">{user.email}</div>
                    <div className="text-[10px] text-primary flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{t.verifiedBadge}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-secondary/20 hover:bg-secondary text-secondary hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.logoutButton}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-3 rounded-xl bg-primary text-background font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{t.loginButton}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
