import React from 'react';
import { NavLink } from 'react-router-dom';

interface Tab {
  id: string;
  path: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const Navigation: React.FC = () => {
  const tabs: Tab[] = [
    { 
      id: 'online', 
      path: '/', 
      label: 'Online Multiplayer', 
      icon: '🌎', 
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Play with others worldwide'
    },
    { 
      id: 'career', 
      path: '/career', 
      label: 'Solo Career', 
      icon: '🚀', 
      color: 'bg-gradient-to-r from-pink-500 to-purple-600',
      description: 'Rise to international fame'
    },
    { 
      id: 'arcade', 
      path: '/arcade', 
      label: 'Arcade Mode', 
      icon: '🕹️', 
      color: 'bg-gradient-to-r from-teal-500 to-cyan-600',
      description: 'Select your own songs'
    },
    { 
      id: 'training', 
      path: '/training', 
      label: 'Training Hub', 
      icon: '🎓', 
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      description: 'Lessons, Skills & Analysis'
    },
    { 
      id: 'replays', 
      path: '/replays', 
      label: 'Replays', 
      icon: '🎬', 
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      description: 'Study Your Mistakes'
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
    <div className="flex-shrink-0 bg-slate-900/50 border-0 border-b border-black/50 shadow-2xl">
      <div className="px-4">
        <div className="flex justify-center overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const activeGradient = getActiveColors(tab.color);
            
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) =>
                  `group relative px-5 py-3 font-medium transition-all duration-300 ease-out 
                  min-w-max flex items-center gap-3 text-white
                  ${
                    isActive
                      ? `${tab.color} shadow-lg`
                      : `hover:${tab.color} hover:shadow-md hover:bg-opacity-80`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="text-xl transition-transform duration-200 scale-150">
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
                    
                    {isActive && (
                      <div className={`
                        absolute bottom-0 left-0 w-full h-1 
                        bg-gradient-to-r ${activeGradient}
                        shadow-lg z-10
                      `} />
                    )}
                    
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                      ${tab.color} rounded-sm
                    `} />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};