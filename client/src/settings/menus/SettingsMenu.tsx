interface SettingsMenuProps {
  onBack: () => void;
}

const SettingsMenu = ({ onBack }: SettingsMenuProps) => {
  const upcomingFeatures = [
    { icon: '🔊', title: 'Audio Settings', description: 'Master volume, SFX, music controls' },
    { icon: '✨', title: 'Visual Effects', description: 'Particles, bloom, motion blur toggle' },
    { icon: '⌨️', title: 'Key Bindings', description: 'Customize your control scheme' },
    { icon: '⚡', title: 'Performance', description: 'Graphics quality and FPS options' },
    { icon: '🎨', title: 'Themes', description: 'Color schemes and UI customization' },
    { icon: '📊', title: 'Statistics', description: 'Detailed gameplay analytics' }
  ];

  return (
<div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-transparent">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-lg"
      >
        <span className="text-xl">←</span> Back
      </button>

      <div className="flex flex-col items-center justify-center flex-1 max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            SETTINGS
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Customize your gaming experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {upcomingFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl p-6 text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4 opacity-60">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-300">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;