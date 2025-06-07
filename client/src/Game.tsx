import { useEffect, useState, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import FallingLetter from './FallingLetter'
import Fretboard from './Fretboard'
import GradientBackground from './GradientBackground'
import SparklesEffect from './SparklesEffect'
import FeedbackText3D from './FeedbackText3D'
import FloatingShapes from './FloatingShapes'
import { Veronica } from './Veronica'
import HealthUI from './HealthUI'
import TimeUI from './TimeUI'
import ComplexityUI from './ComplexityUI'
import HitZoneIndicator from './HitZoneIndicator'
import TimingDisplay from './TimingDisplay'
import Stamp from './Stamp'
import ScoreChart from './ScoreChart'
import { ComplexityManager, type PatternNote } from './ComplexityManager'

const letters = '12345'
const channelPositions = [-2, -1, 0, 1, 2]
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0'];
const baseBpm = 120

interface GameConfig {
  mode: string;
  subMode: string;
  difficulty: number;
  timeLimit: number;
  scoreTarget: number;
}

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

interface HitFeedbackState {
  text: string;
  color: string;
  key: number;
}

interface StampState {
  id: number;
  position: [number, number, number];
  color: string;
}

interface HitResult {
  accuracy: 'perfect' | 'good' | 'almost' | 'miss';
  timingOffset: number;
  score: number;
  feedback: string;
  color: string;
}

const calculateHitAccuracy = (
  notePosition: number, 
  hitZoneCenter: number, 
  complexity: number
): HitResult => {
  const config = ComplexityManager.getConfig(complexity);
  const distance = Math.abs(notePosition - hitZoneCenter);
  
  const perfectWindow = config.timingWindows.perfect * (complexity <= 30 ? 2 : complexity <= 60 ? 1.5 : 1);
  const goodWindow = config.timingWindows.good * (complexity <= 30 ? 1.8 : complexity <= 60 ? 1.3 : 1);
  const almostWindow = config.timingWindows.almost * (complexity <= 30 ? 1.5 : 1.2);
  
  const baseScore = 10 + (complexity / 10);
  const timingOffset = notePosition - hitZoneCenter;
  
  if (distance <= perfectWindow) {
    return {
      accuracy: 'perfect',
      timingOffset,
      score: Math.floor(baseScore * 2.5),
      feedback: distance <= perfectWindow * 0.3 ? 'PERFECT!' : 'EXCELLENT!',
      color: '#00e676'
    };
  } else if (distance <= goodWindow) {
    const goodness = 1 - ((distance - perfectWindow) / (goodWindow - perfectWindow));
    return {
      accuracy: 'good',
      timingOffset,
      score: Math.floor(baseScore * (1.5 + goodness * 0.5)),
      feedback: goodness > 0.7 ? 'GREAT!' : 'GOOD',
      color: '#29b6f6'
    };
  } else if (distance <= almostWindow) {
    const okness = 1 - ((distance - goodWindow) / (almostWindow - goodWindow));
    return {
      accuracy: 'almost',
      timingOffset,
      score: Math.floor(baseScore * (0.8 + okness * 0.4)),
      feedback: okness > 0.5 ? 'NICE' : 'ALMOST',
      color: '#ffc107'
    };
  } else {
    return {
      accuracy: 'miss',
      timingOffset,
      score: 0,
      feedback: distance < almostWindow * 2 ? 'CLOSE' : 'MISS',
      color: '#f44336'
    };
  }
};

const GameLogic = ({ 
  setFallingLetters, 
  setHitFeedback, 
  heldKeys, 
  setScore, 
  setCombo, 
  setHealth,
  complexity,
  setMissedNotes,
  setTotalNotesProcessed
}: {
  setFallingLetters: React.Dispatch<React.SetStateAction<Letter[]>>,
  setHitFeedback: React.Dispatch<React.SetStateAction<HitFeedbackState>>,
  heldKeys: Set<string>,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  setCombo: React.Dispatch<React.SetStateAction<number>>,
  setHealth: React.Dispatch<React.SetStateAction<number>>,
  complexity: number,
  setMissedNotes: React.Dispatch<React.SetStateAction<number>>,
  setTotalNotesProcessed: React.Dispatch<React.SetStateAction<number>>
}) => {
  const moveSpeed = useRef(4);
  const baseAcceleration = 0.075;

  useFrame((state, delta) => {
    const config = ComplexityManager.getConfig(complexity);
    const acceleration = baseAcceleration * config.speedMultiplier;
    moveSpeed.current += acceleration * delta;

    const shrinkSpeed = 8;
    const holdScoreRate = 25 * (1 + complexity / 100);
    let scoreToAddThisFrame = 0;

    const hitZoneCenter = 2.0;
    const maxWindow = config.timingWindows.almost * (complexity <= 30 ? 1.5 : 1.2);

    const nextFallingLetters = (prev: Letter[]) => prev.map(letter => {
        const newLetter = { ...letter };

        if (newLetter.isHit) {
            const newOpacity = Math.max(0, (newLetter.opacity ?? 1) - delta * 2.5);
            newLetter.opacity = newOpacity;
            newLetter.position = [newLetter.position[0], newLetter.position[1] + delta * 1.5, newLetter.position[2] + delta];
            return newLetter;
        }

        if (newLetter.isBeingHeld) {
            if (heldKeys.has(newLetter.letter)) {
                scoreToAddThisFrame += holdScoreRate * delta;
                const newDuration = Math.max(0, (newLetter.duration || 0) - shrinkSpeed * delta);
                newLetter.duration = newDuration;
            } else {
                newLetter.isBeingHeld = false;
            }
            return newLetter;
        }

        newLetter.position = [
          newLetter.position[0], 
          newLetter.position[1], 
          newLetter.position[2] + moveSpeed.current * delta
        ];

        if (newLetter.isMissed) {
            const newDuration = Math.max(0, (newLetter.duration || 0) - shrinkSpeed * delta);
            newLetter.duration = newDuration;
        } else {
            const noteCenter = newLetter.position[2] - 0.8;
            const noteHeight = 1.2 + (newLetter.duration || 0);
            const noteBack = noteCenter - noteHeight / 2;
            const hitBoxEnd = hitZoneCenter + maxWindow;
            
            if (noteBack > hitBoxEnd) {
                const isLongNote = (newLetter.duration ?? 0) > 0.5;
                if (!isLongNote && !newLetter.wasProcessed) {
                    setHitFeedback(prev => ({ text: 'MISSED', color: '#f44336', key: prev.key + 1 }));
                    setCombo(0);
                    setMissedNotes(prev => prev + 1);
                    setTotalNotesProcessed(prev => prev + 1);
                    newLetter.wasProcessed = true;
                    const healthPenalty = 10 + (complexity / 10);
                    setHealth(prev => Math.max(0, prev - healthPenalty));
                }
                newLetter.isMissed = true;
            }
        }

        return newLetter;
    }).filter(letter => {
        if (letter.isMissed && letter.position[2] > 6.4 + (letter.duration || 0)) return false;
        if (letter.isHit && (!letter.opacity || letter.opacity <= 0)) return false;
        return true;
    });

    setFallingLetters(nextFallingLetters);
    if (scoreToAddThisFrame > 0) {
      setScore(prev => prev + scoreToAddThisFrame);
    }
  });
  return null;
}

const ComplexitySpawner = ({ 
  setFallingLetters, 
  complexity,
  setTotalNotes,
  isGameOver
}: { 
  setFallingLetters: React.Dispatch<React.SetStateAction<Letter[]>>,
  complexity: number,
  setTotalNotes: React.Dispatch<React.SetStateAction<number>>,
  isGameOver: boolean
}) => {
  const beatTimer = useRef(0);
  const patternTimer = useRef(0);
  const currentPatternIndex = useRef(0);
  const generatedPattern = useRef<PatternNote[]>([]);
  const lastSpawnTimes = useRef<{ [key: number]: number }>({});
  const randomSpawnTimer = useRef(0);
  const currentMoveSpeed = useRef(4);
  const continuousSpawnTimer = useRef(0);

  useFrame((state, delta) => {
    // STOP SPAWNING IF GAME IS OVER
    if (isGameOver) return;
    
    const now = state.clock.getElapsedTime();
    const config = ComplexityManager.getConfig(complexity);
    
    const currentBpm = baseBpm * config.speedMultiplier;
    const beatInterval = 60 / currentBpm;
    
    const acceleration = 0.075 * config.speedMultiplier;
    currentMoveSpeed.current += acceleration * delta;
    
    beatTimer.current += delta;
    patternTimer.current += delta;
    randomSpawnTimer.current += delta;
    continuousSpawnTimer.current += delta;

    const baseContinuousInterval = complexity <= 20 ? 0.8 : 
                                  complexity <= 40 ? 1.2 : 
                                  complexity <= 60 ? 1.8 : 
                                  2.5;
    const continuousInterval = baseContinuousInterval / config.speedMultiplier;

    if (patternTimer.current > beatInterval * 8 || generatedPattern.current.length === 0) {
      patternTimer.current = 0;
      generatedPattern.current = ComplexityManager.generatePattern(complexity, 2);
      currentPatternIndex.current = 0;
    }

    let spawnedThisFrame = false;

    const currentPattern = generatedPattern.current;
    if (currentPatternIndex.current < currentPattern.length) {
      const nextNote = currentPattern[currentPatternIndex.current];
      const targetTime = nextNote.timing * beatInterval;
      
      if (beatTimer.current >= targetTime) {
        currentPatternIndex.current++;
        
        setFallingLetters((prev) => {
          const newNotes: Letter[] = [];
          
          nextNote.channels.forEach(channelIndex => {
            const timeSinceLastSpawn = now - (lastSpawnTimes.current[channelIndex] || 0);
            const minInterval = beatInterval / (complexity > 70 ? 8 : 4);
            
            if (timeSinceLastSpawn >= minInterval) {
              const isHoldNote = nextNote.type === 'hold' || 
                               (nextNote.duration && nextNote.duration > 0.5);
              
              const newLetter: Letter = {
                id: Math.random(),
                letter: letters[channelIndex],
                position: [channelPositions[channelIndex], 0.02, -20 * config.fadeInTime],
                duration: isHoldNote ? (nextNote.duration || config.holdNoteComplexity * 2) : 0,
                color: channelColors[channelIndex],
                spawnTime: now,
                opacity: 1,
                complexityType: nextNote.type,
                wasProcessed: false
              };
              
              newNotes.push(newLetter);
              lastSpawnTimes.current[channelIndex] = now;
              spawnedThisFrame = true;
            }
          });
          
          if (newNotes.length > 0) {
            setTotalNotes(prev => prev + newNotes.length);
          }
          
          return [...prev, ...newNotes];
        });
      }
    }

    const randomSpawnInterval = beatInterval / Math.max(1 + config.spawnProbability, 0.5);
    if (randomSpawnTimer.current >= randomSpawnInterval) {
      randomSpawnTimer.current = 0;
      
      if (Math.random() < config.spawnProbability) {
        const availableChannels = channelPositions.map((_, i) => i).filter(i => {
          const timeSinceLastSpawn = now - (lastSpawnTimes.current[i] || 0);
          return timeSinceLastSpawn >= beatInterval / 4;
        });

        if (availableChannels.length > 0) {
          const notesToSpawn = Math.min(
            Math.floor(Math.random() * config.maxSimultaneousNotes) + 1,
            availableChannels.length
          );

          setFallingLetters((prev) => {
            const newNotes: Letter[] = [];
            const shuffledChannels = availableChannels.sort(() => 0.5 - Math.random());

            for (let i = 0; i < notesToSpawn; i++) {
              const channelIndex = shuffledChannels[i];
              
              const timing = Math.random() < config.offBeatProbability ? 
                beatInterval * 0.5 : 0;

              const newLetter: Letter = {
                id: Math.random(),
                letter: letters[channelIndex],
                position: [
                  channelPositions[channelIndex], 
                  0.02, 
                  -20 * config.fadeInTime - timing * currentMoveSpeed.current
                ],
                duration: Math.random() < config.holdNoteComplexity ? 0.5 + Math.random() * 2 : 0,
                color: channelColors[channelIndex],
                spawnTime: now,
                opacity: 1,
                complexityType: 'random',
                wasProcessed: false
              };
              
              newNotes.push(newLetter);
              lastSpawnTimes.current[channelIndex] = now;
              spawnedThisFrame = true;
            }

            if (newNotes.length > 0) {
              setTotalNotes(prev => prev + newNotes.length);
            }

            return [...prev, ...newNotes];
          });
        }
      }
    }

    if (!spawnedThisFrame && continuousSpawnTimer.current >= continuousInterval) {
      continuousSpawnTimer.current = 0;
      
      const timeSinceAnySpawn = Math.min(...channelPositions.map((_, i) => now - (lastSpawnTimes.current[i] || 0)));
      const gapThreshold = complexity <= 20 ? 1.5 : 
                          complexity <= 40 ? 2.0 : 
                          complexity <= 60 ? 2.5 : 
                          3.0;
      
      if (timeSinceAnySpawn > gapThreshold) {
        const availableChannels = channelPositions.map((_, i) => i).filter(i => {
          const timeSinceLastSpawn = now - (lastSpawnTimes.current[i] || 0);
          return timeSinceLastSpawn >= 0.5;
        });

        if (availableChannels.length > 0) {
          const channelIndex = availableChannels[Math.floor(Math.random() * availableChannels.length)];
          
          setFallingLetters((prev) => {
            const newLetter: Letter = {
              id: Math.random(),
              letter: letters[channelIndex],
              position: [channelPositions[channelIndex], 0.02, -20 * config.fadeInTime],
              duration: 0,
              color: channelColors[channelIndex],
              spawnTime: now,
              opacity: 1,
              complexityType: 'continuous',
              wasProcessed: false
            };
            
            lastSpawnTimes.current[channelIndex] = now;
            setTotalNotes(prev => prev + 1);
            return [...prev, newLetter];
          });
        }
      }
    }
  });

  return null;
}

interface GameProps {
  gameConfig: GameConfig;
  onBackToMenu: () => void;
}

const Game = ({ gameConfig, onBackToMenu }: GameProps) => {
  const [fallingLetters, setFallingLetters] = useState<Letter[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0);
  const [health, setHealth] = useState(100);
  const [heldKeys, setHeldKeys] = useState<Set<string>>(new Set());
  const [hitFeedback, setHitFeedback] = useState<HitFeedbackState>({ text: '', color: '', key: 0 });
  const [stamps, setStamps] = useState<StampState[]>([]);
  const [complexity, setComplexity] = useState(gameConfig.difficulty);
  const [timingOffset, setTimingOffset] = useState(0);
  const [showTimingDisplay, setShowTimingDisplay] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameConfig.timeLimit);
  const [targetScore, setTargetScore] = useState(gameConfig.scoreTarget);
  const [gameComplete, setGameComplete] = useState(false);
  const [maxCombo, setMaxCombo] = useState(0);

  // New state for tracking detailed statistics
  const [totalNotes, setTotalNotes] = useState(0);
  const [perfectNotes, setPerfectNotes] = useState(0);
  const [goodNotes, setGoodNotes] = useState(0);
  const [almostNotes, setAlmostNotes] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [totalNotesProcessed, setTotalNotesProcessed] = useState(0);
  const [showScoreChart, setShowScoreChart] = useState(false);

  // Calculate accuracy - FIXED
  const accuracy = totalNotesProcessed > 0 ? ((perfectNotes + goodNotes + almostNotes) / totalNotesProcessed) * 100 : 0;

  // Game mode logic
  const isCareerMode = gameConfig.mode === 'career';
  const isTimeMode = gameConfig.subMode === 'time' || gameConfig.timeLimit !== -1;
  const isScoreMode = gameConfig.subMode === 'score';
  const isEndlessMode = gameConfig.timeLimit === -1;

  // Game over conditions - MOVED BEFORE useEffect
  const isGameOver = health <= 0 || gameComplete;

  // Track max combo
  useEffect(() => {
    if (combo > maxCombo) {
      setMaxCombo(combo);
    }
  }, [combo, maxCombo]);

  // Show score chart when game ends
  useEffect(() => {
    if (isGameOver) {
      setTimeout(() => setShowScoreChart(true), 1500);
    }
  }, [isGameOver]);

  // Timer logic for time-based modes
  useEffect(() => {
    if (isTimeMode && !isEndlessMode && timeLeft > 0 && health > 0 && !gameComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
    
    // Separate timer for career mode
    if (isCareerMode && timeLeft > 0 && health > 0 && !gameComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isTimeMode, isCareerMode, isEndlessMode, timeLeft, health, gameComplete]);

  // Score target logic
  useEffect(() => {
    if (isScoreMode && score >= targetScore) {
      setGameComplete(true);
    }
  }, [isScoreMode, score, targetScore]);

  const removeStamp = (id: number) => {
    setStamps(prev => prev.filter(stamp => stamp.id !== id));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || health <= 0 || gameComplete) return;
      const pressedLetter = event.key.toLowerCase();
      
      const channelIndex = letters.indexOf(pressedLetter);
      if (channelIndex === -1) return;
      const xPosition = channelPositions[channelIndex];

      setHeldKeys(prev => new Set(prev).add(pressedLetter));
      
      const hitZoneCenter = 2.0;
      const config = ComplexityManager.getConfig(complexity);
      
      const maxWindow = config.timingWindows.almost * (complexity <= 30 ? 1.5 : 1.2);
      const hitBoxStart = hitZoneCenter - maxWindow;
      const hitBoxEnd = hitZoneCenter + maxWindow;

      const hittableNotes = fallingLetters.filter(l => {
        const noteCenter = l.position[2] - 0.8;
        const noteHeight = 1.2 + (l.duration || 0);
        const noteFront = noteCenter + noteHeight / 2;
        const noteBack = noteCenter - noteHeight / 2;
        
        const overlaps = (noteFront >= hitBoxStart && noteBack <= hitBoxEnd) ||
                        (noteBack <= hitBoxEnd && noteFront >= hitBoxStart);

        return l.letter === pressedLetter &&
               !l.isMissed && !l.isHit && !l.isBeingHeld &&
               overlaps;
      });

      if (hittableNotes.length > 0) {
        const notesWithDistance = hittableNotes.map(note => ({
          note,
          distance: Math.abs((note.position[2] - 0.8) - hitZoneCenter)
        }));
        
        const { note: closestLetter } = notesWithDistance.reduce((closest, current) => 
          current.distance < closest.distance ? current : closest
        );
        
        const noteCenter = closestLetter.position[2] - 0.8;
        const hitResult = calculateHitAccuracy(noteCenter, hitZoneCenter, complexity);
        
        // Update statistics based on hit result
        setTotalNotesProcessed(prev => prev + 1);
        switch (hitResult.accuracy) {
          case 'perfect':
            setPerfectNotes(prev => prev + 1);
            break;
          case 'good':
            setGoodNotes(prev => prev + 1);
            break;
          case 'almost':
            setAlmostNotes(prev => prev + 1);
            break;
          case 'miss':
            setMissedNotes(prev => prev + 1);
            break;
        }
        
        setTimingOffset(hitResult.timingOffset);
        setShowTimingDisplay(true);
        setTimeout(() => setShowTimingDisplay(false), 1500);
        
        const stampPosition: [number, number, number] = [
          closestLetter.position[0], 
          0.1, 
          noteCenter
        ];
        setStamps(prev => [...prev, { 
          id: Math.random(), 
          position: stampPosition, 
          color: hitResult.color 
        }]);

        setHitFeedback(prev => ({ 
          text: hitResult.feedback, 
          color: hitResult.color, 
          key: prev.key + 1 
        }));
        
        setScore(prev => prev + hitResult.score);
        
        if (hitResult.accuracy !== 'miss') {
          const newCombo = combo + 1;
          setCombo(newCombo);
          
          const healthBonus = hitResult.accuracy === 'perfect' ? 5 + (complexity / 50) :
                             hitResult.accuracy === 'good' ? 3 + (complexity / 100) :
                             1 + (complexity / 200);
          setHealth(prev => Math.min(100, prev + healthBonus + (newCombo * 0.1)));
        } else {
          setCombo(0);
          const missPenalty = 3 + (complexity / 25);
          setHealth(prev => Math.max(0, prev - missPenalty));
        }

        const isLongNote = (closestLetter.duration ?? 0) > 0.5;
        if (isLongNote && hitResult.accuracy !== 'miss') {
          setFallingLetters(prev => prev.map(l => 
            l.id === closestLetter.id ? { ...l, isBeingHeld: true, isHit: false, wasProcessed: true } : l
          ));
        } else if (hitResult.accuracy !== 'miss') {
          setFallingLetters(prev => prev.map(l => 
            l.id === closestLetter.id ? { ...l, isHit: true, wasProcessed: true } : l
          ));
        }

      } else {
        const upcomingNotes = fallingLetters.filter(l =>
          l.letter === pressedLetter &&
          !l.isMissed && !l.isHit && !l.isBeingHeld &&
          (l.position[2] - 0.8) < hitBoxStart &&
          (l.position[2] - 0.8) > hitZoneCenter - maxWindow * 2
        );

        if (upcomingNotes.length > 0) {
          setHitFeedback(prev => ({ text: 'EARLY', color: '#ffeb3b', key: prev.key + 1 }));
          setTimingOffset(upcomingNotes[0].position[2] - 0.8 - hitZoneCenter);
          setShowTimingDisplay(true);
          setTimeout(() => setShowTimingDisplay(false), 1500);
        } else {
          setHitFeedback(prev => ({ text: 'MISS', color: '#f44336', key: prev.key + 1 }));
          setTimingOffset(0);
          setTotalNotesProcessed(prev => prev + 1);
          setMissedNotes(prev => prev + 1);
        }
        
        const stampPosition: [number, number, number] = [xPosition, 0.1, hitZoneCenter];
        setStamps(prev => [...prev, { 
          id: Math.random(), 
          position: stampPosition, 
          color: '#f44336' 
        }]);
        
        setCombo(0);
        const missPenalty = 3 + (complexity / 25);
        setHealth(prev => Math.max(0, prev - missPenalty));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const releasedLetter = event.key.toLowerCase();
      setHeldKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(releasedLetter);
        return newSet;
      });
      setFallingLetters(prev => prev.map(l => {
        if (l.letter === releasedLetter && l.isBeingHeld) {
          return { ...l, isBeingHeld: false };
        }
        return l;
      }));
    };

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
    }
  }, [fallingLetters, health, combo, complexity, gameComplete]);

  // Restart game function
  const handleRestart = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHealth(100);
    setTimeLeft(gameConfig.timeLimit);
    setFallingLetters([]);
    setStamps([]);
    setShowTimingDisplay(false);
    setGameComplete(false);
    setComplexity(gameConfig.difficulty);
    
    // Reset statistics
    setTotalNotes(0);
    setPerfectNotes(0);
    setGoodNotes(0);
    setAlmostNotes(0);
    setMissedNotes(0);
    setTotalNotesProcessed(0);
    setShowScoreChart(false);
  };

  // Handle score chart actions
  const handleScoreChartReplay = () => {
    setShowScoreChart(false);
    handleRestart();
  };

  const handleScoreChartBackToMenu = () => {
    setShowScoreChart(false);
    onBackToMenu();
  };

  // UI rendering logic
  const renderUI = () => {
    if (isTimeMode || isCareerMode) {
      return <TimeUI timeLeft={timeLeft} score={score} combo={combo} />;
    } else {
      return <HealthUI score={score} combo={combo} health={health} />;
    }
  };

  // Game completion title logic
  const getGameOverTitle = () => {
    if (health <= 0) return 'GAME OVER';
    if (isCareerMode) return 'RANK COMPLETED!';
    if (isTimeMode && timeLeft <= 0) return 'TIME COMPLETED!';
    if (isScoreMode) return 'TARGET REACHED!';
    return 'GAME COMPLETE!';
  };

  // Game stats for completion screen
  const getGameStats = () => {
    const stats = [
      `Final Score: ${Math.floor(score)}`,
      `Max Combo: ${maxCombo}`
    ];

    if (isTimeMode || isCareerMode) {
      const timeElapsed = gameConfig.timeLimit - timeLeft;
      const minutes = Math.floor(timeElapsed / 60);
const seconds = timeElapsed % 60;
     stats.push(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
   }

   if (isScoreMode) {
     stats.push(`Target: ${targetScore.toLocaleString()}`);
   }

   if (isCareerMode) {
     stats.push(`Difficulty: ${complexity}`);
   }

   return stats;
 };

 return (
   <>
     {renderUI()}
     
     {/* Only show complexity UI for practice modes */}
     {!isCareerMode && (
       <ComplexityUI 
         complexity={complexity} 
         onComplexityChange={setComplexity}
         showDetails={true}
       />
     )}
     
     {/* Show simplified game over screen first */}
     {isGameOver && !showScoreChart && (
       <div style={{ 
         position: 'absolute', 
         top: '50%', 
         left: '50%', 
         transform: 'translate(-50%, -50%)', 
         color: 'white', 
         fontSize: '4em', 
         zIndex: 1000, 
         textAlign: 'center',
         backgroundColor: 'rgba(0, 0, 0, 0.9)',
         padding: '30px',
         borderRadius: '15px',
         border: '3px solid #fff',
         maxWidth: '90vw'
       }}>
         <div style={{ 
           color: health <= 0 ? '#f44336' : '#4caf50',
           textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
         }}>
           {getGameOverTitle()}
         </div>
         
         <div style={{ 
           fontSize: '0.3em', 
           margin: '15px 0', 
           color: '#ccc',
           lineHeight: '1.4'
         }}>
           Calculating final score...
         </div>
       </div>
     )}

     {/* Score Chart */}
     <ScoreChart
       finalScore={score}
       maxCombo={maxCombo}
       totalNotes={totalNotesProcessed}
       perfectNotes={perfectNotes}
       goodNotes={goodNotes}
       almostNotes={almostNotes}
       missedNotes={missedNotes}
       accuracy={accuracy}
       onReplay={handleScoreChartReplay}
       onBackToMenu={handleScoreChartBackToMenu}
       isVisible={showScoreChart}
     />
     
     <Canvas camera={{ position: [0, 2.5, 5], fov: 75 }}>
       <GameLogic 
         setFallingLetters={setFallingLetters} 
         setHitFeedback={setHitFeedback} 
         heldKeys={heldKeys} 
         setScore={setScore} 
         setCombo={setCombo} 
         setHealth={setHealth}
         complexity={complexity}
         setMissedNotes={setMissedNotes}
         setTotalNotesProcessed={setTotalNotesProcessed}
       />
       <ComplexitySpawner 
         setFallingLetters={setFallingLetters} 
         complexity={complexity}
         setTotalNotes={setTotalNotes}
         isGameOver={isGameOver}
       />
       <Suspense fallback={null}>
         <color attach="background" args={['#191919']} />
         <GradientBackground combo={combo} />
         <FloatingShapes />
         <ambientLight intensity={0.8} />

         <Veronica position={[-4.5, -1.5, 0]} scale={1.5} rotation={[0, 0.5, 0]} />

         <FeedbackText3D feedback={hitFeedback} />
         <HitZoneIndicator complexity={complexity} />
         <TimingDisplay 
           timingOffset={timingOffset} 
           show={showTimingDisplay} 
           onComplete={() => setShowTimingDisplay(false)} 
         />
         
         <Fretboard 
           heldKeys={heldKeys} 
           letters={letters} 
           channelPositions={channelPositions} 
           channelColors={channelColors}
         />
         <SparklesEffect 
           heldKeys={heldKeys} 
           letters={letters} 
           channelPositions={channelPositions} 
           channelColors={channelColors} 
         />
         
         {stamps.map(stamp => (
           <Stamp
             key={stamp.id}
             id={stamp.id}
             position={stamp.position}
             color={stamp.color}
             onFadeOut={removeStamp}
           />
         ))}

         {fallingLetters.map(({ id, letter, position, duration, color, isMissed, opacity, isHit, isBeingHeld }) => (
           <FallingLetter
             key={id}
             id={id}
             letter={letter}
             position={position}
             duration={duration}
             color={color}
             isMissed={isMissed}
             opacity={opacity}
             isHit={isHit}
             isBeingHeld={isBeingHeld}
           />
         ))}
         
         <EffectComposer>
           <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
         </EffectComposer>
       </Suspense>
     </Canvas>
   </>
 )
}

export default Game;