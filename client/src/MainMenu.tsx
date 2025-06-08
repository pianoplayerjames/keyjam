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
    { text: 'Career Mode', description: 'Progress through difficulty ranks', color: 'from-pink-500 to-purple-600', target: 'career', icon: '🚀' },
    { text: 'Online', description: 'Play with other players', color: 'from-green-500 to-emerald-600', target: 'online', icon: '🌐' },
    { text: 'Practise', description: 'Free practice mode', color: 'from-blue-500 to-cyan-600', target: 'practise', icon: '🎯' },
    { text: 'Replays', description: 'Watch saved replays', color: 'from-orange-500 to-red-600', target: 'replays', icon: '🎬' },
    { text: 'Settings', description: 'Game settings', color: 'from-gray-500 to-gray-700', target: 'settings', icon: '⚙️' }
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
          <div className="relative w-screen h-screen overflow-hidden font-sans">
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

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-1/3 h-1 bg-cyan-400 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-1/3 h-1 bg-pink-500 animate-pulse" />
            
            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between">
              {/* Top Header */}
              <header className="flex justify-between items-start">
                <img 
                  src="/logo.png" 
                  alt="Game Logo" 
                  className="w-52 h-auto animate-tilt"
                />
                <ReplayStatsDisplay />
              </header>

              {/* Main Content */}
              <main className="flex-1 flex items-center -mt-16">
                <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col items-start gap-4">
                  {menuOptions.map((option, index) => (
                    <button
                      key={option.text}
                      onClick={() => handleMenuClick(option.target)}
                      disabled={isTransitioning}
                      className={`
                        group w-full text-left text-white text-3xl font-extrabold uppercase
                        pl-6 pr-16 py-2 relative bg-black bg-opacity-40
                        border-l-4 ${option.target === 'online' ? 'border-green-400' : 'border-pink-500'}
                        transition-all duration-300 ease-in-out
                        hover:pl-10 hover:bg-opacity-70 hover:shadow-2xl hover:shadow-cyan-500/20
                        focus:outline-none focus:ring-4 ring-white ring-opacity-50
                        animate-slide-up
                      `}
                      style={{
                        animationDelay: `${150 * index}ms`,
                        clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity text-cyan-300">
                          {option.icon}
                        </span>
                        <div>
                          <p className="tracking-wider">{option.text}</p>
                          <p className="text-sm normal-case font-light opacity-70 tracking-normal">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </main>
              

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
      // In a real app, this might come from a store or an API call.
      const storedReplays = localStorage.getItem('rhythm-game-replays');
      const replays = storedReplays ? JSON.parse(storedReplays).state.savedReplays : [];

      if (replays && replays.length > 0) {
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
    <div className="p-4 bg-black bg-opacity-60 rounded-lg border-2 border-purple-500 text-white w-64 backdrop-blur-sm">
      <h3 className="text-base font-bold mb-3 text-center text-purple-300 tracking-widest border-b border-purple-800 pb-2">HALL OF FAME</h3>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-gray-400">Total Replays</span>
          <span className="font-bold text-lg text-purple-400">{replayStats.totalReplays}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-gray-400">Best Score</span>
          <span className="font-bold text-lg text-yellow-400">{replayStats.bestScore.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-gray-400">Top Accuracy</span>
          <span className="font-bold text-lg text-green-400">{replayStats.bestAccuracy.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold text-gray-400">Total Playtime</span>
          <span className="font-bold text-lg text-cyan-400">{formatPlayTime(replayStats.totalPlayTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;