import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CenteredContainer } from '@/shared/components/Layout';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  category: 'gameplay' | 'social' | 'competitive' | 'special';
}

interface MatchHistory {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  mode: string;
  difficulty: number;
  score: number;
  accuracy: number;
  maxCombo: number;
  eloChange: number;
  playedAt: Date;
  duration: number;
  song: string;
}

interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalPlayTime: number;
  averageAccuracy: number;
  bestScore: number;
  longestCombo: number;
  perfectNotes: number;
  totalNotes: number;
  rankingHistory: Array<{ date: Date; rank: string; elo: number }>;
  favoriteGenres: Array<{ genre: string; percentage: number }>;
  monthlyStats: Array<{ month: string; games: number; winRate: number }>;
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  isRare?: boolean;
}

interface PlayerProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  rank: string;
  elo: number;
  level: number;
  experience: number;
  experienceToNext: number;
  avatar: string;
  banner: string;
  country: string;
  joinedAt: Date;
  lastOnline: Date;
  status: 'online' | 'away' | 'in-game' | 'offline';
  isFollowing?: boolean;
  followersCount: number;
  followingCount: number;
  badges: BadgeData[];
  stats: PlayerStats;
  achievements: Achievement[];
  recentMatches: MatchHistory[];
  socialLinks: {
    discord?: string;
    twitter?: string;
    twitch?: string;
    youtube?: string;
  };
  preferences: {
    showStats: boolean;
    showAchievements: boolean;
    showMatchHistory: boolean;
    allowMessages: boolean;
    allowFriendRequests: boolean;
  };
}

