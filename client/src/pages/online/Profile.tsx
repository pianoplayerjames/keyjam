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
  opponentAvatar: string;
  opponentRank: string;
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
  replayAvailable: boolean;
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
  peakElo: number;
  currentStreak: number;
  bestStreak: number;
  arenaPoints: number;
  tournamentsWon: number;
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

interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  earnedAt: Date;
  category: 'tournament' | 'achievement' | 'seasonal' | 'special';
}

interface ForumPost {
  id: string;
  title: string;
  category: string;
  replies: number;
  views: number;
  lastReply: Date;
  isSticky: boolean;
  isLocked: boolean;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  views: number;
  likes: number;
  category: 'guide' | 'analysis' | 'news' | 'strategy';
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
  style: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    fontSize?: string;
    fontFamily?: string;
  };
  isVisible: boolean;
  order: number;
}

interface WorldRanking {
  globalRank: number;
  countryRank: number;
  totalPlayers: number;
  countryPlayers: number;
  percentile: number;
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
  trophies: Trophy[];
  stats: PlayerStats;
  achievements: Achievement[];
  recentMatches: MatchHistory[];
  forumPosts: ForumPost[];
  articles: Article[];
  customSections: CustomSection[];
  worldRanking: WorldRanking;
  socialLinks: {
    discord?: string;
    twitter?: string;
    twitch?: string;
    youtube?: string;
    instagram?: string;
    website?: string;
  };
  preferences: {
    showStats: boolean;
    showAchievements: boolean;
    showMatchHistory: boolean;
    allowMessages: boolean;
    allowFriendRequests: boolean;
  };
  titles: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
    isActive: boolean;
  }>;
  streamInfo?: {
    isStreamer: boolean;
    platform: string;
    title: string;
    isLive: boolean;
    viewers: number;
    recentClips: Array<{
      id: string;
      title: string;
      thumbnail: string;
      views: number;
      createdAt: Date;
    }>;
  };
}

const mockEloHistory = [
  { date: new Date('2024-01-01'), elo: 1200 },
  { date: new Date('2024-01-15'), elo: 1350 },
  { date: new Date('2024-02-01'), elo: 1480 },
  { date: new Date('2024-02-15'), elo: 1420 },
  { date: new Date('2024-03-01'), elo: 1680 },
  { date: new Date('2024-03-15'), elo: 1750 },
  { date: new Date('2024-04-01'), elo: 1920 },
  { date: new Date('2024-04-15'), elo: 1850 },
  { date: new Date('2024-05-01'), elo: 2100 },
  { date: new Date('2024-05-15'), elo: 2250 },
  { date: new Date('2024-06-01'), elo: 2400 },
  { date: new Date('2024-06-11'), elo: 2794 },
];

