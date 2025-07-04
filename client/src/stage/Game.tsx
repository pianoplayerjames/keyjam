import { useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import FallingLetter from './components/FallingNotes'
import Fretboard from './components/Fretboard'
import PulsingBackground from '../shared/components/PulsingBackground'
import SparklesEffect from './components/SparklesEffect'
import FeedbackText3D from './components/FeedbackText3D'
import { Veronica } from '../shared/components/Veronica'
import HealthUI from './ui/HealthUI'
import TimeUI from './ui/TimeUI'
import ComplexityUI from './ui/ComplexityUI'
import HitZoneIndicator from './components/HitZoneIndicator'
import TimingDisplay from './components/TimingDisplay'
import Stamp from './components/Stamp'
import ScoreChart from './ui/ScoreChart'
import GameLogic from './components/GameLogic'
import KeyboardHandler from './components/KeyboardHandler'
import TutorialUI from './ui/TutorialUI'
import { useGameStore } from '../shared/stores/gameStore'
import { useReplayStore } from '../shared/stores/replayStore'
import { replayRecorder } from '../pages/replay/ReplayRecorder'

interface GameProps {
  onBackToMenu: () => void
}

const Game = ({ onBackToMenu }: GameProps) => {
  const {
    gameConfig,
    score,
    maxCombo,
    totalNotes,
    calculateAccuracy,
    fallingLetters,
    stamps,
    isGameOver,
    removeStamp,
    resetGame,
    updateCareerProgress,
  } = useGameStore();

  const { saveReplay, setIsRecording } = useReplayStore();

  useEffect(() => {
    if (isGameOver) {
      const accuracy = calculateAccuracy();
      const metadata = {
        finalScore: score,
        maxCombo: maxCombo,
        totalNotes: totalNotes,
        accuracy: accuracy,
        gameConfig: gameConfig
      };

      if (gameConfig.mode === 'career' && gameConfig.career) {
        updateCareerProgress(
          gameConfig.career.chapterIndex,
          gameConfig.career.levelIndex,
          score,
          accuracy
        );
      }
      
      const replayData = replayRecorder.stopRecording(metadata);
      if (replayData.events.length > 0) {
        saveReplay(replayData);
      }
      setIsRecording(false);
    }
  }, [isGameOver, saveReplay, setIsRecording, score, maxCombo, totalNotes, calculateAccuracy, gameConfig, updateCareerProgress]);

  const handleReplay = () => {
    resetGame();
  };

  const handleWatchReplay = () => {
    const { savedReplays, playReplay } = useReplayStore.getState();
    if (savedReplays.length > 0) {
      playReplay(savedReplays[0]);
    }
  };

  const renderUI = () => {
    if (gameConfig.subMode === 'time' || gameConfig.mode === 'career') {
      return <TimeUI />
    } else {
      return <HealthUI />
    }
  }

  return (
    <>
      <ScoreChart 
        isVisible={isGameOver}
        onReplay={handleReplay}
        onBackToMenu={onBackToMenu}
        onWatchReplay={handleWatchReplay}
      />

      <KeyboardHandler />
      
      {!isGameOver && renderUI()}

      {gameConfig.tutorial?.type === 'waitForInput' && <TutorialUI />}
      
      {!isGameOver && <ComplexityUI />}
      
      <Canvas camera={{ position: [0, 2.5, 5], fov: 75 }}>
        <GameLogic />
        <Suspense fallback={null}>
          <color attach="background" args={['#191919']} />
          <PulsingBackground />
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