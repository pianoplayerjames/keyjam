// src/Game.tsx
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
import Stamp from './Stamp' // Import the new Stamp component

const letters = '12345'
const channelPositions = [-2, -1, 0, 1, 2]
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0'];
const bpm = 120
const beatInterval = 60 / bpm

const hitZoneCenter = 2.0;
const windows = { perfect: 0.2, good: 0.375, almost: 0.6 };

const singleNotesOnly = true;


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
}

interface HitFeedbackState {
  text: string;
  color: string;
  key: number;
}

// Add an interface for the stamp's state
interface StampState {
  id: number;
  position: [number, number, number];
  color: string;
}

const GameLogic = ({ setFallingLetters, setHitFeedback, heldKeys, setScore, setCombo, setHealth }: {
  setFallingLetters: React.Dispatch<React.SetStateAction<Letter[]>>,
  setHitFeedback: React.Dispatch<React.SetStateAction<HitFeedbackState>>,
  heldKeys: Set<string>,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  setCombo: React.Dispatch<React.SetStateAction<number>>,
  setHealth: React.Dispatch<React.SetStateAction<number>>,
}) => {
  const moveSpeed = useRef(4);
  const acceleration = 0.075;

  useFrame((state, delta) => {
    moveSpeed.current += acceleration * delta;

    const shrinkSpeed = 8;
    const holdScoreRate = 25;
    let scoreToAddThisFrame = 0;

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

        newLetter.position = [newLetter.position[0], newLetter.position[1], newLetter.position[2] + moveSpeed.current * delta];

        if (newLetter.isMissed) {
            const newDuration = Math.max(0, (newLetter.duration || 0) - shrinkSpeed * delta);
            newLetter.duration = newDuration;
        } else {
            const noteBackZ = newLetter.position[2] - 1.4 - (newLetter.duration || 0);
            const hitBoxEnd = hitZoneCenter + windows.almost;
            if (noteBackZ > hitBoxEnd) {
                const isLongNote = (newLetter.duration ?? 0) > 0.5;
                if (!isLongNote) {
                    setHitFeedback(prev => ({ text: 'MISSED', color: '#f44336', key: prev.key + 1 }));
                    setCombo(0); // Reset combo on miss
                    setHealth(prev => Math.max(0, prev - 15)); // Decrease health
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

const Spawner = ({ setFallingLetters }: { setFallingLetters: React.Dispatch<React.SetStateAction<Letter[]>> }) => {
    const spawnTimer = useRef(0);
    const channelCooldowns = useRef<{ [key: number]: number }>({});

    useFrame((state, delta) => {
        const now = state.clock.getElapsedTime();
        spawnTimer.current += delta;

        if (spawnTimer.current > beatInterval) {
            spawnTimer.current -= beatInterval;

            setFallingLetters((prev) => {
                const lastSpawnTimes: { [key: number]: number } = {};
                prev.forEach(letter => {
                    const channelIdx = channelPositions.indexOf(letter.position[0]);
                    if (channelIdx !== -1) {
                        if (!lastSpawnTimes[channelIdx] || letter.spawnTime > lastSpawnTimes[channelIdx]) {
                            lastSpawnTimes[channelIdx] = letter.spawnTime;
                        }
                    }
                });

                const availableChannels = channelPositions.map((_, index) => index).filter(channelIdx => {
                    const timeSinceLast = now - (lastSpawnTimes[channelIdx] || 0);
                    if (lastSpawnTimes[channelIdx] && timeSinceLast < beatInterval * 1.5) {
                        return false;
                    }
                    const cooldownEnd = channelCooldowns.current[channelIdx];
                    if (cooldownEnd && now < cooldownEnd) {
                        return false;
                    }
                    return true;
                });
                
                const willSpawnChord = !singleNotesOnly && Math.random() < 0.2 && availableChannels.length >= 2;

                if (willSpawnChord) {
                    const shuffled = availableChannels.sort(() => 0.5 - Math.random());
                    const [chIndex1, chIndex2] = [shuffled[0], shuffled[1]];
                    const spawnTime = now;
                    const duration = singleNotesOnly ? 0 : 0.5;

                    const newNote1: Letter = { id: Math.random(), letter: letters[chIndex1], position: [channelPositions[chIndex1], 0.02, -20], duration, color: channelColors[chIndex1], spawnTime, opacity: 1 };
                    const newNote2: Letter = { id: Math.random(), letter: letters[chIndex2], position: [channelPositions[chIndex2], 0.02, -20], duration, color: channelColors[chIndex2], spawnTime, opacity: 1 };
                    
                    const cooldownDuration = beatInterval * 2;
                    channelCooldowns.current[chIndex1] = now + cooldownDuration;
                    channelCooldowns.current[chIndex2] = now + cooldownDuration;

                    return [...prev, newNote1, newNote2];
                } else if (availableChannels.length >= 1) {
                    const channelIndex = availableChannels[Math.floor(Math.random() * availableChannels.length)];
                    const xPosition = channelPositions[channelIndex];
                    const newLetter: Letter = { id: Math.random(), letter: letters[channelIndex], position: [xPosition, 0.02, -20], duration: singleNotesOnly ? 0 : 0.5, color: channelColors[channelIndex], spawnTime: now, opacity: 1 };
                    
                    if (!singleNotesOnly) {
                        const notesInChannel = prev.filter(l => l.position[0] === xPosition);
                        if (notesInChannel.length > 0) {
                            const lastNoteInChannel = notesInChannel.sort((a, b) => b.spawnTime - a.spawnTime)[0];
                            const timeSinceLastNote = now - lastNoteInChannel.spawnTime;
                            const maxTimeBetweenNotes = beatInterval * 4;

                            if (timeSinceLastNote > 0 && timeSinceLastNote < maxTimeBetweenNotes) {
                                const updatedPrev = [...prev];
                                const lastNoteIndex = updatedPrev.findIndex(l => l.id === lastNoteInChannel.id);
                                if (lastNoteIndex !== -1) {
                                    const trailDurationValue = timeSinceLastNote * 6;
                                    updatedPrev[lastNoteIndex] = { ...updatedPrev[lastNoteIndex], duration: trailDurationValue };
                                    
                                    const trailDurationInSeconds = trailDurationValue / 6;
                                    channelCooldowns.current[channelIndex] = now + trailDurationInSeconds;
                                    
                                    return [...updatedPrev, newLetter];
                                }
                            }
                        }
                    }
                    return [...prev, newLetter];
                }
                
                return prev;
            });
        }
    });

    return null;
}

const Game = () => {
  const [fallingLetters, setFallingLetters] = useState<Letter[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0);
  const [health, setHealth] = useState(100);
  const [heldKeys, setHeldKeys] = useState<Set<string>>(new Set());
  const [hitFeedback, setHitFeedback] = useState<HitFeedbackState>({ text: '', color: '', key: 0 });
  const [stamps, setStamps] = useState<StampState[]>([]); // Add state for stamps

  // Function to remove a stamp by its ID
  const removeStamp = (id: number) => {
    setStamps(prev => prev.filter(stamp => stamp.id !== id));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || health <= 0) return;
      const pressedLetter = event.key.toLowerCase();
      
      const channelIndex = letters.indexOf(pressedLetter);
      if (channelIndex === -1) return; // Key is not part of the game controls
      const xPosition = channelPositions[channelIndex];

      setHeldKeys(prev => new Set(prev).add(pressedLetter));
      
      const hitBoxStart = hitZoneCenter - windows.almost;
      const hitBoxEnd = hitZoneCenter + windows.almost;

      const hittableNotes = fallingLetters.filter(l => {
        const noteFront = l.position[2] - 0.2;
        const noteBack = l.position[2] - 1.4 - (l.duration || 0);
        const isOverlapping = noteFront >= hitBoxStart && noteBack <= hitBoxEnd;

        return l.letter === pressedLetter &&
               !l.isMissed && !l.isHit && !l.isBeingHeld &&
               isOverlapping;
      });

      if (hittableNotes.length > 0) {
        const closestLetter = hittableNotes.sort((a, b) => Math.abs(a.position[2] - hitZoneCenter) - Math.abs(b.position[2] - hitZoneCenter))[0];
        
        const noteFront = closestLetter.position[2] - 0.2;
        const noteBack = closestLetter.position[2] - 1.4 - (closestLetter.duration || 0);
        const hitBoxHeight = windows.almost * 2;

        const overlap = Math.max(0, Math.min(noteFront, hitBoxEnd) - Math.max(noteBack, hitBoxStart));
        const coverageRatio = overlap / hitBoxHeight;

        let feedbackText = '';
        let feedbackColor = '';
        let stampColor = ''; // New variable for the stamp's color
        let scoreToAdd = 0;
        const maxScore = 10;

        scoreToAdd = Math.floor(maxScore * coverageRatio);

        // Determine stamp color based on accuracy
        if (coverageRatio >= 0.95) {
            feedbackText = 'PERFECT!';
            feedbackColor = '#00e676';
            stampColor = '#00e676'; // Green for perfect
        } else if (coverageRatio >= 0.5) {
            feedbackText = 'GOOD';
            feedbackColor = '#29b6f6';
            stampColor = '#ffc107'; // Orange for good
        } else {
            feedbackText = 'ALMOST';
            feedbackColor = '#ffc107';
            stampColor = '#ffeb3b'; // Yellow for almost
        }
        
        // Create a new stamp for the successful hit
        const stampPosition: [number, number, number] = [closestLetter.position[0], 0.1, closestLetter.position[2] - 0.2];
        setStamps(prev => [...prev, { id: Math.random(), position: stampPosition, color: stampColor }]);

        setHitFeedback(prev => ({ text: feedbackText, color: feedbackColor, key: prev.key + 1 }));
        setScore(prev => prev + scoreToAdd);
        const newCombo = combo + 1;
        setCombo(newCombo);
        setHealth(prev => Math.min(100, prev + 2 + newCombo * 0.1));

        const isLongNote = (closestLetter.duration ?? 0) > 0.5;
        if (isLongNote) {
            setFallingLetters(prev => prev.map(l => l.id === closestLetter.id ? { ...l, isBeingHeld: true, isHit: false } : l));
        } else {
            setFallingLetters(prev => prev.map(l => l.id === closestLetter.id ? { ...l, isHit: true } : l));
        }

      } else {
        const upcomingNotes = fallingLetters.filter(l =>
            l.letter === pressedLetter &&
            !l.isMissed && !l.isHit && !l.isBeingHeld &&
            (l.position[2] - 0.2) < hitBoxStart
        );

        if (upcomingNotes.length > 0) {
            setHitFeedback(prev => ({ text: 'EARLY', color: '#ffeb3b', key: prev.key + 1 }));
        }
        
        // Create a red stamp for a miss or empty channel press
        const stampPosition: [number, number, number] = [xPosition, 0.1, hitZoneCenter];
        setStamps(prev => [...prev, { id: Math.random(), position: stampPosition, color: '#f44336' }]);
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
  }, [fallingLetters, health, combo]);

  return (
    <>
      <HealthUI score={score} combo={combo} health={health} />
      {health <= 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '4em', zIndex: 1, textAlign: 'center' }}>
          GAME OVER
          <button onClick={() => {
            setScore(0);
            setCombo(0);
            setHealth(100);
            setFallingLetters([]);
          }} style={{ fontSize: '0.5em', padding: '10px 20px', marginTop: '20px' }}>
            Restart
          </button>
        </div>
      )}
      <Canvas camera={{ position: [0, 2.5, 5], fov: 75 }}>
        <GameLogic setFallingLetters={setFallingLetters} setHitFeedback={setHitFeedback} heldKeys={heldKeys} setScore={setScore} setCombo={setCombo} setHealth={setHealth} />
        <Spawner setFallingLetters={setFallingLetters} />
        <Suspense fallback={null}>
          <color attach="background" args={['#191919']} />
          <GradientBackground combo={combo} />
          <FloatingShapes />
          <ambientLight intensity={0.8} />

          <Veronica position={[-4.5, -1.5, 0]} scale={1.5} rotation={[0, 0.5, 0]} />

          <FeedbackText3D feedback={hitFeedback} />
          <Fretboard 
            heldKeys={heldKeys} 
            letters={letters} 
            channelPositions={channelPositions} 
            channelColors={channelColors}
          />
          <SparklesEffect heldKeys={heldKeys} letters={letters} channelPositions={channelPositions} channelColors={channelColors} />
          
          {/* Render all active stamps */}
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