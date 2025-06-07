// ReplayPlayer.tsx - Fixed version with proper replay engine communication
import React, { useState, useRef, useCallback, useEffect, Suspense } from 'react';
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
import { GameEvent, GameState, ReplayData } from './ReplayRecorder';

const letters = '12345';
const channelPositions = [-2, -1, 0, 1, 2];
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0'];

interface ReplayPlayerProps {
  replayData: ReplayData;
  onClose: () => void;
  isVisible: boolean;
}

class ReplayEngine {
  private replayData: ReplayData;
  private currentFrame = 0;
  private currentEventIndex = 0;
  private isPlaying = false;
  private playbackSpeed = 1.0;
  private onStateUpdate: ((state: any) => void) | null = null;
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private targetFrameTime = 1000 / 60; // 60 FPS

  constructor(replayData: ReplayData) {
    this.replayData = replayData;
    console.log('🎬 ReplayEngine created with data:', {
      events: replayData.events.length,
      duration: replayData.duration,
      firstEvent: replayData.events[0],
      spawnEvents: replayData.events.filter(e => e.type === 'note_spawn').length
    });
  }

  setStateUpdateCallback(callback: (state: any) => void): void {
    this.onStateUpdate = callback;
    console.log('🎬 State update callback set');
    
    // Initialize immediately
    this.initializeGameState();
  }

  play(): void {
    console.log('🎬 Play called, current frame:', this.currentFrame);
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.tick();
  }

  pause(): void {
    console.log('🎬 Pause called');
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  stop(): void {
    console.log('🎬 Stop called');
    this.pause();
    this.seekToFrame(0);
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
    console.log('🎬 Playback speed set to:', this.playbackSpeed);
  }

  seekToFrame(frame: number): void {
    console.log('🎬 Seeking to frame:', frame);
    const wasPlaying = this.isPlaying;
    this.pause();
    
    this.currentFrame = Math.max(0, Math.min(frame, this.getMaxFrame()));
    
    // Reset to beginning and replay events up to this frame
    this.currentEventIndex = 0;
    this.initializeGameState();
    
    // Apply all events up to current frame
    while (
      this.currentEventIndex < this.replayData.events.length &&
      this.replayData.events[this.currentEventIndex].frame <= this.currentFrame
    ) {
      this.applyEvent(this.replayData.events[this.currentEventIndex]);
      this.currentEventIndex++;
    }
    
    this.updateState();
    
    if (wasPlaying) {
      this.play();
    }
  }

  seekToTime(timeMs: number): void {
    const frame = Math.floor((timeMs / 1000) * 60); // Assuming 60 FPS
    this.seekToFrame(frame);
  }

  private tick = (): void => {
    if (!this.isPlaying) return;

    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    const adjustedFrameTime = this.targetFrameTime / this.playbackSpeed;

    if (deltaTime >= adjustedFrameTime) {
      this.advanceFrame();
      this.lastFrameTime = now - (deltaTime % adjustedFrameTime);
    }

    if (this.currentFrame < this.getMaxFrame()) {
      this.animationFrameId = requestAnimationFrame(this.tick);
    } else {
      console.log('🎬 Reached end of replay');
      this.pause();
    }
  };

  private advanceFrame(): void {
    this.currentFrame++;
    
    // Apply events for this frame
    while (
      this.currentEventIndex < this.replayData.events.length &&
      this.replayData.events[this.currentEventIndex].frame <= this.currentFrame
    ) {
      this.applyEvent(this.replayData.events[this.currentEventIndex]);
      this.currentEventIndex++;
    }

    this.updateState();
  }

  private applyEvent(event: GameEvent): void {
    console.log('🎬 Applying event:', event.type, 'at frame', event.frame);
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'apply_event',
        event
      });
    }
  }

  private initializeGameState(): void {
    console.log('🎬 Initializing game state');
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'initialize',
        data: {
          difficulty: this.replayData.gameConfig.difficulty,
          timeLimit: this.replayData.gameConfig.timeLimit
        }
      });
    }
  }

  private updateState(): void {
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'update_frame',
        frame: this.currentFrame,
        time: (this.currentFrame / 60) * 1000 // Convert to ms
      });
    }
  }

  getMaxFrame(): number {
    if (this.replayData.events.length === 0) return 0;
    return Math.max(...this.replayData.events.map(event => event.frame));
  }

  getCurrentFrame(): number {
    return this.currentFrame;
  }

  getCurrentTime(): number {
    return (this.currentFrame / 60) * 1000; // Convert to ms
  }

  getDuration(): number {
    return this.replayData.duration;
  }

  getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}

