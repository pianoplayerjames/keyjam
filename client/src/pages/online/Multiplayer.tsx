import React, { useState, useEffect } from 'react';
import Leaderboards from '@/pages/online/Leaderboards';
import FriendsList from '@/pages/online/Friends';
import PlayerProfile from '@/pages/online/Profile';
import PartySystem from '@/pages/online/Parties';
import { ResizableTimetable } from '@/pages/online/components/ArenaTimetable';
import { CenteredContainer } from '@/shared/components/Layout';
import { ArenaPage } from '@/pages/online/Arena';

interface PlayerData { 
  id: string; 
  username: string; 
  rank: string; 
  elo: number; 
  wins: number; 
  losses: number; 
  draws: number; 
  level: number; 
  avatar: string; 
  status: 'online' | 'away' | 'in-game' | 'offline'; 
  lastPlayed: Date; 
}

interface Arena { 
  id: string; 
  name: string; 
  type: 'tournament' | 'ranked' | 'casual' | 'speed' | 'party' | 'battle-royale' | 'team-battle' | 'practice' | 'blitz' | 'championship' | 'seasonal' | 'custom'; 
  startTime: Date; 
  duration: number; 
  players: number; 
  maxPlayers: number; 
  difficulty: number; 
  prizePool?: number; 
  status: 'waiting' | 'starting' | 'live' | 'finished'; 
  timeControl: string; 
  host: string; 
}

interface ArenaPlayer {
  id: string;
  username: string;
  elo: number;
  rank: string;
  avatar: string;
  status: 'ready' | 'not-ready' | 'away';
  joinedAt: Date;
  isHost: boolean;
}

interface DetailedArena extends Omit<Arena, 'players'> {
  requirements: {
    minElo?: number;
    maxElo?: number;
    rankRequired?: string;
    inviteOnly?: boolean;
  };
  gameMode: string;
  description: string;
  players: ArenaPlayer[];
}

interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  game: string;
  thumbnail: string;
  category: 'main' | 'featured' | 'community';
  tags: string[];
  isLive: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'update' | 'tournament' | 'community' | 'patch';
  author: string;
  publishedAt: Date;
  imageUrl: string;
  tags: string[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'tournament' | 'community' | 'seasonal' | 'special';
  participants: number;
  maxParticipants: number;
  prizePool?: number;
  status: 'upcoming' | 'live' | 'ended';
}

interface MatchPreview {
  id: string;
  players: Array<{ username: string; rank: string; avatar: string }>;
  song: string;
  difficulty: number;
  gameMode: string;
  progress: number;
  viewers: number;
  isRanked: boolean;
}

interface RecordBreak {
  id: string;
  player: string;
  achievement: string;
  score: number;
  song: string;
  difficulty: number;
  timestamp: Date;
  previousRecord?: number;
  category: 'score' | 'accuracy' | 'combo' | 'speed';
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  song: string;
  difficulty: number;
  objective: string;
  reward: string;
  progress: number;
  maxProgress: number;
  expiresAt: Date;
  participants: number;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  lastReply: Date;
  isSticky: boolean;
  isHot: boolean;
}

interface MainPortalProps {
  onBack: () => void;
  onStartGame: (config: any) => void;
}

type PortalSection = 'main' | 'arenas' | 'leaderboards' | 'friends' | 'profile' | 'party' | 'arena';

