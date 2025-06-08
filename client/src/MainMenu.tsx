// client/src/MainMenu.tsx
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CareerMenu from './menus/CareerMenu';
import OnlinePortal from './OnlinePortal';
import PractiseMenu from './menus/PractiseMenu';
import SettingsMenu from './menus/SettingsMenu';
import DifficultyMenu from './menus/DifficultyMenu';
import TimeSelectionMenu from './menus/TimeSelectionMenu';
import ScoreSelectionMenu from './menus/ScoreSelectionMenu';
import ReplayBrowser from './replays/ReplayBrowser';
import PulsingBackground from './PulsingBackground'; // Changed
import { useMenuStore } from './stores/menuStore';
import { useGameStore } from './stores/gameStore';

const MainMenu = () => {
  const { menuState, setMenuState, isTransitioning } = useMenuStore();
  const { setGameConfig, setGameState } = useGameStore();
  
  const [localGameConfig, setLocalGameConfig] = useState({
    mode: '',
    subMode: '',
    difficulty: 30,
    timeLimit: 120,
    scoreTarget: 1000
  });

  const menuOptions = [
    { text: 'Career Mode', description: 'Progress through difficulty ranks', color: 'from-pink-500 to-purple-600', target: 'career' },
    { text: 'Online', description: 'Play with other players', color: 'from-green-500 to-emerald-600', target: 'online' },
    { text: 'Practise', description: 'Free practice mode', color: 'from-blue-500 to-cyan-600', target: 'practise' },
    { text: 'Replays', description: 'Watch saved replays', color: 'from-orange-500 to-red-600', target: 'replays' },
    { text: 'Settings', description: 'Game settings', color: 'from-purple-500 to-indigo-600', target: 'settings' }
  ];

  const handleMenuClick = (target: string) => {
    if (isTransitioning) return;
    setMenuState(target);
  };

  const handleBackClick = () => {
    setMenuState('main');
  };

  const handleConfigUpdate = (updates: Partial<typeof localGameConfig>) => {
    setLocalGameConfig(prev => ({ ...prev, ...updates }));
  };

  const handleGameStart = () => {
    setGameConfig(localGameConfig);
    setGameState('in-transition');
  };

  const renderCurrentMenu = () => {
    switch (menuState) {
      case 'career':
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 z-10">
              <CareerMenu 
                onBack={handleBackClick}
                onStart={() => {
                  handleConfigUpdate({ mode: 'career', difficulty: 3 });
                  handleGameStart();
                }}
              />
            </div>
          </div>
        );
      case 'online':
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 z-10">
              <OnlinePortal 
                onBack={handleBackClick}
                onStartGame={(config) => {
                  handleConfigUpdate({ 
                    mode: config.mode || 'online', 
                    subMode: config.subMode || config.gameMode || 'arena',
                    difficulty: config.difficulty || 50
                  });
                  handleGameStart();
                }}
              />
            </div>
          </div>
        );
      case 'practise':
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 z-10">
              <PractiseMenu 
                onBack={handleBackClick}
                onSelectMode={(mode) => {
                  handleConfigUpdate({ mode: 'practise', subMode: mode });
                  setMenuState(mode === 'time' ? 'time-selection' : 'score-selection');
                }}
              />
            </div>
          </div>
        );
      case 'time-selection':
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 z-10">
              <TimeSelectionMenu 
                onBack={() => setMenuState('practise')}
                onSelectTime={(timeLimit) => {
                  handleConfigUpdate({ timeLimit });
                  setMenuState('difficulty');
                }}
              />
            </div>
          </div>
        );
      case 'score-selection':
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 z-10">
              <ScoreSelectionMenu 
                onBack={() => setMenuState('practise')}
                onSelectScore={(scoreTarget) => {
                  handleConfigUpdate({ scoreTarget });
                  setMenuState('difficulty');
                }}
              />
            </div>
          </div>
        );
      case 'difficulty':
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 z-10">
              <DifficultyMenu 
                onBack={() => setMenuState(localGameConfig.subMode === 'time' ? 'time-selection' : 'score-selection')}
                onSelectDifficulty={(difficulty) => {
                  handleConfigUpdate({ difficulty });
                  handleGameStart();
                }}
              />
            </div>
          </div>
        );
      case 'replays':
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 z-10">
              <ReplayBrowser 
                isVisible={true}
                onClose={handleBackClick}
              />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>
            
            <div className="absolute inset-0 z-10">
              <SettingsMenu 
                onBack={handleBackClick}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="relative w-screen h-screen overflow-hidden">
            <Canvas 
              camera={{ position: [0, 2.5, 5], fov: 75 }} 
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <PulsingBackground /> {/* Changed */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
              </Suspense>
            </Canvas>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto px-8">
                <div className="mb-16 text-center">
                  <img 
                    src="/logo.png" 
                    alt="Game Logo" 
                    className="w-80 h-auto mx-auto animate-pulse"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                  {menuOptions.map((option, index) => (
                    <button
                      key={option.text}
                      onClick={() => handleMenuClick(option.target)}
                      disabled={isTransitioning}
                      className={`
                        group relative overflow-hidden rounded-xl p-6 
                        bg-black bg-opacity-30 backdrop-blur-sm
                        border border-white border-opacity-20
                        transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                        hover:bg-opacity-40 hover:border-opacity-40
                        disabled:opacity-50 disabled:cursor-not-allowed
                        animate-slide-up text-white
                      `}
                      style={{ 
                        animationDelay: `${index * 150}ms`,
                        background: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">{option.text}</h3>
                        <p className="text-sm opacity-90">{option.description}</p>
                      </div>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </button>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <p className="text-gray-300 text-sm">Use keys 1, 2, 3, 4, 5 to play</p>
                </div>

                <ReplayStatsDisplay />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`fixed inset-0 z-50 transition-transform duration-1000 ${
      isTransitioning ? 'transform translate-x-full' : 'transform translate-x-0'
    }`}>
      {renderCurrentMenu()}
    </div>
  );
};

const ReplayStatsDisplay = () => {
  const [replayStats, setReplayStats] = useState<{
    totalReplays: number;
    bestScore: number;
    bestAccuracy: number;
    totalPlayTime: number;
  } | null>(null);

  useState(() => {
    try {
      const replays = JSON.parse(localStorage.getItem('rhythm_game_replays') || '[]');
      if (replays.length > 0) {
        const bestScore = Math.max(...replays.map((r: any) => r.metadata.finalScore));
        const bestAccuracy = Math.max(...replays.map((r: any) => r.metadata.accuracy));
        const totalPlayTime = replays.reduce((sum: number, r: any) => sum + r.duration, 0);
        
        setReplayStats({
          totalReplays: replays.length,
          bestScore,
          bestAccuracy,
          totalPlayTime
        });
      }
    } catch (error) {
      console.error('Failed to load replay stats:', error);
    }
  });

  if (!replayStats || replayStats.totalReplays === 0) return null;

  const formatPlayTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="mt-8 p-6 bg-black bg-opacity-30 rounded-xl border border-gray-700 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-4 text-center text-gray-300">📊 Your Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-400">{replayStats.totalReplays}</div>
          <div className="text-xs text-gray-400">Replays</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-400">{replayStats.bestScore.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Best Score</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{replayStats.bestAccuracy.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Best Accuracy</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">{formatPlayTime(replayStats.totalPlayTime)}</div>
          <div className="text-xs text-gray-400">Play Time</div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;