// ReplayViewer Component - Simplified for debugging
interface ReplayViewerProps {
  replayData: ReplayData;
  replayEngine: ReplayEngine;
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

  // Create a map of all spawn events for quick lookup
  const [spawnEvents] = useState(() => {
    const events = new Map();
    
    replayData.events.forEach(event => {
      if (event.type === 'note_spawn' && event.data.letter) {
        const letter = event.data.letter;
        events.set(letter.id, {
          frame: event.frame,
          timestamp: event.timestamp,
          letter: letter.letter,
          position: letter.position,
          duration: letter.duration || 0,
          color: letter.color,
          complexityType: letter.complexityType || 'normal'
        });
      }
    });
    
    console.log('📝 Processed spawn events:', events.size);
    return events;
  });

  useEffect(() => {
    const handleReplayUpdate = (update: any) => {
      console.log('🎬 Viewer received update:', update.type);
      
      switch (update.type) {
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
                  text: event.data.hitResult?.feedback || 'HIT',
                  color: event.data.hitResult?.color || '#00e676',
                  key: prevState.hitFeedback.key + 1
                };
                break;
                
              case 'note_miss':
                newState.combo = 0;
                newState.health = event.data.health || newState.health;
                newState.hitFeedback = {
                  text: 'MISS',
                  color: '#f44336',
                  key: prevState.hitFeedback.key + 1
                };
                break;
                
              case 'score_change':
                newState.score = event.data.score || newState.score;
                break;
            }
            
            return newState;
          });
          break;
          
        case 'update_frame':
          const currentFrame = update.frame;
          
          setGameState(prevState => {
            // Calculate time left
            const timeElapsed = (currentFrame / 60); // seconds
            const newTimeLeft = Math.max(0, replayData.gameConfig.timeLimit - timeElapsed);
            
            // Calculate visible notes
            const visibleNotes = [];
            
            spawnEvents.forEach((spawnEvent, noteId) => {
              if (currentFrame >= spawnEvent.frame) {
                const framesSinceSpawn = currentFrame - spawnEvent.frame;
                const moveSpeed = 0.15; // Adjust this value to match your game
                const currentZ = spawnEvent.position[2] + (framesSinceSpawn * moveSpeed);
                
                // Show notes that are on screen
                if (currentZ > -50 && currentZ < 20) {
                  visibleNotes.push({
                    id: noteId,
                    letter: spawnEvent.letter,
                    position: [spawnEvent.position[0], spawnEvent.position[1], currentZ],
                    duration: spawnEvent.duration,
                    color: spawnEvent.color,
                    opacity: 1,
                    isMissed: false,
                    isHit: false,
                    isBeingHeld: false
                  });
                }
              }
            });
            
            return {
              ...prevState,
              currentFrame,
              timeLeft: newTimeLeft,
              fallingLetters: visibleNotes
            };
          });
          break;
          
