import { useGameStore } from '../../shared/stores/gameStore';
import { useMenuStore } from '../../shared/stores/menuStore';

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
    }
  };

  const getRankColor = (rank: string | null) => {
      switch(rank) {
          case 'S': return 'text-yellow-400';
          case 'A': return 'text-green-400';
          case 'B': return 'text-blue-400';
          case 'C': return 'text-orange-400';
          case 'D': return 'text-red-400';
          case 'F': return 'text-gray-400';
          default: return 'text-gray-500';
      }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 20) return 'text-green-400';
    if (difficulty <= 40) return 'text-yellow-400';
    if (difficulty <= 60) return 'text-orange-400';
    if (difficulty <= 80) return 'text-red-400';
    return 'text-purple-400';
  };

  const getChapterIcon = (chapterIndex: number) => {
    const icons = ['🎓', '🌱', '🚀', '💎', '⚡', '👑', '🌟', '🔥', '💫', '🏆'];
    return icons[chapterIndex] || '🎵';
  };

  const getChapterTheme = (chapterIndex: number) => {
    const themes = [
      'from-blue-500/20 to-cyan-500/20 border-blue-400',
      'from-green-500/20 to-emerald-500/20 border-green-400', 
      'from-purple-500/20 to-violet-500/20 border-purple-400',
      'from-pink-500/20 to-rose-500/20 border-pink-400',
      'from-orange-500/20 to-amber-500/20 border-orange-400',
      'from-red-500/20 to-crimson-500/20 border-red-400',
      'from-indigo-500/20 to-blue-500/20 border-indigo-400',
      'from-yellow-500/20 to-orange-500/20 border-yellow-400',
      'from-teal-500/20 to-cyan-500/20 border-teal-400',
      'from-violet-500/20 to-purple-500/20 border-violet-400'
    ];
    return themes[chapterIndex] || 'from-gray-500/20 to-slate-500/20 border-gray-400';
  };

  const nextLevel = findNextLevel();
  const hasNextLevel = nextLevel !== null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-slide-up">
            CAREER MODE
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-slide-up">
            Master the art of rhythm through structured progression
          </p>
          
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
            <div className="bg-black/40 rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-2">{career.currentRankIcon}</div>
              <h3 className="text-xl font-bold text-cyan-400">{career.currentRank}</h3>
              <p className="text-gray-400 text-sm">Current Rank</p>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-purple-400 mb-3">Next Rank</h3>
              <div className="bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 transition-all duration-500"
                  style={{ width: `${career.progressToNextRank}%` }}
                />
              </div>
              <p className="text-right text-sm text-gray-400">{career.progressToNextRank.toFixed(0)}%</p>
            </div>

            <div className="bg-black/40 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-pink-400 mb-3">Overall Progress</h3>
              <div className="bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 transition-all duration-500"
                  style={{ width: `${career.overallCompletion}%` }}
                />
              </div>
              <p className="text-right text-sm text-gray-400">{career.overallCompletion.toFixed(0)}%</p>
            </div>

            <div className="bg-black/40 rounded-xl p-6 border border-gray-700">
              {hasNextLevel ? (
                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 
                            px-6 py-3 rounded-xl text-lg font-bold transform transition-all duration-300 
                            hover:scale-105 hover:shadow-2xl"
                >
                  🎮 CONTINUE
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-lg font-bold text-yellow-400">Complete!</p>
                  <p className="text-sm text-gray-400">All levels finished</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8">
            🎵 CHAPTERS 🎵
          </h2>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {career.chapters.map((chapter, chapterIndex) => (
              <div 
                key={chapter.name} 
                className={`
                  relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]
                  ${chapter.unlocked 
                    ? `bg-gradient-to-br ${getChapterTheme(chapterIndex)} hover:shadow-2xl border-2` 
                    : 'bg-gray-900/70 border-2 border-gray-700 opacity-60'
                  }
                `}
              >
                {/* Chapter Header */}
                <div className="p-6 border-b border-gray-600/50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{getChapterIcon(chapterIndex)}</div>
                      <div>
                        <h3 className={`text-2xl font-bold ${chapter.unlocked ? 'text-white' : 'text-gray-500'}`}>
                          {chapter.name}
                        </h3>
                        <p className={`text-sm ${chapter.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                          Chapter {chapterIndex + 1}
                        </p>
                      </div>
                    </div>
                    
                    {chapter.unlocked ? (
                      <div className="text-right">
                        <p className="text-sm font-bold text-cyan-400">
                          {chapter.completion.toFixed(0)}% Complete
                        </p>
                        <div className="w-32 h-3 bg-gray-700 rounded-full mt-1">
                          <div 
                            className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${chapter.completion}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-2xl">🔒</span>
                        <span className="font-bold text-sm">LOCKED</span>
                      </div>
                    )}
                  </div>

                  {/* Chapter Description */}
                  <p className={`text-sm ${chapter.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getChapterDescription(chapterIndex)}
                  </p>
                </div>
                
                {/* Levels Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapter.levels.map((level, levelIndex) => (
                      <button 
                        key={level.name} 
                        onClick={() => level.unlocked ? handleStartLevel(chapterIndex, levelIndex) : null}
                        disabled={!level.unlocked}
                        className={`
                          relative p-4 rounded-xl text-center text-sm transition-all duration-200 group
                          ${level.unlocked 
                            ? 'bg-gray-800/60 hover:bg-gray-700/80 hover:scale-105 border-2 border-gray-600 hover:border-gray-400 cursor-pointer' 
                            : 'bg-gray-900/60 cursor-not-allowed border-2 border-gray-800'
                          }
                        `}
                      >
                        {/* Level Background Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                        
                        <div className="relative z-10">
                          <div className={`font-semibold mb-2 ${level.unlocked ? 'text-gray-200' : 'text-gray-600'}`}>
                            {level.name}
                          </div>
                          
                          {/* Level Rank */}
                          <div className={`font-bold text-3xl mb-2 ${getRankColor(level.rank)}`}>
                            {level.rank || (level.unlocked ? '—' : '🔒')}
                          </div>
                          
                          {/* Level Stats */}
                          {level.unlocked && (
                            <div className="text-xs text-gray-400 space-y-1">
                              <div className="flex justify-between">
                                <span>Difficulty:</span>
                                <span className={getDifficultyColor(level.difficulty)}>
                                  {level.difficulty}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Lanes:</span>
                                <span className="text-blue-400">{level.lanes}</span>
                              </div>
                              {level.timeLimit > 0 && (
                                <div className="flex justify-between">
                                  <span>Time:</span>
                                  <span className="text-green-400">
                                    {Math.floor(level.timeLimit / 60)}:{(level.timeLimit % 60).toString().padStart(2, '0')}
                                  </span>
                                </div>
                              )}
                              {level.scoreTarget > 0 && (
                                <div className="flex justify-between">
                                  <span>Target:</span>
                                  <span className="text-yellow-400">
                                    {level.scoreTarget.toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Special Indicators */}
                          {level.tutorial && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              📚
                            </div>
                          )}
                          
                          {!level.unlocked && (
                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                              <span className="text-4xl">🔒</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chapter Requirements (for locked chapters) */}
                {!chapter.unlocked && (
                  <div className="p-6 border-t border-gray-700 bg-gray-900/50">
                    <p className="text-sm text-gray-500 text-center">
                      {getUnlockRequirement(chapterIndex)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">🎯 Career Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-lg mb-2">🎵</div>
                <p className="text-gray-300">Focus on timing over speed - accuracy is key to progression</p>
              </div>
              <div>
                <div className="text-lg mb-2">📈</div>
                <p className="text-gray-300">Each chapter introduces new mechanics and challenges</p>
              </div>
              <div>
                <div className="text-lg mb-2">🏆</div>
                <p className="text-gray-300">Achieve higher ranks to unlock advanced content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for chapter descriptions and requirements
function getChapterDescription(chapterIndex: number): string {
  const descriptions = [
    "Learn the basics of rhythm gaming with guided tutorials and gentle introduction to timing",
    "Master fundamental timing and simple patterns with basic multi-note sequences", 
    "Develop advanced techniques with complex rhythms and multi-lane coordination",
    "Challenge yourself with professional-level patterns requiring precision and skill",
    "Face lightning-fast sequences and precision timing that tests your reflexes",
    "Conquer the most difficult rhythm combinations with unforgiving challenges",
    "Enter the realm of rhythm mastery where only perfection will suffice",
    "Push the boundaries of human capability with frame-perfect requirements"
  ];
  return descriptions[chapterIndex] || "New challenges await in this chapter";
}

function getUnlockRequirement(chapterIndex: number): string {
  const requirements = [
    "Available from the start", // Tutorial
    "Complete the Tutorial chapter with grade C or better",
    "Complete The Beginning chapter with grade C or better", 
    "Complete Ascension chapter with grade B or better",
    "Complete Mastery chapter with grade B or better",
    "Complete Lightning Speed chapter with grade A or better",
    "Complete Conquest chapter with grade S rank",
    "Complete Transcendence chapter with perfect S ranks"
  ];
  return requirements[chapterIndex] || "Complete previous chapters to unlock";
}

export default CareerMenu;