const MainPortal: React.FC<MainPortalProps> = ({ onBack, onStartGame }) => {
  const [currentSection, setCurrentSection] = useState<PortalSection>('main');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [upcomingArenas, setUpcomingArenas] = useState<Arena[]>([]);
  const [selectedArena, setSelectedArena] = useState<DetailedArena | null>(null);
  const [isPlayerInSelectedArena, setIsPlayerInSelectedArena] = useState(false);
  const [activeTab, setActiveTab] = useState<'featured' | 'events' | 'matches' | 'challenges'>('featured');

  // Mock data
  const [newsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Season 2 Championship Finals Begin This Weekend',
      summary: 'The top 32 players worldwide compete for a $100,000 prize pool in an epic 3-day tournament.',
      category: 'tournament',
      author: 'KeyJam Official',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      imageUrl: '/news/championship.jpg',
      tags: ['tournament', 'championship', 'prize pool']
    },
    {
      id: '2',
      title: 'Update 11.8.2: New Songs & Performance Improvements',
      summary: 'Added 15 new tracks, improved input latency by 12ms, and fixed several multiplayer bugs.',
      category: 'patch',
      author: 'Dev Team',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      imageUrl: '/news/update.jpg',
      tags: ['update', 'songs', 'performance']
    },
    {
      id: '3',
      title: 'Community Spotlight: RhythmGod Hits 3000 ELO',
      summary: 'First player ever to break the 3000 ELO barrier, sharing tips and practice routines.',
      category: 'community',
      author: 'Community Team',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      imageUrl: '/news/community.jpg',
      tags: ['community', 'milestone', 'tips']
    },
    {
      id: '4',
      title: 'Monthly Remix Contest: Electronic Dreams',
      summary: 'Submit your remixes of popular tracks for a chance to have them featured in-game.',
      category: 'community',
      author: 'Music Team',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      imageUrl: '/news/remix.jpg',
      tags: ['contest', 'remix', 'music']
    },
    {
      id: '5',
      title: 'New Anti-Cheat System Deployed',
      summary: 'Enhanced security measures to ensure fair play across all game modes.',
      category: 'update',
      author: 'Security Team',
      publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      imageUrl: '/news/security.jpg',
      tags: ['security', 'anti-cheat', 'fair play']
    },
    {
      id: '6',
      title: 'KeyJam Mobile Beta Now Available',
      summary: 'Download the mobile beta and take your rhythm skills on the go.',
      category: 'update',
      author: 'Mobile Team',
      publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      imageUrl: '/news/mobile.jpg',
      tags: ['mobile', 'beta', 'cross-platform']
    }
  ]);

  const [liveStreams] = useState<LiveStream[]>([
    {
      id: 'main',
      title: 'KeyJam TV: Championship Finals Preview',
      streamer: 'KeyJam Official',
      viewers: 23847,
      game: 'KeyJam',
      thumbnail: '/streams/main.jpg',
      category: 'main',
      tags: ['official', 'championship', 'analysis'],
      isLive: true
    },
    {
      id: '2',
      title: 'Road to Grandmaster: Live Practice Session',
      streamer: 'RhythmPro',
      viewers: 5632,
      game: 'KeyJam',
      thumbnail: '/streams/rhythm.jpg',
      category: 'featured',
      tags: ['practice', 'tips', 'educational'],
      isLive: true
    },
    {
      id: '3',
      title: 'Perfect Accuracy Challenge - 100% or Reset!',
      streamer: 'AccuracyKing',
      viewers: 3247,
      game: 'KeyJam',
      thumbnail: '/streams/accuracy.jpg',
      category: 'featured',
      tags: ['challenge', 'accuracy', 'entertainment'],
      isLive: true
    },
    {
      id: '4',
      title: 'Community Tournament Qualifiers',
      streamer: 'TourneyHost',
      viewers: 1876,
      game: 'KeyJam',
      thumbnail: '/streams/tournament.jpg',
      category: 'community',
      tags: ['tournament', 'qualifiers', 'competition'],
      isLive: true
    },
    {
      id: '5',
      title: 'Speedrun Marathon: All Songs Any%',
      streamer: 'SpeedDemon99',
      viewers: 2341,
      game: 'KeyJam',
      thumbnail: '/streams/speedrun.jpg',
      category: 'featured',
      tags: ['speedrun', 'marathon', 'challenge'],
      isLive: true
    },
    {
      id: '6',
      title: 'Beginner Tutorial: Learning the Basics',
      streamer: 'TeacherBot',
      viewers: 987,
      game: 'KeyJam',
      thumbnail: '/streams/tutorial.jpg',
      category: 'community',
      tags: ['tutorial', 'beginner', 'education'],
      isLive: true
    }
  ]);

  const [upcomingEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'World Championship Finals',
      description: 'The ultimate showdown between the world\'s best players',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      type: 'tournament',
      participants: 32,
      maxParticipants: 32,
      prizePool: 100000,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Community Speed Run Night',
      description: 'Race through songs as fast as possible with accuracy requirements',
      startTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
      type: 'community',
      participants: 156,
      maxParticipants: 500,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Seasonal Ranking Reset',
      description: 'New season begins with fresh leaderboards and rewards',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      type: 'seasonal',
      participants: 0,
      maxParticipants: 0,
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Valentine\'s Day Special Event',
      description: 'Romantic duets and heart-themed challenges',
      startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      type: 'special',
      participants: 0,
      maxParticipants: 1000,
      prizePool: 25000,
      status: 'upcoming'
    },
    {
      id: '5',
      title: 'Monthly Leaderboard Finals',
      description: 'Top 100 players compete for monthly supremacy',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      type: 'tournament',
      participants: 87,
      maxParticipants: 100,
      prizePool: 15000,
      status: 'upcoming'
    }
  ]);

  const [liveMatches] = useState<MatchPreview[]>([
    {
      id: '1',
      players: [
        { username: 'RhythmGod', rank: 'Grandmaster', avatar: '👑' },
        { username: 'BeatMachine', rank: 'Master', avatar: '🤖' }
      ],
      song: 'Neon Dreams',
      difficulty: 95,
      gameMode: 'Ranked 1v1',
      progress: 67,
      viewers: 2847,
      isRanked: true
    },
    {
      id: '2',
      players: [
        { username: 'SpeedDemon', rank: 'Diamond', avatar: '⚡' },
        { username: 'AccuracyAce', rank: 'Diamond', avatar: '🎯' }
      ],
      song: 'Electric Pulse',
      difficulty: 87,
      gameMode: 'Speed Battle',
      progress: 34,
      viewers: 1523,
      isRanked: false
    },
    {
      id: '3',
      players: [
        { username: 'ComboKing', rank: 'Platinum', avatar: '🔥' },
        { username: 'PatternMaster', rank: 'Platinum', avatar: '🧩' }
      ],
      song: 'Synthetic Symphony',
      difficulty: 78,
      gameMode: 'Combo Challenge',
      progress: 89,
      viewers: 934,
      isRanked: true
    },
    {
      id: '4',
      players: [
        { username: 'VibeChecker', rank: 'Gold', avatar: '✨' },
        { username: 'FlowState', rank: 'Gold', avatar: '🌊' }
      ],
      song: 'Bass Drop Madness',
      difficulty: 72,
      gameMode: 'Casual 1v1',
      progress: 12,
      viewers: 456,
      isRanked: false
    },
    {
      id: '5',
      players: [
        { username: 'NightOwl', rank: 'Master', avatar: '🦉' },
        { username: 'DawnBreaker', rank: 'Master', avatar: '🌅' }
      ],
      song: 'Midnight Echoes',
      difficulty: 91,
      gameMode: 'Ranked 1v1',
      progress: 55,
      viewers: 1789,
      isRanked: true
    },
    {
      id: '6',
      players: [
        { username: 'TeamAlpha1', rank: 'Diamond', avatar: '⭐' },
        { username: 'TeamAlpha2', rank: 'Diamond', avatar: '⭐' },
        { username: 'TeamBeta1', rank: 'Platinum', avatar: '🎵' },
        { username: 'TeamBeta2', rank: 'Platinum', avatar: '🎵' }
      ],
      song: 'Tournament Anthem',
      difficulty: 85,
      gameMode: '2v2 Team Battle',
      progress: 78,
      viewers: 3421,
      isRanked: true
    }
  ]);

  const [recordBreaks] = useState<RecordBreak[]>([
    {
      id: '1',
      player: 'RhythmGod',
      achievement: 'Highest Score on Neon Dreams (Expert)',
      score: 2847692,
      song: 'Neon Dreams',
      difficulty: 95,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      previousRecord: 2836541,
      category: 'score'
    },
    {
      id: '2',
      player: 'PerfectPlayer',
      achievement: 'Perfect Accuracy Streak',
      score: 100,
      song: 'Multiple',
      difficulty: 0,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'accuracy'
    },
    {
      id: '3',
      player: 'SpeedDemon',
      achievement: 'Fastest Clear Time',
      score: 127,
      song: 'Lightning Strike',
      difficulty: 88,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      category: 'speed'
    },
    {
      id: '4',
      player: 'ComboKing',
      achievement: 'Longest Combo Chain',
      score: 1847,
      song: 'Endless Rhythm',
      difficulty: 82,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      previousRecord: 1756,
      category: 'combo'
    },
    {
      id: '5',
      player: 'AccuracyAce',
      achievement: 'Perfect Score Trio',
      score: 100,
      song: 'Triple Threat',
      difficulty: 93,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      category: 'accuracy'
    },
    {
      id: '6',
      player: 'BeatMachine',
      achievement: 'Million Point Milestone',
      score: 3124567,
      song: 'Epic Journey',
      difficulty: 98,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      previousRecord: 2987432,
      category: 'score'
    }
  ]);

  const [dailyChallenges] = useState<DailyChallenge[]>([
    {
      id: '1',
      title: 'Accuracy Master',
      description: 'Achieve 95%+ accuracy on 5 different songs',
      song: 'Any',
      difficulty: 0,
      objective: 'Complete 5 songs with 95%+ accuracy',
      reward: '500 XP + Accuracy Badge',
      progress: 3,
      maxProgress: 5,
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
      participants: 12847
    },
    {
      id: '2',
      title: 'Combo Crusher',
      description: 'Achieve a 200+ note combo in any song',
      song: 'Any',
      difficulty: 0,
      objective: 'Get 200+ note combo',
      reward: '750 XP + Combo Master Title',
      progress: 156,
      maxProgress: 200,
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
      participants: 8934
    },
    {
      id: '3',
      title: 'Song of the Day',
      description: 'Complete "Electric Pulse" on Hard difficulty or higher',
      song: 'Electric Pulse',
      difficulty: 70,
      objective: 'Complete Electric Pulse (Hard+)',
      reward: '300 XP + Song Mastery Badge',
      progress: 0,
      maxProgress: 1,
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
      participants: 15623
    },
    {
      id: '4',
      title: 'Speed Demon Challenge',
      description: 'Complete 3 songs in under 10 minutes total',
      song: 'Any (Short)',
      difficulty: 50,
      objective: 'Fast completion time',
      reward: '400 XP + Speed Runner Badge',
      progress: 1,
      maxProgress: 3,
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
      participants: 6789
    }
  ]);

  const [forumPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'Tips for improving accuracy at high speeds?',
      author: 'NewPlayer123',
      category: 'Gameplay Help',
      replies: 23,
      lastReply: new Date(Date.now() - 15 * 60 * 1000),
      isSticky: false,
      isHot: true
    },
    {
      id: '2',
      title: '[OFFICIAL] Season 2 Championship Bracket',
      author: 'KeyJam_Admin',
      category: 'Announcements',
      replies: 156,
      lastReply: new Date(Date.now() - 32 * 60 * 1000),
      isSticky: true,
      isHot: true
    },
    {
      id: '3',
      title: 'Best songs for practicing polyrhythm?',
      author: 'AdvancedPlayer',
      category: 'Song Discussion',
      replies: 45,
      lastReply: new Date(Date.now() - 67 * 60 * 1000),
      isSticky: false,
      isHot: false
    },
    {
      id: '4',
      title: 'Community remix contest submissions thread',
      author: 'MusicMaker',
      category: 'Community',
      replies: 89,
      lastReply: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isSticky: false,
      isHot: true
    },
    {
      id: '5',
      title: 'Bug Report: Multiplayer desync issues',
      author: 'TechSavvy',
      category: 'Bug Reports',
      replies: 34,
      lastReply: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isSticky: false,
      isHot: false
    },
    {
      id: '6',
      title: 'Looking for team members for tournament',
      author: 'TeamCaptain',
      category: 'Team Recruitment',
      replies: 67,
      lastReply: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isSticky: false,
      isHot: true
    }
  ]);

  const generateMockArenaPlayers = (count: number, hostName: string): ArenaPlayer[] => {
    const mockNames = [
      'BeatMaster99', 'RhythmPro', 'SoundWave', 'MelodyKing', 'ComboQueen', 'NoteMaster', 'BassDrop',
      'VibeChecker', 'FlowState', 'PulseRider', 'EchoWave', 'SyncMaster', 'HarmonySeeker', 'TrebleClef',
      'NightOwl', 'DawnBreaker', 'SpeedRunner', 'AccuracyAce', 'ComboKing', 'PatternMaster'
    ];
    const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'];
    
    return Array.from({ length: count }, (_, index) => {
      const isHost = index === 0;
      const username = isHost ? hostName : mockNames[Math.floor(Math.random() * mockNames.length)];
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      const baseElo = ranks.indexOf(rank) * 300 + 1000;
      
      return {
        id: `arena_player_${index}`,
        username,
        elo: baseElo + Math.floor(Math.random() * 300),
        rank,
        avatar: `/avatars/player${index + 1}.png`,
        status: Math.random() > 0.2 ? 'ready' : 'not-ready',
        joinedAt: new Date(Date.now() - Math.random() * 600000),
        isHost
      };
    });
  };

  const getArenaTypeColor = (type: Arena['type']): string => {
    const colors = {
      tournament: '#ff6b35',
      ranked: '#8e24aa',
      casual: '#43a047',
      speed: '#f44336',
      party: '#ff9800',
      'battle-royale': '#e91e63',
      'team-battle': '#3f51b5',
      practice: '#4caf50',
      blitz: '#ff5722',
      championship: '#ffd700',
      seasonal: '#9c27b0',
      custom: '#607d8b'
    };
    return colors[type] || '#666';
  };

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

  useEffect(() => {
    setPlayerData({
      id: 'player_123',
      username: 'RhythmMaster',
      rank: 'Diamond',
      elo: 1847,
      wins: 156,
      losses: 89,
      draws: 12,
      level: 28,
      avatar: '/avatars/default.png',
      status: 'online',
      lastPlayed: new Date()
    });
    
    // Generate lots of arenas spanning different times and types
    const arenaTypes: Arena['type'][] = [
      'tournament', 'ranked', 'casual', 'speed', 'party', 'battle-royale', 
      'team-battle', 'practice', 'blitz', 'championship', 'seasonal', 'custom'
    ];
    
    const arenaNames = [
      'Elite Championship', 'Speed Demons Arena', 'Casual Friday Fun', 'Ranked Royale',
      'Battle Royale Bonanza', 'Team Tactics', 'Practice Paradise', 'Blitz Battlefield',
      'Championship Clash', 'Seasonal Showdown', 'Custom Chaos', 'Midnight Madness',
      'Dawn Patrol', 'Evening Express', 'Morning Mayhem', 'Afternoon Assault',
      'Prime Time Power', 'Late Night Legends', 'Early Bird Express', 'Weekend Warriors',
      'Weekday Wonders', 'Holiday Heroes', 'Festival Frenzy', 'Concert Clash',
      'Symphony Showdown', 'Rhythm Revolution', 'Beat Battle', 'Melody Mayhem',
      'Harmony Heights', 'Tempo Temple', 'Note Nirvana', 'Chord Champions',
      'Scale Soldiers', 'Frequency Fighters', 'Pitch Perfect', 'Tune Titans',
      'Sound Soldiers', 'Audio Athletes', 'Music Masters', 'Rhythm Riders',
      'Beat Brawlers', 'Melody Maniacs', 'Harmony Heroes', 'Tempo Titans',
      'Note Ninjas', 'Chord Crushers', 'Scale Slayers', 'Frequency Fighters',
      'Pitch Pirates', 'Tune Terminators', 'Sound Samurai', 'Audio Assassins'
    ];
    
    const hostNames = [
      'TourneyMaster', 'ArenaKing', 'BattleHost', 'EventOrganizer', 'CompetitionChief',
      'MatchMaker', 'ChallengeCreator', 'ContestCoordinator', 'GameGuide', 'PlayMaster',
      'RhythmRuler', 'BeatBoss', 'MelodyMaster', 'HarmonyHost', 'TempoTitan',
      'NoteNinja', 'ChordChief', 'ScaleSensei', 'FrequencyFather', 'PitchPilot',
      'TuneTutor', 'SoundSheriff', 'AudioAdmin', 'MusicMayor', 'RhythmRanger'
    ];

    const mockArenas: Arena[] = [];
    
    // Generate 100+ arenas across 8-hour timespan
    for (let i = 0; i < 120; i++) {
      const type = arenaTypes[Math.floor(Math.random() * arenaTypes.length)];
      const name = arenaNames[Math.floor(Math.random() * arenaNames.length)];
      const host = hostNames[Math.floor(Math.random() * hostNames.length)];
      
      // Spread arenas across 8 hours, with some clustering for realism
      const timeOffset = (Math.random() * 8 * 60) + (Math.random() * 60 - 30); // 8 hours ± 30 minutes
      const startTime = new Date(Date.now() + timeOffset * 60 * 1000);
      
      // Duration varies by type
      let duration = 30; // default
      switch (type) {
        case 'tournament':
        case 'championship':
          duration = Math.floor(Math.random() * 60) + 90; // 90-150 minutes
          break;
        case 'battle-royale':
          duration = Math.floor(Math.random() * 30) + 60; // 60-90 minutes
          break;
        case 'blitz':
        case 'speed':
          duration = Math.floor(Math.random() * 15) + 15; // 15-30 minutes
          break;
        case 'practice':
          duration = Math.floor(Math.random() * 45) + 30;
          break;
       default:
         duration = Math.floor(Math.random() * 45) + 30; // 30-75 minutes
     }
     
     // Player counts and max players vary by type
     let maxPlayers = 8;
     switch (type) {
       case 'tournament':
       case 'championship':
         maxPlayers = Math.random() > 0.5 ? 32 : 64;
         break;
       case 'battle-royale':
         maxPlayers = Math.random() > 0.3 ? 50 : 100;
         break;
       case 'team-battle':
         maxPlayers = [4, 6, 8, 12, 16][Math.floor(Math.random() * 5)];
         break;
       case 'party':
         maxPlayers = [4, 6, 8][Math.floor(Math.random() * 3)];
         break;
       default:
         maxPlayers = [4, 6, 8, 12, 16][Math.floor(Math.random() * 5)];
     }
     
     const currentPlayers = Math.floor(Math.random() * maxPlayers);
     
     // Prize pools for certain types
     let prizePool: number | undefined;
     if (type === 'tournament' || type === 'championship') {
       prizePool = [1000, 2500, 5000, 10000, 25000, 50000, 100000][Math.floor(Math.random() * 7)];
     } else if (type === 'battle-royale' && Math.random() > 0.7) {
       prizePool = [500, 1000, 2500][Math.floor(Math.random() * 3)];
     }
     
     mockArenas.push({
       id: `arena_${i}`,
       name: `${name} #${Math.floor(Math.random() * 999) + 1}`,
       type,
       startTime,
       duration,
       players: currentPlayers,
       maxPlayers,
       difficulty: Math.floor(Math.random() * 100) + 1,
       prizePool,
       status: Math.random() > 0.1 ? 'waiting' : 'starting',
       timeControl: ['3+2', '5+3', '10+5', '15+10', 'Unlimited'][Math.floor(Math.random() * 5)],
       host: `${host}${Math.floor(Math.random() * 99) + 1}`
     });
   }
   
   // Sort by start time
   mockArenas.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
   setUpcomingArenas(mockArenas);
 }, []);

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

 const formatTimeUntil = (date: Date) => {
   const now = new Date();
   const diff = date.getTime() - now.getTime();
   const hours = Math.floor(diff / 3600000);
   const days = Math.floor(diff / 86400000);

   if (diff < 0) return 'Now';
   if (hours < 24) return `${hours}h`;
   return `${days}d`;
 };

 const getCategoryColor = (category: string) => {
   const colors = {
     tournament: '#ff6b35',
     update: '#2196f3',
     patch: '#4caf50',
     community: '#9c27b0',
     seasonal: '#ffc107',
     special: '#e91e63'
   };
   return colors[category as keyof typeof colors] || '#666';
 };

 const handleViewArena = (arena: Arena) => {
   const detailedArena: DetailedArena = {
     ...arena,
     requirements: { 
       minElo: arena.type === 'tournament' ? 1500 : arena.type === 'championship' ? 2000 : 1200 
     },
     gameMode: 'Standard',
     description: `An exciting ${arena.type} arena hosted by ${arena.host}. Join now for intense rhythm battles!`,
     players: generateMockArenaPlayers(arena.players, arena.host)
   };
   setSelectedArena(detailedArena);
   setCurrentSection('arena');
 };

 const handleJoinArena = () => {
   if (selectedArena && playerData) {
     setIsPlayerInSelectedArena(true);
     console.log('Joined arena:', selectedArena.name);
   }
 };

 const handleLeaveArena = () => {
   setIsPlayerInSelectedArena(false);
   console.log('Left arena:', selectedArena?.name);
 };

 const renderMainPortal = () => (
   <div className="h-full flex flex-col overflow-hidden">
     <CenteredContainer maxWidth="2xl" accountForLeftNav={true} className="h-full flex-1 min-h-0">
       <div className="flex h-full overflow-hidden">
         {/* Main Content Area */}
         <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
           {/* Top Section: Arena Timetable */}
           <div className="flex-shrink-0 mb-6">
             <ResizableTimetable 
               upcomingArenas={upcomingArenas} 
               onJoinArena={(id) => onStartGame({mode: 'online', arenaId: id})} 
               onViewArena={handleViewArena}
               getArenaTypeColor={getArenaTypeColor}
             />
           </div>

           {/* Tab Navigation */}
           <div className="flex gap-1 mb-6 flex-shrink-0">
             {[
               { id: 'featured', label: 'Featured', icon: '⭐' },
               { id: 'events', label: 'Events', icon: '📅' },
               { id: 'matches', label: 'Live Matches', icon: '🎮' },
               { id: 'challenges', label: 'Challenges', icon: '🎯' }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                   activeTab === tab.id
                     ? 'bg-blue-600 text-white shadow-lg'
                     : 'text-gray-400 hover:text-white hover:bg-slate-800'
                 }`}
               >
                 <span>{tab.icon}</span>
                 {tab.label}
               </button>
             ))}
           </div>

           {/* Scrollable Content Area */}
           <div className="flex-1 overflow-y-auto min-h-0 pr-2">
             <div className="pb-6">
               {activeTab === 'featured' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Featured News */}
                   <div className="space-y-4">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <span>📰</span> Latest News
                     </h3>
                     {newsItems.slice(0, 4).map((news) => (
                       <div key={news.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                         <div className="flex items-start gap-3">
                           <div 
                             className="w-16 h-16 rounded-lg flex-shrink-0"
                             style={{ backgroundColor: getCategoryColor(news.category) }}
                           />
                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2">
                               <span 
                                 className="text-xs px-2 py-1 rounded font-bold"
                                 style={{ backgroundColor: getCategoryColor(news.category), color: 'white' }}
                               >
                                 {news.category.toUpperCase()}
                               </span>
                               <span className="text-xs text-gray-400">{formatTimeAgo(news.publishedAt)}</span>
                             </div>
                             <h4 className="font-bold text-white mb-2">{news.title}</h4>
                             <p className="text-sm text-gray-300 mb-2">{news.summary}</p>
                             <div className="flex items-center justify-between">
                               <span className="text-xs text-gray-500">By {news.author}</span>
                               <button className="text-xs text-blue-400 hover:text-blue-300">Read More →</button>
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                     
                     {/* More News Button */}
                     <div className="text-center pt-4">
                       <button className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg text-white font-medium">
                         View All News
                       </button>
                     </div>
                   </div>

                   {/* Live Streams */}
                   <div className="space-y-4">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <span>📺</span> KeyJam TV
                     </h3>
                     
                     {/* Main Stream */}
                     <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-lg p-4">
                       <div className="flex items-center gap-2 mb-3">
                         <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                         <span className="text-red-400 font-bold text-sm">LIVE</span>
                         <span className="text-white font-bold">{liveStreams[0].viewers.toLocaleString()} viewers</span>
                       </div>
                       <h4 className="font-bold text-white mb-2">{liveStreams[0].title}</h4>
                       <p className="text-sm text-gray-300 mb-3">Official KeyJam broadcast</p>
                       <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-bold text-sm">
                         Watch Now
                       </button>
                     </div>

                     {/* Featured Streams */}
                     {liveStreams.slice(1, 6).map((stream) => (
                       <div key={stream.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/50">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                             <span className="font-medium text-white">{stream.streamer}</span>
                           </div>
                           <span className="text-xs text-gray-400">{stream.viewers.toLocaleString()} viewers</span>
                         </div>
                         <p className="text-sm text-gray-300 mb-2">{stream.title}</p>
                         <div className="flex gap-1">
                           {stream.tags.slice(0, 2).map((tag) => (
                             <span key={tag} className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">
                               {tag}
                             </span>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {activeTab === 'events' && (
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {upcomingEvents.map((event) => (
                       <div key={event.id} className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                         <div className="flex items-start justify-between mb-4">
                           <div>
                             <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                             <p className="text-gray-300 mb-3">{event.description}</p>
                           </div>
                           <span className={`px-3 py-1 rounded text-xs font-bold ${
                             event.type === 'tournament' ? 'bg-orange-600' :
                             event.type === 'community' ? 'bg-purple-600' :
                             event.type === 'seasonal' ? 'bg-blue-600' : 'bg-green-600'
                           }`}>
                             {event.type.toUpperCase()}
                           </span>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 mb-4">
                           <div>
                             <div className="text-xs text-gray-400">Starts in</div>
                             <div className="font-bold text-green-400">{formatTimeUntil(event.startTime)}</div>
                           </div>
                           <div>
                             <div className="text-xs text-gray-400">Participants</div>
                             <div className="font-bold text-blue-400">
                               {event.participants}/{event.maxParticipants || '∞'}
                             </div>
                           </div>
                         </div>

                         {event.prizePool && (
                           <div className="bg-yellow-600/20 border border-yellow-500/30 rounded p-3 mb-4">
                             <div className="text-yellow-300 font-bold">
                               💰 Prize Pool: ${event.prizePool.toLocaleString()}
                             </div>
                           </div>
                         )}

                         <div className="flex gap-2">
                           <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-bold">
                             Join Event
                           </button>
                           <button className="px-4 bg-slate-600 hover:bg-slate-500 py-2 rounded text-white">
                             Details
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {activeTab === 'matches' && (
                 <div className="space-y-4">
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <span>🎮</span> Live Matches
                   </h3>
                   {liveMatches.map((match) => (
                     <div key={match.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                       <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-4">
                           {match.players.slice(0, 2).map((player, index) => (
                             <div key={index} className="flex items-center gap-2">
                               <span className="text-xl">{player.avatar}</span>
                               <div>
                                 <div className="font-bold text-white">{player.username}</div>
                                 <div className="text-xs text-gray-400">{player.rank}</div>
                               </div>
                               {index === 0 && match.players.length === 2 && <span className="mx-2 text-gray-400">VS</span>}
                             </div>
                           ))}
                           {match.players.length > 2 && (
                             <span className="text-gray-400 text-sm">+{match.players.length - 2} more</span>
                           )}
                         </div>
                         <div className="text-right">
                           <div className="text-sm font-bold text-purple-400">{match.viewers} viewers</div>
                           <div className="text-xs text-gray-400">{match.gameMode}</div>
                         </div>
                       </div>
                       
                       <div className="mb-3">
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm text-gray-300">{match.song} (Difficulty: {match.difficulty})</span>
                           <span className="text-sm text-cyan-400">{match.progress}% complete</span>
                         </div>
                         <div className="w-full bg-slate-600 rounded-full h-2">
                           <div 
                             className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                             style={{ width: `${match.progress}%` }}
                           />
                         </div>
                       </div>

                       <div className="flex justify-between items-center">
                         <div className="flex gap-2">
                           {match.isRanked && (
                             <span className="bg-orange-600/20 text-orange-400 px-2 py-1 rounded text-xs">
                               RANKED
                             </span>
                           )}
                           <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">
                             LIVE
                           </span>
                         </div>
                         <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-white text-sm">
                           Spectate
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}

               {activeTab === 'challenges' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {/* Daily Challenges */}
                   <div className="space-y-4">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <span>🎯</span> Daily Challenges
                     </h3>
                     {dailyChallenges.map((challenge) => (
                       <div key={challenge.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                         <div className="flex justify-between items-start mb-3">
                           <div>
                             <h4 className="font-bold text-white mb-1">{challenge.title}</h4>
                             <p className="text-sm text-gray-300 mb-2">{challenge.description}</p>
                           </div>
                           <div className="text-right">
                             <div className="text-xs text-gray-400">Expires in</div>
                             <div className="font-bold text-orange-400">{formatTimeUntil(challenge.expiresAt)}</div>
                           </div>
                         </div>

                         <div className="mb-3">
                           <div className="flex justify-between text-sm mb-1">
                             <span className="text-gray-400">Progress</span>
                             <span className="text-white">{challenge.progress}/{challenge.maxProgress}</span>
                           </div>
                           <div className="w-full bg-slate-600 rounded-full h-2">
                             <div 
                               className="bg-green-400 h-2 rounded-full"
                               style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                             />
                           </div>
                         </div>

                         <div className="flex justify-between items-center">
                           <div>
                             <div className="text-xs text-gray-400">Reward</div>
                             <div className="text-sm text-yellow-400 font-bold">{challenge.reward}</div>
                           </div>
                           <div className="text-right">
                             <div className="text-xs text-gray-400">{challenge.participants.toLocaleString()} participating</div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Record Breaks & Forum */}
                   <div className="space-y-4">
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <span>🏆</span> Recent Records
                     </h3>
                     <div className="bg-slate-800/50 rounded-lg border border-slate-600/50 max-h-80 overflow-y-auto">
                       {recordBreaks.map((record) => (
                         <div key={record.id} className="p-3 border-b border-slate-700/50 last:border-b-0">
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                               <span className="text-lg">
                                 {record.category === 'score' ? '🎯' :
                                  record.category === 'accuracy' ? '✨' :
                                  record.category === 'combo' ? '🔥' : '⚡'}
                               </span>
                               <span className="font-bold text-white">{record.player}</span>
                             </div>
                             <span className="text-xs text-gray-400">{formatTimeAgo(record.timestamp)}</span>
                           </div>
                           <p className="text-sm text-gray-300 mb-1">{record.achievement}</p>
                           <div className="flex justify-between items-center">
                             <span className="text-xs text-gray-400">{record.song}</span>
                             <div className="text-sm font-bold text-yellow-400">
                               {record.category === 'score' ? record.score.toLocaleString() :
                                record.category === 'speed' ? `${record.score}s` :
                                `${record.score}%`}
                             </div>
                           </div>
                           {record.previousRecord && (
                             <div className="text-xs text-green-400 mt-1">
                               +{(record.score - record.previousRecord).toLocaleString()} improvement!
                             </div>
                           )}
                         </div>
                       ))}
                     </div>

                     {/* Forum Posts */}
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <span>💬</span> Forum Activity
                     </h3>
                     <div className="bg-slate-800/50 rounded-lg border border-slate-600/50">
                       {forumPosts.map((post) => (
                         <div key={post.id} className="p-3 border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors cursor-pointer">
                           <div className="flex items-start gap-3">
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 {post.isSticky && <span className="text-yellow-400 text-xs">📌</span>}
                                 {post.isHot && <span className="text-red-400 text-xs">🔥</span>}
                                 <h4 className="font-medium text-white text-sm line-clamp-1">{post.title}</h4>
                               </div>
                               <div className="flex items-center gap-2 text-xs text-gray-400">
                                 <span>by {post.author}</span>
                                 <span>•</span>
                                 <span className="text-blue-400">{post.category}</span>
                                 <span>•</span>
                                 <span>{post.replies} replies</span>
                                 <span>•</span>
                                 <span>{formatTimeAgo(post.lastReply)}</span>
                               </div>
                             </div>
                           </div>
                         </div>
                       ))}
                       <div className="p-3 text-center">
                         <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                           View All Forum Posts →
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>

         {/* Right Sidebar - Fixed Height with Internal Scrolling */}
         <div className="w-80 flex-shrink-0 bg-slate-900/30 border-l border-slate-700/50 flex flex-col overflow-hidden">
           {/* Quick Actions */}
           <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
             <h3 className="text-lg font-bold text-white mb-3">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-2">
               <button
                 onClick={() => onStartGame({ mode: 'quick' })}
                 className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg p-3 text-white text-sm font-bold transition-all duration-200 hover:scale-105"
               >
                 <div className="text-lg mb-1">⚡</div>
                 Quick Match
               </button>
               <button
                 onClick={() => setCurrentSection('leaderboards')}
                 className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg p-3 text-white text-sm font-bold transition-all duration-200 hover:scale-105"
               >
                 <div className="text-lg mb-1">🏆</div>
                 Rankings
               </button>
               <button
                 onClick={() => setCurrentSection('friends')}
                 className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg p-3 text-white text-sm font-bold transition-all duration-200 hover:scale-105"
               >
                 <div className="text-lg mb-1">👥</div>
                 Friends
               </button>
               <button
                 onClick={() => setCurrentSection('party')}
                 className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg p-3 text-white text-sm font-bold transition-all duration-200 hover:scale-105"
               >
                 <div className="text-lg mb-1">🎉</div>
                 Party Up
               </button>
             </div>
           </div>

           {/* Scrollable Sidebar Content */}
           <div className="flex-1 overflow-y-auto min-h-0">
             {/* Current Events */}
             <div className="p-4 border-b border-slate-700/50">
               <h3 className="text-lg font-bold text-white mb-3">Happening Now</h3>
               <div className="space-y-3">
                 <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                     <span className="text-red-400 font-bold text-sm">LIVE EVENT</span>
                   </div>
                   <h4 className="text-white font-medium mb-1">Championship Qualifiers</h4>
                   <p className="text-xs text-gray-300">32 spots remaining</p>
                 </div>
                 
                 <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-blue-400 text-sm">📺</span>
                     <span className="text-blue-400 font-bold text-sm">FEATURED STREAM</span>
                   </div>
                   <h4 className="text-white font-medium mb-1">KeyJam TV Live</h4>
                   <p className="text-xs text-gray-300">23.8k viewers</p>
                 </div>

                 <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-purple-400 text-sm">🎉</span>
                     <span className="text-purple-400 font-bold text-sm">WEEKEND SPECIAL</span>
                   </div>
                   <h4 className="text-white font-medium mb-1">Double XP Event</h4>
                   <p className="text-xs text-gray-300">2x rewards until Monday</p>
                 </div>
               </div>
             </div>

             {/* Server Status */}
             <div className="p-4 border-b border-slate-700/50">
               <h3 className="text-lg font-bold text-white mb-3">Server Status</h3>
               <div className="space-y-2">
                 {[
                   { region: 'NA East', ping: 23, status: 'optimal', players: '45.2k' },
                   { region: 'NA West', ping: 45, status: 'good', players: '32.1k' },
                   { region: 'EU West', ping: 67, status: 'good', players: '67.8k' },
                   { region: 'EU East', ping: 72, status: 'good', players: '28.4k' },
                   { region: 'Asia', ping: 89, status: 'fair', players: '91.3k' },
                   { region: 'OCE', ping: 134, status: 'fair', players: '8.7k' }
                 ].map((server, index) => (
                   <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                     <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${
                         server.status === 'optimal' ? 'bg-green-400' :
                         server.status === 'good' ? 'bg-yellow-400' : 'bg-orange-400'
                       }`}></div>
                       <div>
                       <span className="text-white text-sm">{server.region}</span>
                         <div className="text-xs text-gray-400">{server.players} online</div>
                       </div>
                     </div>
                     <span className="text-gray-400 text-xs">{server.ping}ms</span>
                   </div>
                 ))}
               </div>
             </div>

             {/* Top Players Today */}
             <div className="p-4 border-b border-slate-700/50">
               <h3 className="text-lg font-bold text-white mb-3">Top Players Today</h3>
               <div className="space-y-2">
                 {[
                   { rank: 1, name: 'RhythmGod', score: '2.84M', change: '+156', country: '🇺🇸' },
                   { rank: 2, name: 'BeatMachine', score: '2.79M', change: '+89', country: '🇰🇷' },
                   { rank: 3, name: 'SoundWave', score: '2.73M', change: '+234', country: '🇯🇵' },
                   { rank: 4, name: 'PerfectPlayer', score: '2.68M', change: '+67', country: '🇩🇪' },
                   { rank: 5, name: 'SpeedDemon', score: '2.62M', change: '+178', country: '🇬🇧' },
                   { rank: 6, name: 'ComboKing', score: '2.58M', change: '+45', country: '🇫🇷' },
                   { rank: 7, name: 'AccuracyAce', score: '2.54M', change: '+123', country: '🇨🇦' },
                   { rank: 8, name: 'NoteMaster', score: '2.49M', change: '+67', country: '🇦🇺' }
                 ].map((player) => (
                   <div key={player.rank} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                     <div className="flex items-center gap-2">
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                         player.rank === 1 ? 'bg-yellow-500 text-black' :
                         player.rank === 2 ? 'bg-gray-400 text-black' :
                         player.rank === 3 ? 'bg-orange-600 text-white' :
                         'bg-slate-600 text-white'
                       }`}>
                         {player.rank}
                       </div>
                       <div className="flex-1">
                         <div className="flex items-center gap-1">
                           <span className="text-white text-sm font-medium">{player.name}</span>
                           <span className="text-xs">{player.country}</span>
                         </div>
                         <div className="text-xs text-gray-400">{player.score}</div>
                       </div>
                     </div>
                     <div className="text-green-400 text-xs font-bold">{player.change}</div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Arena Quick Stats */}
             <div className="p-4 border-b border-slate-700/50">
               <h3 className="text-lg font-bold text-white mb-3">Arena Stats</h3>
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-800/30 rounded p-3 text-center">
                   <div className="text-xl font-bold text-green-400">{upcomingArenas.filter(a => a.status === 'waiting').length}</div>
                   <div className="text-xs text-gray-400">Open Arenas</div>
                 </div>
                 <div className="bg-slate-800/30 rounded p-3 text-center">
                   <div className="text-xl font-bold text-blue-400">{upcomingArenas.filter(a => a.status === 'starting').length}</div>
                   <div className="text-xs text-gray-400">Starting Soon</div>
                 </div>
                 <div className="bg-slate-800/30 rounded p-3 text-center">
                   <div className="text-xl font-bold text-purple-400">{upcomingArenas.reduce((sum, a) => sum + a.players, 0)}</div>
                   <div className="text-xs text-gray-400">Players Queued</div>
                 </div>
                 <div className="bg-slate-800/30 rounded p-3 text-center">
                   <div className="text-xl font-bold text-orange-400">{upcomingArenas.filter(a => a.prizePool).length}</div>
                   <div className="text-xs text-gray-400">Prize Events</div>
                 </div>
               </div>
             </div>

             {/* Trending Arenas */}
             <div className="p-4 border-b border-slate-700/50">
               <h3 className="text-lg font-bold text-white mb-3">🔥 Trending Arenas</h3>
               <div className="space-y-2">
                 {upcomingArenas
                   .filter(a => a.players / a.maxPlayers > 0.7)
                   .slice(0, 4)
                   .map((arena) => (
                   <div key={arena.id} className="bg-slate-800/30 rounded p-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                        onClick={() => handleViewArena(arena)}>
                     <div className="flex items-center justify-between mb-1">
                       <span className="text-white text-sm font-medium truncate">{arena.name}</span>
                       <span 
                         className="text-xs px-2 py-1 rounded font-bold"
                         style={{ backgroundColor: getArenaTypeColor(arena.type), color: 'white' }}
                       >
                         {arena.type.toUpperCase()}
                       </span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-xs text-gray-400">{arena.players}/{arena.maxPlayers} players</span>
                       <span className="text-xs text-cyan-400">
                         {Math.round((new Date(arena.startTime).getTime() - Date.now()) / 60000)}m
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Achievement of the Day */}
             <div className="p-4 border-b border-slate-700/50">
               <h3 className="text-lg font-bold text-white mb-3">🏅 Daily Achievement</h3>
               <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-lg p-3">
                 <div className="flex items-center gap-3 mb-2">
                   <span className="text-2xl">🎯</span>
                   <div>
                     <h4 className="font-bold text-yellow-300">Accuracy Legend</h4>
                     <p className="text-xs text-yellow-200">Maintain 98%+ accuracy for 10 songs</p>
                   </div>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-xs text-yellow-400">Progress: 3/10</span>
                   <span className="text-xs text-yellow-300 font-bold">1000 XP</span>
                 </div>
                 <div className="w-full bg-yellow-900/50 rounded-full h-1 mt-2">
                   <div className="bg-yellow-400 h-1 rounded-full" style={{ width: '30%' }}></div>
                 </div>
               </div>
             </div>

             {/* Social Links */}
             <div className="p-4">
               <h3 className="text-lg font-bold text-white mb-3">Community</h3>
               <div className="grid grid-cols-4 gap-2 mb-4">
                 {[
                   { name: 'Discord', icon: '💬', color: 'bg-indigo-600', members: '89k' },
                   { name: 'Twitter', icon: '🐦', color: 'bg-blue-500', members: '156k' },
                   { name: 'YouTube', icon: '📺', color: 'bg-red-600', members: '234k' },
                   { name: 'Reddit', icon: '🤖', color: 'bg-orange-600', members: '67k' }
                 ].map((social) => (
                   <div key={social.name} className="text-center">
                     <button
                       className={`${social.color} hover:opacity-80 rounded-lg p-2 text-white transition-all duration-200 hover:scale-105 w-full`}
                       title={social.name}
                     >
                       <div className="text-lg">{social.icon}</div>
                       <div className="text-xs font-medium">{social.name}</div>
                     </button>
                     <div className="text-xs text-gray-400 mt-1">{social.members}</div>
                   </div>
                 ))}
               </div>
               
               {/* Community Stats */}
               <div className="bg-slate-800/30 rounded p-3 text-center">
                 <h4 className="text-sm font-bold text-white mb-2">Community Activity</h4>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                   <div>
                     <div className="font-bold text-green-400">892</div>
                     <div className="text-gray-400">Posts Today</div>
                   </div>
                   <div>
                     <div className="font-bold text-blue-400">2.3k</div>
                     <div className="text-gray-400">New Members</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </CenteredContainer>
   </div>
 );

 // Handle other sections (keep existing logic)
 const renderCurrentSection = () => {
   if (!playerData) return <div>Loading...</div>;

   switch (currentSection) {
     case 'arena':
       return selectedArena ? (
         <ArenaPage
           arena={selectedArena}
           currentPlayer={playerData as any}
           onBack={() => setCurrentSection('main')}
           onJoinArena={handleJoinArena}
           onLeaveArena={handleLeaveArena}
           isPlayerInArena={isPlayerInSelectedArena}
         />
       ) : null;
     case 'leaderboards':
       return <Leaderboards onBack={() => setCurrentSection('main')} />;
     case 'friends':
       return <FriendsList playerData={playerData as any} onBack={() => setCurrentSection('main')} onInviteFriend={(id) => console.log('Inviting friend:', id)} />;
     case 'profile':
       return <PlayerProfile playerData={playerData as any} onBack={() => setCurrentSection('main')} onUpdateProfile={(data) => console.log('Update profile:', data)} />;
     case 'party':
       return <PartySystem onBack={() => setCurrentSection('main')} onStartPartyGame={(config) => onStartGame(config)} />;
     default:
       return renderMainPortal();
   }
 };

 return (
   <div className="h-full w-full overflow-hidden text-white flex flex-col">
     <div className="flex-grow overflow-hidden">{renderCurrentSection()}</div>
   </div>
 );
};

export default MainPortal;