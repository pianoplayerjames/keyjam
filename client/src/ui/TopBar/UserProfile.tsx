// Update TopBar.tsx UserProfile section
// client/src/ui/TopBar/UserProfile.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

interface UserProfileProps {
  playerData: PlayerData;
}

export const UserProfile: React.FC<UserProfileProps> = ({ playerData }) => {
  const navigate = useNavigate();

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

  const handleProfileClick = () => {
    navigate(`/profile/${playerData.username}`);
  };

  return (
    <div className="flex items-center gap-4">
      {/* User Profile Card */}
      <div 
        className="flex items-center gap-3 px-2 py-1 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300 cursor-pointer group"
        onClick={handleProfileClick}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200">
            👤
          </div>
          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
        </div>
        <div className="hidden sm:block">
          <div className="text-white font-semibold text-sm group-hover:text-cyan-400 transition-colors">
            {playerData.username}
          </div>
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
  );
};