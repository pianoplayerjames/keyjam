// client/src/stores/replayStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ReplayData } from '../ReplayRecorder'

interface SavedReplay extends ReplayData {
  id: string
  timestamp: string
}

interface ReplayState {
  // Current replay
  currentReplay: ReplayData | null
  isRecording: boolean
  isPlaying: boolean
  
  // Saved replays
  savedReplays: SavedReplay[]
  
  // Actions
  setCurrentReplay: (replay: ReplayData | null) => void
  setIsRecording: (recording: boolean) => void
  setIsPlaying: (playing: boolean) => void
  saveReplay: (replay: ReplayData) => void
  deleteReplay: (id: string) => void
  loadReplays: () => void
}

export const useReplayStore = create<ReplayState>()(
  persist(
    (set, get) => ({
      // Current replay
      currentReplay: null,
      isRecording: false,
      isPlaying: false,
      
      // Saved replays
      savedReplays: [],
      
      // Actions
      setCurrentReplay: (replay) => set({ currentReplay: replay }),
      setIsRecording: (recording) => set({ isRecording: recording }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      saveReplay: (replay) => {
        const savedReplay: SavedReplay = {
          ...replay,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        }
        
        set((state) => {
          const newReplays = [savedReplay, ...state.savedReplays]
          // Keep only last 10 replays
          if (newReplays.length > 10) {
            newReplays.splice(10)
          }
          return { savedReplays: newReplays }
        })
      },
      
      deleteReplay: (id) => set((state) => ({
        savedReplays: state.savedReplays.filter(r => r.id !== id)
      })),
      
      loadReplays: () => {
        // This is handled by the persist middleware
      }
    }),
    {
      name: 'rhythm-game-replays',
      partialize: (state) => ({ savedReplays: state.savedReplays })
    }
  )
)