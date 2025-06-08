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
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header with Continue Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              CAREER MODE
            </h1>
            <p className="text-gray-300 text-lg">Progress through difficulty ranks and master the rhythm</p>
          </div>
          
          <div className="text-right">
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 
                        px-8 py-4 rounded-xl text-xl font-bold transform transition-all duration-300 
                        hover:scale-105 hover:shadow-2xl mb-4"
            >
              CONTINUE CAREER
            </button>
            <div className="text-right text-sm text-gray-400">
              <div>Current Rank: <span className="text-cyan-400 font-bold">{career.currentRank}</span></div>
              <div>Progress: <span className="text-purple-400 font-bold">{career.overallCompletion.toFixed(0)}%</span></div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black bg-opacity-40 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-4xl mb-2">{career.currentRankIcon}</div>
            <h3 className="text-xl font-bold text-cyan-400">{career.currentRank}</h3>
            <p className="text-gray-400 text-sm">Current Rank</p>
          </div>
          
          <div className="bg-black bg-opacity-40 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-purple-400 mb-3">Progress to {career.nextRank}</h3>
            <div className="bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 transition-all duration-500"
                style={{ width: `${career.progressToNextRank}%` }}
              />
            </div>
            <p className="text-right text-sm text-gray-400">{career.progressToNextRank.toFixed(0)}%</p>
          </div>

          <div className="bg-black bg-opacity-40 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-pink-400 mb-3">Overall Completion</h3>
            <div className="bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 transition-all duration-500"
                style={{ width: `${career.overallCompletion}%` }}
              />
            </div>
            <p className="text-right text-sm text-gray-400">{career.overallCompletion.toFixed(0)}%</p>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-cyan-400">CHAPTERS</h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {career.chapters.map((chapter, chapterIndex) => (
              <div 
                key={chapter.name} 
                className={`p-6 rounded-lg transition-all ${
                  chapter.unlocked 
                    ? 'bg-gray-800 bg-opacity-50 hover:bg-opacity-70 border border-gray-600' 
                    : 'bg-gray-900 bg-opacity-70 border border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-2xl font-bold ${chapter.unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {chapter.name}
                  </h3>
                  {chapter.unlocked ? 
                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-400">{chapter.completion.toFixed(0)}% Complete</p>
                      <div className="w-32 h-3 bg-gray-700 rounded-full mt-1">
                        <div 
                          className="h-3 bg-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${chapter.completion}%` }}
                        />
                      </div>
                    </div> :
                    <p className="text-sm font-bold text-gray-600 flex items-center gap-2">
                      <span>🔒</span> LOCKED
                    </p>
                  }
                </div>
                
                {chapter.unlocked && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {chapter.levels.map((level, levelIndex) => (
                      <button 
                        key={level.name} 
                        onClick={() => handleStartLevel(chapterIndex, levelIndex)}
                        disabled={!level.unlocked}
                        className={`p-4 rounded-lg text-center text-sm transition-all duration-200 ${
                          level.unlocked 
                            ? 'bg-gray-700 hover:bg-gray-600 hover:scale-105 border border-gray-600 hover:border-gray-400' 
                            : 'bg-gray-800 cursor-not-allowed border border-gray-700'
                        }`}
                      >
                        <div className={`font-semibold mb-2 ${level.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                          {level.name}
                        </div>
                        <div className={`font-bold text-2xl mb-1 ${getRankColor(level.rank)}`}>
                          {level.rank || (level.unlocked ? '-' : '🔒')}
                        </div>
                        {level.unlocked && (
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Difficulty: {level.difficulty}</div>
                            <div>Lanes: {level.lanes}</div>
                            {level.timeLimit > 0 && <div>Time: {Math.floor(level.timeLimit / 60)}:{(level.timeLimit % 60).toString().padStart(2, '0')}</div>}
                          </div>
                        )}
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
  );
};

export default CareerMenu;