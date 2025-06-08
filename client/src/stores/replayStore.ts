import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReplayData } from '../replays/ReplayRecorder';
import { ReplayEngine } from '../replays/ReplayEngine';

interface SavedReplay extends ReplayData {
  id: string;
  timestamp: string;
}

interface ReplayState {
  currentReplay: ReplayData | null;
  replayEngine: ReplayEngine | null;
  isRecording: boolean;
  isPlaying: boolean;
  savedReplays: SavedReplay[];
  setIsRecording: (recording: boolean) => void;
  saveReplay: (replay: ReplayData) => void;
  deleteReplay: (id: string) => void;
  playReplay: (replay: SavedReplay) => void;
  stopReplay: () => void;
  togglePlayPause: () => void;
}

export const useReplayStore = create<ReplayState>()(
  persist(
    (set, get) => ({
      currentReplay: null,
      replayEngine: null,
      isRecording: false,
      isPlaying: false,
      savedReplays: [],
      setIsRecording: (recording) => set({ isRecording: recording }),
      saveReplay: (replay) => {
        const savedReplay: SavedReplay = {
          ...replay,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        };
        set((state) => {
          const newReplays = [savedReplay, ...state.savedReplays].slice(0, 10);
          return { savedReplays: newReplays };
        });
      },
      deleteReplay: (id) => set((state) => ({
        savedReplays: state.savedReplays.filter(r => r.id !== id)
      })),
      playReplay: (replay) => {
        get().stopReplay();
        const newEngine = new ReplayEngine(replay);
        set({
            currentReplay: replay,
            replayEngine: newEngine,
            isPlaying: true
        });
        newEngine.play();
      },
      stopReplay: () => {
        const { replayEngine } = get();
        if (replayEngine) {
            replayEngine.stop();
        }
        set({
            currentReplay: null,
            replayEngine: null,
            isPlaying: false
        });
      },
      togglePlayPause: () => {
        const { replayEngine, isPlaying } = get();
        if (replayEngine) {
            if (isPlaying) {
                replayEngine.pause();
                set({ isPlaying: false });
            } else {
                replayEngine.play();
                set({ isPlaying: true });
            }
        }
      }
    }),
    {
      name: 'rhythm-game-replays',
      partialize: (state) => ({ savedReplays: state.savedReplays }),
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.replayEngine = null;
            state.isPlaying = false;
            state.currentReplay = null;
        }
      }
    }
  )
);