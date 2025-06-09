import { useGameStore } from '../../shared/stores/gameStore';
import { useMenuStore } from '../../shared/stores/menuStore';
import { useState, useEffect } from 'react';

interface CareerMenuProps {
  onBack: () => void;
}

const CareerMenu = ({ onBack }: CareerMenuProps) => {
  const { gameConfig, setGameConfig, setGameState, career, resetGame } = useGameStore();
  const { setIsTransitioning } = useMenuStore();
  const [hoveredLevel, setHoveredLevel] = useState<{chapterIndex: number, levelIndex: number} | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

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
          case 'S': return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(255,255,0,0.5)]';
          case 'A': return 'text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]';
          case 'B': return 'text-blue-400 drop-shadow-[0_0_10px_rgba(0,100,255,0.5)]';
          case 'C': return 'text-orange-400 drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]';
          case 'D': return 'text-red-400 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]';
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
      { gradient: 'from-blue-500/30 via-cyan-500/20 to-blue-600/30', accent: 'blue-400', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' },
      { gradient: 'from-green-500/30 via-emerald-500/20 to-green-600/30', accent: 'green-400', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' },
      { gradient: 'from-purple-500/30 via-violet-500/20 to-purple-600/30', accent: 'purple-400', glow: 'shadow-[0_0_30px_rgba(147,51,234,0.3)]' },
      { gradient: 'from-pink-500/30 via-rose-500/20 to-pink-600/30', accent: 'pink-400', glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]' },
      { gradient: 'from-orange-500/30 via-amber-500/20 to-orange-600/30', accent: 'orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]' },
      { gradient: 'from-red-500/30 via-rose-500/20 to-red-600/30', accent: 'red-400', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]' },
      { gradient: 'from-indigo-500/30 via-blue-500/20 to-indigo-600/30', accent: 'indigo-400', glow: 'shadow-[0_0_30px_rgba(99,102,241,0.3)]' },
      { gradient: 'from-yellow-500/30 via-amber-500/20 to-yellow-600/30', accent: 'yellow-400', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]' },
      { gradient: 'from-teal-500/30 via-cyan-500/20 to-teal-600/30', accent: 'teal-400', glow: 'shadow-[0_0_30px_rgba(20,184,166,0.3)]' },
      { gradient: 'from-violet-500/30 via-purple-500/20 to-violet-600/30', accent: 'violet-400', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]' }
    ];
    return themes[chapterIndex] || { gradient: 'from-gray-500/30 to-slate-500/30', accent: 'gray-400', glow: '' };
  };

  const nextLevel = findNextLevel();
  const hasNextLevel = nextLevel !== null;

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 relative flex justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_70%)]" />
      
      <div className="relative z-10 w-full max-w-7xl h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-purple-500/50 hover:scrollbar-thumb-purple-400/70">
        <div className="px-6 py-8 lg:px-8">
          
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-3xl" />
            <div className="relative">
              <h1 className="text-6xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                SOLO CAREER
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mb-8 shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
              <p className="text-xl lg:text-2xl text-gray-300 font-medium tracking-wide">
                Rise to international fame and glory
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] group">
              <div className="text-5xl lg:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{career.currentRankIcon}</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-2">{career.currentRank}</h3>
              <p className="text-gray-400 text-base lg:text-lg">Current Rank</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(147,51,234,0.2)]">
              <h3 className="text-xl lg:text-2xl font-bold text-purple-400 mb-4 lg:mb-6">Next Rank</h3>
              <div className="relative bg-gray-700/50 rounded-full h-5 lg:h-6 overflow-hidden mb-3 lg:mb-4">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  style={{ width: `${career.progressToNextRank}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full" />
              </div>
              <p className="text-right text-base lg:text-lg font-semibold text-gray-300">{career.progressToNextRank.toFixed(0)}%</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-700/50 hover:border-pink-400/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(236,72,153,0.2)]">
              <h3 className="text-xl lg:text-2xl font-bold text-pink-400 mb-4 lg:mb-6">Overall Progress</h3>
              <div className="relative bg-gray-700/50 rounded-full h-5 lg:h-6 overflow-hidden mb-3 lg:mb-4">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                  style={{ width: `${career.overallCompletion}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full" />
              </div>
              <p className="text-right text-base lg:text-lg font-semibold text-gray-300">{career.overallCompletion.toFixed(0)}%</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-700/50 hover:border-green-400/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]">
              {hasNextLevel ? (
                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-400 hover:to-cyan-500 px-6 lg:px-8 py-4 lg:py-6 rounded-2xl text-xl lg:text-2xl font-bold transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2 lg:gap-3">
                    <span className="text-2xl lg:text-3xl">🎮</span>
                    CONTINUE
                  </span>
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-5xl lg:text-6xl mb-4 animate-bounce">🏆</div>
                  <p className="text-xl lg:text-2xl font-bold text-yellow-400 mb-2">Complete!</p>
                  <p className="text-base lg:text-lg text-gray-400">All levels finished</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-4">
                🎵 CHAPTERS 🎵
              </h2>
              <div className="w-32 lg:w-48 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
            </div>
            
            <div className="space-y-8">
              {career.chapters.map((chapter, chapterIndex) => {
                const theme = getChapterTheme(chapterIndex);
                const isSelected = selectedChapter === chapterIndex;
                
                return (
                  <div 
                    key={chapter.name} 
                    className={`
                      relative overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer
                      ${chapter.unlocked 
                        ? `bg-gradient-to-br ${theme.gradient} hover:scale-[1.02] ${theme.glow} border-2 border-${theme.accent}/30 hover:border-${theme.accent}/60` 
                        : 'bg-gray-900/60 border-2 border-gray-700/50 opacity-40'
                      }
                      ${isSelected ? 'scale-[1.02] ' + theme.glow : ''}
                    `}
                    onClick={() => setSelectedChapter(isSelected ? null : chapterIndex)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    
                    <div className="relative z-10 p-6 lg:p-8">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className={`text-5xl lg:text-7xl transform transition-all duration-300 ${chapter.unlocked ? 'hover:scale-110 hover:rotate-12' : ''}`}>
                            {getChapterIcon(chapterIndex)}
                          </div>
                          <div>
                            <h3 className={`text-2xl lg:text-4xl font-black mb-2 ${chapter.unlocked ? 'text-white' : 'text-gray-500'}`}>
                              {chapter.name}
                            </h3>
                            <p className={`text-lg lg:text-xl font-semibold ${chapter.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                              Chapter {chapterIndex + 1}
                            </p>
                          </div>
                        </div>
                        
                        {chapter.unlocked ? (
                          <div className="text-left lg:text-right w-full lg:w-auto">
                            <p className={`text-lg lg:text-xl font-bold text-${theme.accent} mb-3`}>
                              {chapter.completion.toFixed(0)}% Complete
                            </p>
                            <div className="w-full lg:w-48 h-3 lg:h-4 bg-gray-700/50 rounded-full overflow-hidden">
                              <div 
                                className={`h-3 lg:h-4 bg-gradient-to-r from-${theme.accent} to-${theme.accent}/70 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
                                style={{ width: `${chapter.completion}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 lg:gap-4 text-gray-600">
                            <span className="text-3xl lg:text-4xl">🔒</span>
                            <span className="font-bold text-lg lg:text-xl">LOCKED</span>
                          </div>
                        )}
                      </div>

                      <p className={`text-base lg:text-lg mb-6 lg:mb-8 ${chapter.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getChapterDescription(chapterIndex)}
                      </p>
                      
                      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 transition-all duration-500 ${isSelected ? 'opacity-100 max-h-96' : 'opacity-60 max-h-32 overflow-hidden'}`}>
                        {chapter.levels.map((level, levelIndex) => (
                          <button 
                            key={level.name} 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (level.unlocked) handleStartLevel(chapterIndex, levelIndex);
                            }}
                            onMouseEnter={() => setHoveredLevel({chapterIndex, levelIndex})}
                            onMouseLeave={() => setHoveredLevel(null)}
                            disabled={!level.unlocked}
                            className={`
                              relative p-4 lg:p-6 rounded-2xl text-center transition-all duration-300 group border-2
                              ${level.unlocked 
                                ? `bg-gray-800/60 hover:bg-gray-700/80 hover:scale-105 border-gray-600/50 hover:border-${theme.accent}/60 cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]` 
                                : 'bg-gray-900/40 cursor-not-allowed border-gray-800/50'
                              }
                              ${hoveredLevel?.chapterIndex === chapterIndex && hoveredLevel?.levelIndex === levelIndex ? 'scale-105 ' + theme.glow : ''}
                            `}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative z-10">
                              <div className={`font-bold text-sm lg:text-lg mb-2 lg:mb-3 ${level.unlocked ? 'text-gray-200' : 'text-gray-600'}`}>
                                {level.name}
                              </div>
                              
                              <div className={`font-black text-3xl lg:text-5xl mb-3 lg:mb-4 ${getRankColor(level.rank)} transition-all duration-300`}>
                                {level.rank || (level.unlocked ? '—' : '🔒')}
                              </div>
                              
                              {level.unlocked && (
                                <div className="text-xs lg:text-sm text-gray-400 space-y-1 lg:space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span>Difficulty:</span>
                                    <span className={`font-bold ${getDifficultyColor(level.difficulty)}`}>
                                      {level.difficulty}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Lanes:</span>
                                    <span className="text-blue-400 font-bold">{level.lanes}</span>
                                  </div>
                                  {level.timeLimit > 0 && (
                                    <div className="flex justify-between items-center">
                                      <span>Time:</span>
                                      <span className="text-green-400 font-bold">
                                        {Math.floor(level.timeLimit / 60)}:{(level.timeLimit % 60).toString().padStart(2, '0')}
                                      </span>
                                    </div>
                                  )}
                                  {level.scoreTarget > 0 && (
                                    <div className="flex justify-between items-center">
                                      <span>Target:</span>
                                      <span className="text-yellow-400 font-bold">
                                        {level.scoreTarget.toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {level.tutorial && (
                                <div className="absolute -top-1 lg:-top-2 -right-1 lg:-right-2 bg-blue-500 text-white text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full shadow-lg">
                                  📚
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {!chapter.unlocked && (
                        <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-gray-900/50 rounded-2xl border border-gray-700/50">
                          <p className="text-base lg:text-lg text-gray-400 text-center font-medium">
                            {getUnlockRequirement(chapterIndex)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 lg:mt-16 relative">
            <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 rounded-3xl p-8 lg:p-12 border border-purple-500/30 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative z-10">
                <h3 className="text-3xl lg:text-4xl font-black text-purple-400 mb-6 lg:mb-8 text-center">🎯 Master Your Rhythm</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  <div className="text-center group">
                    <div className="text-4xl lg:text-6xl mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">🎵</div>
                    <p className="text-lg lg:text-xl text-gray-300 font-medium">Timing beats speed - precision unlocks progression</p>
                  </div>
                  <div className="text-center group">
                    <div className="text-4xl lg:text-6xl mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">📈</div>
                    <p className="text-lg lg:text-xl text-gray-300 font-medium">Master new mechanics in each evolving chapter</p>
                  </div>
                  <div className="text-center group">
                    <div className="text-4xl lg:text-6xl mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">🏆</div>
                    <p className="text-lg lg:text-xl text-gray-300 font-medium">Higher ranks unlock advanced challenges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    "Available from the start",
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