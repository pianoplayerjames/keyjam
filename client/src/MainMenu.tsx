import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { TopBar } from './ui/TopBar';
import { Navigation } from './ui/Navigation';
import CareerMenu from './career/menus/CareerMenu';
import OnlinePortal from './online/OnlinePortal';
import PractiseMenu from './training/menus/PractiseMenu';
import SettingsMenu from './settings/menus/SettingsMenu';
import DifficultyMenu from './training/menus/DifficultyMenu';
import TimeSelectionMenu from './training/menus/TimeSelectionMenu';
import ScoreSelectionMenu from './training/menus/ScoreSelectionMenu';
import ReplayBrowser from './replay/components/ReplayBrowser';
import ArcadeMenu from './arcade/menus/ArcadeMenu';
import { AnimatedBackground } from './shared/components/AnimatedBackground';
import LeftNav from './ui/LeftNav';
import { useMenuStore } from './shared/stores/menuStore';
import { useGameStore } from './shared/stores/gameStore';

interface PlayerStats {
  totalReplays: number;
  bestScore: number;
  bestAccuracy: number;
  totalPlayTime: number;
}

const MainMenu = () => {
  const { menuState, setMenuState } = useMenuStore();
  const { gameConfig, setGameConfig, setGameState } = useGameStore();
  
  const [activeTab, setActiveTab] = useState<'career' | 'arcade' | 'online' | 'practice' | 'replays' | 'settings'>('online');
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

  const handleGameStart = () => {
    setGameConfig(localGameConfig);
    setGameState('in-transition');
  };
  
  const handleSelectSong = (songId: string) => {
    setLocalGameConfig(prev => ({ ...prev, mode: 'arcade', subMode: 'arcade', songId }));
    handleGameStart();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'career':
        return <CareerMenu onBack={() => {}} />;
      case 'arcade':
        return <ArcadeMenu onBack={() => setActiveTab('career')} onSelectSong={handleSelectSong} />;
      case 'online':
        return <OnlinePortal onBack={() => setActiveTab('career')} onStartGame={(config) => {
          setLocalGameConfig(prev => ({ ...prev, mode: config.mode || 'online', subMode: config.subMode || config.gameMode || 'arena', difficulty: config.difficulty || 50 }));
          handleGameStart();
        }} />;
      case 'practice':
        return <PractiseMenu onBack={() => setActiveTab('career')} onSelectMode={(mode) => {
          setLocalGameConfig(prev => ({ ...prev, mode: 'practise', subMode: mode }));
          setMenuState(mode === 'time' ? 'time-selection' : 'score-selection');
        }} />;
      case 'replays':
        return <div className="h-full"><ReplayBrowser isVisible={true} onClose={() => setActiveTab('career')} /></div>;
      case 'settings':
        return <SettingsMenu onBack={() => setActiveTab('career')} />;
      default:
        return null;
    }
  };

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
        
        {/* Top Bar */}
        <TopBar playerData={playerData} playerStats={playerStats} />

        {/* Navigation Tabs */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-grow relative overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;