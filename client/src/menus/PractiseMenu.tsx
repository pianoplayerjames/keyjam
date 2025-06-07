interface PractiseMenuProps {
  onBack: () => void;
  onSelectMode: (mode: string) => void;
}

const PractiseMenu = ({ onBack, onSelectMode }: PractiseMenuProps) => {
  const practiseOptions = [
    { 
      text: 'Score Based', 
      description: 'Play until you reach a target score', 
      color: 'from-orange-500 to-red-600',
      icon: '🎯',
      mode: 'score'
    },
    { 
      text: 'Time Based', 
      description: 'Play for a set amount of time', 
      color: 'from-purple-500 to-indigo-600',
      icon: '⏱️',
      mode: 'time'
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

      <div className="flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            PRACTISE MODE
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Choose your practice mode and customize your session
          </p>
        </div>

        <div className="flex flex-col gap-8 w-full max-w-2xl">
          {practiseOptions.map((option, index) => (
            <button
              key={option.text}
              onClick={() => onSelectMode(option.mode)}
              className={`
                group relative overflow-hidden rounded-xl p-8 bg-gradient-to-r ${option.color}
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                animate-slide-up backdrop-blur-sm
              `}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative z-10 flex items-center gap-6">
                <div className="text-4xl">{option.icon}</div>
                <div className="text-left">
                  <h3 className="text-3xl font-bold mb-2">{option.text}</h3>
                  <p className="text-lg opacity-90">{option.description}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PractiseMenu;