import React from 'react';
import { CenteredContainer } from '../shared/components/Layout';

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
    <div className="flex-shrink-0 bg-slate-800/50 py-1 border-0 border-b border-black/50 shadow-2xl">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true}>
        <div className="flex items-center justify-between gap-8">
          
          <div className="flex items-center">
            <div className="flex items-center gap-3 group">
              <div>
                <div className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  KeyJam
                </div>
                <div className="text-xs text-gray-400">V11.8.2 / Season 1</div>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-4 ml-8">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">182,247</span>
                <span className="text-gray-400 text-xs">Online Now</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1">
                <span className="text-blue-400 text-lg">🎮</span>
                <span className="text-blue-400 text-sm font-semibold">34,636</span>
                <span className="text-gray-400 text-xs">Live Games</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1">
                <span className="text-purple-400 text-lg">🏆</span>
                <span className="text-purple-400 text-sm font-semibold">243</span>
                <span className="text-gray-400 text-xs">Live Arenas</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
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

           <div className="flex items-center gap-3 px-2 py-1 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300 cursor-pointer group">
             <div className="relative">
               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                 👤
               </div>
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
           </div>
         </div>
       </div>

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
     </CenteredContainer>
   </div>
 );
};