        case 'initialize':
          console.log('🎬 Initializing viewer state');
          setGameState(prevState => ({
            ...prevState,
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
          }));
          break;
      }
    };

    replayEngine.setStateUpdateCallback(handleReplayUpdate);
  }, [replayEngine, spawnEvents, replayData.gameConfig]);

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

  console.log('🎮 ReplayViewer state:', {
    frame: gameState.currentFrame,
    timeLeft: gameState.timeLeft,
    notesVisible: gameState.fallingLetters.length,
    totalSpawnEvents: spawnEvents.size
  });

  return (
    <>
      {renderUI()}
      
      {/* Debug Info */}
      <div style={{
        position: 'absolute',
        bottom: '140px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 1000,
        fontFamily: 'monospace'
      }}>
        <div style={{ color: '#00ff00', fontWeight: 'bold' }}>REPLAY DEBUG</div>
        Frame: {gameState.currentFrame}<br/>
        Time Left: {gameState.timeLeft.toFixed(1)}s<br/>
        Total Spawns: {spawnEvents.size}<br/>
        Notes Visible: {gameState.fallingLetters.length}<br/>
        Playing: {replayEngine.isCurrentlyPlaying() ? 'YES' : 'NO'}<br/>
        {gameState.fallingLetters.length > 0 && (
          <>
            First Note Z: {gameState.fallingLetters[0].position[2].toFixed(2)}<br/>
            First Note Letter: {gameState.fallingLetters[0].letter}
          </>
        )}
      </div>

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

          {/* Render test cube if no notes to verify rendering works */}
          {gameState.fallingLetters.length === 0 && gameState.currentFrame > 60 && (
            <mesh position={[0, 1, 2]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
            </mesh>
          )}

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

// Main ReplayPlayer Component - Fixed
const ReplayPlayer: React.FC<ReplayPlayerProps> = ({ replayData, onClose, isVisible }) => {
  const [replayEngine] = useState(() => new ReplayEngine(replayData));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const timelineRef = useRef<HTMLInputElement>(null);
  const maxTime = replayData.duration;
  const maxFrame = replayEngine.getMaxFrame();

  // Auto-start playback when component mounts
  useEffect(() => {
    if (isVisible) {
      console.log('🎬 ReplayPlayer mounted, starting playback');
      setTimeout(() => {
        handlePlay();
      }, 500); // Small delay to ensure everything is initialized
    }
  }, [isVisible]);

  // Update current time and frame from engine
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(replayEngine.getCurrentFrame());
      setCurrentTime(replayEngine.getCurrentTime());
      setIsPlaying(replayEngine.isCurrentlyPlaying());
    }, 100);

    return () => clearInterval(interval);
  }, [replayEngine]);

  const handlePlay = useCallback(() => {
    console.log('🎬 Play button clicked');
    if (isPlaying) {
      replayEngine.pause();
    } else {
      replayEngine.play();
    }
  }, [isPlaying, replayEngine]);

  const handleStop = useCallback(() => {
    replayEngine.stop();
  }, [replayEngine]);

  const handleTimelineChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    replayEngine.seekToTime(newTime);
  }, [replayEngine]);

  const handleSpeedChange = useCallback((speed: number) => {
    replayEngine.setPlaybackSpeed(speed);
    setPlaybackSpeed(speed);
  }, [replayEngine]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Replay Viewer */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#000'
      }}>
        <ReplayViewer 
          replayData={replayData}
          replayEngine={replayEngine}
        />
        
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* Controls */}
      <div style={{
        height: '120px',
        backgroundColor: '#1a1a1a',
        borderTop: '2px solid #333',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {/* Timeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'white', fontSize: '14px', minWidth: '60px' }}>
            {formatTime(currentTime)}
          </span>
          <input
            ref={timelineRef}
            type="range"
            min="0"
            max={maxTime}
            value={currentTime}
            onChange={handleTimelineChange}
            style={{
              flex: 1,
              height: '8px',
              background: '#333',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <span style={{ color: 'white', fontSize: '14px', minWidth: '60px' }}>
            {formatTime(maxTime)}
          </span>
        </div>

        {/* Control Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '15px' 
        }}>
          {/* Play/Pause */}
          <button onClick={handlePlay} style={{...buttonStyle, fontSize: '24px'}}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          {/* Stop */}
          <button onClick={handleStop} style={buttonStyle}>
            ⏹️
          </button>
          
          {/* Speed Controls */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginLeft: '30px'
          }}>
            <span style={{ color: 'white', fontSize: '14px' }}>Speed:</span>
            {[0.25, 0.5, 1, 2, 4].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                style={{
                  ...speedButtonStyle,
                  backgroundColor: playbackSpeed === speed ? '#4caf50' : '#333',
                  color: playbackSpeed === speed ? 'black' : 'white'
                }}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: '#333',
  color: 'white',
  border: '2px solid #555',
  borderRadius: '8px',
  padding: '10px 15px',
  cursor: 'pointer',
  fontSize: '18px',
  minWidth: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const speedButtonStyle = {
  background: '#333',
  color: 'white',
  border: '1px solid #555',
  borderRadius: '4px',
  padding: '5px 10px',
  cursor: 'pointer',
  fontSize: '12px',
  minWidth: '35px'
};

export default ReplayPlayer;