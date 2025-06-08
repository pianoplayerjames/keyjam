import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { ComplexityManager } from '../ComplexityManager'

interface Letter {
  id: number
  letter: string
  position: [number, number, number]
  duration?: number
  color?: string
  spawnTime: number
  isMissed?: boolean
  isHit?: boolean
  isBeingHeld?: boolean
  opacity?: number
  complexityType?: 'normal' | 'chord' | 'rapid' | 'cross' | 'polyrhythm' | 'syncopated' | 'hold' | 'random'
  wasProcessed?: boolean
}

interface GameConfig {
  mode: string
  subMode: string
  difficulty: number
  timeLimit: number
  scoreTarget: number
  songId?: string;
}

interface StampState {
  id: number
  position: [number, number, number]
  color: string
}

interface HitFeedbackState {
  text: string
  color: string
  key: number
}

interface GameState {
  gameConfig: GameConfig
  setGameConfig: (config: GameConfig) => void
  
  gameState: 'menu' | 'in-transition' | 'game'
  setGameState: (state: 'menu' | 'in-transition' | 'game') => void
  
  score: number
  combo: number
  maxCombo: number
  health: number
  setScore: (score: number) => void
  setCombo: (combo: number) => void
  setMaxCombo: (maxCombo: number) => void
  setHealth: (health: number) => void
  addScore: (points: number) => void
  incrementCombo: () => void
  resetCombo: () => void
  
  complexity: number
  timeLeft: number
  targetScore: number
  setComplexity: (complexity: number) => void
  setTimeLeft: (time: number) => void
  setTargetScore: (target: number) => void
  
  fallingLetters: Letter[]
  heldKeys: Set<string>
  stamps: StampState[]
  setFallingLetters: (letters: Letter[] | ((prev: Letter[]) => Letter[])) => void
  setHeldKeys: (keys: Set<string>) => void
  addStamp: (stamp: StampState) => void
  removeStamp: (id: number) => void
  
  hitFeedback: HitFeedbackState
  timingOffset: number
  showTimingDisplay: boolean
  setHitFeedback: (feedback: HitFeedbackState) => void
  setTimingOffset: (offset: number) => void
  setShowTimingDisplay: (show: boolean) => void
  
  totalNotes: number
  perfectNotes: number
  goodNotes: number
  almostNotes: number
  missedNotes: number
  totalNotesProcessed: number
  accuracy: number
  setTotalNotes: (count: number) => void
  setPerfectNotes: (count: number) => void
  setGoodNotes: (count: number) => void
  setAlmostNotes: (count: number) => void
  setMissedNotes: (count: number) => void
  setTotalNotesProcessed: (count: number) => void
  incrementTotalNotes: () => void
  incrementPerfectNotes: () => void
  incrementGoodNotes: () => void
  incrementAlmostNotes: () => void
  incrementMissedNotes: () => void
  incrementTotalNotesProcessed: () => void
  
  isGameOver: boolean
  gameComplete: boolean
  setIsGameOver: (gameOver: boolean) => void
  setGameComplete: (complete: boolean) => void
  
  resetGame: () => void
  calculateAccuracy: () => number
}

const initialGameConfig: GameConfig = {
  mode: '',
  subMode: '',
  difficulty: 30,
  timeLimit: 120,
  scoreTarget: 1000,
  songId: undefined,
}

