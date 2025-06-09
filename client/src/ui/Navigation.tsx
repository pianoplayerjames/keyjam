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
      color: 'from-pink-500 to-purple-600',
      description: 'From Rookie To Grandmaster'
    },
    { 
      id: 'arcade', 
      label: 'Arcade Mode', 
      icon: '🎵', 
      color: 'from-teal-500 to-cyan-600',
      description: 'Select your own songs'
    },
    { 
      id: 'online', 
      label: 'Online Multiplayer', 
      icon: '🌎', 
      color: 'bg-white',
      description: 'Play with others worldwide'
    },
    { 
      id: 'practice', 
      label: 'Training', 
      icon: '🎯', 
      color: 'from-blue-500 to-cyan-600',
      description: 'Tutorials & Skill Games'
    },
    { 
      id: 'replays', 
      label: 'Replays', 
      icon: '🎬', 
      color: 'from-orange-500 to-red-600',
      description: 'Study Your Mistakes'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️', 
      color: 'from-gray-500 to-gray-700',
      description: 'Game settings'
    }
  ];

  return (
    <div className="flex-shrink-0 border-b border-black bg-slate-500/70 border-opacity-10">
      <div className="px-8">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group relative px-4 py-3 font-medium transition-all duration-300 ease-out min-w-max flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 bg-opacity-20 text-cyan-400'
                  : 'text-gray-300 hover:bg-purple-500 hover:bg-opacity-20 hover:text-white'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{tab.label}</div>
                <div className="text-xs opacity-70">{tab.description}</div>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};