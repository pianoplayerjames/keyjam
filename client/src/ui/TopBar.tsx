import React from 'react';

interface PlayerStats {
  totalReplays: number;
  bestScore: number;
  bestAccuracy: number;
  totalPlayTime: number;
}

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

interface TopBarProps {
  playerData: PlayerData;
  playerStats?: PlayerStats;
}

export const TopBar: React.FC<TopBarProps> = ({ playerData, playerStats }) => {
  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      case 'diamond': return '#b9f2ff';
      case 'master': return '#ff6b35';
      case 'grandmaster': return '#ff1744';
      default: return '#666';
    }
  };

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
    <div className="flex-shrink-0 bg-slate-800/50 py-1 border-white/10 shadow-2xl">
      <div className="px-6 py-0">
        <div className="flex items-center justify-between">
          
          {/* Left Section - Logo & Branding */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="KeyJam" 
                  className="h-10 w-auto animate-tilt group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
              </div>
              <div>
                <div className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  KeyJam
                </div>
                <div className="text-xs text-gray-400">V11.8.2 / Season 1</div>
              </div>
            </div>

            {/* Live Stats with Animations */}
            <div className="hidden xl:flex items-center gap-4 ml-8">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">1,247</span>
                <span className="text-gray-400 text-xs">Online Now</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1">
                <span className="text-blue-400 text-lg">🎮</span>
                <span className="text-blue-400 text-sm font-semibold">34,636</span>
                <span className="text-gray-400 text-xs">Active Games</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1">
                <span className="text-purple-400 text-lg">🏆</span>
                <span className="text-purple-400 text-sm font-semibold">23</span>
                <span className="text-gray-400 text-xs">Live Arenas</span>
              </div>
            </div>
          </div>

          {/* Right Section - User Profile & Status */}
          <div className="flex items-center gap-4">
            
            {/* Performance Stats */}
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

            {/* Notifications */}
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group">
              <span className="text-xl group-hover:scale-110 transition-transform duration-200 block">🔔</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>

            {/* User Profile Card */}
            <div className="flex items-center gap-3 px-2 py-1 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300 cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                  👤
                </div>
                {/* Online Status Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-semibold text-sm">{playerData.username}</div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs font-bold" 
                    style={{ color: getRankColor(playerData.rank) }}
                  >
                    {playerData.rank}
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-cyan-400 text-xs font-semibold">{playerData.elo} ELO</span>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats Row */}
        <div className="xl:hidden mt-3 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">1,247 Online</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <span className="text-blue-400 text-sm">🎮</span>
            <span className="text-blue-400 text-sm font-semibold">89 Games</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <span className="text-purple-400 text-sm">🏟️</span>
            <span className="text-purple-400 text-sm font-semibold">23 Arenas</span>
          </div>
        </div>
      </div>
    </div>
  );
};