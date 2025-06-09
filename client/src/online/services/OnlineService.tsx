// client/src/online/MockOnlineService.tsx
export interface OnlinePlayer {
  id: string;
  username: string;
  elo: number;
  rank: string;
  status: 'online' | 'away' | 'in-game' | 'offline';
  region: string;
  avatar: string;
  lastSeen: Date;
  wins: number;
  losses: number;
  draws: number;
  level: number;
}

export interface GameArena {
  id: string;
  name: string;
  host: OnlinePlayer;
  players: OnlinePlayer[];
  maxPlayers: number;
  gameMode: string;
  difficulty: number;
  region: string;
  isRanked: boolean;
  minElo?: number;
  maxElo?: number;
  status: 'waiting' | 'in-progress' | 'full';
  createdAt: Date;
  settings: {
    timeLimit?: number;
    scoreTarget?: number;
    allowSpectators: boolean;
    password?: string;
  };
}

export interface MatchResult {
  id: string;
  players: {
    player: OnlinePlayer;
    score: number;
    accuracy: number;
    rank: number;
    eloChange: number;
  }[];
  arena: GameArena;
  duration: number;
  completedAt: Date;
  replay?: {
    id: string;
    data: any;
  };
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: 'single-elimination' | 'double-elimination' | 'round-robin' | 'swiss';
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: number;
  startTime: Date;
  endTime?: Date;
  status: 'upcoming' | 'registration' | 'in-progress' | 'completed';
  difficulty: number;
  gameMode: string;
  region: string;
  organizer: string;
  rules: string[];
  brackets?: any[];
}

export interface FriendRequest {
  id: string;
  from: OnlinePlayer;
  to: OnlinePlayer;
  message?: string;
  sentAt: Date;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ChatMessage {
  id: string;
  from: OnlinePlayer;
  content: string;
  timestamp: Date;
  channel: 'global' | 'arena' | 'party' | 'private';
  targetId?: string; // arena id, party id, or user id for private messages
}

export interface LeaderboardEntry {
  rank: number;
  player: OnlinePlayer;
  stats: {
    gamesPlayed: number;
    winRate: number;
    averageScore: number;
    bestScore: number;
    streak: number;
    recentForm: ('W' | 'L' | 'D')[];
  };
  seasonStats?: {
    seasonRank: number;
    seasonElo: number;
    seasonGames: number;
  };
}

export interface OnlineStats {
  playersOnline: number;
  gamesInProgress: number;
  activeArenas: number;
  activeTournaments: number;
  peakPlayersToday: number;
  averageWaitTime: number;
  serverStatus: {
    region: string;
    status: 'online' | 'maintenance' | 'degraded';
    ping: number;
    playerCount: number;
  }[];
}

class MockOnlineService {
  private static instance: MockOnlineService;
  private players: Map<string, OnlinePlayer> = new Map();
  private arenas: Map<string, GameArena> = new Map();
  private matches: Map<string, MatchResult> = new Map();
  private tournaments: Map<string, Tournament> = new Map();
  private friendRequests: Map<string, FriendRequest> = new Map();
  private chatHistory: Map<string, ChatMessage[]> = new Map();
  private leaderboards: Map<string, LeaderboardEntry[]> = new Map();
  private currentPlayer: OnlinePlayer | null = null;

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): MockOnlineService {
    if (!MockOnlineService.instance) {
      MockOnlineService.instance = new MockOnlineService();
    }
    return MockOnlineService.instance;
  }

  private initializeMockData(): void {
    // Initialize mock players
    const mockPlayers: OnlinePlayer[] = [
      {
        id: 'player_1',
        username: 'RhythmGod',
        elo: 2547,
        rank: 'Grandmaster',
        status: 'online',
        region: 'NA-East',
        avatar: '/avatars/1.png',
        lastSeen: new Date(),
        wins: 342,
        losses: 58,
        draws: 12,
        level: 87
      },
      {
        id: 'player_2',
        username: 'BeatMachine',
        elo: 2489,
        rank: 'Grandmaster',
        status: 'in-game',
        region: 'EU-West',
        avatar: '/avatars/2.png',
        lastSeen: new Date(),
        wins: 298,
        losses: 67,
        draws: 8,
        level: 82
      },
      {
        id: 'player_3',
        username: 'SoundWave',
        elo: 2423,
        rank: 'Master',
        status: 'online',
        region: 'NA-West',
        avatar: '/avatars/3.png',
        lastSeen: new Date(),
        wins: 267,
        losses: 89,
        draws: 15,
        level: 78
      }
      // Add more mock players...
    ];

    mockPlayers.forEach(player => {
      this.players.set(player.id, player);
    });

    // Initialize mock arenas
    const mockArenas: GameArena[] = [
      {
        id: 'arena_1',
        name: 'Elite Championship',
        host: mockPlayers[0],
        players: [mockPlayers[0], mockPlayers[1]],
        maxPlayers: 8,
        gameMode: 'Tournament',
        difficulty: 85,
        region: 'NA-East',
        isRanked: true,
        minElo: 2000,
        status: 'waiting',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        settings: {
          timeLimit: 300,
          allowSpectators: true
        }
      }
      // Add more mock arenas...
    ];

    mockArenas.forEach(arena => {
      this.arenas.set(arena.id, arena);
    });

    // Initialize mock tournaments
    const mockTournaments: Tournament[] = [
      {
        id: 'tournament_1',
        name: 'Weekly Championship',
        description: 'Compete against the best players for glory and prizes!',
        format: 'single-elimination',
        maxParticipants: 64,
        currentParticipants: 47,
        entryFee: 0,
        prizePool: 10000,
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
        status: 'registration',
        difficulty: 75,
        gameMode: 'Ranked',
        region: 'Global',
        organizer: 'GameAdmin',
        rules: [
          'Standard ranked rules apply',
          'No remakes allowed',
          'Must maintain 80%+ accuracy to advance',
          'Disconnections count as forfeit after 2 minutes'
        ]
      }
      // Add more tournaments...
    ];

    mockTournaments.forEach(tournament => {
      this.tournaments.set(tournament.id, tournament);
    });

    // Initialize global leaderboard
    const globalLeaderboard: LeaderboardEntry[] = mockPlayers
      .map((player, index) => ({
        rank: index + 1,
        player,
        stats: {
          gamesPlayed: player.wins + player.losses + player.draws,
          winRate: (player.wins / (player.wins + player.losses + player.draws)) * 100,
          averageScore: Math.floor(Math.random() * 50000) + 70000,
          bestScore: Math.floor(Math.random() * 30000) + 95000,
          streak: Math.floor(Math.random() * 10),
          recentForm: this.generateRecentForm()
        }
      }))
      .sort((a, b) => b.player.elo - a.player.elo);

    this.leaderboards.set('global', globalLeaderboard);
  }

  private generateRecentForm(): ('W' | 'L' | 'D')[] {
    const results: ('W' | 'L' | 'D')[] = [];
    for (let i = 0; i < 10