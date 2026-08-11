import React, { useState } from 'react';

interface PlayerAvatarProps {
  photoUrl?: string;
  name: string;
  teamShort: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  photoUrl,
  name,
  teamShort,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-7 h-7 sm:w-8 sm:h-8 text-[10px]',
    md: 'w-9 h-9 sm:w-10 sm:h-10 text-xs',
    lg: 'w-10 h-10 sm:w-12 sm:h-12 text-sm',
    xl: 'w-14 h-14 sm:w-16 sm:h-16 text-base'
  };

  // Club distinct gradient / color styles for the fallback avatar badge
  const getClubBg = (team: string) => {
    switch (team.toUpperCase()) {
      case 'ARS':
      case 'LIV':
      case 'MUN':
      case 'BOU':
      case 'NFO':
      case 'SOU':
        return 'from-rose-500/20 to-red-600/30 text-rose-400 border-rose-500/40';
      case 'MCI':
      case 'CHE':
      case 'EVE':
      case 'LEI':
      case 'BHA':
      case 'IPS':
        return 'from-cyan-500/20 to-blue-600/30 text-cyan-400 border-cyan-500/40';
      case 'AVL':
      case 'WHU':
      case 'CRY':
        return 'from-purple-500/20 to-pink-600/30 text-purple-400 border-purple-500/40';
      case 'NEW':
      case 'FUL':
      case 'TOT':
        return 'from-slate-600/30 to-zinc-700/40 text-slate-200 border-slate-500/40';
      case 'WOL':
      case 'BRE':
        return 'from-amber-500/20 to-orange-600/30 text-amber-400 border-amber-500/40';
      default:
        return 'from-primary/20 to-emerald-600/30 text-primary border-primary/40';
    }
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 relative bg-surface-container-highest border ${className}`}
    >
      {!hasError && photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${getClubBg(
            teamShort
          )} flex flex-col items-center justify-center font-mono font-bold leading-none select-none`}
        >
          <span>{teamShort || name.substring(0, 2).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};
