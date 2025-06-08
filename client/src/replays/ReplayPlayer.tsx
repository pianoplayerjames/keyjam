// client/src/ReplayPlayer.tsx
import React, { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReplayStore } from '../stores/replayStore';
import { ReplayEngine } from './ReplayEngine';
import FallingLetter from '../FallingLetter';
import Fretboard from '../Fretboard';
import GradientBackground from '../GradientBackground';
import SparklesEffect from '../SparklesEffect';
import FeedbackText3D from '../FeedbackText3D';
import FloatingShapes from '../FloatingShapes';
import { Veronica } from '../Veronica';
import HealthUI from '../HealthUI';
import TimeUI from '../TimeUI';
import HitZoneIndicator from '../HitZoneIndicator';
import TimingDisplay from '../TimingDisplay';
import Stamp from '../Stamp';

// Re-export ReplayEngine to fix the circular dependency with the store
export { ReplayEngine };

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

const ReplayViewer: React.FC = () => {
  const replayEngine = useReplayStore((state) => state.replayEngine);
  const currentReplay = useReplayStore((state) => state.currentReplay);

  const [gameState, setGameState] = useState<ReplayGameState>({
    score: 0, combo: 0, health: 100, fallingLetters: [], heldKeys: new Set(),
    stamps: [], hitFeedback: { text: '', color: '', key: 0 }, timingOffset: 0,
    showTimingDisplay: false, complexity: 50, timeLeft: 0, currentFrame: 0,
  });

  const spawnEvents = useRef(new Map()).current;

  useEffect(() => {
    if (currentReplay) {
        spawnEvents.clear();
        currentReplay.events.forEach(event => {
            if (event.type === 'note_spawn' && event.data.letter) {
                const letter = event.data.letter;
                spawnEvents.set(letter.id, {
                    frame: event.frame,
                    letter: letter.letter,
                    position: letter.position,
                    duration: letter.duration || 0,
                    color: letter.color,
                });
            }
        });
    }
  }, [currentReplay, spawnEvents]);

  useEffect(() => {
    if (!replayEngine) return;

    const handleReplayUpdate = (update: any) => {
      setGameState(prevState => {
        let newState = { ...prevState };
        switch(update.type) {
            case 'apply_event':
                const { event } = update;
                // Simplified event handling for viewer
                if (event.type === 'keydown') newState.heldKeys = new Set([...newState.heldKeys, event.data.key]);
                if (event.type === 'keyup') newState.heldKeys = new Set([...newState.heldKeys].filter(k => k !== event.data.key));
                if (event.type === 'note_hit') {
                    newState.score = event.data.score;
                    newState.combo = event.data.combo;
                    newState.health = event.data.health;
                }
                break;
            case 'update_frame':
                const { frame } = update;
                const visibleNotes: any[] = [];
                spawnEvents.forEach((spawnEvent, noteId) => {
                    if (frame >= spawnEvent.frame) {
                        const framesSinceSpawn = frame - spawnEvent.frame;
                        const moveSpeed = 0.15; // This should ideally come from complexity config
                        const currentZ = spawnEvent.position[2] + (framesSinceSpawn * moveSpeed);
                        if (currentZ < 20) {
                            visibleNotes.push({ id: noteId, ...spawnEvent, position: [spawnEvent.position[0], spawnEvent.position[1], currentZ] });
                        }
                    }
                });
                newState.fallingLetters = visibleNotes;
                newState.currentFrame = frame;
                break;
        }
        return newState;
      });
    };

    replayEngine.setStateUpdateCallback(handleReplayUpdate);
  }, [replayEngine, spawnEvents]);

  const removeStamp = (id: number) => {
    setGameState(prevState => ({
      ...prevState,
      stamps: prevState.stamps.filter(stamp => stamp.id !== id)
    }));
  };

  const renderUI = () => {
    if (!currentReplay) return null;
    if (currentReplay.gameConfig.subMode === 'time' || currentReplay.gameConfig.mode === 'career') {
      return <TimeUI />;
    } else {
      return <HealthUI />;
    }
  };

  return (
    <>
      {renderUI()}
      <Canvas camera={{ position: [0, 2.5, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#191919']} />
          <GradientBackground />
          <FloatingShapes />
          <ambientLight intensity={0.8} />
          <Veronica position={[-4.5, -1.5, 0]} scale={1.5} rotation={[0, 0.5, 0]} />
          <FeedbackText3D />
          <HitZoneIndicator />
          <TimingDisplay />
          <Fretboard />
          <SparklesEffect />
          
          {gameState.stamps.map(stamp => (
            <Stamp key={stamp.id} {...stamp} onFadeOut={removeStamp} />
          ))}

          {gameState.fallingLetters.map(letter => (
            <FallingLetter key={letter.id} {...letter} />
          ))}
          
          <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  );
};

const ReplayPlayer: React.FC = () => {
  const { 
    replayEngine, 
    isPlaying, 
    togglePlayPause, 
    stopReplay 
  } = useReplayStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  
  const timelineRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!replayEngine) return;
    const interval = setInterval(() => {
      setCurrentTime(replayEngine.getCurrentTime());
    }, 100);
    return () => clearInterval(interval);
  }, [replayEngine]);

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!replayEngine) return;
    const newTime = parseFloat(e.target.value);
    replayEngine.seekToTime(newTime);
    setCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    if (!replayEngine) return;
    replayEngine.setPlaybackSpeed(speed);
    setPlaybackSpeed(speed);
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!replayEngine) return null;
  
  const maxTime = replayEngine.getDuration();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 2000, display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#000' }}>
        <ReplayViewer />
        <button
          onClick={stopReplay}
          style={{
            position: 'absolute', top: '20px', right: '20px', background: 'rgba(0, 0, 0, 0.7)',
            color: 'white', border: '2px solid white', borderRadius: '8px', padding: '10px 15px',
            cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
          }}
        >
          ✕ Close
        </button>
      </div>

      <div style={{
        height: '120px', backgroundColor: '#1a1a1a', borderTop: '2px solid #333',
        padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'white', fontSize: '14px', minWidth: '60px' }}>
            {formatTime(currentTime)}
          </span>
          <input
            ref={timelineRef} type="range" min="0" max={maxTime} value={currentTime}
            onChange={handleTimelineChange}
            style={{ flex: 1, height: '8px' }}
          />
          <span style={{ color: 'white', fontSize: '14px', minWidth: '60px' }}>
            {formatTime(maxTime)}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
          <button onClick={togglePlayPause} style={{...buttonStyle, fontSize: '24px'}}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button onClick={stopReplay} style={buttonStyle}>⏹️</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '30px' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>Speed:</span>
            {[0.25, 0.5, 1, 2, 4].map(speed => (
              <button key={speed} onClick={() => handleSpeedChange(speed)}
                style={{...speedButtonStyle, backgroundColor: playbackSpeed === speed ? '#4caf50' : '#333'}}>
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  background: '#333', color: 'white', border: '2px solid #555', borderRadius: '8px',
  padding: '10px 15px', cursor: 'pointer', fontSize: '18px', minWidth: '50px',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const speedButtonStyle: React.CSSProperties = {
  background: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px',
  padding: '5px 10px', cursor: 'pointer', fontSize: '12px', minWidth: '35px'
};

export default ReplayPlayer;