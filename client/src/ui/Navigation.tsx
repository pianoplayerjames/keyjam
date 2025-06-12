import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CenteredContainer } from '../shared/components/Layout';

interface Tab {
  id: string;
  path: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  dropdownItems?: DropdownItem[];
}

interface DropdownItem {
  label: string;
  path: string;
  icon: string;
  description: string;
}

export const Navigation: React.FC = () => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs: Tab[] = [
    { 
      id: 'online', 
      path: '/', 
      label: 'Online Multiplayer', 
      icon: '🌎', 
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      description: 'Play with others worldwide',
      dropdownItems: [
        { label: 'Quick Match', path: '/online/quick', icon: '⚡', description: 'Jump into a match instantly' },
        { label: 'Ranked Play', path: '/online/ranked', icon: '🏆', description: 'Competitive ranked matches' },
        { label: 'Custom Lobbies', path: '/online/lobbies', icon: '🎮', description: 'Browse and join custom games' },
        { label: 'Tournaments', path: '/online/tournaments', icon: '🏅', description: 'Enter competitive tournaments' },
        { label: 'Leaderboards', path: '/online/leaderboards', icon: '📊', description: 'View global rankings' }
      ]
    },
    { 
      id: 'career', 
      path: '/career', 
      label: 'Solo Career', 
      icon: '🚀', 
      color: 'bg-gradient-to-r from-pink-500 to-purple-600',
      description: 'Rise to international fame',
      dropdownItems: [
        { label: 'Story Mode', path: '/career/story', icon: '📖', description: 'Follow your rise to stardom' },
        { label: 'Chapter Select', path: '/career/chapters', icon: '🎭', description: 'Choose your performance venue' },
        { label: 'Achievements', path: '/career/achievements', icon: '🎯', description: 'Track your progress and unlocks' },
        { label: 'Statistics', path: '/career/stats', icon: '📈', description: 'View detailed performance metrics' }
      ]
    },
    { 
      id: 'arcade', 
      path: '/arcade', 
      label: 'Arcade Mode', 
      icon: '🕹️', 
      color: 'bg-gradient-to-r from-teal-500 to-cyan-600',
      description: 'Select your own songs',
      dropdownItems: [
        { label: 'Song Library', path: '/arcade/songs', icon: '🎵', description: 'Browse all available tracks' },
        { label: 'Custom Charts', path: '/arcade/custom', icon: '🎨', description: 'Community-made beatmaps' },
        { label: 'Daily Challenges', path: '/arcade/daily', icon: '📅', description: 'New challenges every day' },
        { label: 'Score Attack', path: '/arcade/score', icon: '🎯', description: 'Chase the highest scores' },
        { label: 'Time Trial', path: '/arcade/time', icon: '⏱️', description: 'Beat the clock challenges' }
      ]
    },
    { 
      id: 'training', 
      path: '/training', 
      label: 'Training Hub', 
      icon: '🎓', 
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      description: 'Lessons, Skills & Analysis',
      dropdownItems: [
        { label: 'Tutorials', path: '/training/tutorials', icon: '📚', description: 'Learn the basics and advanced techniques' },
        { label: 'Practice Mode', path: '/training/practice', icon: '🎯', description: 'Hone specific skills and patterns' },
        { label: 'Rhythm Trainer', path: '/training/rhythm', icon: '🥁', description: 'Improve your timing and accuracy' },
        { label: 'Performance Analysis', path: '/training/analysis', icon: '📊', description: 'Review and improve your gameplay' },
        { label: 'Calibration', path: '/training/calibration', icon: '⚙️', description: 'Adjust audio and visual settings' }
      ]
    },
    { 
      id: 'social', 
      path: '/social', 
      label: 'Social Hub', 
      icon: '👥', 
      color: 'bg-gradient-to-r from-violet-500 to-fuchsia-600',
      description: 'Forums, Teams & Streamers',
      dropdownItems: [
        { label: 'Community Forums', path: '/social/forums', icon: '💬', description: 'Discuss strategies and share tips' },
        { label: 'Teams & Clans', path: '/social/teams', icon: '⚔️', description: 'Join or create competitive teams' },
        { label: 'Live Streams', path: '/social/streams', icon: '📺', description: 'Watch top players and streamers' },
        { label: 'Events Calendar', path: '/social/events', icon: '📅', description: 'Community events and tournaments' },
        { label: 'Player Profiles', path: '/social/profiles', icon: '👤', description: 'View and share player achievements' }
      ]
    },
    { 
      id: 'replays', 
      path: '/replays', 
      label: 'Replays', 
      icon: '🎬', 
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      description: 'Study Your Mistakes',
      dropdownItems: [
        { label: 'My Replays', path: '/replays/mine', icon: '📼', description: 'View your saved gameplay recordings' },
        { label: 'Featured Replays', path: '/replays/featured', icon: '⭐', description: 'Top plays from the community' },
        { label: 'Replay Browser', path: '/replays/browse', icon: '🔍', description: 'Search and filter all replays' },
        { label: 'Comparison Tool', path: '/replays/compare', icon: '⚖️', description: 'Compare performances side-by-side' }
      ]
    }
  ];

  const getActiveColors = (tabColor: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-gradient-to-r from-pink-500 to-purple-600': 'from-pink-700 to-purple-800',
      'bg-gradient-to-r from-teal-500 to-cyan-600': 'from-teal-700 to-cyan-800',
      'bg-gradient-to-r from-blue-500 to-indigo-600': 'from-blue-700 to-indigo-800',
      'bg-gradient-to-r from-green-500 to-emerald-600': 'from-green-700 to-emerald-800',
      'bg-gradient-to-r from-violet-500 to-fuchsia-600': 'from-violet-700 to-fuchsia-800',
      'bg-gradient-to-r from-orange-500 to-red-600': 'from-orange-700 to-red-800',
      'bg-gradient-to-r from-gray-600 to-slate-700': 'from-gray-800 to-slate-900',
    };
    return colorMap[tabColor] || 'from-gray-700 to-gray-800';
  };

  return (
    <div className="flex-shrink-0 bg-slate-900/50 border-0 border-b border-black/50 shadow-2xl relative z-30">
      <CenteredContainer maxWidth="2xl" accountForLeftNav={true}>
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-wrap justify-center gap-x-0">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const activeGradient = getActiveColors(tab.color);
              const isHovered = hoveredTab === tab.id;
              
              return (
                <div 
                  key={tab.id}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  <NavLink
                    to={tab.path}
                    className={({ isActive }) =>
                      `group relative px-4 py-3 font-medium transition-all duration-300 ease-out 
                      flex items-center gap-2 text-white whitespace-nowrap
                      ${
                        isActive
                          ? `${tab.color} shadow-lg`
                          : `hover:${tab.color} hover:shadow-md hover:bg-opacity-80`
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="text-lg transition-transform duration-200">
                          {tab.icon}
                        </span>
                        <div className="text-left">
                          <div className={`font-semibold transition-colors duration-200 text-sm ${
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

                  {/* Dropdown Menu */}
                  {tab.dropdownItems && isHovered && (
                    <div className="absolute top-full left-0 mt-0 w-80 bg-slate-800/95 backdrop-blur-md border border-slate-600/50 rounded-b-lg shadow-2xl z-50 animate-slide-in-right">
                      <div className="p-3">
                        <div className="space-y-1">
                          {tab.dropdownItems.map((item, index) => (
                            <NavLink
                              key={index}
                              to={item.path}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 group"
                            >
                              <span className="text-lg">{item.icon}</span>
                              <div className="flex-1">
                                <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                                  {item.label}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {item.description}
                                </div>
                              </div>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};