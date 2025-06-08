// client/src/Game.tsx
import { useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
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
import { useGameStore } from './stores/gameStore'
import { useReplayStore } from './stores/replayStore'
import GameLogic from './components/GameLogic'
import KeyboardHandler from './components/KeyboardHandler'

interface GameProps {
  onBackToMenu: () => void
}

const Game = ({ onBackToMenu }: GameProps) => {
  const {
    gameConfig,
    score,
    combo,
    health,
    complexity,
    timeLeft,
    fallingLetters,
    stamps,
    isGameOver,
    removeStamp,
    resetGame
  } = useGameStore()

  const { setIsRecording } = useReplayStore()

  // Start recording when game starts
  useEffect(() => {
    if (!isGameOver) {
      setIsRecording(true)
    }
  }, [isGameOver, setIsRecording])

  const renderUI = () => {
    if (gameConfig.subMode === 'time' || gameConfig.mode === 'career') {
      return <TimeUI />
    } else {
      return <HealthUI />
    }
  }

  return (
    <>
      <KeyboardHandler />
      
      {renderUI()}
      
      {/* Debug Info */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div>Notes: {fallingLetters.length}</div>
        <div>Complexity: {complexity}</div>
        <div>Score: {score}</div>
        <div>Combo: {combo}</div>
      </div>
      
      <ComplexityUI showDetails={true} />
      
      <Canvas camera={{ position: [0, 2.5, 5], fov: 75 }}>
        <GameLogic />
        <Suspense fallback={null}>
          <color attach="background" args={['#191919']} />
          <GradientBackground combo={combo} />
          <FloatingShapes />
          <ambientLight intensity={0.8} />

          <Veronica position={[-4.5, -1.5, 0]} scale={1.5} rotation={[0, 0.5, 0]} />

          <FeedbackText3D />
          <HitZoneIndicator />
          <TimingDisplay />
          
          <Fretboard />
          <SparklesEffect />
          
          {stamps.map(stamp => (
            <Stamp
              key={stamp.id}
              id={stamp.id}
              position={stamp.position}
              color={stamp.color}
              onFadeOut={removeStamp}
            />
          ))}

          {fallingLetters.map(letter => (
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
          <Stats />
        </Suspense>
      </Canvas>
    </>
  )
}

export default Game