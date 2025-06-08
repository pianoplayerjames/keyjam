import { useGameStore } from '../stores/gameStore';
import { useMenuStore } from '../stores/menuStore';

interface CareerMenuProps {
  onBack: () => void;
}

const CareerMenu = ({ onBack }: CareerMenuProps) => {
  const { gameConfig, setGameConfig, setGameState, career, resetGame } = useGameStore();
  const { setIsTransitioning } = useMenuStore();

  const findNextLevel = () => {
    for (let i = 0; i < career.chapters.length; i++) {
        if (career.chapters[i].unlocked) {
            for (let j = 0; j < career.chapters[i].levels.length; j++) {
                const level = career.chapters[i].levels[j];
                if (level.unlocked && !level.rank) {
                    return { chapterIndex: i, levelIndex: j, level };
                }
            }
        }
    }
    return null;
  };

  const handleStartLevel = (chapterIndex: number, levelIndex: number) => {
    const level = career.chapters[chapterIndex].levels[levelIndex];
    if (!level.unlocked) {
        alert("This level is locked!");
        return;
    }
    
    resetGame(); 

    setGameConfig({
      mode: 'career',
      subMode: 'career',
      difficulty: level.difficulty,
      timeLimit: level.timeLimit,
      scoreTarget: level.scoreTarget,
      lanes: level.lanes,
      tutorial: level.tutorial,
      career: { chapterIndex, levelIndex }
    });
    setIsTransitioning(true);
    setGameState('in-transition');
  };

  const handleContinue = () => {
    const nextLevel = findNextLevel();
    if (nextLevel) {
        handleStartLevel(nextLevel.chapterIndex, nextLevel.levelIndex);
    } else {
        alert("Congratulations! You've completed all available levels!");
    }
  };

  const getRankColor = (rank: string | null) => {
      switch(rank) {
          case 'S': return 'text-yellow-400';
          case 'A': return 'text-green-400';
          case 'B': return 'text-blue-400';
          case 'C': return 'text-orange-400';
          default: return 'text-gray-500';
      }
  }

  return (
    <div className="flex flex-col items-center min-h-screen text-white p-8 bg-transparent">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
      >
        <span className="text-xl">←</span> Back
      </button>
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            CAREER MODE
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-black bg-opacity-40 rounded-xl p-6 border border-gray-700 flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">CURRENT STATUS</h2>
                    <div className="text-center bg-gray-800 bg-opacity-50 rounded-lg p-4">
                        <div className="text-5xl mb-2">{career.currentRankIcon}</div>
                        <h3 className="text-3xl font-bold mb-1">{career.currentRank}</h3>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2 text-center">Progress to {career.nextRank}</h3>
                    <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4"
                            style={{ width: `${career.progressToNextRank}%` }}
                        />
                    </div>
                    <p className="text-right text-sm mt-1">{career.progressToNextRank.toFixed(0)}%</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2 text-center">Overall Completion</h3>
                     <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-pink-500 to-purple-600 h-4"
                            style={{ width: `${career.overallCompletion}%` }}
                        />
                    </div>
                    <p className="text-right text-sm mt-1">{career.overallCompletion.toFixed(0)}%</p>
                </div>
                <button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 
                                mt-4 px-8 py-4 rounded-xl text-xl font-bold transform transition-all duration-300 
                                hover:scale-105 hover:shadow-2xl"
                >
                    CONTINUE CAREER
                </button>
            </div>
            <div className="lg:col-span-2 bg-black bg-opacity-40 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">CHAPTERS</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {career.chapters.map((chapter, chapterIndex) => (
                        <div key={chapter.name} className={`p-4 rounded-lg transition-all ${chapter.unlocked ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-900 bg-opacity-70'}`}>
                            <div className="flex justify-between items-center">
                                <h3 className={`text-xl font-bold ${chapter.unlocked ? 'text-white' : 'text-gray-500'}`}>{chapter.name}</h3>
                                {chapter.unlocked ? 
                                  <p className="text-sm font-bold text-cyan-400">{chapter.completion.toFixed(0)}% Complete</p> :
                                  <p className="text-sm font-bold text-gray-600">LOCKED 🔒</p>
                                }
                            </div>
                            {chapter.unlocked && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                                    {chapter.levels.map((level, levelIndex) => (
                                        <button 
                                            key={level.name} 
                                            onClick={() => handleStartLevel(chapterIndex, levelIndex)}
                                            disabled={!level.unlocked}
                                            className={`p-2 rounded text-center text-sm transition-all ${level.unlocked ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 cursor-not-allowed'}`}
                                        >
                                            <p className={`${level.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>{level.name}</p>
                                            <p className={`font-bold ${getRankColor(level.rank)}`}>{level.rank || '-'}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CareerMenu;