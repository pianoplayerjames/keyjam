// ReplayViewer.tsx - Updated to properly handle note reconstruction
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import FallingLetter from './FallingLetter';
import Fretboard from './Fretboard';
import GradientBackground from './GradientBackground';
import SparklesEffect from './SparklesEffect';
import FeedbackText3D from './FeedbackText3D';
import FloatingShapes from './FloatingShapes';
import { Veronica } from './Veronica';
import HealthUI from './HealthUI';
import TimeUI from './TimeUI';
import HitZoneIndicator from './HitZoneIndicator';
import TimingDisplay from './TimingDisplay';
import Stamp from './Stamp';
import { ReplayData } from './ReplayRecorder';

const letters = '12345';
const channelPositions = [-2, -1, 0, 1, 2];
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0'];

interface ReplayViewerProps {
  replayData: ReplayData;
  replayEngine: any;
}

interface ReplayGameState {
  score: number;
  combo: number;
  health: number;
  fallingLetters: any[];
  heldKeys: Set<string>;
  stamps: any[];
  hitFeedback: any;
  timingOffset: number;
  showTimingDisplay: boolean;
  complexity: number;
  timeLeft: number;
  currentFrame: number;
  moveSpeed: number;
}

const ReplayViewer: React.FC<ReplayViewerProps> = ({ replayData, replayEngine }) => {
  const [gameState, setGameState] = useState<ReplayGameState>({
    score: 0,
    combo: 0,
    health: 100,
    fallingLetters: [],
    heldKeys: new Set(),
    stamps: [],
    hitFeedback: { text: '', color: '', key: 0 },
    timingOffset: 0,
    showTimingDisplay: false,
    complexity: replayData.gameConfig.difficulty,
    timeLeft: replayData.gameConfig.timeLimit,
    currentFrame: 0,
    moveSpeed: 4
  });

  // Store all spawned notes with their spawn times
  const [allSpawnedNotes] = useState(() => {
    const notes = new Map();
    replayData.events.forEach(event => {
      if (event.type === 'note_spawn' && event.data.letter) {
        const note = {
          ...event.data.letter,
          spawnFrame: event.frame,
          spawnTime: event.timestamp,
          isActive: true
        };
        notes.set(event.data.letter.id, note);
      }
    });
    return notes;
  });

  useEffect(() => {
    const handleReplayUpdate = (update: any) => {
      switch (update.type) {
        case 'restore_keyframe':
          setGameState(prevState => ({
            ...prevState,
            ...update.data,
            heldKeys: new Set(update.data.heldKeys || []),
            moveSpeed: update.data.moveSpeed || 4
          }));
          break;
          
        case 'apply_event':
          const event = update.event;
          setGameState(prevState => {
            const newState = { ...prevState };
            
            switch (event.type) {
              case 'keydown':
                newState.heldKeys = new Set([...newState.heldKeys, event.data.key]);
                break;
                
              case 'keyup':
                newState.heldKeys = new Set([...newState.heldKeys].filter(k => k !== event.data.key));
                break;
                
              case 'note_hit':
                newState.score = event.data.score || newState.score;
                newState.combo = event.data.combo || newState.combo;
                newState.health = event.data.health || newState.health;
                newState.hitFeedback = {
                  text: event.data.hitResult?.feedback || event.data.feedback || 'HIT',
                  color: event.data.hitResult?.color || event.data.color || '#00e676',
                  key: prevState.hitFeedback.key + 1
                };
                if (event.data.timingOffset !== undefined) {
                  newState.timingOffset = event.data.timingOffset;
                  newState.showTimingDisplay = true;
                  setTimeout(() => {
                    setGameState(current => ({ ...current, showTimingDisplay: false }));
                  }, 1500);
                }
                if (event.data.stamp) {
                  newState.stamps = [...newState.stamps, {
                    ...event.data.stamp,
                    id: Math.random() // Ensure unique ID
                  }];
                }
                break;
                
              case 'note_miss':
                newState.combo = 0;
                newState.health = event.data.health || newState.health;
                newState.hitFeedback = {
                  text: 'MISS',
                  color: '#f44336',
                  key: prevState.hitFeedback.key + 1
                };
                if (event.data.stamp) {
                  newState.stamps = [...newState.stamps, {
                    ...event.data.stamp,
                    id: Math.random()
                  }];
                }
                break;
                
              case 'score_change':
                newState.score = event.data.score || newState.score;
                break;
                
              case 'combo_change':
                newState.combo = event.data.combo || newState.combo;
                break;
                
              case 'health_change':
                newState.health = event.data.health || newState.health;
                break;
            }
            
            return newState;
          });
          break;
          
        case 'update_frame':
          setGameState(prevState => {
            const currentFrame = update.frame;
            const currentTime = update.time;
            
            // Calculate which notes should be visible at this frame
            const visibleNotes = [];
            const frameRate = 60; // 60 FPS
            const moveSpeedPerFrame = 0.1; // Adjust this to match your game's move speed
            
            allSpawnedNotes.forEach((spawnedNote, noteId) => {
              // Calculate how many frames have passed since this note spawned
              const framesSinceSpawn = currentFrame - spawnedNote.spawnFrame;
              
              if (framesSinceSpawn >= 0) {
                // Calculate the note's current position
                const startZ = spawnedNote.position[2];
                const currentZ = startZ + (framesSinceSpawn * moveSpeedPerFrame);
                
                // Only show notes that are still on screen and haven't been processed
                if (currentZ < 10 && currentZ > -25) {
                  const note = {
                    ...spawnedNote,
                    position: [
                      spawnedNote.position[0],
                      spawnedNote.position[1],
                      currentZ
                    ]
                  };
                  
                  // Check if this note has been hit or missed by looking at events
                  const hitEvent = replayData.events.find(e => 
                    e.type === 'note_hit' && 
                    e.data.letter?.id === noteId && 
                    e.frame <= currentFrame
                  );
                  
                  const missEvent = replayData.events.find(e => 
                    e.type === 'note_miss' && 
                    e.data.letter?.id === noteId && 
                    e.frame <= currentFrame
                  );
                  
                  if (hitEvent) {
                    note.isHit = true;
                    note.opacity = Math.max(0, 1 - ((currentFrame - hitEvent.frame) / 60)); // Fade out over 1 second
                  } else if (missEvent) {
                    note.isMissed = true;
                  }
                  
                  // Check if note is being held
                  const isBeingHeld = prevState.heldKeys.has(note.letter) && 
                                    note.duration > 0 && 
                                    !note.isHit && 
                                    !note.isMissed;
                  note.isBeingHeld = isBeingHeld;
                  
                  visibleNotes.push(note);
                }
              }
            });
            
            return {
              ...prevState,
              currentFrame,
              fallingLetters: visibleNotes,
              // Clean up old stamps
              stamps: prevState.stamps.filter(stamp => {
                const age = currentFrame - (stamp.spawnFrame || currentFrame);
                return age < 30; // Remove stamps after 30 frames (0.5 seconds)
              })
            };
          });
          break;
          
        case 'initialize':
          setGameState({
            score: 0,
            combo: 0,
            health: 100,
            fallingLetters: [],
            heldKeys: new Set(),
            stamps: [],
            hitFeedback: { text: '', color: '', key: 0 },
            timingOffset: 0,
            showTimingDisplay: false,
            complexity: update.data.difficulty,
            timeLeft: update.data.timeLimit,
            currentFrame: 0,
            moveSpeed: 4
          });
          break;
      }
    };

    replayEngine.setStateUpdateCallback(handleReplayUpdate);
  }, [replayEngine, replayData.events, allSpawnedNotes]);

  const removeStamp = (id: number) => {
    setGameState(prevState => ({
      ...prevState,
      stamps: prevState.stamps.filter(stamp => stamp.id !== id)
    }));
  };

  // Render UI based on game mode
  const renderUI = () => {
    if (replayData.gameConfig.subMode === 'time' || replayData.gameConfig.mode === 'career') {
      return <TimeUI timeLeft={gameState.timeLeft} score={gameState.score} combo={gameState.combo} />;
    } else {
      return <HealthUI score={gameState.score} combo={gameState.combo} health={gameState.health} />;
    }
  };

  // Debug info to help troubleshoot
  console.log('Replay Debug:', {
    currentFrame: gameState.currentFrame,
    visibleNotes: gameState.fallingLetters.length,
    totalSpawnedNotes: allSpawnedNotes.size,
    heldKeys: Array.from(gameState.heldKeys),
    stamps: gameState.stamps.length
  });

  return (
    <>
      {renderUI()}
      
      {/* Replay Mode Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '140px',
        left: '20px',
        background: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'white',
          animation: 'pulse 1s infinite'
        }} />
        REPLAY MODE
      </div>

      {/* Debug Info */}
      <div style={{
        position: 'absolute',
        bottom: '180px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Frame: {gameState.currentFrame}<br/>
        Notes: {gameState.fallingLetters.length}<br/>
        Total Spawned: {allSpawnedNotes.size}<br/>
        Held Keys: {Array.from(gameState.heldKeys).join(', ')}
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}
      </style>

      <Canvas camera={{ position: [0, 2.5, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#191919']} />
          <GradientBackground combo={gameState.combo} />
          <FloatingShapes />
          <ambientLight intensity={0.8} />

          <Veronica position={[-4.5, -1.5, 0]} scale={1.5} rotation={[0, 0.5, 0]} />

          <FeedbackText3D feedback={gameState.hitFeedback} />
          <HitZoneIndicator complexity={gameState.complexity} />
          <TimingDisplay 
            timingOffset={gameState.timingOffset} 
            show={gameState.showTimingDisplay} 
            onComplete={() => setGameState(prev => ({ ...prev, showTimingDisplay: false }))} 
          />
          
          <Fretboard 
            heldKeys={gameState.heldKeys} 
            letters={letters} 
            channelPositions={channelPositions} 
            channelColors={channelColors}
          />
          <SparklesEffect 
            heldKeys={gameState.heldKeys} 
            letters={letters} 
            channelPositions={channelPositions} 
            channelColors={channelColors} 
          />
          
          {gameState.stamps.map(stamp => (
            <Stamp
              key={stamp.id}
              id={stamp.id}
              position={stamp.position}
              color={stamp.color}
              onFadeOut={removeStamp}
            />
          ))}

          {gameState.fallingLetters.map(letter => (
            <FallingLetter
              key={letter.id}
              id={letter.id}
              letter={letter.letter}
              position={letter.position}
              duration={letter.duration}
              color={letter.color}
              isMissed={letter.isMissed}
              opacity={letter.opacity || 1}
              isHit={letter.isHit}
              isBeingHeld={letter.isBeingHeld}
            />
          ))}
          
          <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  );
};

export default ReplayViewer;