const mockPlayerProfile: PlayerProfile = {
  id: 'player_123',
  username: 'RhythmMaster',
  displayName: 'Rhythm Master',
  bio: 'Professional rhythm game player | Diamond ranked | Streaming daily on Twitch | Always up for a challenge! 🎵',
  rank: 'Diamond',
  elo: 2794,
  level: 47,
  experience: 23456,
  experienceToNext: 8544,
  avatar: 'https://picsum.photos/300/300?random=1',
  banner: 'https://picsum.photos/1200/400?random=1',
  country: 'US',
  joinedAt: new Date('2023-06-15'),
  lastOnline: new Date(),
  status: 'online',
  isFollowing: false,
  followersCount: 1247,
  followingCount: 342,
  badges: [
    {
      id: 'tournament_winner',
      name: 'Tournament Champion',
      description: 'Won a major tournament',
      icon: '🏆',
      color: '#ffd700',
      earnedAt: new Date('2024-03-15'),
      isRare: true
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: '100 perfect accuracy games',
      icon: '💎',
      color: '#b9f2ff',
      earnedAt: new Date('2024-02-20')
    },
    {
      id: 'combo_king',
      name: 'Combo King',
      description: '1000+ note combo',
      icon: '🔥',
      color: '#ff6b35',
      earnedAt: new Date('2024-01-10')
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Expert difficulty master',
      icon: '⚡',
      color: '#ff1744',
      earnedAt: new Date('2023-12-05')
    }
  ],
  stats: {
    totalGames: 1547,
    wins: 892,
    losses: 534,
    draws: 121,
    winRate: 57.7,
    totalPlayTime: 186420000,
    averageAccuracy: 94.3,
    bestScore: 2847692,
    longestCombo: 1847,
    perfectNotes: 234567,
    totalNotes: 367891,
    rankingHistory: [
      { date: new Date('2024-01-01'), rank: 'Platinum', elo: 2200 },
      { date: new Date('2024-02-01'), rank: 'Diamond', elo: 2500 },
      { date: new Date('2024-03-01'), rank: 'Diamond', elo: 2794 },
    ],
    favoriteGenres: [
      { genre: 'Electronic', percentage: 45 },
      { genre: 'Synthwave', percentage: 28 },
      { genre: 'Techno', percentage: 15 },
      { genre: 'Ambient', percentage: 12 }
    ],
    monthlyStats: [
      { month: 'Jan', games: 156, winRate: 54.8 },
      { month: 'Feb', games: 203, winRate: 58.1 },
      { month: 'Mar', games: 189, winRate: 61.4 }
    ]
  },
  achievements: [
    {
      id: 'first_win',
      name: 'First Victory',
      description: 'Win your first match',
      icon: '🏆',
      rarity: 'common',
      unlockedAt: new Date('2023-06-16'),
      category: 'gameplay'
    },
    {
      id: 'combo_master',
      name: 'Combo Master',
      description: 'Achieve a 500+ note combo',
      icon: '🔥',
      rarity: 'rare',
      unlockedAt: new Date('2023-08-20'),
      category: 'gameplay'
    },
    {
      id: 'perfect_game',
      name: 'Perfectionist',
      description: 'Complete a song with 100% accuracy',
      icon: '💎',
      rarity: 'epic',
      unlockedAt: new Date('2023-09-10'),
      category: 'competitive'
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Add 50 friends',
      icon: '🦋',
      rarity: 'rare',
      progress: 42,
      maxProgress: 50,
      category: 'social'
    }
  ],
  recentMatches: [
    {
      id: 'match_1',
      opponent: 'BeatMaster99',
      result: 'win',
      mode: 'Ranked',
      difficulty: 85,
      score: 234567,
      accuracy: 96.7,
      maxCombo: 456,
      eloChange: +23,
      playedAt: new Date(Date.now() - 1000 * 60 * 30),
      duration: 180,
      song: 'Neon Dreams'
    },
    {
      id: 'match_2',
      opponent: 'SoundWave',
      result: 'loss',
      mode: 'Ranked',
      difficulty: 92,
      score: 198432,
      accuracy: 91.2,
      maxCombo: 234,
      eloChange: -18,
      playedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      duration: 165,
      song: 'Electric Pulse'
    },
    {
      id: 'match_3',
      opponent: 'MelodyMaster',
      result: 'win',
      mode: 'Casual',
      difficulty: 78,
      score: 267891,
      accuracy: 98.1,
      maxCombo: 789,
      eloChange: +15,
      playedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      duration: 200,
      song: 'Digital Storm'
    }
  ],
  socialLinks: {
    discord: 'RhythmMaster#1234',
    twitter: '@rhythmmaster',
    twitch: 'rhythmmaster_live',
    youtube: 'RhythmMasterOfficial'
  },
  preferences: {
    showStats: true,
    showAchievements: true,
    showMatchHistory: true,
    allowMessages: true,
    allowFriendRequests: true
  }
};

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'matches' | 'about'>('overview');
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, always load the mock profile
      setProfile(mockPlayerProfile);
      setIsOwnProfile(username === 'RhythmMaster' || !username);
      setLoading(false);
    };

    loadProfile();
  }, [username]);

  const getRankColor = (rank: string) => {
    const colors = {
      'bronze': '#cd7f32',
      'silver': '#c0c0c0',
      'gold': '#ffd700',
      'platinum': '#e5e4e2',
      'diamond': '#b9f2ff',
      'master': '#ff6b35',
      'grandmaster': '#ff1744'
    };
    return colors[rank.toLowerCase() as keyof typeof colors] || '#666';
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'in-game': return 'bg-blue-400';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleFollow = () => {
    if (profile) {
      setProfile({
        ...profile,
        isFollowing: !profile.isFollowing,
        followersCount: profile.isFollowing ? profile.followersCount - 1 : profile.followersCount + 1
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-white text-xl mb-2">Player not found</div>
          <div className="text-gray-400 mb-4">The profile you're looking for doesn't exist</div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CenteredContainer maxWidth="2xl" accountForLeftNav={true} className="py-6">
        {/* Header with Banner */}
        <div className="relative mb-6">
          <div
            className="w-full h-64 rounded-lg bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url(${profile.banner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 px-4 py-2 bg-black/50 hover:bg-black/70 rounded-lg text-white font-medium transition-colors backdrop-blur-sm"
            >
              ← Back
            </button>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end gap-6">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-3 border-white ${getStatusColor(profile.status)}`}></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{profile.displayName}</h1>
                    <span className="text-gray-300">@{profile.username}</span>
                    <div className="flex items-center gap-1">
                      <img src={`https://flagcdn.com/16x12/${profile.country.toLowerCase()}.png`} alt={profile.country} className="rounded-sm" />
                      <span className="text-gray-300 text-sm">{profile.country}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{ backgroundColor: getRankColor(profile.rank), color: 'white' }}
                      >
                        {profile.rank}
                      </span>
                      <span className="text-xl font-bold text-white">{profile.elo} ELO</span>
                    </div>
                    <div className="text-gray-300">Level {profile.level}</div>
                    <div className="text-gray-300">•</div>
                    <div className="text-gray-300">Joined {profile.joinedAt.toLocaleDateString()}</div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-3">
                    {profile.badges.slice(0, 4).map((badge) => (
                      <div
                        key={badge.id}
                        className={`relative px-3 py-1 rounded-full text-sm font-medium ${badge.isRare ? 'animate-pulse' : ''}`}
                        style={{ backgroundColor: badge.color + '20', border: `1px solid ${badge.color}`, color: badge.color }}
                        title={badge.description}
                      >
                        <span className="mr-1">{badge.icon}</span>
                        {badge.name}
                      </div>
                    ))}
                    {profile.badges.length > 4 && (
                      <div className="px-3 py-1 bg-gray-600/20 border border-gray-600 rounded-full text-sm text-gray-300">
                        +{profile.badges.length - 4} more
                      </div>
                    )}
                  </div>

                  {/* Social Stats */}
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-bold text-white">{profile.followersCount.toLocaleString()}</span>
                      <span className="text-gray-300 ml-1">followers</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">{profile.followingCount.toLocaleString()}</span>
                      <span className="text-gray-300 ml-1">following</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">{profile.stats.totalGames.toLocaleString()}</span>
                      <span className="text-gray-300 ml-1">games played</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!isOwnProfile && (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                          profile.isFollowing
                            ? 'bg-gray-600 hover:bg-gray-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {profile.isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                      <button className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors">
                        Challenge
                      </button>
                      <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors">
                        💬
                      </button>
                    </>
                  )}
                  {isOwnProfile && (
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'stats', label: 'Statistics', icon: '📈' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'matches', label: 'Match History', icon: '🎮' },
            { id: 'about', label: 'About', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
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

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{profile.stats.winRate}%</div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{profile.stats.averageAccuracy}%</div>
                      <div className="text-sm text-gray-400">Avg Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{profile.stats.bestScore.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Best Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{profile.stats.longestCombo}</div>
                      <div className="text-sm text-gray-400">Max Combo</div>
                    </div>
                  </div>
                </div>

                {/* Recent Matches */}
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Matches</h3>
                  <div className="space-y-3">
                    {profile.recentMatches.slice(0, 3).map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            match.result === 'win' ? 'bg-green-600' : 
                            match.result === 'loss' ? 'bg-red-600' : 'bg-yellow-600'
                          }`}>
                            {match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}
                          </div>
                          <div>
                            <div className="text-white font-medium">vs {match.opponent}</div>
                            <div className="text-sm text-gray-400">{match.song} • {match.mode}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{match.score.toLocaleString()}</div>
                          <div className="text-sm text-gray-400">{match.accuracy}% • {formatTimeAgo(match.playedAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Level Progress */}
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-lg font-bold text-white mb-4">Level Progress</h3>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-400">Level {profile.level}</div>
                    <div className="text-sm text-gray-400">{profile.experience.toLocaleString()} / {(profile.experience + profile.experienceToNext).toLocaleString()} XP</div>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3 mb-2">
                    <div 
                      className="bg-blue-400 h-3 rounded-full"
                      style={{ width: `${(profile.experience / (profile.experience + profile.experienceToNext)) * 100}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-400">
                    {profile.experienceToNext.toLocaleString()} XP to next level
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Achievements</h3>
                  <div className="space-y-3">
                    {profile.achievements.filter(a => a.unlockedAt).slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{achievement.name}</div>
                          <div className="text-xs text-gray-400">{formatTimeAgo(achievement.unlockedAt!)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                {Object.keys(profile.socialLinks).some(key => profile.socialLinks[key as keyof typeof profile.socialLinks]) && (
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                    <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
                    <div className="space-y-2">
                      {profile.socialLinks.discord && (
                        <a href="#" className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded text-blue-400 hover:text-blue-300 transition-colors">
                          <span className="text-lg">💬</span>
                          <span className="text-sm">{profile.socialLinks.discord}</span>
                        </a>
                      )}
                      {profile.socialLinks.twitch && (
                        <a href="#" className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded text-purple-400 hover:text-purple-300 transition-colors">
                          <span className="text-lg">📺</span>
                          <span className="text-sm">{profile.socialLinks.twitch}</span>
                        </a>
                      )}
                      {profile.socialLinks.twitter && (
                        <a href="#" className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded text-blue-400 hover:text-blue-300 transition-colors">
                          <span className="text-lg">🐦</span>
                          <span className="text-sm">{profile.socialLinks.twitter}</span>
                        </a>
                      )}
                      {profile.socialLinks.youtube && (
                        <a href="#" className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded text-red-400 hover:text-red-300 transition-colors">
                          <span className="text-lg">📹</span>
                          <span className="text-sm">{profile.socialLinks.youtube}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4">Performance Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Playtime</span>
                    <span className="text-white font-medium">{formatTime(profile.stats.totalPlayTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Games Played</span>
                    <span className="text-white font-medium">{profile.stats.totalGames.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-green-400 font-medium">{profile.stats.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Accuracy</span>
                    <span className="text-blue-400 font-medium">{profile.stats.averageAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Score</span>
                    <span className="text-purple-400 font-medium">{profile.stats.bestScore.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
<span className="text-gray-400">Longest Combo</span>
                    <span className="text-orange-400 font-medium">{profile.stats.longestCombo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Perfect Notes</span>
                    <span className="text-yellow-400 font-medium">{profile.stats.perfectNotes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Notes Hit</span>
                    <span className="text-white font-medium">{profile.stats.totalNotes.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4">Monthly Performance</h3>
                <div className="space-y-3">
                  {profile.stats.monthlyStats.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-white font-medium">{month.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">{month.games} games</span>
                        <span className={`font-medium ${month.winRate >= 60 ? 'text-green-400' : month.winRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {month.winRate}% WR
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4">Favorite Genres</h3>
                <div className="space-y-3">
                  {profile.stats.favoriteGenres.map((genre) => (
                    <div key={genre.genre} className="flex items-center justify-between">
                      <span className="text-white">{genre.genre}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full"
                            style={{ width: `${genre.percentage}%` }}
                          />
                        </div>
                        <span className="text-blue-400 font-medium w-12 text-right">{genre.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-lg border transition-all hover:scale-105 ${
                    achievement.unlockedAt
                      ? 'bg-slate-800/50 border-slate-600/50'
                      : 'bg-slate-900/50 border-slate-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`text-4xl ${achievement.unlockedAt ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
                      <span
                        className="text-xs px-2 py-1 rounded font-bold uppercase"
                        style={{ backgroundColor: getRarityColor(achievement.rarity) + '20', color: getRarityColor(achievement.rarity) }}
                      >
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
                  
                  {achievement.progress !== undefined && achievement.maxProgress !== undefined ? (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : achievement.unlockedAt ? (
                    <div className="text-green-400 text-sm font-medium">
                      ✅ Unlocked {formatTimeAgo(achievement.unlockedAt)}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">🔒 Locked</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="bg-slate-800/50 rounded-lg border border-slate-600/50">
              <div className="p-6 border-b border-slate-600/50">
                <h3 className="text-xl font-bold text-white">Match History</h3>
              </div>
              <div className="divide-y divide-slate-600/50">
                {profile.recentMatches.map((match) => (
                  <div key={match.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          match.result === 'win' ? 'bg-green-600' : 
                          match.result === 'loss' ? 'bg-red-600' : 'bg-yellow-600'
                        }`}>
                          {match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}
                        </div>
                        <div>
                          <div className="text-white font-medium text-lg">vs {match.opponent}</div>
                          <div className="text-gray-400 text-sm">{match.song} • {match.mode}</div>
                          <div className="text-gray-500 text-xs">{formatTimeAgo(match.playedAt)}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="grid grid-cols-4 gap-6 text-sm">
                          <div>
                            <div className="text-gray-400">Score</div>
                            <div className="text-white font-medium">{match.score.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Accuracy</div>
                            <div className="text-blue-400 font-medium">{match.accuracy}%</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Max Combo</div>
                            <div className="text-orange-400 font-medium">{match.maxCombo}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">ELO Change</div>
                            <div className={`font-medium ${match.eloChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {match.eloChange > 0 ? '+' : ''}{match.eloChange}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4">About</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Bio</div>
                    <p className="text-white leading-relaxed">{profile.bio}</p>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Member Since</div>
                    <div className="text-white">{profile.joinedAt.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Last Online</div>
                    <div className="text-white">{formatTimeAgo(profile.lastOnline)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Location</div>
                    <div className="flex items-center gap-2 text-white">
                      <img src={`https://flagcdn.com/16x12/${profile.country.toLowerCase()}.png`} alt={profile.country} className="rounded-sm" />
                      {profile.country}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4">All Badges</h3>
                <div className="grid grid-cols-1 gap-3">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
                      style={{ borderLeft: `4px solid ${badge.color}` }}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{badge.name}</div>
                        <div className="text-gray-400 text-sm">{badge.description}</div>
                        <div className="text-gray-500 text-xs">
                          Earned {formatTimeAgo(badge.earnedAt)}
                        </div>
                      </div>
                      {badge.isRare && (
                        <div className="text-yellow-400 text-sm font-bold bg-yellow-400/20 px-2 py-1 rounded">
                          RARE
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CenteredContainer>
    </div>
  );
};

export default ProfilePage;