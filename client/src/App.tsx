// src/App.tsx
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './Game';
import MainMenu from './MainMenu';
import Transition from './Transition';
import FloatingShapes from './FloatingShapes';
import GradientBackground from './GradientBackground';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'in-transition', 'game'
  const [gameMode, setGameMode] = useState('');

  const handleStartGame = (mode: string) => {
    setGameMode(mode);
    setGameState('in-transition');
  };

  const handleTransitionComplete = () => {
    setGameState('game');
  };

  if (gameState === 'game') {
      return <Game />;
  }

  return (
    <Canvas camera={{ position: [0, 2.5, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <GradientBackground combo={0} />
        <FloatingShapes />
        <ambientLight intensity={0.8} />
        {gameState === 'menu' && <MainMenu onStartGame={handleStartGame} />}
        {gameState === 'in-transition' && <Transition onTransitionComplete={handleTransitionComplete} />}
      </Suspense>
    </Canvas>
  );
}

export default App;