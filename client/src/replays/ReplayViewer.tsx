// ReplayViewer.tsx - Enhanced debugging version
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import FallingLetter from '../FallingNotes';
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

  // Enhanced debugging for spawn events
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Process all spawn events with detailed logging
  const [spawnEvents] = useState(() => {
    const events = [];
    
    console.log('🔍 Processing replay events...');
    console.log('Total events:', replayData.events.length);
    
    replayData.events.forEach((event, index) => {
      if (event.type === 'note_spawn') {
        console.log(`Spawn Event ${index}:`, {
          frame: event.frame,
          timestamp: event.timestamp,
          data: event.data
        });
        
        // Handle both possible data structures
        let letterData;
        if (event.data.letter) {
          letterData = event.data.letter;
        } else if (event.data.id) {
          letterData = event.data;
        } else {
          console.warn('Unknown spawn event structure:', event.data);
          return;
        }
        
        const spawnEvent = {
          frame: event.frame,
          timestamp: event.timestamp,
          id: letterData.id,
          letter: letterData.letter,
          position: letterData.position || [0, 0.02, -40],
          duration: letterData.duration || 0,
          color: letterData.color || '#fff',
          complexityType: letterData.complexityType || 'normal',
          originalEvent: event
        };
        
        events.push(spawnEvent);
      }
    });
    
    console.log('Processed spawn events:', events.length);
    console.log('Sample spawn event:', events[0]);
    
    return events;
  });

  useEffect(() => {
    const handleReplayUpdate = (update: any) => {
      console.log('🎬 Replay update:', update.type, update);
      
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
                console.log('Key pressed:', event.data.key);
                break;
                
              case 'keyup':
                newState.heldKeys = new Set([...newState.heldKeys].filter(k => k !== event.data.key));
                console.log('Key released:', event.data.key);
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
                    id: Math.random(),
                    spawnFrame: event.frame
                  }];
                }
                console.log('Note hit:', event.data);
                break;
                
              case 'note_miss':
                newState.combo = 0;
                newState.health = event.data.health || newState.health;
                newState.hitFeedback = {
                  text: 'MISS',
                  color: '#f44336',
                  key: prevState.hitFeedback.key + 1
                };
                console.log('Note missed:', event.data);
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
          const currentTime = update.time;
          
          // Simple approach: show all notes that should be spawned by this frame
          const visibleNotes = [];
          
          spawnEvents.forEach((spawnEvent, index) => {
            // Only process notes that have spawned by this frame
            if (currentFrame >= spawnEvent.frame) {
              // Calculate frames since spawn
              const framesSinceSpawn = currentFrame - spawnEvent.frame;
              
              // Simple movement calculation (you can adjust this)
              const moveSpeed = 0.1; // Units per frame
              const startZ = spawnEvent.position[2];
              const currentZ = startZ + (framesSinceSpawn * moveSpeed);
              
              // Show notes that are still on screen
              if (currentZ > -50 && currentZ < 20) {
                const note = {
                  id: spawnEvent.id,
                  letter: spawnEvent.letter,
                  position: [
                    spawnEvent.position[0],
                    spawnEvent.position[1],
                    currentZ
                  ],
                  duration: spawnEvent.duration,
                  color: spawnEvent.color,
                  opacity: 1,
                  isMissed: false,
                  isHit: false,
                  isBeingHeld: false,
                  complexityType: spawnEvent.complexityType,
                  framesSinceSpawn
                };
                
                visibleNotes.push(note);
              }
            }
          });
          
          setGameState(prevState => ({
            ...prevState,
            currentFrame,
            fallingLetters: visibleNotes,
            stamps: prevState.stamps.filter(stamp => {
              const age = currentFrame - (stamp.spawnFrame || currentFrame);
              return age < 30;
            })
          }));
          
          // Update debug info
          setDebugInfo({
            currentFrame,
            totalSpawnEvents: spawnEvents.length,
            spawnedByNow: spawnEvents.filter(e => currentFrame >= e.frame).length,
            visibleNotes: visibleNotes.length,
            sampleCalculation: spawnEvents.length > 0 ? {
              spawnFrame: spawnEvents[0].frame,
              framesSinceSpawn: Math.max(0, currentFrame - spawnEvents[0].frame),
              calculatedZ: spawnEvents[0].position[2] + (Math.max(0, currentFrame - spawnEvents[0].frame) * 0.1)
            } : null
          });
          
          break;
          
        case 'initialize':
          console.log('🎬 Initializing replay viewer');
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
  }, [replayEngine, spawnEvents]);

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

  // Console logging for debugging
  console.log('🎮 Current game state:', {
    currentFrame: gameState.currentFrame,
    fallingLetters: gameState.fallingLetters.length,
    heldKeys: Array.from(gameState.heldKeys),
    debugInfo
  });

  // Force show a test note if no notes are visible but we should have some
  const testNotes = [];
  if (gameState.fallingLetters.length === 0 && gameState.currentFrame > 100) {
    // Add a test note to see if rendering works
    testNotes.push({
      id: 'test-note',
      letter: '3',
      position: [0, 0.02, 0],
      duration: 0,
      color: '#4caf50',
      opacity: 1,
      isMissed: false,
      isHit: false,
      isBeingHeld: false
    });
  }

  const allNotes = [...gameState.fallingLetters, ...testNotes];

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

      {/* Enhanced Debug Info */}
      <div style={{
        position: 'absolute',
        bottom: '180px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '11px',
        zIndex: 1000,
        fontFamily: 'monospace',
        minWidth: '300px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <div style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '5px' }}>
          REPLAY DEBUG INFO
        </div>
        Frame: {gameState.currentFrame}<br/>
        Total Spawn Events: {spawnEvents.length}<br/>
        Should Be Spawned: {debugInfo.spawnedByNow || 0}<br/>
        Notes Visible: {gameState.fallingLetters.length}<br/>
        Test Notes: {testNotes.length}<br/>
        Total Rendering: {allNotes.length}<br/>
        Held Keys: {Array.from(gameState.heldKeys).join(', ') || 'None'}<br/>
        <hr style={{ margin: '10px 0' }} />
        
        {debugInfo.sampleCalculation && (
          <>
            <div style={{ color: '#ffff00' }}>Sample Calculation:</div>
            Spawn Frame: {debugInfo.sampleCalculation.spawnFrame}<br/>
            Frames Since: {debugInfo.sampleCalculation.framesSinceSpawn}<br/>
            Calculated Z: {debugInfo.sampleCalculation.calculatedZ?.toFixed(2)}<br/>
          </>
        )}
        
        {spawnEvents.length > 0 && (
          <>
            <hr style={{ margin: '10px 0' }} />
            <div style={{ color: '#ffff00' }}>First Spawn Event:</div>
            Frame: {spawnEvents[0].frame}<br/>
            Letter: {spawnEvents[0].letter}<br/>
            Pos: [{spawnEvents[0].position.map(p => p.toFixed(1)).join(', ')}]<br/>
          </>
        )}
        
        {gameState.fallingLetters.length > 0 && (
          <>
            <hr style={{ margin: '10px 0' }} />
            <div style={{ color: '#00ff00' }}>First Visible Note:</div>
            Letter: {gameState.fallingLetters[0].letter}<br/>
            Pos: [{gameState.fallingLetters[0].position.map((p: number) => p.toFixed(1)).join(', ')}]<br/>
            Since Spawn: {gameState.fallingLetters[0].framesSinceSpawn}<br/>
          </>
        )}
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
          
          {/* Force render a test cube if no notes are showing */}
          {allNotes.length === 0 && gameState.currentFrame > 100 && (
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#ff0000" />
            </mesh>
          )}
          
          {gameState.stamps.map(stamp => (
            <Stamp
              key={stamp.id}
              id={stamp.id}
              position={stamp.position}
              color={stamp.color}
              onFadeOut={removeStamp}
            />
          ))}

          {allNotes.map(letter => (
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