// client/src/menus/ArcadeMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { songs } from '../songs/song-data';

interface ArcadeMenuProps {
  onBack: () => void;
  onSelectSong: (songId: string) => void;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  accuracy: number;
  combo: number;
  mods: string[];
  date: Date;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  pp: number;
}

const generateMockLeaderboard = (songId: string): LeaderboardEntry[] => {
  const users = [
    'RhythmGod', 'BeatMaster', 'ComboKing', 'PerfectPlayer', 'SoundWave',
    'NoteNinja', 'MelodyMaster', 'HitSoundHero', 'TimingPro', 'AccuracyAce',
    'SpeedDemon', 'FlowState', 'PulsePlayer', 'VibeCheck', 'SyncMaster'
  ];
  const mods = [[], ['HD'], ['DT'], ['HR'], ['HD', 'HR'], ['DT', 'HD'], ['FL'], ['HD', 'DT']];
  return Array.from({ length: 50 }, (_, i) => {
    const baseScore = 1000000 - (i * 15000) - Math.random() * 10000;
    const accuracy = Math.max(85, 100 - (i * 0.5) - Math.random() * 3);
    const combo = Math.floor(Math.random() * 500) + 200;
    const selectedMods = mods[Math.floor(Math.random() * mods.length)];
    const getGrade = (acc: number): LeaderboardEntry['grade'] => {
      if (acc >= 95) return 'S';
      if (acc >= 90) return 'A';
      if (acc >= 80) return 'B';
      if (acc >= 70) return 'C';
      if (acc >= 60) return 'D';
      return 'F';
    };
    return {
      rank: i + 1,
      username: users[Math.floor(Math.random() * users.length)],
      score: Math.floor(baseScore),
      accuracy: parseFloat(accuracy.toFixed(2)),
      combo: combo,
      mods: selectedMods,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      grade: getGrade(accuracy),
      pp: Math.floor((baseScore / 10000) * (accuracy / 100) * (1 + selectedMods.length * 0.1))
    };
  }).sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1 }));
};

const ArcadeMenu: React.FC<ArcadeMenuProps> = ({ onBack, onSelectSong }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState<'global' | 'country' | 'friends'>('global');
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSong = filteredSongs[selectedIndex];

  useEffect(() => {
    if (selectedSong) {
      setLeaderboardData(generateMockLeaderboard(selectedSong.id));
    }
  }, [selectedSong]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setSelectedIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          setSelectedIndex(prev => Math.min(filteredSongs.length - 1, prev + 1));
          break;
        case 'Enter':
          if (selectedSong) {
            onSelectSong(selectedSong.id);
          }
          break;
        case 'Escape':
          onBack();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredSongs.length, selectedSong, onSelectSong, onBack]);

  const handleSongListWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = Math.sign(e.deltaY);
    setSelectedIndex(prev => 
      Math.max(0, Math.min(filteredSongs.length - 1, prev + direction))
    );
  };

  const handleLeaderboardWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return '#4caf50';
    if (difficulty <= 50) return '#ff9800';
    if (difficulty <= 70) return '#f44336';
    return '#9c27b0';
  };

  const getStarRating = (difficulty: number) => {
    const stars = Math.ceil(difficulty / 20);
    return '★'.repeat(Math.min(stars, 5));
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return '#FFD700';
      case 'A': return '#00e676';
      case 'B': return '#4caf50';
      case 'C': return '#ffc107';
      case 'D': return '#ff9800';
      case 'F': return '#f44336';
      default: return '#666';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div ref={menuRef} className="absolute inset-0 z-10 flex">
        <div className="w-1/4 backdrop-blur-sm border-opacity-30" onWheel={handleSongListWheel}>
          <div className="p-4 border-b border-pink-500 border-opacity-30">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Song Select
              </h1>
              <button onClick={onBack} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600 text-white text-sm">
                ← Back
              </button>
            </div>
            <div className="relative">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Type to search..." className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none text-sm" />
              <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
            </div>
          </div>
          <div className="overflow-y-auto h-full pb-32">
            {filteredSongs.map((song, index) => (
              <div key={song.id} onClick={() => setSelectedIndex(index)} onDoubleClick={() => onSelectSong(song.id)} className={`p-3 cursor-pointer transition-all duration-200 border-l-4 ${index === selectedIndex ? 'bg-pink-900 bg-opacity-30 border-pink-500' : 'border-transparent hover:bg-gray-800 hover:bg-opacity-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate text-sm">{song.title}</h3>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: getDifficultyColor(song.difficulty) + '33', color: getDifficultyColor(song.difficulty) }}>{getStarRating(song.difficulty)} {song.difficulty}</span>
                      <span className="text-xs text-cyan-400">{song.bpm} BPM</span>
                    </div>
                  </div>
                  {index === selectedIndex && <div className="text-pink-400 text-lg animate-pulse">►</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {selectedSong && (
            <div className="bg-black bg-opacity-60 backdrop-blur-sm m-4 rounded-xl p-4 border border-purple-500 border-opacity-30">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg flex items-center justify-center border-2 border-purple-400" style={{ background: selectedSong.backgroundGradient ? `linear-gradient(135deg, ${selectedSong.backgroundGradient.replace('from-', '').replace('to-', '').replace('-', ', ')})` : 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                  <span className="text-white text-2xl">🎵</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedSong.title}</h2>
                  <p className="text-lg text-gray-300 mb-2">{selectedSong.artist}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-2 text-center"><div className="text-lg font-bold" style={{ color: getDifficultyColor(selectedSong.difficulty) }}>{selectedSong.difficulty}</div><div className="text-xs text-gray-400">Difficulty</div></div>
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-2 text-center"><div className="text-lg font-bold text-cyan-400">{selectedSong.bpm}</div><div className="text-xs text-gray-400">BPM</div></div>
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-2 text-center"><div className="text-lg font-bold text-purple-400">{selectedSong.pattern.length}</div><div className="text-xs text-gray-400">Notes</div></div>
                  </div>
                </div>
                <button onClick={() => onSelectSong(selectedSong.id)} className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-lg shadow-2xl transform transition-all duration-200 hover:scale-105 hover:shadow-pink-500/50" style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <span className="relative z-10 flex items-center gap-2">▶ PLAY</span>
                </button>
              </div>
            </div>
          )}
          <div className="px-4 py-2 bg-black bg-opacity-40 text-center">
            <div className="grid grid-cols-4 gap-4 text-xs text-gray-400">
              <div>↑↓ Navigate</div><div>Enter Play</div><div>Esc Back</div><div>Scroll Select</div>
            </div>
          </div>
        </div>
        <div className="w-1/3 bg-opacity-40 backdrop-blur-sm border-l border-opacity-30 flex flex-col" onWheel={handleLeaderboardWheel}>
          <div className="p-4 border-b border-pink-500 border-opacity-30">
            <h2 className="text-xl font-bold text-white mb-3">🏆 Leaderboard</h2>
            <div className="flex gap-1">
              {[{ id: 'global', label: 'Global', icon: '🌍' }, { id: 'country', label: 'Country', icon: '🏴' }, { id: 'friends', label: 'Friends', icon: '👥' }].map(tab => (
                <button key={tab.id} onClick={() => setSelectedTab(tab.id as any)} className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all ${selectedTab === tab.id ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  <span>{tab.icon}</span>{tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {selectedSong && leaderboardData.map((entry, index) => (
              <div key={`${entry.username}-${entry.rank}`} className={`p-3 border-b border-gray-700 border-opacity-30 hover:bg-gray-800 hover:bg-opacity-30 transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-900/20 to-transparent' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center">{index < 3 ? <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span> : <span className="text-gray-400 font-bold text-sm">#{entry.rank}</span>}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm truncate">{entry.username}</span>
                      <span className="text-xs font-bold px-1 rounded" style={{ color: getGradeColor(entry.grade) }}>{entry.grade}</span>
                      {entry.mods.length > 0 && <div className="flex gap-1">{entry.mods.map(mod => (<span key={mod} className="text-xs bg-orange-600 text-white px-1 rounded">{mod}</span>))}</div>}
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div className="flex justify-between"><span>{entry.score.toLocaleString()}</span><span>{entry.accuracy.toFixed(2)}%</span></div>
                      <div className="flex justify-between"><span>{entry.combo}x combo</span><span className="text-purple-400">{entry.pp}pp</span></div>
                      <div className="text-right text-gray-500">{formatDate(entry.date)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-t border-blue-500 border-opacity-30">
            <div className="text-xs text-blue-300 font-semibold mb-1">Your Best</div>
            <div className="text-sm text-white">#{Math.floor(Math.random() * 50) + 1} • {(Math.random() * 500000 + 500000).toLocaleString()} • {(Math.random() * 10 + 85).toFixed(2)}%</div>
          </div>
        </div>
    </div>
  );
};

export default ArcadeMenu;