const mockPlayerProfile: PlayerProfile = {
  id: 'player_123',
  username: 'RhythmMaster',
  displayName: 'Rhythm Master',
  bio: 'Professional rhythm game player | Diamond ranked | Streaming daily on Twitch | Always up for a challenge! 🎵',
  rank: 'Grandmaster',
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
  worldRanking: {
    globalRank: 47,
    countryRank: 12,
    totalPlayers: 2847392,
    countryPlayers: 347281,
    percentile: 99.8
  },
  titles: [
    { id: 'gm', name: 'Grandmaster', description: 'Achieved Grandmaster rank', color: '#ff1744', isActive: true },
    { id: 'streamer', name: 'Content Creator', description: 'Verified content creator', color: '#9c27b0', isActive: true },
    { id: 'tournament', name: 'Tournament Champion', description: 'Won a major tournament', color: '#ffd700', isActive: false },
  ],
  streamInfo: {
    isStreamer: true,
    platform: 'Twitch',
    title: 'Road to 3000 ELO - Tournament Practice!',
    isLive: true,
    viewers: 1247,
    recentClips: [
      { id: '1', title: 'Insane 1000 Combo!', thumbnail: 'https://picsum.photos/160/90?random=clip1', views: 15420, createdAt: new Date('2024-06-10') },
      { id: '2', title: 'Perfect Score on Expert', thumbnail: 'https://picsum.photos/160/90?random=clip2', views: 8930, createdAt: new Date('2024-06-09') },
      { id: '3', title: 'Comeback Victory', thumbnail: 'https://picsum.photos/160/90?random=clip3', views: 12650, createdAt: new Date('2024-06-08') },
    ]
  },
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
  trophies: [
    {
      id: 'world_championship',
      name: 'World Championship 2024',
      description: 'First place in the annual world championship',
      icon: '🌍',
      tier: 'diamond',
      earnedAt: new Date('2024-03-15'),
      category: 'tournament'
    },
    {
      id: 'seasonal_rank',
      name: 'Season 2 Grandmaster',
      description: 'Achieved Grandmaster rank in Season 2',
      icon: '⭐',
      tier: 'gold',
      earnedAt: new Date('2024-02-28'),
      category: 'seasonal'
    },
    {
      id: 'perfect_month',
      name: 'Perfect Month',
      description: '100% win rate for an entire month',
      icon: '🎯',
      tier: 'platinum',
      earnedAt: new Date('2024-01-31'),
      category: 'achievement'
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
    peakElo: 2850,
    currentStreak: 7,
    bestStreak: 23,
    arenaPoints: 15420,
    tournamentsWon: 3,
    rankingHistory: [
      { date: new Date('2024-01-01'), rank: 'Platinum', elo: 2200 },
      { date: new Date('2024-02-01'), rank: 'Diamond', elo: 2500 },
      { date: new Date('2024-03-01'), rank: 'Master', elo: 2700 },
      { date: new Date('2024-04-01'), rank: 'Grandmaster', elo: 2794 },
    ],
    favoriteGenres: [
      { genre: 'Electronic', percentage: 45 },
      { genre: 'Synthwave', percentage: 28 },
      { genre: 'Techno', percentage: 15 },
      { genre: 'Ambient', percentage: 12 }
    ],
    monthlyStats: [
      { month: 'Mar', games: 156, winRate: 54.8 },
      { month: 'Apr', games: 203, winRate: 58.1 },
      { month: 'May', games: 189, winRate: 61.4 },
      { month: 'Jun', games: 89, winRate: 65.2 }
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
      opponentAvatar: '🤖',
      opponentRank: 'Master',
      result: 'win',
      mode: 'Ranked',
      difficulty: 85,
      score: 234567,
      accuracy: 96.7,
      maxCombo: 456,
      eloChange: +23,
      playedAt: new Date(Date.now() - 1000 * 60 * 30),
      duration: 180,
      song: 'Neon Dreams',
      replayAvailable: true
    },
    {
      id: 'match_2',
      opponent: 'SoundWave',
      opponentAvatar: '🌊',
      opponentRank: 'Grandmaster',
      result: 'loss',
      mode: 'Ranked',
      difficulty: 92,
      score: 198432,
      accuracy: 91.2,
      maxCombo: 234,
      eloChange: -18,
      playedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      duration: 165,
      song: 'Electric Pulse',
      replayAvailable: true
    },
    {
      id: 'match_3',
      opponent: 'MelodyMaster',
      opponentAvatar: '🎵',
      opponentRank: 'Diamond',
      result: 'win',
      mode: 'Tournament',
      difficulty: 78,
      score: 267891,
      accuracy: 98.1,
      maxCombo: 789,
      eloChange: +35,
      playedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      duration: 200,
      song: 'Digital Storm',
      replayAvailable: true
    }
  ],
  forumPosts: [
    {
      id: '1',
      title: 'Advanced Techniques for High-Speed Sections',
      category: 'Strategy Guides',
      replies: 47,
      views: 2850,
      lastReply: new Date(Date.now() - 1000 * 60 * 60 * 12),
      isSticky: true,
      isLocked: false
    },
    {
      id: '2',
      title: 'Tournament Meta Analysis - Spring 2024',
      category: 'Competitive',
      replies: 23,
      views: 1420,
      lastReply: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isSticky: false,
      isLocked: false
    }
  ],
  articles: [
    {
      id: '1',
      title: 'The Science of Perfect Timing in Rhythm Games',
      excerpt: 'A deep dive into the mechanics of timing windows and how to optimize your accuracy...',
      publishedAt: new Date('2024-05-15'),
      views: 15420,
      likes: 847,
      category: 'analysis'
    },
    {
      id: '2',
      title: 'From Bronze to Grandmaster: My Journey',
      excerpt: 'Sharing my experience climbing the ranks and the lessons learned along the way...',
      publishedAt: new Date('2024-04-28'),
      views: 8930,
      likes: 523,
      category: 'guide'
    }
  ],
  customSections: [
    {
      id: 'music_taste',
      title: '🎵 My Music Taste',
      content: `<div style="text-align: center;">
        <h3>Currently Listening To:</h3>
        <p>• Porter Robinson - Language</p>
        <p>• Madeon - All My Friends</p>
        <p>• Odesza - Sun Models</p>
        <br/>
        <marquee>🎶 EDM is life! 🎶</marquee>
      </div>`,
      style: {
        backgroundColor: '#1a1a2e',
        textColor: '#ff6b9d',
        borderColor: '#ff1744',
        fontSize: '14px',
        fontFamily: 'Comic Sans MS'
      },
      isVisible: true,
      order: 1
    },
    {
      id: 'shoutouts',
      title: '📢 Shoutouts',
      content: `<div>
        <p><strong>Thanks to all my supporters!</strong></p>
        <p>🔥 BeatMaster99 - Best practice partner!</p>
        <p>⭐ SoundWave - Amazing rival and friend</p>
        <p>💎 My stream community for the endless support</p>
        <br/>
        <center><blink>FOLLOW MY STREAM!</blink></center>
      </div>`,
      style: {
        backgroundColor: '#2d1b69',
        textColor: '#00ff88',
        borderColor: '#9c27b0',
        fontSize: '13px',
        fontFamily: 'Arial'
      },
      isVisible: true,
      order: 2
    }
  ],
  socialLinks: {
    discord: 'RhythmMaster#1234',
    twitter: '@rhythmmaster',
    twitch: 'rhythmmaster_live',
    youtube: 'RhythmMasterOfficial',
    instagram: '@rhythmmaster_official',
    website: 'https://rhythmmaster.pro'
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
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'matches' | 'about' | 'content'>('overview');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
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

  const EloChart = () => (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
      <h3 className="text-xl font-bold text-white mb-4">ELO History</h3>
      <div className="relative h-64 bg-slate-900/50 rounded-lg p-4">
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
          <defs>
            <linearGradient id="eloGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#ff6b9d" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {mockEloHistory.map((point, index) => {
            const x = (index / (mockEloHistory.length - 1)) * 380 + 10;
            const y = 180 - ((point.elo - 1000) / 2000) * 160;
            const nextPoint = mockEloHistory[index + 1];
            
            return (
              <g key={index}>
                {nextPoint && (
                  <line
                    x1={x}
                    y1={y}
                    x2={(index + 1) / (mockEloHistory.length - 1) * 380 + 10}
                    y2={180 - ((nextPoint.elo - 1000) / 2000) * 160}
                    stroke="#ff6b9d"
                    strokeWidth="3"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ff1744"
                  stroke="#fff"
                  strokeWidth="2"
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>{`${point.date.toLocaleDateString()}: ${point.elo} ELO`}</title>
                </circle>
              </g>
            );
          })}
          
          <polygon
            points={mockEloHistory.map((point, index) => {
              const x = (index / (mockEloHistory.length - 1)) * 380 + 10;
              const y = 180 - ((point.elo - 1000) / 2000) * 160;
              return `${x},${y}`;
            }).join(' ') + ' 390,180 10,180'}
            fill="url(#eloGradient)"
          />
        </svg>
        
        <div className="absolute top-2 right-2 text-xs text-gray-400">
          Peak: {profile?.stats.peakElo} ELO
        </div>
      </div>
    </div>
  );

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
      <CenteredContainer maxWidth="xl" accountForLeftNav={true} className="py-6">
        <div className="relative mb-6">
          <div
            className="w-full h-80 rounded-lg bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url(${profile.banner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 px-4 py-2 bg-black/60 hover:bg-black/80 rounded-lg text-white font-medium transition-colors backdrop-blur-sm border border-white/20"
            >
              ← Back
            </button>

            {profile.streamInfo?.isLive && (
              <div className="absolute top-4 right-4 px-4 py-2 bg-red-600/90 backdrop-blur-sm rounded-lg text-white font-bold border border-red-400/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  LIVE - {profile.streamInfo.viewers} viewers
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end gap-8">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="w-40 h-40 rounded-full border-4 border-white shadow-2xl"
                  />
                  <div className={`absolute bottom-4 right-4 w-8 h-8 rounded-full border-4 border-white shadow-lg ${getStatusColor(profile.status)}`}></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex gap-2 mb-3">
                    {profile.titles.filter(t => t.isActive).map((title) => (
                      <div
                        key={title.id}
                        className="px-3 py-1 rounded-full text-sm font-bold border-2 animate-pulse"
                        style={{ 
                          backgroundColor: title.color + '20', 
                          borderColor: title.color,
                          color: title.color 
                        }}
                        title={title.description}
                      >
                        {title.name}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">{profile.displayName}</h1>
                    <span className="text-gray-200 text-xl">@{profile.username}</span>
                    <div className="flex items-center gap-2">
                      <img src={`https://flagcdn.com/24x18/${profile.country.toLowerCase()}.png`} alt={profile.country} className="rounded-sm border border-white/20" />
                      <span className="text-gray-200 text-lg">{profile.country}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-3">
                      <span 
                        className="px-4 py-2 rounded-full text-lg font-bold border-2 shadow-lg"
                        style={{ 
                          backgroundColor: getRankColor(profile.rank) + '20', 
                          borderColor: getRankColor(profile.rank),
                          color: getRankColor(profile.rank) 
                        }}
                      >
                        {profile.rank}
                      </span>
                      <span className="text-3xl font-bold text-white drop-shadow-lg">{profile.elo} ELO</span>
                    </div>
                    <div className="text-gray-200">Level {profile.level}</div>
                    <div className="text-gray-200">•</div>
                    <div className="text-gray-200">Joined {profile.joinedAt.toLocaleDateString()}</div>
                  </div>

                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-yellow-400 text-2xl font-bold">#{profile.worldRanking.globalRank}</div>
                        <div className="text-gray-300 text-sm">Global Rank</div>
                      </div>
                      <div>
                        <div className="text-blue-400 text-2xl font-bold">#{profile.worldRanking.countryRank}</div>
                        <div className="text-gray-300 text-sm">{profile.country} Rank</div>
                      </div>
                      <div>
                        <div className="text-green-400 text-2xl font-bold">{profile.worldRanking.percentile}%</div>
                        <div className="text-gray-300 text-sm">Top Percentile</div>
                      </div>
                      <div>
                        <div className="text-purple-400 text-2xl font-bold">{profile.stats.arenaPoints.toLocaleString()}</div>
                        <div className="text-gray-300 text-sm">Arena Points</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-8 text-lg">
                    <div>
                      <span className="font-bold text-white">{profile.followersCount.toLocaleString()}</span>
                      <span className="text-gray-200 ml-1">followers</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">{profile.followingCount.toLocaleString()}</span>
                      <span className="text-gray-200 ml-1">following</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">{profile.stats.totalGames.toLocaleString()}</span>
                      <span className="text-gray-200 ml-1">games played</span>
                    </div>
                    <div>
                      <span className="font-bold text-green-400">{profile.stats.wins}</span>
                      <span className="text-gray-400">/</span>
                      <span className="font-bold text-red-400">{profile.stats.losses}</span>
                      <span className="text-gray-200 ml-1">W/L</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!isOwnProfile && (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`px-6 py-3 rounded-lg font-medium transition-all shadow-lg ${
                          profile.isFollowing
                            ? 'bg-gray-600/80 hover:bg-gray-700/80 text-white border border-gray-500'
                            : 'bg-blue-600/80 hover:bg-blue-700/80 text-white border border-blue-400'
                        } backdrop-blur-sm`}
                      >
                        {profile.isFollowing ? '✓ Following' : '+ Follow'}
                      </button>
                      <button className="px-6 py-3 bg-green-600/80 hover:bg-green-700/80 backdrop-blur-sm rounded-lg text-white font-medium transition-all shadow-lg border border-green-400">
                        ⚔️ Challenge
                      </button>
                      <button className="px-6 py-3 bg-purple-600/80 hover:bg-purple-700/80 backdrop-blur-sm rounded-lg text-white font-medium transition-all shadow-lg border border-purple-400">
                        💬 Message
                      </button>
                      <button className="px-4 py-3 bg-orange-600/80 hover:bg-orange-700/80 backdrop-blur-sm rounded-lg text-white font-medium transition-all shadow-lg border border-orange-400">
                        👥 Add Friend
                      </button>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                          className="px-4 py-3 bg-gray-600/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-lg text-white transition-all shadow-lg border border-gray-500"
                        >
                          ⋯
                        </button>
                        {showActionsDropdown && (
                          <div className="absolute top-full right-0 mt-2 bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-lg shadow-xl z-50 min-w-40">
                            <button className="w-full px-4 py-2 text-left text-yellow-400 hover:bg-slate-700/50 transition-colors rounded-t-lg">
                              🚫 Block User
                            </button>
                            <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700/50 transition-colors rounded-b-lg">
                              🚨 Report
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {isOwnProfile && (
                    <button className="px-6 py-3 bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-sm rounded-lg text-white font-medium transition-all shadow-lg border border-blue-400">
                      ⚙️ Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50 mb-6">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span>📝</span> About Me
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">{profile.bio}</p>
          
          <div className="mt-6">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>🔗</span> Connect With Me
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(profile.socialLinks).map(([platform, handle]) => {
                if (!handle) return null;
                const icons = {
                  discord: '💬',
                  twitter: '🐦',
                  twitch: '📺',
                  youtube: '📹',
                  instagram: '📷',
                  website: '🌐'
                };
                const colors = {
                  discord: 'from-indigo-500 to-purple-600',
                  twitter: 'from-blue-400 to-blue-600',
                  twitch: 'from-purple-500 to-purple-700',
                  youtube: 'from-red-500 to-red-700',
                  instagram: 'from-pink-500 to-purple-600',
                  website: 'from-gray-500 to-gray-700'
                };
                return (
                  <a
                    key={platform}
                    href="#"
                    className={`flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r ${colors[platform as keyof typeof colors]} hover:scale-105 transition-all shadow-lg text-white font-medium`}
                  >
                    <span className="text-lg">{icons[platform as keyof typeof icons]}</span>
                    <div className="text-sm truncate">{handle}</div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🏆</span> Trophy Cabinet
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.trophies.map((trophy) => {
              const tierColors = {
                bronze: 'from-orange-600 to-yellow-700',
                silver: 'from-gray-400 to-gray-600',
                gold: 'from-yellow-400 to-yellow-600',
                platinum: 'from-blue-300 to-blue-500',
                diamond: 'from-cyan-300 to-blue-400'
              };
              return (
                <div
                  key={trophy.id}
                  className={`p-4 rounded-lg bg-gradient-to-br ${tierColors[trophy.tier]} border-2 border-white/20 shadow-lg hover:scale-105 transition-all`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{trophy.icon}</div>
                    <h4 className="font-bold text-white text-lg">{trophy.name}</h4>
                    <p className="text-white/90 text-sm mb-2">{trophy.description}</p>
                    <div className="text-xs text-white/80">
                      {formatTimeAgo(trophy.earnedAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-lg p-1 border border-slate-600/50">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'stats', label: 'Statistics', icon: '📈' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'matches', label: 'Match History', icon: '🎮' },
            { id: 'content', label: 'Content', icon: '📝' },
            { id: 'about', label: 'Custom', icon: '✨' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
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

        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <EloChart />

                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>🎮</span> Recent Matches
                  </h3>
                  <div className="space-y-3">
                    {profile.recentMatches.slice(0, 5).map((match) => (
                      <div key={match.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                              match.result === 'win' ? 'bg-green-600' : 
                              match.result === 'loss' ? 'bg-red-600' : 'bg-yellow-600'
                            }`}>
                              {match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{match.opponentAvatar}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium text-lg">{match.opponent}</span>
                                  <span 
                                    className="px-2 py-1 rounded text-xs font-bold"
                                    style={{ backgroundColor: getRankColor(match.opponentRank) + '30', color: getRankColor(match.opponentRank) }}
                                  >
                                    {match.opponentRank}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-400">{match.song} • {match.mode}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="grid grid-cols-4 gap-4 text-sm mb-2">
                              <div>
                                <div className="text-gray-400">Score</div>
                                <div className="text-white font-bold">{match.score.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Accuracy</div>
                                <div className="text-blue-400 font-bold">{match.accuracy}%</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Combo</div>
                                <div className="text-orange-400 font-bold">{match.maxCombo}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">ELO</div>
                                <div className={`font-bold ${match.eloChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {match.eloChange > 0 ? '+' : ''}{match.eloChange}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{formatTimeAgo(match.playedAt)}</span>
                              {match.replayAvailable && (
                                <button className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs hover:bg-blue-600/30 transition-colors">
                                  📺 Replay
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors">
                    View All Matches →
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span>🔥</span> Current Form
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Streak</span>
                      <span className="text-green-400 font-bold">{profile.stats.currentStreak} wins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best Streak</span>
                      <span className="text-yellow-400 font-bold">{profile.stats.bestStreak} wins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tournaments Won</span>
                      <span className="text-purple-400 font-bold">{profile.stats.tournamentsWon}</span>
                    </div>
                  </div>
                </div>

                {profile.streamInfo?.isStreamer && (
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <span>📺</span> Stream
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${profile.streamInfo.isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className={profile.streamInfo.isLive ? 'text-red-400 font-bold' : 'text-gray-400'}>
                          {profile.streamInfo.isLive ? 'LIVE' : 'OFFLINE'}
                        </span>
                        {profile.streamInfo.isLive && (
                          <span className="text-white">• {profile.streamInfo.viewers} viewers</span>
                        )}
                      </div>
                      <div className="text-white font-medium">{profile.streamInfo.title}</div>
                      <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                        Watch on {profile.streamInfo.platform}
                      </button>
                      
                      <div className="mt-4">
                        <h4 className="text-white font-medium mb-2">Recent Highlights</h4>
                        <div className="space-y-2">
                          {profile.streamInfo.recentClips.slice(0, 3).map((clip) => (
                            <div key={clip.id} className="flex gap-2 p-2 bg-slate-700/30 rounded hover:bg-slate-700/50 transition-colors cursor-pointer">
                              <img src={clip.thumbnail} alt={clip.title} className="w-16 h-9 rounded object-cover" />
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium truncate">{clip.title}</div>
                                <div className="text-xs text-gray-400">{clip.views.toLocaleString()} views</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-lg font-bold text-white mb-3">Quick Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Peak ELO</span>
                      <span className="text-yellow-400 font-bold">{profile.stats.peakElo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-green-400 font-bold">{profile.stats.winRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Accuracy</span>
                      <span className="text-blue-400 font-bold">{profile.stats.averageAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best Score</span>
                      <span className="text-purple-400 font-bold">{profile.stats.bestScore.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-lg font-bold text-white mb-3">Recent Achievements</h3>
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
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>💬</span> Forum Posts
                </h3>
                <div className="space-y-3">
                  {profile.forumPosts.map((post) => (
                    <div key={post.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white hover:text-blue-400 transition-colors">{post.title}</h4>
                        <div className="flex gap-2">
                          {post.isSticky && <span className="text-yellow-400 text-xs">📌</span>}
                          {post.isLocked && <span className="text-red-400 text-xs">🔒</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="text-blue-400">{post.category}</span>
                        <span>{post.replies} replies</span>
                        <span>{post.views} views</span>
                        <span>{formatTimeAgo(post.lastReply)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📖</span> Articles & Guides
                </h3>
                <div className="space-y-3">
                  {profile.articles.map((article) => (
                    <div key={article.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all cursor-pointer">
                      <h4 className="font-medium text-white hover:text-blue-400 transition-colors mb-2">{article.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-gray-400">
                          <span className="text-purple-400">{article.category}</span>
                          <span>{article.views} views</span>
                          <span>{article.likes} likes</span>
                        </div>
                        <span className="text-gray-500">{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profile.customSections
                  .filter(section => section.isVisible)
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div
                      key={section.id}
                      className="rounded-lg border-2 overflow-hidden shadow-lg"
                      style={{
                        backgroundColor: section.style.backgroundColor || '#1e293b',
                        borderColor: section.style.borderColor || '#475569'
                      }}
                    >
                      <div className="p-3 border-b-2" style={{ borderColor: section.style.borderColor || '#475569' }}>
                        <h3 
                          className="font-bold text-lg"
                          style={{ 
                            color: section.style.textColor || '#ffffff',
                            fontFamily: section.style.fontFamily || 'inherit'
                          }}
                        >
                          {section.title}
                        </h3>
                      </div>
                      <div 
                        className="p-4"
                        style={{
                          color: section.style.textColor || '#ffffff',
                          fontSize: section.style.fontSize || '14px',
                          fontFamily: section.style.fontFamily || 'inherit'
                        }}
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  ))}
              </div>

              {isOwnProfile && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                  <h3 className="text-xl font-bold text-white mb-4">Customize Your Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors">
                      <div className="text-lg mb-2">➕</div>
                      Add Custom Section
                    </button>
                    <button className="p-4 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-400 hover:bg-purple-600/30 transition-colors">
                      <div className="text-lg mb-2">🎨</div>
                      Edit Theme
                    </button>
                    <button className="p-4 bg-green-600/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-600/30 transition-colors">
                      <div className="text-lg mb-2">🔗</div>
                      Manage Links
                    </button>
                    <button className="p-4 bg-orange-600/20 border border-orange-500/50 rounded-lg text-orange-400 hover:bg-orange-600/30 transition-colors">
                      <div className="text-lg mb-2">🏆</div>
                      Showcase Trophies
                    </button>
                  </div>
                </div>
              )}
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
                    <span className="text-gray-400">W/L Ratio</span>
                    <span className="text-blue-400 font-medium">{(profile.stats.wins / Math.max(profile.stats.losses, 1)).toFixed(2)}</span>
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
                    <span className="text-gray-400">Peak ELO</span>
                    <span className="text-yellow-400 font-medium">{profile.stats.peakElo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current ELO</span>
                    <span className="text-white font-medium">{profile.elo}</span>
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
                  <div className="flex justify-between">
                    <span className="text-gray-400">Arena Points</span>
                    <span className="text-cyan-400 font-medium">{profile.stats.arenaPoints.toLocaleString()}</span>
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

              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🌍</span> World Rankings
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-600/20 border border-yellow-500/50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-400">#{profile.worldRanking.globalRank}</div>
                      <div className="text-yellow-300 text-sm">Global Rank</div>
                      <div className="text-xs text-gray-400 mt-1">out of {profile.worldRanking.totalPlayers.toLocaleString()}</div>
                    </div>
                    <div className="text-center p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-400">#{profile.worldRanking.countryRank}</div>
                      <div className="text-blue-300 text-sm">{profile.country} Rank</div>
                      <div className="text-xs text-gray-400 mt-1">out of {profile.worldRanking.countryPlayers.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-600/20 border border-green-500/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">Top {profile.worldRanking.percentile}%</div>
                    <div className="text-green-300 text-sm">Percentile Ranking</div>
                    <div className="text-xs text-gray-400 mt-1">Better than {(100 - profile.worldRanking.percentile).toFixed(1)}% of all players</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.achievements.map((achievement) => {
                const getRarityColor = (rarity: Achievement['rarity']) => {
                  switch (rarity) {
                    case 'common': return '#9e9e9e';
                    case 'rare': return '#2196f3';
                    case 'epic': return '#9c27b0';
                    case 'legendary': return '#ff9800';
                    default: return '#666';
                  }
                };

                return (
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
                );
              })}
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="bg-slate-800/50 rounded-lg border border-slate-600/50">
              <div className="p-6 border-b border-slate-600/50">
                <h3 className="text-xl font-bold text-white">Complete Match History</h3>
              </div>
              <div className="divide-y divide-slate-600/50">
                {profile.recentMatches.map((match) => (
                  <div key={match.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                          match.result === 'win' ? 'bg-green-600' : 
                          match.result === 'loss' ? 'bg-red-600' : 'bg-yellow-600'
                        }`}>
                          {match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : 'D'}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{match.opponentAvatar}</span>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-white font-medium text-xl">vs {match.opponent}</span>
                              <span 
                                className="px-3 py-1 rounded text-sm font-bold"
                                style={{ backgroundColor: getRankColor(match.opponentRank) + '30', color: getRankColor(match.opponentRank) }}
                              >
                                {match.opponentRank}
                              </span>
                            </div>
                            <div className="text-gray-400 text-sm">{match.song} • {match.mode} • Difficulty {match.difficulty}</div>
                            <div className="text-gray-500 text-xs">{formatTimeAgo(match.playedAt)} • {Math.floor(match.duration / 60)}:{(match.duration % 60).toString().padStart(2, '0')}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="grid grid-cols-4 gap-8 text-sm mb-3">
                          <div>
                            <div className="text-gray-400">Score</div>
                            <div className="text-white font-bold text-lg">{match.score.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Accuracy</div>
                            <div className="text-blue-400 font-bold text-lg">{match.accuracy}%</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Max Combo</div>
                            <div className="text-orange-400 font-bold text-lg">{match.maxCombo}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">ELO Change</div>
                            <div className={`font-bold text-lg ${match.eloChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {match.eloChange > 0 ? '+' : ''}{match.eloChange}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {match.replayAvailable && (
                            <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-sm hover:bg-blue-600/30 transition-colors border border-blue-500/50">
                              📺 Watch Replay
                            </button>
                          )}
                          <button className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded text-sm hover:bg-purple-600/30 transition-colors border border-purple-500/50">
                            📊 View Stats
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CenteredContainer>
    </div>
  );
};

export default ProfilePage;