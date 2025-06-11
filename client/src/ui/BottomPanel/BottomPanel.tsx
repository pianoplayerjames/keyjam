// client/src/ui/BottomPanel/BottomPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { SongLibrary } from './SongLibrary';

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
  rating?: number;
}

const defaultPlaylist: Song[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'SynthWave',
    duration: 195,
    src: '/audio/neon-dreams.mp3',
    albumArt: 'https://picsum.photos/300/300?random=1',
    genre: 'Electronic',
    difficulty: 7,
    isLiked: false,
    isDisliked: false,
    playCount: 15420,
    bpm: 128,
    rating: 4
  },
  {
    id: '2',
    title: 'Midnight Rush',
    artist: 'CyberBeats',
    duration: 212,
    src: '/audio/midnight-rush.mp3',
    albumArt: 'https://picsum.photos/300/300?random=2',
    genre: 'Synthwave',
    difficulty: 8,
    isLiked: true,
    isDisliked: false,
    playCount: 8750,
    bpm: 140,
    rating: 5
  },
  {
    id: '3',
    title: 'Digital Storm',
    artist: 'TechnoFlow',
    duration: 178,
    src: '/audio/digital-storm.mp3',
    albumArt: 'https://picsum.photos/300/300?random=3',
    genre: 'Techno',
    difficulty: 9,
    isLiked: false,
    isDisliked: false,
    playCount: 23100,
    bpm: 150,
    rating: 3
  },
  {
    id: '4',
    title: 'Crystal City',
    artist: 'AmbientWaves',
    duration: 245,
    src: '/audio/crystal-city.mp3',
    albumArt: 'https://picsum.photos/300/300?random=4',
    genre: 'Ambient',
    difficulty: 5,
    isLiked: false,
    isDisliked: false,
    playCount: 5680,
    bpm: 90,
    rating: 4
  },
  {
    id: '5',
    title: 'Quantum Beat',
    artist: 'FutureSound',
    duration: 189,
    src: '/audio/quantum-beat.mp3',
    albumArt: 'https://picsum.photos/300/300?random=5',
    genre: 'Electronic',
    difficulty: 10,
    isLiked: false,
    isDisliked: true,
    playCount: 31250,
    bpm: 135,
    rating: 2
  },
  {
    id: '6',
    title: 'Electric Sunrise',
    artist: 'NeonLights',
    duration: 203,
    src: '/audio/electric-sunrise.mp3',
    albumArt: 'https://picsum.photos/300/300?random=6',
    genre: 'Electronic',
    difficulty: 6,
    isLiked: true,
    isDisliked: false,
    playCount: 12340,
    bpm: 124,
    rating: 5
  },
  {
    id: '7',
    title: 'Retro Wave',
    artist: 'VintageSound',
    duration: 188,
    src: '/audio/retro-wave.mp3',
    albumArt: 'https://picsum.photos/300/300?random=7',
    genre: 'Synthwave',
    difficulty: 7,
    isLiked: false,
    isDisliked: false,
    playCount: 19800,
    bpm: 118,
    rating: 3
  },
  {
    id: '8',
    title: 'Bass Drop',
    artist: 'BeatMaster',
    duration: 165,
    src: '/audio/bass-drop.mp3',
    albumArt: 'https://picsum.photos/300/300?random=8',
    genre: 'Dubstep',
    difficulty: 9,
    isLiked: false,
    isDisliked: false,
    playCount: 45600,
    bpm: 140,
    rating: 4
  },
  {
    id: '9',
    title: 'Chill Vibes',
    artist: 'RelaxMode',
    duration: 234,
    src: '/audio/chill-vibes.mp3',
    albumArt: 'https://picsum.photos/300/300?random=9',
    genre: 'Chill',
    difficulty: 3,
    isLiked: true,
    isDisliked: false,
    playCount: 78200,
    bpm: 85,
    rating: 5
  },
  {
    id: '10',
    title: 'Hardcore Rush',
    artist: 'Intensity',
    duration: 176,
    src: '/audio/hardcore-rush.mp3',
    albumArt: 'https://picsum.photos/300/300?random=10',
    genre: 'Hardcore',
    difficulty: 10,
    isLiked: false,
    isDisliked: false,
    playCount: 27900,
    bpm: 180,
    rating: 3
  },
  {
    id: '11',
    title: 'Space Odyssey',
    artist: 'CosmicTunes',
    duration: 267,
    src: '/audio/space-odyssey.mp3',
    albumArt: 'https://picsum.photos/300/300?random=11',
    genre: 'Ambient',
    difficulty: 4,
    isLiked: false,
    isDisliked: false,
    playCount: 6420,
    bpm: 75,
    rating: 4
  },
  {
    id: '12',
    title: 'Glitch Matrix',
    artist: 'DataFlow',
    duration: 192,
    src: '/audio/glitch-matrix.mp3',
    albumArt: 'https://picsum.photos/300/300?random=12',
    genre: 'Glitch',
    difficulty: 8,
    isLiked: false,
    isDisliked: false,
    playCount: 13570,
    bpm: 160,
    rating: 3
  }
];

