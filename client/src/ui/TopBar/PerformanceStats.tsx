import React from 'react';

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

interface PerformanceStatsProps {
  playerData: PlayerData;
  playerStats?: PlayerStats;
}

export const PerformanceStats: React.FC<PerformanceStatsProps> = ({ playerData, playerStats }) => {
  const calculateWinRate = () => {
    const total = playerData.wins + playerData.losses + playerData.draws;
    return total > 0 ? ((playerData.wins / total) * 100).toFixed(1) : '0.0';
  };

  const formatPlayTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="hidden md:flex items-center gap-4 px-4 py-1 rounded bg-slate-900 border border-black/50 shadow-sm backdrop-blur-sm">
      <div className="text-center">
        <div className="text-sm font-bold text-green-400">{calculateWinRate()}%</div>
        <div className="text-xs text-gray-400">Win Rate</div>
      </div>
      <div className="w-px h-8 bg-white/20"></div>
      <div className="text-center">
        <div className="text-sm font-bold text-blue-400">{playerData.wins}/{playerData.losses}</div>
        <div className="text-xs text-gray-400">W/L</div>
      </div>
      <div className="w-px h-8 bg-white/20"></div>
      <div className="text-center">
        <div className="text-sm font-bold text-purple-400">{playerData.level}</div>
        <div className="text-xs text-gray-400">Level</div>
      </div>
      {playerStats && (
        <>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-sm font-bold text-yellow-400">
              {playerStats.bestScore > 999999 ? `${(playerStats.bestScore / 1000000).toFixed(1)}M` : `${Math.floor(playerStats.bestScore / 1000)}K`}
            </div>
            <div className="text-xs text-gray-400">Best</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-sm font-bold text-cyan-400">{formatPlayTime(playerStats.totalPlayTime)}</div>
            <div className="text-xs text-gray-400">Playtime</div>
          </div>
        </>
      )}
    </div>
  );
};