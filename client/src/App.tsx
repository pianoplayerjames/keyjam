// src/App.tsx
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './Game';
import MainMenu from './MainMenu';
import Transition from './Transition';
import FloatingShapes from './FloatingShapes';
import GradientBackground from './GradientBackground';
import './App.css';

// Simple loading component without Text
const SimpleLoading = () => (
  <group>
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff4f7b" />
    </mesh>
  </group>
);

function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'in-transition', 'game'
  const [gameMode, setGameMode] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartGame = (mode: string) => {
    let actualGameMode = 'score';
    if (mode === 'Solo') {
      actualGameMode = 'score';
    } else if (mode === 'Training') {
      actualGameMode = 'time';
    }
    
    setGameMode(actualGameMode);
    setIsTransitioning(true);
    setGameState('in-transition');
  };

  const handleTransitionComplete = () => {
    setGameState('game');
    setIsTransitioning(false);
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setGameMode('');
    setIsTransitioning(false);
  };

  if (gameState === 'game') {
      return <Game gameMode={gameMode} onBackToMenu={handleBackToMenu} />;
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
            onStartGame={handleStartGame} 
            isTransitioning={isTransitioning}
          />
        )}
        
        {gameState === 'in-transition' && (
          <Transition 
            onTransitionComplete={handleTransitionComplete}
            gameMode={gameMode}
          />
        )}
      </Suspense>
    </Canvas>
  );
}

export default App;