import { useState } from 'react';
import CareerMenu from './menus/CareerMenu';
import OnlineMenu from './menus/OnlineMenu';
import PractiseMenu from './menus/PractiseMenu';
import SettingsMenu from './menus/SettingsMenu';
import DifficultyMenu from './menus/DifficultyMenu';
import TimeSelectionMenu from './menus/TimeSelectionMenu';
import ScoreSelectionMenu from './menus/ScoreSelectionMenu';

interface GameConfig {
  mode: string;
  subMode: string;
  difficulty: number;
  timeLimit: number;
  scoreTarget: number;
}

interface MainMenuProps {
  menuState: string;
  onStartGame: (config: GameConfig) => void;
  onMenuNavigation: (state: string) => void;
  isTransitioning?: boolean;
}

const MainMenu = ({ 
  menuState, 
  onStartGame, 
  onMenuNavigation, 
  isTransitioning = false 
}: MainMenuProps) => {
  const [gameConfig, setGameConfig] = useState<GameConfig>({
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
    { text: 'Settings', description: 'Game settings', color: 'from-purple-500 to-indigo-600', target: 'settings' }
  ];

  const handleMenuClick = (target: string) => {
    if (isTransitioning) return;
    onMenuNavigation(target);
  };

  const handleBackClick = () => {
    onMenuNavigation('main');
  };

  const handleConfigUpdate = (updates: Partial<GameConfig>) => {
    setGameConfig(prev => ({ ...prev, ...updates }));
  };

  const handleGameStart = () => {
    onStartGame(gameConfig);
  };

  const renderCurrentMenu = () => {
    switch (menuState) {
      case 'career':
        return (
          <CareerMenu 
            onBack={handleBackClick}
            onStart={() => {
              handleConfigUpdate({ mode: 'career', difficulty: 3 });
              handleGameStart();
            }}
          />
        );
      case 'online':
        return (
          <OnlineMenu 
            onBack={handleBackClick}
            onSelectMode={(mode) => {
              handleConfigUpdate({ mode: 'online', subMode: mode });
              handleGameStart();
            }}
          />
        );
      case 'practise':
        return (
          <PractiseMenu 
            onBack={handleBackClick}
            onSelectMode={(mode) => {
              handleConfigUpdate({ mode: 'practise', subMode: mode });
              onMenuNavigation(mode === 'time' ? 'time-selection' : 'score-selection');
            }}
          />
        );
      case 'time-selection':
        return (
          <TimeSelectionMenu 
            onBack={() => onMenuNavigation('practise')}
            onSelectTime={(timeLimit) => {
              handleConfigUpdate({ timeLimit });
              onMenuNavigation('difficulty');
            }}
          />
        );
      case 'score-selection':
        return (
          <ScoreSelectionMenu 
            onBack={() => onMenuNavigation('practise')}
            onSelectScore={(scoreTarget) => {
              handleConfigUpdate({ scoreTarget });
              onMenuNavigation('difficulty');
            }}
          />
        );
      case 'difficulty':
        return (
          <DifficultyMenu 
            onBack={() => onMenuNavigation(gameConfig.subMode === 'time' ? 'time-selection' : 'score-selection')}
            onSelectDifficulty={(difficulty) => {
              handleConfigUpdate({ difficulty });
              handleGameStart();
            }}
          />
        );
      case 'settings':
        return (
          <SettingsMenu 
            onBack={handleBackClick}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
            <div className="flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto px-8">
              <div className="mb-16 text-center">
                <img 
                  src="/logo.png" 
                  alt="Game Logo" 
                  className="w-80 h-auto mx-auto mb-8 animate-pulse"
                />
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Rhythm Master
                </h1>
                <p className="text-xl text-gray-300">Master the rhythm, become the legend</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                {menuOptions.map((option, index) => (
                  <button
                    key={option.text}
                    onClick={() => handleMenuClick(option.target)}
                    disabled={isTransitioning}
                    className={`
                      group relative overflow-hidden rounded-xl p-6 bg-gradient-to-r ${option.color}
                      transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                      disabled:opacity-50 disabled:cursor-not-allowed
                      animate-slide-up
                    `}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-2">{option.text}</h3>
                      <p className="text-sm opacity-90">{option.description}</p>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300 group-hover:duration-200 animate-tilt" />
                  </button>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-400 text-sm">Use keys 1, 2, 3, 4, 5 to play</p>
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

export default MainMenu;