const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="p-2 text-gray-400 hover:text-white transition-colors duration-200 group relative z-10"
      title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
    >
      <div className="relative">
        {isFullscreen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </div>
    </button>
  );
};

export const BottomPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(defaultPlaylist[0]);
  const [playlist, setPlaylist] = useState<Song[]>(defaultPlaylist);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setCurrentTime(0);
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentSong) return;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
    setCurrentTime(0);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentSong) return;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentSong(playlist[prevIndex]);
    setCurrentTime(0);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleLike = (songId: string) => {
    setPlaylist(prevPlaylist => 
      prevPlaylist.map(song => 
        song.id === songId 
          ? { ...song, isLiked: !song.isLiked, isDisliked: false }
          : song
      )
    );
    if (currentSong?.id === songId) {
      setCurrentSong(prev => prev ? { ...prev, isLiked: !prev.isLiked, isDisliked: false } : prev);
    }
  };

  const handleDislike = (songId: string) => {
    setPlaylist(prevPlaylist => 
      prevPlaylist.map(song => 
        song.id === songId 
          ? { ...song, isDisliked: !song.isDisliked, isLiked: false }
          : song
      )
    );
    if (currentSong?.id === songId) {
      setCurrentSong(prev => prev ? { ...prev, isDisliked: !prev.isDisliked, isLiked: false } : prev);
    }
  };

  const handleHeaderClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext(new MouseEvent('click') as any);
    };
    const handleLoadedData = () => {
      audio.volume = volume;
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [currentSong, volume]);

  if (!currentSong) return null;

  return (
    <>
      <audio ref={audioRef} src={currentSong.src} preload="metadata" />
      
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <div 
          className={`w-full max-w-6xl transition-all duration-300 ease-in-out ${
            isExpanded ? 'h-[600px]' : 'h-14'
          }`}
        >
          <div className="bg-slate-900/95 backdrop-blur-md border-t border-x border-slate-700/50 shadow-2xl h-full rounded-t-lg overflow-hidden relative">
            {isExpanded && (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden pb-14">
                  <SongLibrary
                    playlist={playlist}
                    currentSong={currentSong}
                    onSongSelect={handleSongSelect}
                    onClose={() => setIsExpanded(false)}
                  />
                </div>
              </div>
            )}
            
            <div 
              className={`${isExpanded ? 'absolute bottom-0 left-0 right-0' : ''} h-14 bg-slate-900/98 ${isExpanded ? 'border-t border-slate-700/30' : ''} cursor-pointer group hover:bg-slate-800/50 transition-colors duration-200`}
              onClick={handleHeaderClick}
            >
              
              <div className="px-2 flex items-center h-full relative">
                <div className="w-full flex items-center">
                  <div className="flex-1">
                    <AudioPlayer
                      currentSong={currentSong}
                      isPlaying={isPlaying}
                      currentTime={currentTime}
                      volume={volume}
                      onPlayPause={handlePlayPause}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      onSeek={handleSeek}
                      onVolumeChange={handleVolumeChange}
                      onExpand={() => {}}
                      isExpanded={isExpanded}
                      audioRef={audioRef}
                      onLike={handleLike}
                      onDislike={handleDislike}
                    />
                  </div>
                  
                  <div className="flex-shrink-0 ml-4 mr-2">
                    <div className={`transform transition-transform duration-200 text-gray-400 group-hover:text-white ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <FullscreenButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};