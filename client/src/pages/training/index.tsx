import React, { useState, useEffect } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';
import { useGameStore } from '@/shared/stores/gameStore';
import { useReplayStore } from '@/shared/stores/replayStore';

interface TrainingData {
  lessonsCompleted: number;
  totalLessons: number;
  skillGamesBest: { [key: string]: number };
  weakAreas: string[];
  recentMistakes: Array<{
    type: string;
    frequency: number;
    improvement: number;
  }>;
  practiceStats: {
    totalHours: number;
    streak: number;
    accuracy: number;
    improvement: number;
  };
}

interface TrainingHubProps {
  onBack: () => void;
  onStartGame: (config: any) => void;
}

const TrainingHub: React.FC<TrainingHubProps> = ({ onBack, onStartGame }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'lessons' | 'skills' | 'analysis' | 'leaderboards'>('overview');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedSkillGame, setSelectedSkillGame] = useState<string | null>(null);
  const { savedReplays } = useReplayStore();
  
  // Mock training data - in real app this would come from your backend
  const [trainingData] = useState<TrainingData>({
    lessonsCompleted: 12,
    totalLessons: 24,
    skillGamesBest: {
      'timing-precision': 95,
      'pattern-recognition': 87,
      'chord-reading': 78,
      'sight-reading': 82,
      'polyrhythm': 65
    },
    weakAreas: ['Polyrhythm', 'Fast Transitions', 'Cross-Hand Patterns'],
    recentMistakes: [
      { type: 'Early Hits', frequency: 23, improvement: -5 },
      { type: 'Missed Notes', frequency: 18, improvement: 12 },
      { type: 'Wrong Key', frequency: 15, improvement: 8 },
      { type: 'Timing Issues', frequency: 31, improvement: -2 }
    ],
    practiceStats: {
      totalHours: 47.5,
      streak: 12,
      accuracy: 89.2,
      improvement: 7.3
    }
  });

  const lessons = [
    {
      id: 'basics-1',
      title: 'Rhythm Fundamentals',
      description: 'Learn to feel the beat and understand basic note values',
      difficulty: 'Beginner',
      duration: '15 min',
      completed: true,
      icon: '🎵',
      color: 'from-green-500 to-emerald-600',
      topics: ['Quarter Notes', 'Half Notes', 'Whole Notes', 'Basic Timing']
    },
    {
      id: 'basics-2', 
      title: 'Reading Simple Patterns',
      description: 'Practice sight-reading basic rhythm patterns',
      difficulty: 'Beginner',
      duration: '20 min',
      completed: true,
      icon: '👀',
      color: 'from-blue-500 to-cyan-600',
      topics: ['Pattern Recognition', 'Note Reading', 'Visual Cues']
    },
    {
      id: 'intermediate-1',
      title: 'Eighth Note Mastery',
      description: 'Master faster rhythms with eighth notes and combinations',
      difficulty: 'Intermediate',
      duration: '25 min',
      completed: false,
      icon: '⚡',
      color: 'from-orange-500 to-red-600',
      topics: ['Eighth Notes', 'Mixed Patterns', 'Speed Building']
    },
    {
      id: 'intermediate-2',
      title: 'Syncopation & Off-beats',
      description: 'Learn to play off the beat and syncopated rhythms',
      difficulty: 'Intermediate', 
      duration: '30 min',
      completed: false,
      icon: '🎭',
      color: 'from-purple-500 to-pink-600',
      topics: ['Syncopation', 'Off-beat Timing', 'Jazz Rhythms']
    },
    {
      id: 'advanced-1',
      title: 'Polyrhythm Fundamentals',
      description: 'Play multiple rhythms simultaneously',
      difficulty: 'Advanced',
      duration: '35 min',
      completed: false,
      icon: '🧠',
      color: 'from-red-500 to-rose-600',
      topics: ['Multiple Rhythms', 'Independence', 'Complex Patterns']
    },
    {
      id: 'advanced-2',
      title: 'Sight Reading Speed',
      description: 'Read and play new patterns instantly',
      difficulty: 'Advanced',
      duration: '40 min', 
      completed: false,
      icon: '🚀',
      color: 'from-indigo-500 to-purple-600',
      topics: ['Speed Reading', 'Pattern Recognition', 'Instant Play']
    }
  ];

  const skillGames = [
    {
      id: 'timing-precision',
      title: 'Timing Precision Drill',
      description: 'Perfect your timing accuracy with metronome challenges',
      bestScore: trainingData.skillGamesBest['timing-precision'] || 0,
      icon: '🎯',
      color: 'from-green-500 to-teal-600',
      type: 'precision',
      difficulty: 'All Levels'
    },
    {
      id: 'pattern-recognition',
      title: 'Pattern Memory Game',
      description: 'Memorize and repeat increasingly complex patterns',
      bestScore: trainingData.skillGamesBest['pattern-recognition'] || 0,
      icon: '🧩',
      color: 'from-blue-500 to-indigo-600', 
      type: 'memory',
      difficulty: 'Beginner+'
    },
    {
      id: 'chord-reading',
      title: 'Chord Recognition Speed',
      description: 'Quickly identify and play chord patterns',
      bestScore: trainingData.skillGamesBest['chord-reading'] || 0,
      icon: '🎹',
      color: 'from-purple-500 to-pink-600',
      type: 'reading',
      difficulty: 'Intermediate+'
    },
    {
      id: 'sight-reading',
      title: 'Sight Reading Challenge',
      description: 'Read and play new notation on the spot',
      bestScore: trainingData.skillGamesBest['sight-reading'] || 0,
      icon: '👁️',
      color: 'from-orange-500 to-red-600',
      type: 'reading',
      difficulty: 'All Levels'
    },
    {
      id: 'polyrhythm',
      title: 'Polyrhythm Trainer',
      description: 'Master multiple simultaneous rhythms',
      bestScore: trainingData.skillGamesBest['polyrhythm'] || 0,
      icon: '🥁',
      color: 'from-red-500 to-rose-600',
      type: 'advanced',
      difficulty: 'Advanced'
    },
    {
      id: 'speed-builder',
      title: 'Speed Building Ladder',
      description: 'Gradually increase tempo while maintaining accuracy',
      bestScore: trainingData.skillGamesBest['speed-builder'] || 0,
      icon: '🔥',
      color: 'from-yellow-500 to-orange-600',
      type: 'speed',
      difficulty: 'Intermediate+'
    }
  ];

  const leaderboards = {
    daily: [
      { rank: 1, name: 'RhythmPro', score: 98, improvement: '+12' },
      { rank: 2, name: 'BeatMaster', score: 95, improvement: '+8' },
      { rank: 3, name: 'You', score: 89, improvement: '+5' },
      { rank: 4, name: 'TimingGuru', score: 87, improvement: '+3' },
      { rank: 5, name: 'PatternKing', score: 84, improvement: '+15' }
    ],
    weekly: [
      { rank: 1, name: 'StudyHero', score: 2847, improvement: '+156' },
      { rank: 2, name: 'PracticeBeast', score: 2789, improvement: '+98' },
      { rank: 3, name: 'You', score: 2634, improvement: '+234' },
      { rank: 4, name: 'SkillBuilder', score: 2587, improvement: '+67' },
      { rank: 5, name: 'TrainingMaster', score: 2445, improvement: '+189' }
    ]
  };

  const handleStartLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      onStartGame({
        mode: 'lesson',
        lessonId: lessonId,
        lessonTitle: lesson.title,
        difficulty: lesson.difficulty.toLowerCase()
      });
    }
  };

  const handleStartSkillGame = (gameId: string) => {
    const game = skillGames.find(g => g.id === gameId);
    if (game) {
      onStartGame({
        mode: 'skill-game',
        gameId: gameId,
        gameTitle: game.title,
        gameType: game.type
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-orange-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Progress Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-300">Lessons Progress</h3>
            <span className="text-2xl">📚</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {trainingData.lessonsCompleted}/{trainingData.totalLessons}
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(trainingData.lessonsCompleted / trainingData.totalLessons) * 100}%` }}
            />
          </div>
          <p className="text-blue-200 text-sm">{Math.round((trainingData.lessonsCompleted / trainingData.totalLessons) * 100)}% Complete</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-green-300">Practice Stats</h3>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {trainingData.practiceStats.totalHours}h
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-200">🔥 {trainingData.practiceStats.streak} day streak</span>
          </div>
          <p className="text-green-200 text-sm mt-1">
            {trainingData.practiceStats.accuracy}% avg accuracy
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-purple-300">Skill Games</h3>
            <span className="text-2xl">🎮</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {Object.keys(trainingData.skillGamesBest).length}
          </div>
          <p className="text-purple-200 text-sm">
            Best: {Math.max(...Object.values(trainingData.skillGamesBest))}%
          </p>
          <p className="text-purple-200 text-sm">
            Avg: {Math.round(Object.values(trainingData.skillGamesBest).reduce((a, b) => a + b, 0) / Object.values(trainingData.skillGamesBest).length)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-orange-300">Improvement</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            +{trainingData.practiceStats.improvement}%
          </div>
          <p className="text-orange-200 text-sm">This week</p>
          <p className="text-orange-200 text-sm">
            {savedReplays.length} replays analyzed
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveSection('lessons')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl p-6 text-left transition-all duration-200 hover:scale-105"
        >
          <div className="text-2xl mb-2">📖</div>
          <h3 className="text-lg font-bold text-white">Continue Learning</h3>
          <p className="text-blue-200 text-sm">Next: {lessons.find(l => !l.completed)?.title || 'All Complete!'}</p>
        </button>

        <button
          onClick={() => setActiveSection('skills')}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl p-6 text-left transition-all duration-200 hover:scale-105"
        >
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="text-lg font-bold text-white">Practice Skills</h3>
          <p className="text-green-200 text-sm">Improve weak areas</p>
        </button>

        <button
          onClick={() => setActiveSection('analysis')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl p-6 text-left transition-all duration-200 hover:scale-105"
        >
          <div className="text-2xl mb-2">🔍</div>
          <h3 className="text-lg font-bold text-white">Analyze Mistakes</h3>
          <p className="text-purple-200 text-sm">{trainingData.recentMistakes.length} patterns found</p>
        </button>

        <button
          onClick={() => setActiveSection('leaderboards')}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl p-6 text-left transition-all duration-200 hover:scale-105"
        >
          <div className="text-2xl mb-2">🏆</div>
          <h3 className="text-lg font-bold text-white">Leaderboards</h3>
          <p className="text-orange-200 text-sm">Rank #{leaderboards.daily[2].rank} today</p>
        </button>
      </div>

      {/* Weak Areas & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Areas to Improve
          </h3>
          <div className="space-y-3">
            {trainingData.weakAreas.map((area, index) => (
              <div key={area} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <span className="text-white font-medium">{area}</span>
                <button 
                  className="text-sm bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-md text-white font-medium transition-colors"
                  onClick={() => {
                    // Find skill game that helps with this area
                    if (area.toLowerCase().includes('polyrhythm')) {
                      setSelectedSkillGame('polyrhythm');
                      setActiveSection('skills');
                    } else if (area.toLowerCase().includes('timing')) {
                      setSelectedSkillGame('timing-precision');
                      setActiveSection('skills');
                    } else {
                      setSelectedSkillGame('pattern-recognition');
                      setActiveSection('skills');
                    }
                  }}
                >
                  Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Recommended Practice
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <div className="font-medium text-blue-300 mb-1">Daily Timing Drill</div>
              <div className="text-sm text-blue-200">5 min precision training</div>
            </div>
            <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
              <div className="font-medium text-green-300 mb-1">Pattern Recognition</div>
              <div className="text-sm text-green-200">10 min sight reading</div>
            </div>
            <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
              <div className="font-medium text-purple-300 mb-1">Mistake Review</div>
              <div className="text-sm text-purple-200">Analyze recent replays</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Interactive Lessons</h2>
        <div className="text-sm text-gray-400">
          Progress: {trainingData.lessonsCompleted}/{trainingData.totalLessons} completed
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div 
            key={lesson.id}
            className={`relative rounded-xl p-6 border transition-all duration-200 hover:scale-105 ${
              lesson.completed 
                ? 'bg-green-900/30 border-green-500/50' 
                : 'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
            }`}
          >
            {lesson.completed && (
              <div className="absolute top-3 right-3 text-green-400 text-xl">✅</div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`text-3xl bg-gradient-to-r ${lesson.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                {lesson.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{lesson.duration}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 line-height-relaxed">{lesson.description}</p>

            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">Topics covered:</div>
              <div className="flex flex-wrap gap-1">
                {lesson.topics.map((topic) => (
                  <span key={topic} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleStartLesson(lesson.id)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                lesson.completed
                  ? 'bg-slate-600 hover:bg-slate-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
              }`}
            >
              {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillGames = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Skill Building Games</h2>
        <div className="text-sm text-gray-400">
          Focus on specific techniques and abilities
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillGames.map((game) => (
          <div 
            key={game.id}
            className={`relative rounded-xl p-6 border bg-slate-800/50 border-slate-600/50 hover:border-slate-500/50 transition-all duration-200 hover:scale-105 ${
              selectedSkillGame === game.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`text-3xl bg-gradient-to-r ${game.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                {game.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{game.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className={getDifficultyColor(game.difficulty)}>{game.difficulty}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400 capitalize">{game.type}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4">{game.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400">Personal Best</div>
                <div className={`text-xl font-bold ${getScoreColor(game.bestScore)}`}>
                  {game.bestScore}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Type</div>
                <div className="text-sm text-white capitalize">{game.type} Training</div>
              </div>
            </div>

            <button
              onClick={() => handleStartSkillGame(game.id)}
              className="w-full py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
            >
              Start Training
            </button>
          </div>
        ))}
      </div>

      {/* Skill Building Tips */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>💡</span> Training Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-300 mb-2">Effective Practice</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Practice little and often (15-30 min sessions)</li>
              <li>• Focus on accuracy before speed</li>
              <li>• Use a metronome for timing games</li>
              <li>• Take breaks to avoid fatigue</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-green-300 mb-2">Tracking Progress</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Review your mistake patterns weekly</li>
              <li>• Set realistic daily goals</li>
              <li>• Celebrate small improvements</li>
              <li>• Compare with leaderboards for motivation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Analysis</h2>
        <div className="text-sm text-gray-400">
          Based on {savedReplays.length} recent replays
        </div>
      </div>

      {/* Mistake Patterns */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Common Mistake Patterns
        </h3>
        <div className="space-y-4">
          {trainingData.recentMistakes.map((mistake, index) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{mistake.type}</h4>
                <div className={`text-sm font-bold ${mistake.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {mistake.improvement >= 0 ? '+' : ''}{mistake.improvement}%
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">Frequency</span>
                    <span className="text-white">{mistake.frequency} times</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${Math.min(mistake.frequency, 50)}%` }}
                    />
                  </div>
                </div>
                <button className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-white font-medium transition-colors">
                  Practice Fix
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Targeted Exercises
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
              <div className="font-medium text-red-300 mb-1">Timing Precision</div>
<div className="text-sm text-red-200">Your early hits suggest rushing. Practice with slower metronome.</div>
             <button className="mt-2 text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white">
               Start Drill
             </button>
           </div>
           <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
             <div className="font-medium text-blue-300 mb-1">Key Accuracy</div>
             <div className="text-sm text-blue-200">Wrong key presses indicate pattern confusion.</div>
             <button className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white">
               Pattern Drill
             </button>
           </div>
           <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
             <div className="font-medium text-green-300 mb-1">Note Reading</div>
             <div className="text-sm text-green-200">Improve sight-reading to reduce missed notes.</div>
             <button className="mt-2 text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white">
               Reading Practice
             </button>
           </div>
         </div>
       </div>

       <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
           <span>📈</span> Progress Trends
         </h3>
         <div className="space-y-4">
           <div>
             <div className="flex justify-between text-sm mb-2">
               <span className="text-gray-400">Accuracy Trend</span>
               <span className="text-green-400">↗ +{trainingData.practiceStats.improvement}%</span>
             </div>
             <div className="w-full bg-slate-600 rounded-full h-2">
               <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }} />
             </div>
           </div>
           <div>
             <div className="flex justify-between text-sm mb-2">
               <span className="text-gray-400">Consistency</span>
               <span className="text-blue-400">↗ +12%</span>
             </div>
             <div className="w-full bg-slate-600 rounded-full h-2">
               <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
             </div>
           </div>
           <div>
             <div className="flex justify-between text-sm mb-2">
               <span className="text-gray-400">Speed</span>
               <span className="text-yellow-400">↗ +8%</span>
             </div>
             <div className="w-full bg-slate-600 rounded-full h-2">
               <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '52%' }} />
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* Recent Replays Analysis */}
     <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
       <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
         <span>🎬</span> Recent Replay Analysis
       </h3>
       {savedReplays.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {savedReplays.slice(0, 6).map((replay) => (
             <div key={replay.id} className="bg-slate-700/50 rounded-lg p-4">
               <div className="flex justify-between items-start mb-2">
                 <div className="text-sm font-medium text-white truncate">
                   {new Date(replay.timestamp).toLocaleDateString()}
                 </div>
                 <div className={`text-xs font-bold ${getScoreColor(replay.metadata.accuracy)}`}>
                   {replay.metadata.accuracy.toFixed(1)}%
                 </div>
               </div>
               <div className="text-xs text-gray-400 mb-2">
                 Score: {replay.metadata.finalScore.toLocaleString()}
               </div>
               <div className="text-xs text-gray-400 mb-3">
                 Combo: {replay.metadata.maxCombo}
               </div>
               <button className="w-full text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-white transition-colors">
                 Analyze Mistakes
               </button>
             </div>
           ))}
         </div>
       ) : (
         <div className="text-center py-8 text-gray-400">
           <div className="text-4xl mb-2">🎮</div>
           <p>No replays yet. Play some games to see analysis!</p>
         </div>
       )}
     </div>
   </div>
 );

 const renderLeaderboards = () => (
   <div className="space-y-6">
     <div className="flex items-center justify-between">
       <h2 className="text-2xl font-bold text-white">Training Leaderboards</h2>
       <div className="text-sm text-gray-400">
         Compete with other learners
       </div>
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Daily Leaderboard */}
       <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
           <span>📅</span> Daily Practice Points
         </h3>
         <div className="space-y-3">
           {leaderboards.daily.map((entry, index) => (
             <div 
               key={entry.rank}
               className={`flex items-center justify-between p-3 rounded-lg ${
                 entry.name === 'You' 
                   ? 'bg-blue-600/20 border border-blue-500/30' 
                   : 'bg-slate-700/50'
               }`}
             >
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                   entry.rank === 1 ? 'bg-yellow-500 text-black' :
                   entry.rank === 2 ? 'bg-gray-400 text-black' :
                   entry.rank === 3 ? 'bg-orange-600 text-white' :
                   'bg-slate-600 text-white'
                 }`}>
                   {entry.rank}
                 </div>
                 <div>
                   <div className={`font-medium ${entry.name === 'You' ? 'text-blue-300' : 'text-white'}`}>
                     {entry.name}
                   </div>
                   <div className="text-xs text-gray-400">
                     {entry.score} points
                   </div>
                 </div>
               </div>
               <div className={`text-sm font-bold ${
                 entry.improvement.startsWith('+') ? 'text-green-400' : 'text-red-400'
               }`}>
                 {entry.improvement}
               </div>
             </div>
           ))}
         </div>
       </div>

       {/* Weekly Leaderboard */}
       <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
           <span>📊</span> Weekly Training Score
         </h3>
         <div className="space-y-3">
           {leaderboards.weekly.map((entry, index) => (
             <div 
               key={entry.rank}
               className={`flex items-center justify-between p-3 rounded-lg ${
                 entry.name === 'You' 
                   ? 'bg-purple-600/20 border border-purple-500/30' 
                   : 'bg-slate-700/50'
               }`}
             >
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                   entry.rank === 1 ? 'bg-yellow-500 text-black' :
                   entry.rank === 2 ? 'bg-gray-400 text-black' :
                   entry.rank === 3 ? 'bg-orange-600 text-white' :
                   'bg-slate-600 text-white'
                 }`}>
                   {entry.rank}
                 </div>
                 <div>
                   <div className={`font-medium ${entry.name === 'You' ? 'text-purple-300' : 'text-white'}`}>
                     {entry.name}
                   </div>
                   <div className="text-xs text-gray-400">
                     {entry.score.toLocaleString()} points
                   </div>
                 </div>
               </div>
               <div className={`text-sm font-bold ${
                 entry.improvement.startsWith('+') ? 'text-green-400' : 'text-red-400'
               }`}>
                 {entry.improvement}
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>

     {/* Skill-Specific Leaderboards */}
     <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
       <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
         <span>🎯</span> Skill Game High Scores
       </h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {skillGames.map((game) => (
           <div key={game.id} className="bg-slate-700/50 rounded-lg p-4">
             <div className="flex items-center gap-2 mb-3">
               <span className="text-lg">{game.icon}</span>
               <div className="text-sm font-medium text-white truncate">
                 {game.title}
               </div>
             </div>
             <div className="space-y-2 text-xs">
               <div className="flex justify-between">
                 <span className="text-gray-400">Your Best:</span>
                 <span className={`font-bold ${getScoreColor(game.bestScore)}`}>
                   {game.bestScore}%
                 </span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-400">Global Best:</span>
                 <span className="text-yellow-400 font-bold">98%</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-400">Your Rank:</span>
                 <span className="text-white">#247</span>
               </div>
             </div>
             <button 
               onClick={() => handleStartSkillGame(game.id)}
               className="w-full mt-3 text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white transition-colors"
             >
               Improve Score
             </button>
           </div>
         ))}
       </div>
     </div>

     {/* Achievement Showcase */}
     <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
       <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
         <span>🏅</span> Recent Achievements
       </h3>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { title: 'Speed Demon', desc: 'Complete 100 BPM drill', icon: '⚡', date: '2 days ago' },
           { title: 'Pattern Master', desc: '95% accuracy on patterns', icon: '🧩', date: '5 days ago' },
           { title: 'Consistent Player', desc: '7-day practice streak', icon: '🔥', date: '1 week ago' },
           { title: 'Mistake Hunter', desc: 'Analyzed 10 replays', icon: '🔍', date: '1 week ago' }
         ].map((achievement, index) => (
           <div key={index} className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-lg p-4 text-center">
             <div className="text-2xl mb-2">{achievement.icon}</div>
             <div className="font-medium text-yellow-300 text-sm mb-1">{achievement.title}</div>
             <div className="text-xs text-yellow-200 mb-2">{achievement.desc}</div>
             <div className="text-xs text-yellow-400">{achievement.date}</div>
           </div>
         ))}
       </div>
     </div>
   </div>
 );

 return (
   <div>
     <CenteredContainer maxWidth="xl" accountForLeftNav={true}>
       <div className="flex flex-col h-full">
         {/* Header */}
         <div className="flex items-center justify-between py-6 border-b border-slate-700/50 flex-shrink-0">
           <div className="flex items-center gap-4">
             <button
               onClick={onBack}
               className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 text-white text-sm font-medium"
             >
               ← Back
             </button>
             <div>
               <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                 🎓 Training Hub
               </h1>
               <p className="text-gray-400 text-sm">Master your rhythm skills with lessons, games, and analysis</p>
             </div>
           </div>
         </div>

         {/* Navigation Tabs */}
         <div className="flex gap-1 py-4 border-b border-slate-700/50 flex-shrink-0">
           {[
             { id: 'overview', label: 'Overview', icon: '📊' },
             { id: 'lessons', label: 'Lessons', icon: '📚' },
             { id: 'skills', label: 'Skill Games', icon: '🎮' },
             { id: 'analysis', label: 'Analysis', icon: '🔍' },
             { id: 'leaderboards', label: 'Leaderboards', icon: '🏆' }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveSection(tab.id as any)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                 activeSection === tab.id
                   ? 'bg-blue-600 text-white shadow-lg'
                   : 'text-gray-400 hover:text-white hover:bg-slate-800'
               }`}
             >
               <span>{tab.icon}</span>
               {tab.label}
             </button>
           ))}
         </div>

         {/* Content */}
         <div className="flex-1 py-6">
           {activeSection === 'overview' && renderOverview()}
           {activeSection === 'lessons' && renderLessons()}
           {activeSection === 'skills' && renderSkillGames()}
           {activeSection === 'analysis' && renderAnalysis()}
           {activeSection === 'leaderboards' && renderLeaderboards()}
         </div>
       </div>
     </CenteredContainer>
   </div>
 );
};

export default TrainingHub;