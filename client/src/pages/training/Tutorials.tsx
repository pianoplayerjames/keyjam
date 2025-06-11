import React, { useState } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: number;
  category: 'basics' | 'timing' | 'patterns' | 'advanced' | 'competitive';
  icon: string;
  completed: boolean;
  unlocked: boolean;
  prerequisites?: string[];
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'interactive' | 'practice' | 'quiz';
  duration: number;
  description: string;
  completed: boolean;
}

interface TutorialsProps {
  onBack: () => void;
  onStartTutorial: (tutorialId: string) => void;
}

const mockTutorials: Tutorial[] = [
  {
    id: 'basics-1',
    title: 'Your First Notes',
    description: 'Learn the fundamentals of hitting notes and basic timing',
    difficulty: 'Beginner',
    duration: 8,
    category: 'basics',
    icon: '🎵',
    completed: true,
    unlocked: true,
    lessons: [
      {
        id: 'lesson-1',
        title: 'Welcome to KeyJam',
        type: 'video',
        duration: 2,
        description: 'Introduction to the game interface',
        completed: true
      },
      {
        id: 'lesson-2',
        title: 'Hit Your First Note',
        type: 'interactive',
        duration: 3,
        description: 'Practice hitting single notes',
        completed: true
      },
      {
        id: 'lesson-3',
        title: 'Basic Timing',
        type: 'practice',
        duration: 3,
        description: 'Understanding rhythm and timing',
        completed: true
      }
    ]
  },
  {
    id: 'basics-2',
    title: 'Multiple Lanes',
    description: 'Master playing across different lanes simultaneously',
    difficulty: 'Beginner',
    duration: 12,
    category: 'basics',
    icon: '🛤️',
    completed: true,
    unlocked: true,
    prerequisites: ['basics-1'],
    lessons: [
      {
        id: 'lesson-4',
        title: 'Lane Awareness',
        type: 'interactive',
        duration: 4,
        description: 'Understanding the 5-lane system',
        completed: true
      },
      {
        id: 'lesson-5',
        title: 'Hand Positioning',
        type: 'video',
        duration: 3,
        description: 'Optimal finger placement for each lane',
        completed: true
      },
      {
        id: 'lesson-6',
        title: 'Cross-Lane Practice',
        type: 'practice',
        duration: 5,
        description: 'Moving between lanes smoothly',
        completed: true
      }
    ]
  },
  {
    id: 'timing-1',
    title: 'Perfect Timing Mastery',
    description: 'Achieve consistent perfect hits and understand timing windows',
    difficulty: 'Intermediate',
    duration: 15,
    category: 'timing',
    icon: '⏱️',
    completed: false,
    unlocked: true,
    prerequisites: ['basics-2'],
    lessons: [
      {
        id: 'lesson-7',
        title: 'Timing Windows Explained',
        type: 'video',
        duration: 4,
        description: 'Perfect, Good, Almost, and Miss timing',
        completed: true
      },
      {
        id: 'lesson-8',
        title: 'Visual vs Audio Cues',
        type: 'interactive',
        duration: 6,
        description: 'Learning to read both visual and audio timing',
        completed: false
      },
      {
        id: 'lesson-9',
        title: 'Metronome Training',
        type: 'practice',
        duration: 5,
        description: 'Building internal rhythm with metronome',
        completed: false
      }
    ]
  },
  {
    id: 'patterns-1',
    title: 'Common Pattern Recognition',
    description: 'Identify and master frequently occurring note patterns',
    difficulty: 'Intermediate',
    duration: 18,
    category: 'patterns',
    icon: '🔗',
    completed: false,
    unlocked: true,
    prerequisites: ['timing-1'],
    lessons: [
      {
        id: 'lesson-10',
        title: 'Basic Patterns',
        type: 'video',
        duration: 5,
        description: 'Scales, arpeggios, and simple sequences',
        completed: false
      },
      {
        id: 'lesson-11',
        title: 'Pattern Memory',
        type: 'interactive',
        duration: 7,
        description: 'Building muscle memory for common patterns',
        completed: false
      },
      {
        id: 'lesson-12',
        title: 'Speed Building',
        type: 'practice',
        duration: 6,
        description: 'Gradually increasing pattern speed',
        completed: false
      }
    ]
  },
  {
    id: 'advanced-1',
    title: 'Chord Progressions',
    description: 'Master multiple simultaneous notes and complex harmonies',
    difficulty: 'Advanced',
    duration: 22,
    category: 'advanced',
    icon: '🎹',
    completed: false,
    unlocked: false,
    prerequisites: ['patterns-1'],
    lessons: [
      {
        id: 'lesson-13',
        title: 'Two-Note Chords',
        type: 'interactive',
        duration: 6,
        description: 'Playing two notes simultaneously',
        completed: false
      },
      {
        id: 'lesson-14',
        title: 'Three-Note Chords',
        type: 'practice',
        duration: 8,
        description: 'Managing three simultaneous notes',
        completed: false
      },
      {
        id: 'lesson-15',
        title: 'Chord Transitions',
        type: 'practice',
        duration: 8,
        description: 'Smooth movement between chord shapes',
        completed: false
      }
    ]
  },
  {
    id: 'advanced-2',
    title: 'Polyrhythm Fundamentals',
    description: 'Understanding and playing multiple overlapping rhythms',
    difficulty: 'Advanced',
    duration: 25,
    category: 'advanced',
    icon: '🌀',
    completed: false,
    unlocked: false,
    prerequisites: ['advanced-1'],
    lessons: [
      {
        id: 'lesson-16',
        title: 'What is Polyrhythm?',
        type: 'video',
        duration: 6,
        description: 'Theory behind polyrhythmic patterns',
        completed: false
      },
      {
        id: 'lesson-17',
        title: '2 Against 3',
        type: 'interactive',
        duration: 9,
        description: 'Basic polyrhythm: two notes against three',
        completed: false
      },
      {
        id: 'lesson-18',
        title: 'Complex Polyrhythms',
        type: 'practice',
        duration: 10,
        description: 'Advanced polyrhythmic combinations',
        completed: false
      }
    ]
  },
  {
    id: 'competitive-1',
    title: 'Tournament Preparation',
    description: 'Strategies and techniques for competitive play',
    difficulty: 'Expert',
    duration: 30,
    category: 'competitive',
    icon: '🏆',
    completed: false,
    unlocked: false,
    prerequisites: ['advanced-2'],
    lessons: [
      {
        id: 'lesson-19',
        title: 'Performance Under Pressure',
        type: 'video',
        duration: 8,
        description: 'Managing nerves and staying focused',
        completed: false
      },
      {
        id: 'lesson-20',
        title: 'Reading Opponent Patterns',
        type: 'interactive',
        duration: 10,
        description: 'Analyzing and countering opponent strategies',
        completed: false
      },
      {
        id: 'lesson-21',
        title: 'Advanced Techniques',
        type: 'practice',
        duration: 12,
        description: 'Pro-level techniques and optimizations',
        completed: false
      }
    ]
  },
  {
    id: 'competitive-2',
    title: 'Frame-Perfect Execution',
    description: 'Achieve the highest level of precision and consistency',
    difficulty: 'Expert',
    duration: 35,
    category: 'competitive',
    icon: '⚡',
    completed: false,
    unlocked: false,
    prerequisites: ['competitive-1'],
    lessons: [
      {
        id: 'lesson-22',
        title: 'Frame Data Analysis',
        type: 'video',
        duration: 10,
        description: 'Understanding timing at the frame level',
        completed: false
      },
      {
        id: 'lesson-23',
        title: 'Input Optimization',
        type: 'interactive',
        duration: 12,
        description: 'Minimizing input lag and maximizing precision',
        completed: false
      },
      {
        id: 'lesson-24',
        title: 'Consistency Training',
        type: 'practice',
        duration: 13,
        description: 'Building repeatable perfect execution',
        completed: false
      }
    ]
  }
];

const Tutorials: React.FC<TutorialsProps> = ({ onBack, onStartTutorial }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Tutorials', icon: '📚', count: mockTutorials.length },
    { id: 'basics', label: 'Basics', icon: '🎵', count: mockTutorials.filter(t => t.category === 'basics').length },
    { id: 'timing', label: 'Timing', icon: '⏱️', count: mockTutorials.filter(t => t.category === 'timing').length },
    { id: 'patterns', label: 'Patterns', icon: '🔗', count: mockTutorials.filter(t => t.category === 'patterns').length },
    { id: 'advanced', label: 'Advanced', icon: '🎹', count: mockTutorials.filter(t => t.category === 'advanced').length },
    { id: 'competitive', label: 'Competitive', icon: '🏆', count: mockTutorials.filter(t => t.category === 'competitive').length },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Advanced': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'Expert': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getCompletionPercentage = (tutorial: Tutorial) => {
    const completedLessons = tutorial.lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedLessons / tutorial.lessons.length) * 100);
  };

  const filteredTutorials = mockTutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPrerequisiteNames = (prerequisites?: string[]) => {
    if (!prerequisites) return [];
    return prerequisites.map(id => {
      const tutorial = mockTutorials.find(t => t.id === id);
      return tutorial?.title || id;
    });
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return '📹';
      case 'interactive': return '🎮';
      case 'practice': return '🎯';
      case 'quiz': return '❓';
      default: return '📝';
    }
  };

  if (selectedTutorial) {
    return (
      <div className="min-h-screen bg-slate-900">
        <CenteredContainer maxWidth="xl" accountForLeftNav={true}>
          <div className="py-8">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setSelectedTutorial(null)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                ← Back to Tutorials
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">{selectedTutorial.title}</h1>
                <p className="text-gray-400">{selectedTutorial.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-slate-800 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Lessons</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {selectedTutorial.lessons.filter(l => l.completed).length}/{selectedTutorial.lessons.length} completed
                      </span>
                      <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 transition-all duration-300"
                          style={{ width: `${getCompletionPercentage(selectedTutorial)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedTutorial.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`p-4 rounded-lg border transition-colors ${
                          lesson.completed 
                            ? 'bg-green-900/20 border-green-500/30' 
                            : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              lesson.completed ? 'bg-green-600 text-white' : 'bg-slate-600 text-gray-300'
                            }`}>
                              {lesson.completed ? '✓' : index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getLessonIcon(lesson.type)}</span>
                                <h3 className="font-semibold text-white">{lesson.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded font-medium ${
                                  lesson.type === 'video' ? 'bg-red-500/20 text-red-400' :
                                  lesson.type === 'interactive' ? 'bg-blue-500/20 text-blue-400' :
                                  lesson.type === 'practice' ? 'bg-green-500/20 text-green-400' :
                                  'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {lesson.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400">{lesson.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">{lesson.duration}m</span>
                            <button
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                lesson.completed
                                  ? 'bg-gray-600 text-gray-300 cursor-default'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                              disabled={lesson.completed}
                            >
                              {lesson.completed ? 'Completed' : 'Start'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4">Tutorial Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Difficulty</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                        {selectedTutorial.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">{selectedTutorial.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lessons</span>
                      <span className="text-white">{selectedTutorial.lessons.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category</span>
                      <span className="text-white capitalize">{selectedTutorial.category}</span>
                    </div>
                  </div>

                  {selectedTutorial.prerequisites && selectedTutorial.prerequisites.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Prerequisites</h4>
                      <div className="space-y-2">
                        {getPrerequisiteNames(selectedTutorial.prerequisites).map((name, index) => (
                          <div key={index} className="text-sm text-blue-400">
                            • {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4">Progress</h3>
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          className="text-slate-600"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - getCompletionPercentage(selectedTutorial) / 100)}`}
                          className="text-green-400 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {getCompletionPercentage(selectedTutorial)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400">
                      {selectedTutorial.lessons.filter(l => l.completed).length} of {selectedTutorial.lessons.length} lessons completed
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onStartTutorial(selectedTutorial.id)}
                  className={`w-full py-3 rounded-lg font-bold transition-colors ${
                    selectedTutorial.unlocked
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedTutorial.unlocked}
                >
                  {selectedTutorial.completed ? 'Review Tutorial' : 
                   selectedTutorial.unlocked ? 'Continue Tutorial' : 'Complete Prerequisites'}
                </button>
              </div>
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true}>
        <div className="py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white">Tutorials</h1>
              <p className="text-gray-400">Learn rhythm game fundamentals and advanced techniques</p>
            </div>
          </div>

          <div className="flex gap-6 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div className="w-64 flex-shrink-0">
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="font-bold text-white mb-4">Categories</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <span className="text-sm opacity-75">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTutorials.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className={`relative bg-slate-800 rounded-xl p-6 border transition-all duration-200 ${
                      tutorial.unlocked
                        ? 'border-slate-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 cursor-pointer'
                        : 'border-slate-700 opacity-60'
                    }`}
                    onClick={() => tutorial.unlocked && setSelectedTutorial(tutorial)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{tutorial.icon}</div>
                        <div>
                          <h3 className="font-bold text-white">{tutorial.title}</h3>
                          <p className="text-sm text-gray-400">{tutorial.description}</p>
                        </div>
                      </div>
                      {tutorial.completed && (
                        <div className="text-green-400 text-xl">✓</div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(tutorial.difficulty)}`}>
                        {tutorial.difficulty}
                      </span>
                      <span className="text-sm text-gray-400">{tutorial.duration} min</span>
                      <span className="text-sm text-gray-400">{tutorial.lessons.length} lessons</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm text-white">{getCompletionPercentage(tutorial)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 transition-all duration-300"
                          style={{ width: `${getCompletionPercentage(tutorial)}%` }}
                        />
                      </div>
                    </div>

                    {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Prerequisites: {getPrerequisiteNames(tutorial.prerequisites).join(', ')}
                      </div>
                    )}

                    {!tutorial.unlocked && (
                      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🔒</div>
                          <div className="text-white font-bold">Locked</div>
                          <div className="text-sm text-gray-400">Complete prerequisites to unlock</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};

export default Tutorials;