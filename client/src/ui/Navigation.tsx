import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { 
      id: 'career', 
      label: 'Solo Career', 
      icon: '🚀', 
      color: 'bg-gradient-to-r from-pink-500 to-purple-600',
      description: 'From Rookie To Grandmaster'
    },
    { 
      id: 'arcade', 
      label: 'Arcade Mode', 
      icon: '🎵', 
      color: 'bg-gradient-to-r from-teal-500 to-cyan-600',
      description: 'Select your own songs'
    },
    { 
      id: 'online', 
      label: 'Online Multiplayer', 
      icon: '🌎', 
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Play with others worldwide'
    },
    { 
      id: 'practice', 
      label: 'Training', 
      icon: '🎯', 
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      description: 'Tutorials & Skill Games'
    },
    { 
      id: 'replays', 
      label: 'Replays', 
      icon: '🎬', 
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      description: 'Study Your Mistakes'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️', 
      color: 'bg-gradient-to-r from-gray-600 to-slate-700',
      description: 'Game settings'
    }
  ];

  const getActiveColors = (tabColor: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-gradient-to-r from-pink-500 to-purple-600': 'from-pink-700 to-purple-800',
      'bg-gradient-to-r from-teal-500 to-cyan-600': 'from-teal-700 to-cyan-800',
      'bg-gradient-to-r from-blue-500 to-indigo-600': 'from-blue-700 to-indigo-800',
      'bg-gradient-to-r from-green-500 to-emerald-600': 'from-green-700 to-emerald-800',
      'bg-gradient-to-r from-orange-500 to-red-600': 'from-orange-700 to-red-800',
      'bg-gradient-to-r from-gray-600 to-slate-700': 'from-gray-800 to-slate-900',
    };
    return colorMap[tabColor] || 'from-gray-700 to-gray-800';
  };

  return (
    <div className="flex-shrink-0">
      <div className="px-4">
        <div className="flex justify-center overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const activeGradient = getActiveColors(tab.color);
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative px-5 py-4 font-medium transition-all duration-300 ease-out 
                  min-w-max flex items-center gap-3 text-white
                  ${isActive 
                    ? `${tab.color} shadow-lg` 
                    : `hover:${tab.color} hover:shadow-md hover:bg-opacity-80`
                  }
                `}
              >
                <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                  {tab.icon}
                </span>
                <div className="text-left">
                  <div className={`font-semibold transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'
                  }`}>
                    {tab.label}
                  </div>
                  <div className={`text-xs transition-colors duration-200 ${
                    isActive ? 'text-gray-100' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>
                    {tab.description}
                  </div>
                </div>
                
                {/* Active indicator - positioned at the very bottom */}
                {isActive && (
                  <div className={`
                    absolute bottom-0 left-0 w-full h-1 
                    bg-gradient-to-r ${activeGradient}
                    shadow-lg z-10
                  `} />
                )}
                
                {/* Hover glow effect */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                  ${tab.color} rounded-sm
                `} />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Thicker bottom border line */}
      <div className="h-1 bg-black/30" />
    </div>
  );
};