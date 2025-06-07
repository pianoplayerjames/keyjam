interface DifficultyMenuProps {
  onBack: () => void;
  onSelectDifficulty: (difficulty: number) => void;
}

const DifficultyMenu = ({ onBack, onSelectDifficulty }: DifficultyMenuProps) => {
  const difficultyOptions = [
    { 
      text: 'Tutorial', 
      description: 'Very slow, huge timing windows', 
      value: 3, 
      color: 'from-green-400 to-green-600',
      icon: '🎓'
    },
    { 
      text: 'Easy', 
      description: 'Slow speed, generous timing', 
      value: 15, 
      color: 'from-lime-400 to-green-600',
      icon: '🟢'
    },
    { 
      text: 'Normal', 
      description: 'Comfortable pace', 
      value: 35, 
      color: 'from-yellow-400 to-orange-600',
      icon: '🟡'
    },
    { 
      text: 'Hard', 
      description: 'Fast pace, tighter timing', 
      value: 55, 
      color: 'from-orange-400 to-red-600',
      icon: '🟠'
    },
    { 
      text: 'Expert', 
      description: 'Very precise timing required', 
      value: 75, 
      color: 'from-red-400 to-pink-600',
      icon: '🔴'
    },
    { 
      text: 'Master', 
      description: 'Professional level difficulty', 
      value: 90, 
      color: 'from-purple-400 to-indigo-600',
      icon: '⭐'
    }
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-30">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-lg"
      >
        <span className="text-xl">←</span> Back
      </button>

      <div className="flex flex-col items-center justify-center flex-1 max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            SELECT DIFFICULTY
          </h1>
          <p className="text-lg text-gray-300">
            Choose your challenge level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {difficultyOptions.map((option, index) => (
            <button
              key={option.text}
              onClick={() => onSelectDifficulty(option.value)}
              className={`
                group relative overflow-hidden rounded-xl p-6 bg-gradient-to-r ${option.color}
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                animate-slide-up backdrop-blur-sm
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10 text-center">
                <div className="text-3xl mb-3">{option.icon}</div>
                <h3 className="text-xl font-bold mb-2">{option.text} ({option.value})</h3>
                <p className="text-sm opacity-90">{option.description}</p>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Professional Level Warning */}
        <div className="mt-8 max-w-2xl">
          <div className="bg-purple-900 bg-opacity-50 border border-purple-500 rounded-xl p-4 text-center">
            <p className="text-purple-200 text-sm">
              <span className="font-bold">Expert & Master:</span> Frame-perfect timing, complex patterns, years of practice recommended
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultyMenu;