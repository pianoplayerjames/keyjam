// ReplayPlayer.tsx - Updated with proper imports and ReplayViewer component
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
  }

  setStateUpdateCallback(callback: (state: any) => void): void {
    this.onStateUpdate = callback;
  }

  play(): void {
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.tick();
  }

  pause(): void {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  stop(): void {
    this.pause();
    this.seekToFrame(0);
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
  }

  seekToFrame(frame: number): void {
    const wasPlaying = this.isPlaying;
    this.pause();
    
    this.currentFrame = Math.max(0, Math.min(frame, this.getMaxFrame()));
    
    // Find the closest keyframe before this frame
    const keyframe = this.findClosestKeyframe(this.currentFrame);
    
    if (keyframe) {
      // Restore from keyframe
      this.applyKeyframe(keyframe);
      
      // Apply events from keyframe to current frame
      this.applyEventsFromFrame(keyframe.frame, this.currentFrame);
    } else {
      // No keyframe found, start from beginning
      this.currentFrame = 0;
      this.currentEventIndex = 0;
      this.initializeGameState();
    }
    
    // Update event index
    this.currentEventIndex = this.replayData.events.findIndex(
      event => event.frame > this.currentFrame
    );
    if (this.currentEventIndex === -1) {
      this.currentEventIndex = this.replayData.events.length;
    }
    
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

    this.animationFrameId = requestAnimationFrame(this.tick);
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

    // Check if we've reached the end
    if (this.currentFrame >= this.getMaxFrame()) {
      this.pause();
    }

    this.updateState();
  }

  private findClosestKeyframe(frame: number): GameState | null {
    let closest: GameState | null = null;
    
    for (const keyframe of this.replayData.keyframes) {
      if (keyframe.frame <= frame) {
        if (!closest || keyframe.frame > closest.frame) {
          closest = keyframe;
        }
      }
    }
    
    return closest;
  }

  private applyKeyframe(keyframe: GameState): void {
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'restore_keyframe',
        data: keyframe
      });
    }
  }

  private applyEventsFromFrame(startFrame: number, endFrame: number): void {
    const eventsInRange = this.replayData.events.filter(
      event => event.frame > startFrame && event.frame <= endFrame
    );
    
    for (const event of eventsInRange) {
      this.applyEvent(event);
    }
  }

  private applyEvent(event: GameEvent): void {
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'apply_event',
        event
      });
    }
  }

  private initializeGameState(): void {
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'initialize',
        data: this.replayData.gameConfig
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
    return Math.max(
      ...this.replayData.events.map(event => event.frame),
      ...this.replayData.keyframes.map(keyframe => keyframe.frame)
    );
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

// ReplayViewer Component
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
    currentFrame: 0
  });

  useEffect(() => {
    const handleReplayUpdate = (update: any) => {
      switch (update.type) {
        case 'restore_keyframe':
          setGameState(prevState => ({
            ...prevState,
            ...update.data,
            heldKeys: new Set(update.data.heldKeys)
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
                }
                if (event.data.stamp) {
                  newState.stamps = [...newState.stamps, event.data.stamp];
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
                  newState.stamps = [...newState.stamps, event.data.stamp];
                }
                break;
                
              case 'note_spawn':
                if (event.data.letter) {
                  newState.fallingLetters = [...newState.fallingLetters, event.data.letter];
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
          setGameState(prevState => ({
            ...prevState,
            currentFrame: update.frame,
            // Update falling letters positions based on frame
            fallingLetters: prevState.fallingLetters.map(letter => ({
              ...letter,
              position: [
                letter.position[0],
                letter.position[1],
                letter.originalZ + (update.frame - letter.spawnFrame) * 0.1 // Simulate movement
              ]
            })).filter(letter => letter.position[2] < 10) // Remove off-screen letters
          }));
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
            currentFrame: 0
          });
          break;
      }
    };

    replayEngine.setStateUpdateCallback(handleReplayUpdate);
  }, [replayEngine]);

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
              opacity={letter.opacity}
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

// Main ReplayPlayer Component
const ReplayPlayer: React.FC<ReplayPlayerProps> = ({ replayData, onClose, isVisible }) => {
  const [replayEngine] = useState(() => new ReplayEngine(replayData));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const timelineRef = useRef<HTMLInputElement>(null);
  const maxTime = replayData.duration;
  const maxFrame = replayEngine.getMaxFrame();

  useEffect(() => {
    replayEngine.setStateUpdateCallback((update) => {
      // Handle state updates from replay engine
      console.log('Replay update:', update);
      
      setCurrentFrame(replayEngine.getCurrentFrame());
      setCurrentTime(replayEngine.getCurrentTime());
    });
  }, [replayEngine]);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      replayEngine.pause();
      setIsPlaying(false);
    } else {
      replayEngine.play();
      setIsPlaying(true);
    }
  }, [isPlaying, replayEngine]);

  const handleStop = useCallback(() => {
    replayEngine.stop();
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentFrame(0);
  }, [replayEngine]);

  const handleTimelineChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    replayEngine.seekToTime(newTime);
    setCurrentTime(newTime);
  }, [replayEngine]);

  const handleSpeedChange = useCallback((speed: number) => {
    replayEngine.setPlaybackSpeed(speed);
    setPlaybackSpeed(speed);
  }, [replayEngine]);

  const handleRewind = useCallback(() => {
    const newTime = Math.max(0, currentTime - 5000); // Rewind 5 seconds
    replayEngine.seekToTime(newTime);
  }, [currentTime, replayEngine]);

  const handleFastForward = useCallback(() => {
    const newTime = Math.min(maxTime, currentTime + 5000); // Fast forward 5 seconds
    replayEngine.seekToTime(newTime);
  }, [currentTime, maxTime, replayEngine]);

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
        
        {/* Replay Info Overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          fontSize: '14px',
          minWidth: '200px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>📹 REPLAY</div>
          <div>Frame: {currentFrame} / {maxFrame}</div>
          <div>Time: {formatTime(currentTime)} / {formatTime(maxTime)}</div>
          <div>Speed: {playbackSpeed}x</div>
          <div>Score: {replayData.metadata.finalScore}</div>
          <div>Accuracy: {replayData.metadata.accuracy.toFixed(1)}%</div>
        </div>
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
          {/* Rewind */}
          <button onClick={handleRewind} style={buttonStyle}>
            ⏪
          </button>
          
          {/* Play/Pause */}
          <button onClick={handlePlay} style={{...buttonStyle, fontSize: '24px'}}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          {/* Stop */}
          <button onClick={handleStop} style={buttonStyle}>
            ⏹️
          </button>
          
          {/* Fast Forward */}
          <button onClick={handleFastForward} style={buttonStyle}>
            ⏩
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