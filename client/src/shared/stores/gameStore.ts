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

// Update the initialCareerState in client/src/shared/stores/gameStore.ts

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
        { name: 'Hit the Beat', rank: null, unlocked: false, difficulty: 5, timeLimit: 90, scoreTarget: 750, lanes: 3, tutorial: { type: 'standard' } },
      ]
    },
    { 
      name: 'The Beginning', 
      unlocked: false, 
      completion: 0, 
      levels: [
        { name: 'First Steps', rank: null, unlocked: false, difficulty: 8, timeLimit: 90, scoreTarget: 1000, lanes: 4 },
        { name: 'Rhythm Basics', rank: null, unlocked: false, difficulty: 12, timeLimit: 120, scoreTarget: 1500, lanes: 4 },
        { name: 'Simple Patterns', rank: null, unlocked: false, difficulty: 16, timeLimit: 120, scoreTarget: 2000, lanes: 5 },
        { name: 'Getting Comfortable', rank: null, unlocked: false, difficulty: 20, timeLimit: 150, scoreTarget: 2500, lanes: 5 },
      ]
    },
    { 
      name: 'Ascension', 
      unlocked: false, 
      completion: 0, 
      levels: [
        { name: 'Chord Training', rank: null, unlocked: false, difficulty: 25, timeLimit: 150, scoreTarget: 3000, lanes: 5 },
        { name: 'Off-beat Hits', rank: null, unlocked: false, difficulty: 30, timeLimit: 150, scoreTarget: 4000, lanes: 5 },
        { name: 'Pattern Recognition', rank: null, unlocked: false, difficulty: 35, timeLimit: 180, scoreTarget: 5000, lanes: 5 },
        { name: 'Next Level', rank: null, unlocked: false, difficulty: 40, timeLimit: 180, scoreTarget: 6000, lanes: 6 },
      ] 
    },
    {
      name: 'Mastery',
      unlocked: false,
      completion: 0,
      levels: [
        { name: 'Complex Rhythms', rank: null, unlocked: false, difficulty: 45, timeLimit: 200, scoreTarget: 8000, lanes: 6 },
        { name: 'Multi-Lane Madness', rank: null, unlocked: false, difficulty: 50, timeLimit: 200, scoreTarget: 10000, lanes: 7 },
        { name: 'Precision Required', rank: null, unlocked: false, difficulty: 55, timeLimit: 220, scoreTarget: 12000, lanes: 7 },
        { name: 'Advanced Techniques', rank: null, unlocked: false, difficulty: 60, timeLimit: 240, scoreTarget: 15000, lanes: 8 },
      ]
    },
    {
      name: 'Lightning Speed',
      unlocked: false,
      completion: 0,
      levels: [
        { name: 'Speed Demon', rank: null, unlocked: false, difficulty: 65, timeLimit: 180, scoreTarget: 18000, lanes: 8 },
        { name: 'Rapid Fire', rank: null, unlocked: false, difficulty: 70, timeLimit: 200, scoreTarget: 22000, lanes: 8 },
        { name: 'Blur of Notes', rank: null, unlocked: false, difficulty: 75, timeLimit: 220, scoreTarget: 25000, lanes: 8 },
        { name: 'Supersonic', rank: null, unlocked: false, difficulty: 80, timeLimit: 240, scoreTarget: 30000, lanes: 8 },
      ]
    },
    {
      name: 'Conquest',
      unlocked: false,
      completion: 0,
      levels: [
        { name: 'Unforgiving', rank: null, unlocked: false, difficulty: 82, timeLimit: 200, scoreTarget: 35000, lanes: 8 },
        { name: 'Merciless', rank: null, unlocked: false, difficulty: 84, timeLimit: 220, scoreTarget: 40000, lanes: 8 },
        { name: 'Ruthless', rank: null, unlocked: false, difficulty: 86, timeLimit: 240, scoreTarget: 45000, lanes: 8 },
        { name: 'Domination', rank: null, unlocked: false, difficulty: 88, timeLimit: 300, scoreTarget: 50000, lanes: 8 },
      ]
    },
    {
      name: 'Transcendence', 
      unlocked: false,
      completion: 0,
      levels: [
        { name: 'Beyond Human', rank: null, unlocked: false, difficulty: 90, timeLimit: 250, scoreTarget: 60000, lanes: 8 },
        { name: 'Perfect Machine', rank: null, unlocked: false, difficulty: 92, timeLimit: 280, scoreTarget: 70000, lanes: 8 },
        { name: 'Rhythm God', rank: null, unlocked: false, difficulty: 94, timeLimit: 300, scoreTarget: 80000, lanes: 8 },
        { name: 'Immortal Legend', rank: null, unlocked: false, difficulty: 96, timeLimit: 350, scoreTarget: 100000, lanes: 8 },
      ]
    },
    {
      name: 'Infinity',
      unlocked: false,
      completion: 0,
      levels: [
        { name: 'Frame Perfect', rank: null, unlocked: false, difficulty: 97, timeLimit: 300, scoreTarget: 120000, lanes: 8 },
        { name: 'Impossibility', rank: null, unlocked: false, difficulty: 98, timeLimit: 350, scoreTarget: 150000, lanes: 8 },
        { name: 'The Final Test', rank: null, unlocked: false, difficulty: 99, timeLimit: 400, scoreTarget: 200000, lanes: 8 },
        { name: 'Eternal Rhythm', rank: null, unlocked: false, difficulty: 100, timeLimit: 500, scoreTarget: 500000, lanes: 8 },
      ]
    }
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
  
  // Update level rank if better
  if (!level.rank || gradeOrder[newGrade] > gradeOrder[level.rank]) {
      level.rank = newGrade;
  }
  
  // Unlock next level in current chapter
  if (gradeOrder[newGrade] >= 1) { // D or better
    const nextLevelIndex = levelIndex + 1;
    if (nextLevelIndex < career.chapters[chapterIndex].levels.length) {
        career.chapters[chapterIndex].levels[nextLevelIndex].unlocked = true;
    } else {
        // Check if we should unlock the next chapter
        const currentChapter = career.chapters[chapterIndex];
        const allLevelsCompleted = currentChapter.levels.every(l => l.rank !== null);
        
        if (allLevelsCompleted && chapterIndex + 1 < career.chapters.length) {
            // Different requirements for different chapters
            let shouldUnlock = false;
            const avgGrade = currentChapter.levels.reduce((sum, l) => sum + gradeOrder[l.rank!], 0) / currentChapter.levels.length;
            
            switch (chapterIndex) {
              case 0: // Tutorial -> Beginning (need C average)
                shouldUnlock = avgGrade >= 2;
                break;
              case 1: // Beginning -> Ascension (need C average) 
                shouldUnlock = avgGrade >= 2;
                break;
              case 2: // Ascension -> Mastery (need B average)
                shouldUnlock = avgGrade >= 3;
                break;
              case 3: // Mastery -> Lightning Speed (need B average)
                shouldUnlock = avgGrade >= 3;
                break;
              case 4: // Lightning Speed -> Conquest (need A average)
                shouldUnlock = avgGrade >= 4;
                break;
              case 5: // Conquest -> Transcendence (need S average)
                shouldUnlock = avgGrade >= 5;
                break;
              case 6: // Transcendence -> Infinity (need all S ranks)
                shouldUnlock = currentChapter.levels.every(l => l.rank === 'S');
                break;
              default:
                shouldUnlock = false;
            }
            
            if (shouldUnlock) {
                career.chapters[chapterIndex + 1].unlocked = true;
                if (career.chapters[chapterIndex + 1].levels.length > 0) {
                    career.chapters[chapterIndex + 1].levels[0].unlocked = true;
                }
            }
        }
    }
  }
  
  // Calculate chapter completion
  career.chapters.forEach((chapter: CareerChapter) => {
    const chapterLevels = chapter.levels.length;
    const chapterCompletedLevels = chapter.levels.filter(l => l.rank !== null).length;
    chapter.completion = chapterLevels > 0 ? (chapterCompletedLevels / chapterLevels) * 100 : 0;
  });
  
  // Calculate overall completion and rank progression
  let totalLevels = 0;
  let completedLevels = 0;
  career.chapters.forEach((chapter: CareerChapter) => {
    totalLevels += chapter.levels.length;
    completedLevels += chapter.levels.filter(l => l.rank !== null).length;
  });
  
  career.overallCompletion = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;
  
  // Update rank based on progress and performance
  const ranks = [
    { name: 'Rookie', icon: '🎓', threshold: 0 },
    { name: 'Amateur', icon: '🌱', threshold: 5 },
    { name: 'Novice', icon: '🎵', threshold: 12 },
    { name: 'Skilled', icon: '🎯', threshold: 25 },
    { name: 'Expert', icon: '⭐', threshold: 40 },
    { name: 'Master', icon: '💎', threshold: 60 },
    { name: 'Grandmaster', icon: '👑', threshold: 80 },
    { name: 'Legend', icon: '🏆', threshold: 95 },
    { name: 'Mythical', icon: '🌟', threshold: 99 },
    { name: 'Eternal', icon: '♾️', threshold: 100 }
  ];
  
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (career.overallCompletion >= ranks[i].threshold) {
      career.currentRank = ranks[i].name;
      career.currentRankIcon = ranks[i].icon;
      career.nextRank = i < ranks.length - 1 ? ranks[i + 1].name : 'Maximum';
      
      const currentThreshold = ranks[i].threshold;
      const nextThreshold = i < ranks.length - 1 ? ranks[i + 1].threshold : 100;
      const progressInCurrentRank = career.overallCompletion - currentThreshold;
      const totalRankRange = nextThreshold - currentThreshold;
      career.progressToNextRank = totalRankRange > 0 ? (progressInCurrentRank / totalRankRange) * 100 : 100;
      break;
    }
  }
  
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