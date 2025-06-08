import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CareerMenu from './menus/CareerMenu';
import OnlinePortal from './OnlinePortal';
import PractiseMenu from './menus/PractiseMenu';
import SettingsMenu from './menus/SettingsMenu';
import DifficultyMenu from './menus/DifficultyMenu';
import TimeSelectionMenu from './menus/TimeSelectionMenu';
import ScoreSelectionMenu from './menus/ScoreSelectionMenu';
import ReplayBrowser from './replays/ReplayBrowser';
import ArcadeMenu from './menus/ArcadeMenu';
import PulsingBackground from './PulsingBackground';
import { useMenuStore } from './stores/menuStore';
import { useGameStore } from './stores/gameStore';

interface PlayerStats {
  totalReplays: number;
  bestScore: number;
  bestAccuracy: number;
  totalPlayTime: number;
}

const MainMenu = () => {
  const { menuState, setMenuState, isTransitioning } = useMenuStore();
  const { gameConfig, setGameConfig, setGameState } = useGameStore();
  
  const [activeTab, setActiveTab] = useState<'career' | 'arcade' | 'online' | 'practice' | 'replays' | 'settings'>('career');
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

  // Load player stats
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

  const formatPlayTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      case 'diamond': return '#b9f2ff';
      case 'master': return '#ff6b35';
      case 'grandmaster': return '#ff1744';
      default: return '#666';
    }
  };

  const calculateWinRate = () => {
    const total = playerData.wins + playerData.losses + playerData.draws;
    return total > 0 ? ((playerData.wins / total) * 100).toFixed(1) : '0.0';
  };

  const tabs = [
    { 
      id: 'career' as const, 
      label: 'Career', 
      icon: '🚀', 
      color: 'from-pink-500 to-purple-600',
      description: 'Progress through difficulty ranks'
    },
    { 
      id: 'arcade' as const, 
      label: 'Arcade', 
      icon: '🎵', 
      color: 'from-teal-500 to-cyan-600',
      description: 'Select your own songs'
    },
    { 
      id: 'online' as const, 
      label: 'Online', 
      icon: '🌐', 
      color: 'from-green-500 to-emerald-600',
      description: 'Play with others worldwide'
    },
    { 
      id: 'practice' as const, 
      label: 'Training', 
      icon: '🎯', 
      color: 'from-blue-500 to-cyan-600',
      description: 'Improve at your own pace'
    },
    { 
      id: 'replays' as const, 
      label: 'Replays', 
      icon: '🎬', 
      color: 'from-orange-500 to-red-600',
      description: 'Watch saved replays'
    },
    { 
      id: 'settings' as const, 
      label: 'Settings', 
      icon: '⚙️', 
      color: 'from-gray-500 to-gray-700',
      description: 'Game settings'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'career':
        return (
          <CareerMenu 
            onBack={() => {}}
          />
        );
      case 'arcade':
        return (
          <ArcadeMenu
            onBack={() => setActiveTab('career')}
            onSelectSong={handleSelectSong}
          />
        );
      case 'online':
        return (
          <OnlinePortal 
            onBack={() => setActiveTab('career')}
            onStartGame={(config) => {
              setLocalGameConfig(prev => ({ 
                ...prev,
                mode: config.mode || 'online', 
                subMode: config.subMode || config.gameMode || 'arena',
                difficulty: config.difficulty || 50
              }));
              handleGameStart();
            }}
          />
        );
      case 'practice':
        return (
          <PractiseMenu 
            onBack={() => setActiveTab('career')}
            onSelectMode={(mode) => {
              setLocalGameConfig(prev => ({ ...prev, mode: 'practise', subMode: mode }));
              setMenuState(mode === 'time' ? 'time-selection' : 'score-selection');
            }}
          />
        );
      case 'replays':
        return (
          <div className="h-full">
            <ReplayBrowser 
              isVisible={true}
              onClose={() => setActiveTab('career')}
            />
          </div>
        );
      case 'settings':
        return (
          <SettingsMenu 
            onBack={() => setActiveTab('career')}
          />
        );
      default:
        return null;
    }
  };

  // Handle sub-menu states for practice mode
  if (menuState === 'time-selection' || menuState === 'score-selection' || menuState === 'difficulty') {
    return (
      <div className="relative w-screen h-screen overflow-hidden">
        <Canvas 
          camera={{ position: [0, 2.5, 5], fov: 75 }} 
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <PulsingBackground />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
          </Suspense>
        </Canvas>
        
        <div className="absolute inset-0 z-10">
          {menuState === 'time-selection' && (
            <TimeSelectionMenu 
              onBack={() => setMenuState('main')}
              onSelectTime={(timeLimit) => {
                setLocalGameConfig(prev => ({ ...prev, timeLimit }));
                setMenuState('difficulty');
              }}
            />
          )}
          {menuState === 'score-selection' && (
            <ScoreSelectionMenu 
              onBack={() => setMenuState('main')}
            />
          )}
          {menuState === 'difficulty' && (
            <DifficultyMenu 
              onBack={() => setMenuState(localGameConfig.subMode === 'time' ? 'time-selection' : 'score-selection')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 transition-transform duration-1000">
      {/* Background */}
      <div className="absolute inset-0">
        <Canvas 
          camera={{ position: [0, 2.5, 5], fov: 75 }} 
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <PulsingBackground />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced Header Bar with Stats */}
      <div className="relative z-10 bg-white bg-opacity-5 border-b border-white border-opacity-10 backdrop-blur-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <img 
                src="/logo.png" 
                alt="KeyJam" 
                className="h-12 w-auto animate-tilt"
              />
              <div className="text-white font-bold text-xl">
                KeyJam Online
              </div>
            </div>

            {/* Center Stats Section */}
            <div className="flex items-center gap-8">
              {/* Online Stats */}
              <div className="hidden lg:flex gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>1,247 Online</span>
                </div>
                <div>🎮 89 Games</div>
                <div>🏟️ 23 Arenas</div>
              </div>

              {/* Player Performance Stats */}
              <div className="hidden md:flex items-center gap-6 bg-white bg-opacity-10 rounded-lg px-4 py-2 border border-white border-opacity-20">
                <div className="text-center">
                  <div className="text-sm font-bold text-green-400">{calculateWinRate()}%</div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-400">
                    {playerData.wins}/{playerData.losses}/{playerData.draws}
                  </div>
                  <div className="text-xs text-gray-400">W/L/D</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-400">Lv.{playerData.level}</div>
                  <div className="text-xs text-gray-400">Level</div>
                </div>
                {playerStats && (
                  <>
                    <div className="text-center">
                      <div className="text-sm font-bold text-yellow-400">
                        {playerStats.bestScore > 999999 
                          ? `${(playerStats.bestScore / 1000000).toFixed(1)}M` 
                          : `${Math.floor(playerStats.bestScore / 1000)}K`}
                      </div>
                      <div className="text-xs text-gray-400">Best Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-cyan-400">{formatPlayTime(playerStats.totalPlayTime)}</div>
                      <div className="text-xs text-gray-400">Playtime</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Player Card */}
            <div className="flex items-center gap-4 bg-white bg-opacity-10 rounded-xl px-4 py-2 border border-white border-opacity-20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                👤
              </div>
              <div>
                <div className="text-white font-semibold">{playerData.username}</div>
                <div className="text-sm" style={{ color: getRankColor(playerData.rank) }}>
                  {playerData.rank} • {playerData.elo} ELO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 bg-white bg-opacity-5 border-b border-white border-opacity-10 backdrop-blur-sm">
        <div className="px-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group relative px-6 py-4 text-white font-medium transition-all duration-300 ease-out
                  hover:bg-white hover:bg-opacity-10 min-w-max flex items-center gap-3
                  ${activeTab === tab.id ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </div>
                
                {/* Active Tab Indicator */}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Main Content Area */}
      <div className="relative z-10 h-[calc(100vh-160px)] backdrop-blur-sm overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MainMenu;