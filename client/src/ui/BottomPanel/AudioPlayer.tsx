// client/src/ui/BottomPanel/AudioPlayer.tsx
import React from 'react';
import { AudioVisualizer } from './AudioVisualizer';

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

interface AudioPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onExpand: () => void;
  isExpanded: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onExpand,
  isExpanded,
  audioRef
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent * currentSong.duration);
  };

  const progress = currentSong.duration > 0 ? (currentTime / currentSong.duration) * 100 : 0;

  return (
    <div className="w-full flex items-center gap-4 h-full">
      {/* Album Art & Song Info */}
      <div className="flex items-center gap-3 min-w-0 w-64">
        <div className="relative group">
          <img
            src={currentSong.albumArt || '/images/default-album.jpg'}
            alt={currentSong.title}
            className="w-10 h-10 rounded object-cover shadow-lg group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-black/20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="font-medium text-white text-sm truncate">{currentSong.title}</div>
          <div className="text-xs text-gray-400 truncate">{currentSong.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          className="p-1.5 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        
        <button
          onClick={onPlayPause}
          className="p-2 bg-white text-black rounded-full hover:scale-105 transition-all duration-200 shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <button
          onClick={onNext}
          className="p-1.5 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      {/* Progress Bar with Time */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
        <div
          className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group relative"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full relative transition-all duration-100"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"></div>
          </div>
        </div>
        <span className="text-xs text-gray-400 w-10">{formatTime(currentSong.duration)}</span>
      </div>

      {/* Visualizer */}
      <div className="w-32">
        <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <button className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      
      {/* Expand Button */}
      <button
        onClick={onExpand}
        className="p-1.5 text-gray-400 hover:text-white transition-colors duration-200"
      >
        <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};