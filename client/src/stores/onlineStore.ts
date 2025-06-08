import { create } from 'zustand';

interface Party {
  id: string;
  name: string;
  leader: string;
  members: PartyMember[];
  maxMembers: number;
  isPublic: boolean;
  gameMode?: string;
  difficulty?: number;
  region: string;
  createdAt: Date;
  status: 'waiting' | 'in-queue' | 'in-game';
}

interface PartyMember {
  id: string;
  username: string;
  elo: number;
  rank: string;
  status: 'ready' | 'not-ready' | 'away';
  joinedAt: Date;
  avatar: string;
  isLeader: boolean;
}

interface PartyInvite {
  id: string;
  fromUsername: string;
  fromElo: number;
  fromRank: string;
  partyName: string;
  sentAt: Date;
  expiresAt: Date;
}

interface Friend {
  id: string;
  username: string;
  status: 'online' | 'away' | 'in-game' | 'offline';
  elo: number;
  rank: string;
  lastSeen: Date;
  isPlaying?: boolean;
  currentGame?: string;
  avatar: string;
  mutualFriends: number;
}

interface FriendRequest {
  id: string;
  username: string;
  elo: number;
  rank: string;
  sentAt: Date;
  avatar: string;
}

interface OnlinePlayer {
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
  bio?: string;
}

interface OnlineStats {
  playersOnline: number;
  gamesInProgress: number;
  availableArenas: number;
}

interface Arena {
    id: string;
    name: string;
    host: string;
    players: number;
    maxPlayers: number;
    difficulty: number;
    gameMode: string;
    region: string;
    ping: number;
    status: 'waiting' | 'in-progress' | 'full';
    isRanked: boolean;
    minElo?: number;
    maxElo?: number;
}
  
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
}

interface OnlineState {
  playerData: OnlinePlayer | null;
  isConnected: boolean;
  onlineStats: OnlineStats;
  friends: Friend[];
  friendRequests: FriendRequest[];
  currentParty: Party | null;
  availableParties: Party[];
  partyInvites: PartyInvite[];
  arenas: Arena[];
  leaderboardData: LeaderboardPlayer[];
  setPlayerData: (player: OnlinePlayer | null) => void;
  updatePlayerData: (data: Partial<OnlinePlayer>) => void;
  setIsConnected: (connected: boolean) => void;
  setOnlineStats: (stats: OnlineStats) => void;
  setFriends: (friends: Friend[]) => void;
  removeFriend: (friendId: string) => void;
  setFriendRequests: (requests: FriendRequest[]) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  setCurrentParty: (party: Party | null) => void;
  setAvailableParties: (parties: Party[]) => void;
  createParty: (formData: any, player: OnlinePlayer) => void;
  leaveParty: () => void;
  joinParty: (party: Party, player: OnlinePlayer) => void;
  setArenas: (arenas: Arena[]) => void;
  setLeaderboardData: (data: LeaderboardPlayer[]) => void;
}

export const useOnlineStore = create<OnlineState>((set, get) => ({
  playerData: null,
  isConnected: false,
  onlineStats: {
    playersOnline: 0,
    gamesInProgress: 0,
    availableArenas: 0
  },
  friends: [],
  friendRequests: [],
  currentParty: null,
  availableParties: [],
  partyInvites: [],
  arenas: [],
  leaderboardData: [],
  setPlayerData: (player) => set({ playerData: player }),
  updatePlayerData: (data) => set(state => ({
    playerData: state.playerData ? { ...state.playerData, ...data } : null
  })),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setOnlineStats: (stats) => set({ onlineStats: stats }),
  setFriends: (friends) => set({ friends }),
  removeFriend: (friendId) => set((state) => ({ 
    friends: state.friends.filter(f => f.id !== friendId) 
  })),
  setFriendRequests: (requests) => set({ friendRequests: requests }),
  acceptFriendRequest: (requestId: string) => set(state => {
    const request = state.friendRequests.find(r => r.id === requestId);
    if (!request) return state;
    const newFriend: Friend = {
      id: request.id,
      username: request.username,
      status: 'online',
      elo: request.elo,
      rank: request.rank,
      lastSeen: new Date(),
      avatar: request.avatar,
      mutualFriends: 0,
    };
    return {
      friends: [...state.friends, newFriend],
      friendRequests: state.friendRequests.filter(r => r.id !== requestId),
    }
  }),
  declineFriendRequest: (requestId: string) => set(state => ({
    friendRequests: state.friendRequests.filter(r => r.id !== requestId),
  })),
  setCurrentParty: (party) => set({ currentParty: party }),
  setAvailableParties: (parties) => set({ availableParties: parties }),
  leaveParty: () => set({ currentParty: null }),
  createParty: (formData, player) => {
    const newParty: Party = {
      id: `party_${Date.now()}`,
      name: formData.name || `${player.username}'s Party`,
      leader: player.username,
      members: [{
        id: player.id,
        username: player.username,
        elo: player.elo,
        rank: player.rank,
        status: 'ready',
        joinedAt: new Date(),
        avatar: player.avatar,
        isLeader: true
      }],
      maxMembers: formData.maxMembers,
      isPublic: formData.isPublic,
      gameMode: formData.gameMode,
      difficulty: formData.difficulty,
      region: formData.region,
      createdAt: new Date(),
      status: 'waiting'
    };
    set({ currentParty: newParty });
  },
  joinParty: (party, player) => {
    if (party.members.length >= party.maxMembers) return;
    const newMember: PartyMember = {
      id: player.id,
      username: player.username,
      elo: player.elo,
      rank: player.rank,
      status: 'not-ready' as const,
      joinedAt: new Date(),
      avatar: player.avatar,
      isLeader: false
    };
    const updatedParty = { ...party, members: [...party.members, newMember] };
    set({ currentParty: updatedParty });
  },
  setArenas: (arenas) => set({ arenas }),
  setLeaderboardData: (data) => set({ leaderboardData: data }),
}));