const initialHitFeedback: HitFeedbackState = {
  text: '',
  color: '',
  key: 0
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gameConfig: initialGameConfig,
    setGameConfig: (config) => set({ gameConfig: config }),
    
    gameState: 'menu',
    setGameState: (state) => set({ gameState: state }),
    
    score: 0,
    combo: 0,
    maxCombo: 0,
    health: 100,
    setScore: (score) => set({ score }),
    setCombo: (combo) => {
      const state = get()
      set({ 
        combo,
        maxCombo: Math.max(state.maxCombo, combo)
      })
    },
    setMaxCombo: (maxCombo) => set({ maxCombo }),
    setHealth: (health) => set({ health: Math.max(0, Math.min(100, health)) }),
    addScore: (points) => set((state) => ({ score: state.score + points })),
    incrementCombo: () => {
      const state = get()
      const newCombo = state.combo + 1
      set({ 
        combo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo)
      })
    },
    resetCombo: () => set({ combo: 0 }),
    
    complexity: 30,
    timeLeft: 120,
    targetScore: 1000,
    setComplexity: (complexity) => set({ complexity }),
    setTimeLeft: (time) => set({ timeLeft: Math.max(0, time) }),
    setTargetScore: (target) => set({ targetScore: target }),
    
    fallingLetters: [],
    heldKeys: new Set(),
    stamps: [],
    setFallingLetters: (letters) => {
      set((state) => {
        const newLetters = typeof letters === 'function' ? letters(state.fallingLetters) : letters
        return { fallingLetters: newLetters }
      })
    },
    setHeldKeys: (keys) => set({ heldKeys: keys }),
    addStamp: (stamp) => set((state) => ({ stamps: [...state.stamps, stamp] })),
    removeStamp: (id) => set((state) => ({ stamps: state.stamps.filter(s => s.id !== id) })),
    
    hitFeedback: initialHitFeedback,
    timingOffset: 0,
    showTimingDisplay: false,
    setHitFeedback: (feedback) => set({ hitFeedback: feedback }),
    setTimingOffset: (offset) => set({ timingOffset: offset }),
    setShowTimingDisplay: (show) => set({ showTimingDisplay: show }),
    
    totalNotes: 0,
    perfectNotes: 0,
    goodNotes: 0,
    almostNotes: 0,
    missedNotes: 0,
    totalNotesProcessed: 0,
    accuracy: 0,
    setTotalNotes: (count) => set({ totalNotes: count }),
    setPerfectNotes: (count) => set({ perfectNotes: count }),
    setGoodNotes: (count) => set({ goodNotes: count }),
    setAlmostNotes: (count) => set({ almostNotes: count }),
    setMissedNotes: (count) => set({ missedNotes: count }),
    setTotalNotesProcessed: (count) => set({ totalNotesProcessed: count }),
    incrementTotalNotes: () => set((state) => ({ totalNotes: state.totalNotes + 1 })),
    incrementPerfectNotes: () => set((state) => ({ perfectNotes: state.perfectNotes + 1 })),
    incrementGoodNotes: () => set((state) => ({ goodNotes: state.goodNotes + 1 })),
    incrementAlmostNotes: () => set((state) => ({ almostNotes: state.almostNotes + 1 })),
    incrementMissedNotes: () => set((state) => ({ missedNotes: state.missedNotes + 1 })),
    incrementTotalNotesProcessed: () => set((state) => ({ totalNotesProcessed: state.totalNotesProcessed + 1 })),
    
    isGameOver: false,
    gameComplete: false,
    setIsGameOver: (gameOver) => {
      if (gameOver) {
        set({ isGameOver: true, fallingLetters: [], stamps: [] });
      } else {
        set({ isGameOver: false });
      }
    },
    setGameComplete: (complete) => set({ gameComplete: complete }),
    
    resetGame: () => set({
      score: 0,
      combo: 0,
      maxCombo: 0,
      health: 100,
      timeLeft: get().gameConfig.timeLimit,
      fallingLetters: [],
      heldKeys: new Set(),
      stamps: [],
      hitFeedback: initialHitFeedback,
      timingOffset: 0,
      showTimingDisplay: false,
      totalNotes: 0,
      perfectNotes: 0,
      goodNotes: 0,
      almostNotes: 0,
      missedNotes: 0,
      totalNotesProcessed: 0,
      isGameOver: false,
      gameComplete: false
    }),
    
    calculateAccuracy: () => {
      const state = get()
      const totalProcessed = state.totalNotesProcessed
      return totalProcessed > 0 ? ((state.perfectNotes + state.goodNotes + state.almostNotes) / totalProcessed) * 100 : 0
    }
  }))
)

export const useAccuracy = () => useGameStore((state) => state.calculateAccuracy())
export const useIsTimeMode = () => useGameStore((state) => 
  state.gameConfig.subMode === 'time' || state.gameConfig.timeLimit !== -1
)
export const useIsScoreMode = () => useGameStore((state) => 
  state.gameConfig.subMode === 'score'
)
export const useIsCareerMode = () => useGameStore((state) => 
  state.gameConfig.mode === 'career'
)