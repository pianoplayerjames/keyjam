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
  isLiked?: boolean;
  isDisliked?: boolean;
  playCount?: number;
  bpm?: number;
  rating?: number; // 1-5 star rating
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
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'difficulty' | 'duration' | 'playCount' | 'genre' | 'bpm' | 'rating'>('title');
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
        case 'playCount':
          return (b.playCount || 0) - (a.playCount || 0);
        case 'genre':
          return (a.genre || '').localeCompare(b.genre || '');
        case 'bpm':
          return (a.bpm || 0) - (b.bpm || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
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

  const formatPlayCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
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

  const getRatingStars = (rating?: number) => {
    if (!rating) return '☆☆☆☆☆';
    return '★'.repeat(Math.min(rating, 5)) + '☆'.repeat(Math.max(0, 5 - rating));
  };

  const getRatingColor = (rating?: number) => {
    if (!rating) return 'text-gray-400';
    if (rating <= 2) return 'text-red-400';
    if (rating <= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const handleHeaderClick = () => {
    onClose();
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="h-full flex flex-col">
      <div 
        className="flex items-center justify-between p-4 border-b border-slate-700/50 cursor-pointer group hover:bg-slate-800/30 transition-colors duration-200 relative"
        onClick={handleHeaderClick}
      >
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-slate-600 rounded-full group-hover:bg-slate-500 transition-colors duration-200"></div>
        
        <h3 className="text-lg font-bold text-white">Song Library</h3>
        
        <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="p-3 border-b border-slate-700/50" onClick={handleSearchClick}>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            onClick={handleSelectClick}
            className="px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="genre">Genre</option>
            <option value="rating">Rating</option>
            <option value="difficulty">Difficulty</option>
            <option value="bpm">BPM</option>
            <option value="playCount">Plays</option>
            <option value="duration">Duration</option>
          </select>
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            onClick={handleSelectClick}
            className="px-2 py-1.5 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="all">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Header with proper alignment */}
      <div className="px-3 py-2 bg-slate-800/30 border-b border-slate-700/50 text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <div className="w-8"></div> {/* Album art space */}
          <div className="flex-1 min-w-0">Song • Artist</div>
          <div className="w-16 text-center">Rating</div>
          <div className="w-16 text-center">Genre</div>
          <div className="w-12 text-center">BPM</div>
          <div className="w-16 text-center">Plays</div>
          <div className="w-20 text-center">Difficulty</div>
          <div className="w-12 text-center">Time</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bottom-panel-scrollbar">
        <div className="space-y-0">
          {filteredAndSortedPlaylist.map((song) => (
            <div
              key={song.id}
              onClick={() => onSongSelect(song)}
              className={`flex items-center gap-3 p-2 hover:bg-slate-800/50 cursor-pointer transition-colors duration-200 group ${
                currentSong.id === song.id ? 'bg-blue-600/20 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={song.albumArt || 'https://picsum.photos/300/300?random=default'}
                  alt={song.title}
                  className="w-8 h-8 rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://picsum.photos/300/300?random=default';
                  }}
                />
                {currentSong.id === song.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate leading-tight">
                  {song.title}
                </div>
                <div className="text-xs text-gray-400 truncate leading-tight">
                  {song.artist}
                </div>
              </div>
              
              {/* Rating */}
              <div className="w-16 text-center">
                <div className={`text-xs ${getRatingColor(song.rating)}`}>
                  {getRatingStars(song.rating)}
                </div>
              </div>
              
              {/* Genre */}
              <div className="w-16 text-center">
                <div className="text-xs text-gray-400 truncate">
                  {song.genre || '-'}
                </div>
              </div>

              {/* BPM */}
              <div className="w-12 text-center">
                <div className="text-xs text-gray-400">
                  {song.bpm || '-'}
                </div>
              </div>
              
              {/* Play count */}
              <div className="w-16 text-center">
                <div className="text-xs text-gray-400">
                  {formatPlayCount(song.playCount)}
                </div>
              </div>
              
              {/* Difficulty */}
              <div className="w-20 text-center">
                <div className={`text-xs font-mono ${getDifficultyColor(song.difficulty)}`}>
                  {getDifficultyStars(song.difficulty)}
                </div>
              </div>
              
              {/* Duration */}
              <div className="w-12 text-center">
                <div className="text-xs text-gray-400">{formatTime(song.duration)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};