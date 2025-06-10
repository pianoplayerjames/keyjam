import { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '@/App.css';
import Game from '@/stage/Game';
import Transition from '@/shared/components/Transition';
import PulsingBackground from '@/shared/components/PulsingBackground';
import { useGameStore } from '@/shared/stores/gameStore';
import { useMenuStore } from '@/shared/stores/menuStore';
import { useReplayStore } from '@/shared/stores/replayStore';
import ReplayPlayer from '@/pages/replay/components/ReplayPlayer';
import { TopBar } from '@/ui/TopBar';
import { Navigation } from '@/ui/Navigation';
import CareerMenu from '@/pages/career';
import OnlinePortal from '@/pages/online/Multiplayer';
import PractiseMenu from '@/pages/training/Practise';
import DifficultyMenu from '@/pages/training/Difficulty';
import TimeSelectionMenu from '@/pages/training/TimeSelection';
import ScoreSelectionMenu from '@/pages/training/ScoreSelection';
import ReplayBrowser from '@/pages/replay/components/ReplayBrowser';
import ArcadeMenu from '@/pages/arcade';
import { AnimatedBackground } from '@/shared/components/AnimatedBackground';
import LeftNav from '@/ui/LeftNav';
import { ArenaPage } from '@/pages/online/Arena';

const SimpleLoading = () => (
  <group>
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff4f7b" />
    </mesh>
  </group>
);

interface PlayerStats {
  totalReplays: number;
  bestScore: number;
  bestAccuracy: number;
  totalPlayTime: number;
}

function App() {
  const { gameState, gameConfig, setGameConfig, setGameState } = useGameStore();
  const { menuState, setMenuState, isTransitioning, setIsTransitioning } = useMenuStore();
  const isPlayingReplay = useReplayStore((state) => state.isPlaying);
  const navigate = useNavigate();

  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [playerData] = useState({
    username: 'RhythmMaster',
    rank: 'Diamond',
    elo: 1847,
    level: 28,
    wins: 156,
    losses: 89,
    draws: 12,
    status: 'online' as const
  });

  const [localGameConfig, setLocalGameConfig] = useState({
    ...gameConfig,
    songId: ''
  });

  useEffect(() => {
    try {
      const storedReplays = localStorage.getItem('rhythm-game-replays');
      const replays = storedReplays ? JSON.parse(storedReplays).state.savedReplays : [];

      if (replays && replays.length > 0) {
        const bestScore = Math.max(...replays.map((r: any) => r.metadata.finalScore));
        const bestAccuracy = Math.max(...replays.map((r: any) => r.metadata.accuracy));
        const totalPlayTime = replays.reduce((sum: number, r: any) => sum + r.duration, 0);

        setPlayerStats({
          totalReplays: replays.length,
          bestScore,
          bestAccuracy,
          totalPlayTime
        });
      }
    } catch (error) {
      console.error('Failed to load player stats:', error);
    }
  }, []);


  const handleStartGameWithConfig = (config: typeof gameConfig) => {
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

  const handleSelectSong = (songId: string) => {
    const newConfig = { ...localGameConfig, mode: 'arcade' as const, subMode: 'arcade' as const, songId };
    setLocalGameConfig(newConfig);
    handleStartGameWithConfig(newConfig);
  };

  if (gameState === 'game') {
    return <Game onBackToMenu={handleBackToMenu} />;
  }

  const renderMainMenu = () => {
    if (menuState === 'time-selection' || menuState === 'score-selection' || menuState === 'difficulty') {
      return (
        <div className="relative w-screen h-screen overflow-hidden">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }} className="absolute inset-0">
            <Suspense fallback={null}>
              <AnimatedBackground />
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 z-10">
            {menuState === 'time-selection' && <TimeSelectionMenu onBack={() => setMenuState('main')} onSelectTime={(timeLimit) => {
              setLocalGameConfig(prev => ({ ...prev, timeLimit }));
              setMenuState('difficulty');
            }} />}
            {menuState === 'score-selection' && <ScoreSelectionMenu onBack={() => setMenuState('main')} />}
            {menuState === 'difficulty' && <DifficultyMenu onBack={() => setMenuState(localGameConfig.subMode === 'time' ? 'time-selection' : 'score-selection')} />}
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50">
        <LeftNav />
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col h-screen">
          <TopBar playerData={playerData} playerStats={playerStats} />
          <Navigation />
          <div className="flex-grow relative overflow-hidden">
            <Routes>
                <Route path="/" element={<OnlinePortal onBack={() => navigate('/')} onStartGame={(config) => handleStartGameWithConfig(config)} />} />
                <Route path="/career" element={<CareerMenu onBack={() => navigate('/')} />} />
                <Route path="/arcade" element={<ArcadeMenu onBack={() => navigate('/')} onSelectSong={handleSelectSong} />} />
                <Route path="/practice" element={<PractiseMenu onBack={() => navigate('/')} onSelectMode={(mode) => {
                  setLocalGameConfig(prev => ({ ...prev, mode: 'practise', subMode: mode }));
                  setMenuState(mode === 'time' ? 'time-selection' : 'score-selection');
                }} />} />
                <Route path="/replays" element={<div className="h-full"><ReplayBrowser isVisible={true} onClose={() => navigate('/')} /></div>} />
                <Route path="/arena/:id" element={<ArenaPage />} />
            </Routes>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ visibility: isPlayingReplay ? 'hidden' : 'visible' }}>
      {isPlayingReplay && <ReplayPlayer />}

      <Canvas
        camera={{ position: [0, 2.5, 5], fov: 75 }}
        className="absolute inset-0"
      >
        <Suspense fallback={<SimpleLoading />}>
          <PulsingBackground />
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

      {gameState === 'menu' && renderMainMenu()}
    </div>
  );
}

export default App;