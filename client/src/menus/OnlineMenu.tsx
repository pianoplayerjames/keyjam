interface OnlineMenuProps {
  onBack: () => void;
  onSelectMode: (mode: string) => void;
}

const OnlineMenu = ({ onBack, onSelectMode }: OnlineMenuProps) => {
  const onlineOptions = [
    { 
      text: 'Arenas', 
      description: 'Join public rooms with up to 8 players', 
      color: 'from-green-400 to-emerald-600',
      icon: '🏟️',
      mode: 'arenas',
      comingSoon: true
    },
    { 
      text: 'Duels', 
      description: '1v1 competitive matches', 
      color: 'from-red-400 to-pink-600',
      icon: '⚔️',
      mode: 'duels',
      comingSoon: true
    },
    { 
      text: 'Invite Friend', 
      description: 'Play with friends via invite code', 
      color: 'from-blue-400 to-cyan-600',
      icon: '👥',
      mode: 'invite',
      comingSoon: true
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
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            ONLINE PLAY
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Challenge players from around the world
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-2xl">
          {onlineOptions.map((option, index) => (
            <button
              key={option.text}
              onClick={() => onSelectMode(option.mode)}
              className={`
                group relative overflow-hidden rounded-xl p-6 
                ${option.comingSoon 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed' 
                  : `bg-gradient-to-r ${option.color} hover:scale-105 hover:shadow-2xl`
                }
                transform transition-all duration-300
                animate-slide-up backdrop-blur-sm
              `}
              style={{ animationDelay: `${index * 150}ms` }}
              disabled={option.comingSoon}
            >
              <div className="relative z-10 flex items-center gap-6">
                <div className="text-4xl opacity-75">{option.icon}</div>
                <div className="text-left flex-1">
                  <h3 className={`text-2xl font-bold mb-2 ${option.comingSoon ? 'text-gray-400' : 'text-white'}`}>
                    {option.text} {option.comingSoon && '(Soon)'}
                  </h3>
                  <p className={`text-sm ${option.comingSoon ? 'text-gray-500' : 'text-white opacity-90'}`}>
                    {option.description}
                  </p>
                </div>
              </div>
              {!option.comingSoon && (
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center max-w-2xl">
          <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">🚧 ONLINE FEATURES COMING SOON! 🚧</h3>
            <p className="text-yellow-200 text-sm leading-relaxed">
              For now, these options will start a practice game.
              Full multiplayer functionality is in development!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineMenu;