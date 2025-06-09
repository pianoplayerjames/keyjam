import { create } from 'zustand'
import { subscribeWithSelector, persist } from 'zustand/middleware'

const STATE_VERSION = 2; // Increment this when making breaking state changes

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
  isPaused?: boolean
}

interface GameConfig {
  mode: string
  subMode: string
  difficulty: number
  timeLimit: number
  scoreTarget: number
  songId?: string;
  lanes: number;
  career?: {
    chapterIndex: number;
    levelIndex: number;
  }
  tutorial?: {
      type: 'waitForInput' | 'standard';
  }
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

interface TutorialPromptState {
    text: string;
    visible: boolean;
}

interface CareerLevel {
  name: string;
  rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | null;
  unlocked: boolean;
  difficulty: number;
  timeLimit: number;
  scoreTarget: number;
  lanes: number;
  tutorial?: { type: 'waitForInput' | 'standard' };
}

interface CareerChapter {
  name: string;
  unlocked: boolean;
  completion: number;
  levels: CareerLevel[];
}

interface CareerState {
  currentRank: string;
  currentRankIcon: string;
  nextRank: string;
  progressToNextRank: number;
  overallCompletion: number;
  chapters: CareerChapter[];
}

interface GameState {
  gameConfig: GameConfig
  setGameConfig: (config: Partial<GameConfig>) => void
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
  career: CareerState;
  updateCareerProgress: (chapterIndex: number, levelIndex: number, finalScore: number, accuracy: number) => void;
  resetCareer: () => void;
  tutorialPrompt: TutorialPromptState | null;
  setTutorialPrompt: (prompt: TutorialPromptState | null) => void;
  version: number;
}

const initialCareerState: CareerState = {
  currentRank: 'Rookie',
  currentRankIcon: '🎓',
  nextRank: 'Amateur',
  progressToNextRank: 0,
  overallCompletion: 0,
  chapters: [
    {
      name: 'Tutorial',
      unlocked: true,
      completion: 0,
      levels: [
        { name: 'First Press', rank: null, unlocked: true, difficulty: 1, timeLimit: -1, scoreTarget: 100, lanes: 1, tutorial: { type: 'waitForInput' } },
        { name: 'Basic Timing', rank: null, unlocked: false, difficulty: 3, timeLimit: 120, scoreTarget: 500, lanes: 2, tutorial: { type: 'standard' } },
      ]
    },
    { 
      name: 'The Beginning', 
      unlocked: false, 
      completion: 0, 
      levels: [
        { name: 'First Steps', rank: null, unlocked: false, difficulty: 5, timeLimit: 90, scoreTarget: 500, lanes: 4 },
        { name: 'Rhythm Basics', rank: null, unlocked: false, difficulty: 10, timeLimit: 120, scoreTarget: 1000, lanes: 5 },
        { name: 'Simple Patterns', rank: null, unlocked: false, difficulty: 15, timeLimit: 120, scoreTarget: 1500, lanes: 5 },
      ]
    },
    { 
      name: 'Ascension', 
      unlocked: false, 
      completion: 0, 
      levels: [
        { name: 'Chord Training', rank: null, unlocked: false, difficulty: 25, timeLimit: 150, scoreTarget: 2500, lanes: 5 },
        { name: 'Off-beat Hits', rank: null, unlocked: false, difficulty: 35, timeLimit: 150, scoreTarget: 3500, lanes: 5 },
        { name: 'Next Level', rank: null, unlocked: false, difficulty: 45, timeLimit: 180, scoreTarget: 5000, lanes: 5 },
      ] 
    },
  ]
};

export const useGameStore = create<GameState>()(
  persist(
    subscribeWithSelector((set, get) => ({
      version: STATE_VERSION,
      gameConfig: {
        mode: '',
        subMode: '',
        difficulty: 30,
        timeLimit: 120,
        scoreTarget: 1000,
        songId: undefined,
        lanes: 5,
      },
      setGameConfig: (config) => set(state => ({ gameConfig: { ...state.gameConfig, ...config } })),
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
      hitFeedback: { text: '', color: '', key: 0 },
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
        hitFeedback: { text: '', color: '', key: 0 },
        timingOffset: 0,
        showTimingDisplay: false,
        totalNotes: 0,
        perfectNotes: 0,
        goodNotes: 0,
        almostNotes: 0,
        missedNotes: 0,
        totalNotesProcessed: 0,
        isGameOver: false,
        gameComplete: false,
        tutorialPrompt: null,
      }),
      calculateAccuracy: () => {
        const state = get()
        const totalProcessed = state.totalNotesProcessed
        return totalProcessed > 0 ? ((state.perfectNotes + state.goodNotes + state.almostNotes) / totalProcessed) * 100 : 0
      },
      career: initialCareerState,
      resetCareer: () => set({ career: initialCareerState, version: STATE_VERSION }),
      updateCareerProgress: (chapterIndex, levelIndex, finalScore, accuracy) => {
        const state = get();
        const career = JSON.parse(JSON.stringify(state.career));
        const level = career.chapters[chapterIndex].levels[levelIndex];
        const getGrade = (acc: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' => {
          if (acc >= 95) return 'S';
          if (acc >= 90) return 'A';
          if (acc >= 80) return 'B';
          if (acc >= 70) return 'C';
          if (acc >= 60) return 'D';
          return 'F';
        };
        const newGrade = getGrade(accuracy);
        const gradeOrder = { 'F': 0, 'D': 1, 'C': 2, 'B': 3, 'A': 4, 'S': 5 };
        if (!level.rank || gradeOrder[newGrade] > gradeOrder[level.rank]) {
            level.rank = newGrade;
        }
        if (gradeOrder[newGrade] >= 1) {
            const nextLevelIndex = levelIndex + 1;
            if (nextLevelIndex < career.chapters[chapterIndex].levels.length) {
                career.chapters[chapterIndex].levels[nextLevelIndex].unlocked = true;
            } else {
                const nextChapterIndex = chapterIndex + 1;
                if (nextChapterIndex < career.chapters.length) {
                    career.chapters[nextChapterIndex].unlocked = true;
                    if (career.chapters[nextChapterIndex].levels.length > 0) {
                        career.chapters[nextChapterIndex].levels[0].unlocked = true;
                    }
                }
            }
        }
        let totalLevels = 0;
        let completedLevels = 0;
        career.chapters.forEach((chapter: CareerChapter) => {
            const chapterLevels = chapter.levels.length;
            totalLevels += chapterLevels;
            const chapterCompletedLevels = chapter.levels.filter(l => l.rank !== null).length;
            completedLevels += chapterCompletedLevels;
            chapter.completion = chapterLevels > 0 ? (chapterCompletedLevels / chapterLevels) * 100 : 0;
        });
        career.overallCompletion = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;
        career.progressToNextRank = (career.overallCompletion % 25) * 4;
        set({ career });
      },
      tutorialPrompt: null,
      setTutorialPrompt: (prompt) => set({ tutorialPrompt: prompt }),
    })),
    {
      name: 'keyjam-game-store',
      version: STATE_VERSION,
      partialize: (state) => ({
        career: state.career,
        version: state.version,
      }),
      migrate: (persistedState, version) => {
        if (version < STATE_VERSION) {
          return { ...get().getState(), career: initialCareerState, version: STATE_VERSION }
        }
        return persistedState as GameState;
      },
    }
  )
)