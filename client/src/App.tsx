// src/App.tsx
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './Game';
import MainMenu from './MainMenu';
import Transition from './Transition';
import FloatingShapes from './FloatingShapes';
import GradientBackground from './GradientBackground';
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
  const [gameState, setGameState] = useState('menu');
  const [menuState, setMenuState] = useState('main');
  const [gameConfig, setGameConfig] = useState({
    mode: '',
    subMode: '',
    difficulty: 30,
    timeLimit: 120,
    scoreTarget: 1000
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleMenuNavigation = (newState: string) => {
    setMenuState(newState);
  };

  if (gameState === 'game') {
    return <Game gameConfig={gameConfig} onBackToMenu={handleBackToMenu} />;
  }

  return (
    <Canvas camera={{ position: [0, 2.5, 5], fov: 75 }}>
      <Suspense fallback={<SimpleLoading />}>
        <GradientBackground combo={0} />
        <FloatingShapes />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        {gameState === 'menu' && (
          <MainMenu 
            menuState={menuState}
            onStartGame={handleStartGame}
            onMenuNavigation={handleMenuNavigation}
            isTransitioning={isTransitioning}
          />
        )}
        
        {gameState === 'in-transition' && (
          <Transition 
            onTransitionComplete={handleTransitionComplete}
            gameMode={gameConfig.mode}
          />
        )}
      </Suspense>
    </Canvas>
  );
}

export default App;