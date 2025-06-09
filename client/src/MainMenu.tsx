import React, { useState, useEffect, Suspense } from 'react';
import CareerMenu from './menus/CareerMenu';
import OnlinePortal from './OnlinePortal';
import PractiseMenu from './menus/PractiseMenu';
import SettingsMenu from './menus/SettingsMenu';
import DifficultyMenu from './menus/DifficultyMenu';
import TimeSelectionMenu from './menus/TimeSelectionMenu';
import ScoreSelectionMenu from './menus/ScoreSelectionMenu';
import ReplayBrowser from './replays/ReplayBrowser';
import ArcadeMenu from './menus/ArcadeMenu';
import { AnimatedBackground } from './components/AnimatedBackground';
import { useMenuStore } from './stores/menuStore';
import { useGameStore } from './stores/gameStore';
import { Canvas } from '@react-three/fiber';

interface PlayerStats {
  totalReplays: number;
  bestScore: number;
  bestAccuracy: number;
  totalPlayTime: number;
}

const MainMenu = () => {
  const { menuState, setMenuState } = useMenuStore();
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
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col h-screen">
        
        {/* Enhanced Top Bar */}
        <div className="flex-shrink-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              
              {/* Left Section - Logo & Branding */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 group">
                  <div className="relative">
                    <img 
                      src="/logo.png" 
                      alt="KeyJam" 
                      className="h-10 w-auto animate-tilt group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      KeyJam
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Online Portal</div>
                  </div>
                </div>

                {/* Live Stats with Animations */}
                <div className="hidden xl:flex items-center gap-4 ml-8">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-green-400 text-sm font-semibold">1,247</span>
                    <span className="text-gray-400 text-xs">Online</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <span className="text-blue-400 text-lg">🎮</span>
                    <span className="text-blue-400 text-sm font-semibold">89</span>
                    <span className="text-gray-400 text-xs">Active Games</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <span className="text-purple-400 text-lg">🏟️</span>
                    <span className="text-purple-400 text-sm font-semibold">23</span>
                    <span className="text-gray-400 text-xs">Arenas</span>
                  </div>
                </div>
              </div>

              {/* Center Section - Quick Actions */}
              <div className="hidden lg:flex items-center gap-3">
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-500/25">
                  <span className="mr-2">⚡</span>
                  Quick Match
                </button>
                
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                  <span className="mr-2">🏆</span>
                  Tournaments
                </button>

                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                  <span className="mr-2">👥</span>
                  Create Party
                </button>
              </div>

              {/* Right Section - User Profile & Status */}
              <div className="flex items-center gap-4">
                
                {/* Performance Stats */}
                <div className="hidden md:flex items-center gap-4 bg-white/5 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-400">{calculateWinRate()}%</div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-400">{playerData.wins}/{playerData.losses}</div>
                    <div className="text-xs text-gray-400">W/L</div>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-purple-400">Lv.{playerData.level}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </div>
                  {playerStats && (
                    <>
                      <div className="w-px h-8 bg-white/20"></div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-yellow-400">
                          {playerStats.bestScore > 999999 ? `${(playerStats.bestScore / 1000000).toFixed(1)}M` : `${Math.floor(playerStats.bestScore / 1000)}K`}
                        </div>
                        <div className="text-xs text-gray-400">Best</div>
                      </div>
                      <div className="w-px h-8 bg-white/20"></div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">{formatPlayTime(playerStats.totalPlayTime)}</div>
                        <div className="text-xs text-gray-400">Playtime</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Notifications */}
                <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200 block">🔔</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </button>

                {/* User Profile Card */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-white/10 rounded-xl px-4 py-2 border border-white/20 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300 cursor-pointer group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                      👤
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-white font-semibold text-sm">{playerData.username}</div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-xs font-bold" 
                        style={{ color: getRankColor(playerData.rank) }}
                      >
                        {playerData.rank}
                      </span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-cyan-400 text-xs font-semibold">{playerData.elo} ELO</span>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Stats Row */}
            <div className="xl:hidden mt-3 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">1,247 Online</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <span className="text-blue-400 text-sm">🎮</span>
                <span className="text-blue-400 text-sm font-semibold">89 Games</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <span className="text-purple-400 text-sm">🏟️</span>
                <span className="text-purple-400 text-sm font-semibold">23 Arenas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-shrink-0 border-b border-white border-opacity-10">
          <div className="px-8">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative px-4 py-3 font-medium transition-all duration-300 ease-out min-w-max flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 bg-opacity-20 text-cyan-400'
                      : 'text-gray-300 hover:bg-purple-500 hover:bg-opacity-20 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-70">{tab.description}</div>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow relative overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;