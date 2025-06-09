import React from 'react';

export const MobileStats: React.FC = () => {
  return (
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
  );
};