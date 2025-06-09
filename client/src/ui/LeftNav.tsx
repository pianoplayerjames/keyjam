import React from 'react';

// Mock friend data for demonstration
const friends = [
  { id: 1, name: 'RhythmGod', avatar: '🤖', status: 'online' },
  { id: 2, name: 'BeatMaster', avatar: '🧑', status: 'online' },
  { id: 3, name: 'ComboKing', avatar: '🦄', status: 'away' },
  { id: 4, name: 'SoundWave', avatar: '🐼', status: 'offline' },
  { id: 5, name: 'NoteNinja', avatar: '🦊', status: 'online' },
  { id: 6, name: 'MelodyMaster', avatar: '🐙', status: 'in-game' },
  { id: 7, name: 'TimingPro', avatar: '🦖', status: 'online' },
];

const getStatusColor = (status: 'online' | 'away' | 'in-game' | 'offline') => {
    switch (status) {
        case 'online': return 'bg-green-400';
        case 'away': return 'bg-yellow-400';
        case 'in-game': return 'bg-blue-400';
        default: return 'bg-gray-500';
    }
}

const LeftNav = () => {
  return (
    <nav className="fixed top-0 left-0 h-screen w-18 hover:w-56 bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 transition-all duration-300 ease-in-out overflow-x-hidden z-50 group">
      <div className="flex flex-col justify-between h-full">
                {/* Bottom Icons - e.g., Notifications and Settings */}
        <ul className="flex flex-col items-start mt-4 space-y-2">
           <li>
              <a href="#" className="flex items-center p-4 py-2 rounded-lg text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200">
                <span className="text-3xl">🔔</span>
                <span className="ml-4 text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">Notifications</span>
              </a>
            </li>
           <li>
              <a href="#" className="flex items-center p-4 py-2 rounded-lg text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200">
                <span className="text-3xl">⚙️</span>
                <span className="ml-4 text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">Settings</span>
              </a>
            </li>
        </ul>
        {/* Friends List */}
        <ul className="flex flex-col items-start mb-4 space-y-2">
          <li className="text-gray-500 text-xs font-bold uppercase transition-all duration-300 w-full px-7 mb-2 opacity-0 group-hover:opacity-100">Friends</li>
          {friends.map(friend => (
            <li key={friend.id} className="w-full">
              <a href="#" className="flex items-center p-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-200">
                <div className="relative">
                    <span className="text-3xl">{friend.avatar}</span>
                    <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-slate-900 ${getStatusColor(friend.status)}`}></span>
                </div>
                <span className="ml-4 text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 whitespace-nowrap">{friend.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default LeftNav;