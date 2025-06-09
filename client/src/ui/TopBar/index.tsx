import React from 'react';
import { Logo } from './Logo';
import { LiveStats } from './LiveStats';
import { PerformanceStats } from './PerformanceStats';
import { UserProfile } from './UserProfile';
import { MobileStats } from './MobileStats';

interface PlayerData {
  username: string;
  rank: string;
  elo: number;
  level: number;
  wins: number;
  losses: number;
  draws: number;
  status: 'online' | 'away' | 'in-game' | 'offline';
}

interface PlayerStats {
  totalReplays: number;
  bestScore: number;
  bestAccuracy: number;
  totalPlayTime: number;
}

interface TopBarProps {
  playerData: PlayerData;
  playerStats?: PlayerStats;
}

export const TopBar: React.FC<TopBarProps> = ({ playerData, playerStats }) => {
  return (
    <div className="flex-shrink-0 bg-slate-800/50 py-1 border-white/10 shadow-2xl">
      <div className="px-6 py-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <LiveStats />
          </div>

          <div className="flex items-center gap-4">
            <PerformanceStats playerData={playerData} playerStats={playerStats} />
            <UserProfile playerData={playerData} />
          </div>
        </div>

        <MobileStats />
      </div>
    </div>
  );
};