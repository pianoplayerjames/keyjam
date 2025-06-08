// client/src/stores/onlineStore.ts
import { create } from 'zustand'

interface OnlinePlayer {
  id: string
  username: string
  elo: number
  rank: string
  status: 'online' | 'away' | 'in-game' | 'offline'
  region: string
  avatar: string
  lastSeen: Date
  wins: number
  losses: number
  draws: number
  level: number
}

interface OnlineStats {
  playersOnline: number
  gamesInProgress: number
  availableArenas: number
}

interface OnlineState {
  // Player data
  playerData: OnlinePlayer | null
  
  // Online status
  isConnected: boolean
  onlineStats: OnlineStats
  
  // Friends
  friends: OnlinePlayer[]
  friendRequests: any[]
  
  // Actions
  setPlayerData: (player: OnlinePlayer | null) => void
  setIsConnected: (connected: boolean) => void
  setOnlineStats: (stats: OnlineStats) => void
  setFriends: (friends: OnlinePlayer[]) => void
  addFriend: (friend: OnlinePlayer) => void
  removeFriend: (friendId: string) => void
  setFriendRequests: (requests: any[]) => void
}

export const useOnlineStore = create<OnlineState>((set) => ({
  // Player data
  playerData: null,
  
  // Online status
  isConnected: false,
  onlineStats: {
    playersOnline: 0,
    gamesInProgress: 0,
    availableArenas: 0
  },
  
  // Friends
  friends: [],
  friendRequests: [],
  
  // Actions
  setPlayerData: (player) => set({ playerData: player }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setOnlineStats: (stats) => set({ onlineStats: stats }),
  setFriends: (friends) => set({ friends }),
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
  removeFriend: (friendId) => set((state) => ({ 
    friends: state.friends.filter(f => f.id !== friendId) 
  })),
  setFriendRequests: (requests) => set({ friendRequests: requests })
}))