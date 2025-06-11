// client/src/pages/online/Leaderboards.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

interface LeaderboardPlayer {
  rank: number;
  username: string;
  elo: number;
  tier: string;
  wins: number;
  losses: number;
  winRate: number;
  recentChange: number;
  country: string;
  avatar: string;
  isOnline: boolean;
  level: number;
  totalGames: number;
  streak: number;
  lastPlayed: Date;
  badges: string[];
}

interface LeaderboardsProps {
  onBack: () => void;
}

const mockLeaderboardData: LeaderboardPlayer[] = Array.from({ length: 500 }, (_, i) => {
  const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'];
  const countries = ['🇺🇸', '🇰🇷', '🇯🇵', '🇩🇪', '🇬🇧', '🇫🇷', '🇨🇦', '🇦🇺', '🇸🇪', '🇳🇴'];
  const names = [
    'RhythmGod', 'BeatMachine', 'SoundWave', 'PerfectPlayer', 'SpeedDemon', 'ComboKing', 
    'AccuracyAce', 'NoteMaster', 'VibeChecker', 'FlowState', 'PulseRider', 'EchoWave',
    'SyncMaster', 'HarmonySeeker', 'TrebleClef', 'NightOwl', 'DawnBreaker', 'TimingPro',
    'BeatBoss', 'RhythmRuler', 'SoundSavant', 'NoteSavage', 'MelodyMaster', 'BassDrop'
  ];
  
  const baseElo = Math.max(800, 3000 - (i * 4) + Math.random() * 150 - 75);
  const tier = ranks[Math.min(ranks.length - 1, Math.floor((baseElo - 800) / 350))];
  const wins = Math.floor(Math.random() * 500) + 50;
  const losses = Math.floor(Math.random() * 300) + 20;
  const totalGames = wins + losses;
  const winRate = (wins / totalGames) * 100;
  
  return {
    rank: i + 1,
    username: names[Math.floor(Math.random() * names.length)] + (Math.floor(Math.random() * 999) + 1),
    elo: Math.floor(baseElo),
    tier,
    wins,
    losses,
    winRate,
    recentChange: Math.floor(Math.random() * 80) - 40,
    country: countries[Math.floor(Math.random() * countries.length)],
    avatar: `/avatars/player${(i % 20) + 1}.png`,
    isOnline: Math.random() > 0.3,
    level: Math.floor(baseElo / 50) + Math.floor(Math.random() * 10),
    totalGames,
    streak: Math.floor(Math.random() * 15),
    lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    badges: ['🏆', '⚡', '🎯', '🔥'].slice(0, Math.floor(Math.random() * 3))
  };
});

const Leaderboards: React.FC<LeaderboardsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'regional'>('global');
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'alltime'>('alltime');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const currentPlayerRank = 127; // Simulated current player rank

  const filteredData = useMemo(() => {
    let filtered = mockLeaderboardData;

    if (searchQuery.trim()) {
      filtered = filtered.filter(player => 
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeTab) {
      case 'friends':
        filtered = filtered.slice(0, 15); // Mock friends
        break;
      case 'regional':
        filtered = filtered.filter(player => player.country === '🇺🇸'); // Mock regional
        break;
    }

    return filtered;
  }, [activeTab, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const getTierColor = (tier: string) => {
    const colors = {
      'grandmaster': 'text-red-400',
      'master': 'text-orange-400',
      'diamond': 'text-cyan-400',
      'platinum': 'text-gray-300',
      'gold': 'text-yellow-400',
      'silver': 'text-gray-400',
      'bronze': 'text-orange-600'
    };
    return colors[tier.toLowerCase() as keyof typeof colors] || 'text-gray-400';
  };

  const getTierBg = (tier: string) => {
    const colors = {
      'grandmaster': 'bg-red-500/10 border-red-500/20',
      'master': 'bg-orange-500/10 border-orange-500/20',
      'diamond': 'bg-cyan-500/10 border-cyan-500/20',
      'platinum': 'bg-gray-300/10 border-gray-300/20',
      'gold': 'bg-yellow-500/10 border-yellow-500/20',
      'silver': 'bg-gray-400/10 border-gray-400/20',
      'bronze': 'bg-orange-600/10 border-orange-600/20'
    };
    return colors[tier.toLowerCase() as keyof typeof colors] || 'bg-gray-500/10 border-gray-500/20';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <CenteredContainer maxWidth="2xl" accountForLeftNav={true}>
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Leaderboards</h1>
                <p className="text-gray-400">See how you stack up against the competition</p>
              </div>
            </div>
          </div>

          {/* Your Rank Card */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Your Current Rank</h3>
                  <p className="text-purple-100">RhythmMaster</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">#{currentPlayerRank}</div>
                <div className="text-purple-100">2,347 ELO</div>
              </div>
            </div>
          </div>

          {/* Tabs and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
              {[
                { id: 'global', label: 'Global', icon: '🌍' },
                { id: 'friends', label: 'Friends', icon: '👥' },
                { id: 'regional', label: 'Regional', icon: '🏛️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="alltime">All Time</option>
              </select>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-slate-800 rounded-xl overflow-hidden mb-8">
          {/* Table Header */}
          <div className="bg-slate-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-300 uppercase tracking-wide">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-2 text-center">Rating</div>
              <div className="col-span-2 text-center">Tier</div>
              <div className="col-span-2 text-center">Win Rate</div>
              <div className="col-span-1 text-center">Status</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-700">
            {paginatedData.map((player, index) => (
              <div
                key={player.rank}
                className={`px-6 py-4 hover:bg-slate-700/50 transition-colors ${
                  player.username.includes('RhythmMaster') ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Rank */}
                  <div className="col-span-1">
                    <div className={`text-xl font-bold ${
                      player.rank <= 3 ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : `#${player.rank}`}
                    </div>
                  </div>

                  {/* Player */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-lg">👤</span>
                        </div>
                        {player.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            player.username.includes('RhythmMaster') ? 'text-blue-400' : 'text-white'
                          }`}>
                            {player.username}
                            {player.username.includes('RhythmMaster') && ' (You)'}
                          </span>
                          <span className="text-lg">{player.country}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-400">Level {player.level}</span>
                          {player.badges.map((badge, i) => (
                            <span key={i} className="text-sm">{badge}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="col-span-2 text-center">
                    <div className="text-xl font-bold text-yellow-400">
                      {player.elo.toLocaleString()}
                    </div>
                    <div className={`text-sm ${
                      player.recentChange > 0 ? 'text-green-400' : 
                      player.recentChange < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {player.recentChange > 0 ? '+' : ''}{player.recentChange}
                    </div>
                  </div>

                  {/* Tier */}
                  <div className="col-span-2 text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getTierBg(player.tier)} ${getTierColor(player.tier)}`}>
                      {player.tier}
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-2 text-center">
                    <div className="text-lg font-semibold text-white">
                      {player.winRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">
                      {player.wins}W {player.losses}L
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 text-center">
                    <div className={`w-3 h-3 rounded-full mx-auto ${
                      player.isOnline ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} players
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 text-gray-400">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === totalPages
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {filteredData.length.toLocaleString()}
            </div>
            <div className="text-gray-400">Total Players</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {filteredData.filter(p => p.isOnline).length.toLocaleString()}
            </div>
            <div className="text-gray-400">Online Now</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {Math.floor(filteredData.reduce((sum, p) => sum + p.elo, 0) / filteredData.length || 0)}
            </div>
            <div className="text-gray-400">Average ELO</div>
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};

export default Leaderboards;