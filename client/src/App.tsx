// client/src/App.tsx
import { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './Game';
import MainMenu from './MainMenu';
import Transition from './Transition';
import FloatingShapes from './FloatingShapes';
import GradientBackground from './GradientBackground';
import { useGameStore } from './stores/gameStore';
import { useMenuStore } from './stores/menuStore';
import { useReplayStore } from './stores/replayStore';
import ReplayPlayer from './replays/ReplayPlayer';
import './App.css';

const SimpleLoading = () => (
  <group>
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff4f7b" />
    </mesh>
  </group>
);

function App() {
  const { gameState, gameConfig, setGameConfig, setGameState } = useGameStore();
  const { menuState, isTransitioning, setIsTransitioning, setMenuState } = useMenuStore();
  const isPlayingReplay = useReplayStore((state) => state.isPlaying);

  const handleStartGame = (config: typeof gameConfig) => {
    setGameConfig(config);
    setIsTransitioning(true);
    setGameState('in-transition');
  };

  const handleTransitionComplete = () => {
    setGameState('game');
    setIsTransitioning(false);
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setMenuState('main');
    setIsTransitioning(false);
  };

  if (gameState === 'game') {
    return <Game onBackToMenu={handleBackToMenu} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ visibility: isPlayingReplay ? 'hidden' : 'visible' }}>
      {/* Conditionally render ReplayPlayer on top of everything */}
      {isPlayingReplay && <ReplayPlayer />}

      <Canvas
        camera={{ position: [0, 2.5, 5], fov: 75 }}
        className="absolute inset-0"
      >
        <Suspense fallback={<SimpleLoading />}>
          <GradientBackground />
          <FloatingShapes />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          
          {gameState === 'in-transition' && (
            <Transition
              onTransitionComplete={handleTransitionComplete}
              gameMode={gameConfig.mode}
            />
          )}
        </Suspense>
      </Canvas>

      {gameState === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
        />
      )}
    </div>
  );
}

export default App;