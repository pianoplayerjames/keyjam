import React, { useState, useEffect, useRef } from 'react';
import { songs } from '@/songs/data/song-data';
import { CenteredContainer } from '@/shared/components/Layout';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
          e.preventDefault();
          setSelectedIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
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

  // Auto-scroll to selected song
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedElement = container.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  const handleSongListWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = Math.sign(e.deltaY);
    setSelectedIndex(prev => 
      Math.max(0, Math.min(filteredSongs.length - 1, prev + direction))
    );
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
    <div className="h-full">
      <CenteredContainer maxWidth="2xl" accountForLeftNav={true} className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 text-white text-sm font-medium"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                🕹️ Arcade Mode
              </h1>
              <p className="text-gray-400 text-sm">Choose your song and compete for the best score</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative w-80">
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search songs or artists..." 
              className="w-full px-4 py-2 pl-10 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Song List */}
          <div className="w-1/3 border-r border-slate-700/50 bg-slate-900/30 backdrop-blur-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700/30">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Song Library</h2>
                <span className="text-sm text-gray-400">{filteredSongs.length} songs</span>
              </div>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto"
              onWheel={handleSongListWheel}
            >
              {filteredSongs.map((song, index) => (
                <div 
                  key={song.id}
                  onClick={() => setSelectedIndex(index)}
                  onDoubleClick={() => onSelectSong(song.id)}
                  className={`p-4 cursor-pointer transition-all duration-200 border-l-4 hover:bg-slate-800/50 ${
                    index === selectedIndex 
                      ? 'bg-pink-900/30 border-pink-500 shadow-lg' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{song.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span 
                          className="text-xs px-2 py-1 rounded font-medium"
                          style={{ 
                            backgroundColor: getDifficultyColor(song.difficulty) + '33', 
                            color: getDifficultyColor(song.difficulty) 
                          }}
                        >
                          {getStarRating(song.difficulty)} {song.difficulty}
                        </span>
                        <span className="text-xs text-cyan-400 font-medium">{song.bpm} BPM</span>
                      </div>
                    </div>
                    {index === selectedIndex && (
                      <div className="text-pink-400 text-xl animate-pulse ml-2">►</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Song Details & Controls */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedSong && (
              <>
                {/* Song Preview */}
                <div className="p-6 bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/50">
                  <div className="flex items-center gap-6">
                    <div 
                      className="w-32 h-32 rounded-xl flex items-center justify-center border-2 border-purple-400 shadow-2xl"
                      style={{ 
                        background: selectedSong.backgroundGradient 
                          ? `linear-gradient(135deg, ${selectedSong.backgroundGradient.replace('from-', '').replace('to-', '').replace('-', ', ')})` 
                          : 'linear-gradient(135deg, #667eea, #764ba2)' 
                      }}
                    >
                      <span className="text-white text-4xl">🎵</span>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedSong.title}</h2>
                      <p className="text-xl text-gray-300 mb-4">{selectedSong.artist}</p>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                          <div 
                            className="text-xl font-bold"
                            style={{ color: getDifficultyColor(selectedSong.difficulty) }}
                          >
                            {selectedSong.difficulty}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Difficulty</div>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-cyan-400">{selectedSong.bpm}</div>
                          <div className="text-xs text-gray-400 mt-1">BPM</div>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-purple-400">{selectedSong.pattern.length}</div>
                          <div className="text-xs text-gray-400 mt-1">Notes</div>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-green-400">3:42</div>
                          <div className="text-xs text-gray-400 mt-1">Length</div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onSelectSong(selectedSong.id)}
                      className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl text-white font-bold text-xl shadow-2xl transform transition-all duration-200 hover:scale-105"
                      style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}
                    >
                      <span className="flex items-center gap-3">
                        ▶ PLAY
                      </span>
                    </button>
                  </div>
                </div>

                {/* Controls Help */}
                <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-700/50">
                  <div className="flex justify-center gap-8 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">↑↓</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Enter</kbd>
                      <span>Play</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Esc</kbd>
                      <span>Back</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Scroll</kbd>
                      <span>Quick Select</span>
                    </div>
                  </div>
                </div>
                
                {/* Leaderboard */}
                <div className="flex-1 overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        🏆 Leaderboard
                      </h3>
                      <div className="flex gap-2">
                        {[
                          { id: 'global', label: 'Global', icon: '🌍' }, 
                          { id: 'country', label: 'Country', icon: '🏴' }, 
                          { id: 'friends', label: 'Friends', icon: '👥' }
                        ].map(tab => (
                          <button 
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedTab === tab.id 
                                ? 'bg-pink-600 text-white shadow-lg' 
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                          >
                            <span>{tab.icon}</span>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {leaderboardData.slice(0, 15).map((entry, index) => (
                      <div 
                        key={`${entry.username}-${entry.rank}`}
                        className={`flex items-center gap-4 p-3 mb-2 rounded-lg transition-colors hover:bg-slate-700/50 ${
                          index < 3 ? 'bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-600/30' : 'bg-slate-800/30'
                        }`}
                      >
                        <div className="w-8 text-center">
                          {index < 3 ? (
                            <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                          ) : (
                            <span className="text-gray-400 font-bold text-sm">#{entry.rank}</span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-white text-sm truncate">{entry.username}</span>
                            <span 
                              className="text-xs font-bold px-2 py-0.5 rounded"
                              style={{ color: getGradeColor(entry.grade) }}
                            >
                              {entry.grade}
                            </span>
                            {entry.mods.length > 0 && (
                              <div className="flex gap-1">
                                {entry.mods.map(mod => (
                                  <span key={mod} className="text-xs bg-orange-600 text-white px-1 py-0.5 rounded">
                                    {mod}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs text-gray-400">
                            <div className="text-yellow-400 font-medium">{entry.score.toLocaleString()}</div>
                            <div>{entry.accuracy.toFixed(2)}%</div>
                            <div className="text-purple-400">{entry.combo}x</div>
                            <div className="text-cyan-400">{entry.pp}pp</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 text-right">
                          {formatDate(entry.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Your Best Score */}
                  <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-t border-blue-500/30">
                    <div className="text-xs text-blue-300 font-semibold mb-1">Your Best</div>
                    <div className="text-sm text-white">
                      #{Math.floor(Math.random() * 50) + 1} • {(Math.random() * 500000 + 500000).toLocaleString()} • {(Math.random() * 10 + 85).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};

export default ArcadeMenu;