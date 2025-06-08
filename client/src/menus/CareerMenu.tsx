// client/src/menus/CareerMenu.tsx
import { useGameStore } from '../stores/gameStore';
import { useMenuStore } from '../stores/menuStore';

interface CareerMenuProps {
  onBack: () => void;
}

const CareerMenu = ({ onBack }: CareerMenuProps) => {
  const { setGameConfig, setGameState } = useGameStore();
  const { setIsTransitioning } = useMenuStore();

  const handleStart = () => {
    setGameConfig({
      mode: 'career',
      subMode: 'career',
      difficulty: 3,
      timeLimit: 120,
      scoreTarget: 1000
    });
    setIsTransitioning(true);
    setGameState('in-transition');
  };

  return (
    <div className="flex flex-col items-center min-h-screen text-white p-8 bg-transparent">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
      >
        <span className="text-xl">←</span> Back
      </button>

      <div className="flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            CAREER MODE
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Start your journey as a rhythm novice and climb the ranks!
            Begin with tutorial difficulty and unlock higher ranks as you progress.
            Each rank lasts 2 minutes - survive to advance!
          </p>
        </div>

        <div className="bg-black bg-opacity-50 rounded-xl p-8 mb-12 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">CURRENT RANK</h2>
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-3xl font-bold mb-2">ROOKIE</h3>
            <p className="text-gray-400">Difficulty: Tutorial (Level 3)</p>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 
                     px-12 py-4 rounded-xl text-2xl font-bold transform transition-all duration-300 
                     hover:scale-105 hover:shadow-2xl"
        >
          START CAREER
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Next Ranks: Amateur → Intermediate → Advanced → Expert → Master → Legend
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerMenu;