// client/src/ui/BottomPanel/SongLibrary.tsx
import React, { useState, useMemo } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src: string;
  albumArt?: string;
  genre?: string;
  difficulty?: number;
}

interface SongLibraryProps {
  playlist: Song[];
  currentSong: Song;
  onSongSelect: (song: Song) => void;
  onClose: () => void;
}

export const SongLibrary: React.FC<SongLibraryProps> = ({
  playlist,
  currentSong,
  onSongSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'difficulty' | 'duration'>('title');
  const [filterGenre, setFilterGenre] = useState<string>('all');

  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(playlist.map(song => song.genre).filter(Boolean))];
    return uniqueGenres;
  }, [playlist]);

  const filteredAndSortedPlaylist = useMemo(() => {
    let filtered = playlist.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           song.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = filterGenre === 'all' || song.genre === filterGenre;
      return matchesSearch && matchesGenre;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'difficulty':
          return (a.difficulty || 0) - (b.difficulty || 0);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });
  }, [playlist, searchQuery, sortBy, filterGenre]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty?: number) => {
    if (!difficulty) return 'text-gray-400';
    if (difficulty <= 3) return 'text-green-400';
    if (difficulty <= 6) return 'text-yellow-400';
    if (difficulty <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getDifficultyStars = (difficulty?: number) => {
    if (!difficulty) return '○○○○○';
    return '●'.repeat(Math.min(difficulty, 5)) + '○'.repeat(Math.max(0, 5 - difficulty));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <h3 className="text-lg font-bold text-white">Song Library</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="p-4 border-b border-slate-700/50">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="artist">Sort by Artist</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="duration">Sort by Duration</option>
          </select>
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {filteredAndSortedPlaylist.map((song) => (
            <div
              key={song.id}
              onClick={() => onSongSelect(song)}
              className={`flex items-center gap-4 p-3 hover:bg-slate-800/50 cursor-pointer transition-colors duration-200 ${
                currentSong.id === song.id ? 'bg-blue-600/20 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={song.albumArt || '/images/default-album.jpg'}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                {currentSong.id === song.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{song.title}</div>
                <div className="text-sm text-gray-400 truncate">{song.artist}</div>
                {song.genre && (
                  <div className="text-xs text-gray-500 mt-1">{song.genre}</div>
                )}
              </div>
              
              <div className="text-center">
                <div className={`text-sm font-mono ${getDifficultyColor(song.difficulty)}`}>
                  {getDifficultyStars(song.difficulty)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {song.difficulty ? `Level ${song.difficulty}` : 'Unrated'}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-400">{formatTime(song.duration)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.floor(song.duration / 60)}m
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};