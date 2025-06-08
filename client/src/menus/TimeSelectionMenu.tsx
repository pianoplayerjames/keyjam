// client/src/menus/TimeSelectionMenu.tsx
import { useGameStore } from '../stores/gameStore';

interface TimeSelectionMenuProps {
  onBack: () => void;
  onSelectTime: (timeLimit: number) => void;
}

const TimeSelectionMenu = ({ onBack, onSelectTime }: TimeSelectionMenuProps) => {
  const { setGameConfig, gameConfig } = useGameStore();

  const timeOptions = [
    { text: '1 Minute', value: 60, color: 'from-green-400 to-green-600', icon: '⚡' },
    { text: '2 Minutes', value: 120, color: 'from-blue-400 to-blue-600', icon: '🎵' },
    { text: '3 Minutes', value: 180, color: 'from-orange-400 to-orange-600', icon: '🎶' },
    { text: '5 Minutes', value: 300, color: 'from-red-400 to-red-600', icon: '🔥' },
    { text: '10 Minutes', value: 600, color: 'from-purple-400 to-purple-600', icon: '💪' },
    { text: 'Endless', value: -1, color: 'from-gray-500 to-gray-700', icon: '♾️' }
  ];

  const handleSelectTime = (timeLimit: number) => {
    setGameConfig({
      ...gameConfig,
      timeLimit
    });
    onSelectTime(timeLimit);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-transparent">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-lg"
      >
        <span className="text-xl">←</span> Back
      </button>

      <div className="flex flex-col items-center justify-center flex-1 max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            SELECT TIME LIMIT
          </h1>
          <p className="text-lg text-gray-300">
            Choose how long you want to practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {timeOptions.map((option, index) => (
            <button
              key={option.text}
              onClick={() => handleSelectTime(option.value)}
              className={`
                group relative overflow-hidden rounded-xl p-6 bg-gradient-to-r ${option.color}
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                animate-slide-up backdrop-blur-sm
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10 text-center">
                <div className="text-3xl mb-3">{option.icon}</div>
                <h3 className="text-xl font-bold">{option.text}</h3>
                {option.value === -1 && (
                  <p className="text-sm opacity-75 mt-2">Until you quit</p>
                )}
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSelectionMenu;