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
}

const defaultPlaylist: Song[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'SynthWave',
    duration: 195,
    src: '/audio/neon-dreams.mp3',
    albumArt: '/images/neon-dreams.jpg',
    genre: 'Electronic',
    difficulty: 7
  },
  {
    id: '2',
    title: 'Midnight Rush',
    artist: 'CyberBeats',
    duration: 212,
    src: '/audio/midnight-rush.mp3',
    albumArt: '/images/midnight-rush.jpg',
    genre: 'Synthwave',
    difficulty: 8
  },
  {
    id: '3',
    title: 'Digital Storm',
    artist: 'TechnoFlow',
    duration: 178,
    src: '/audio/digital-storm.mp3',
    albumArt: '/images/digital-storm.jpg',
    genre: 'Techno',
    difficulty: 9
  },
  {
    id: '4',
    title: 'Crystal City',
    artist: 'AmbientWaves',
    duration: 245,
    src: '/audio/crystal-city.mp3',
    albumArt: '/images/crystal-city.jpg',
    genre: 'Ambient',
    difficulty: 5
  },
  {
    id: '5',
    title: 'Quantum Beat',
    artist: 'FutureSound',
    duration: 189,
    src: '/audio/quantum-beat.mp3',
    albumArt: '/images/quantum-beat.jpg',
    genre: 'Electronic',
    difficulty: 10
  }
];

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

  const handlePlayPause = () => {
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!currentSong) return;
    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
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
  }, [currentSong, volume, handleNext]);

  if (!currentSong) return null;

  return (
    <>
      <audio ref={audioRef} src={currentSong.src} preload="metadata" />
      
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'h-96' : 'h-16'
      }`}>
        <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 shadow-2xl h-full">
          {isExpanded && (
            <div className="h-full overflow-hidden">
              <SongLibrary
                playlist={playlist}
                currentSong={currentSong}
                onSongSelect={handleSongSelect}
                onClose={() => setIsExpanded(false)}
              />
            </div>
          )}
          
          <div className="h-16 flex items-center px-4 bg-slate-900/98 border-t border-slate-700/30">
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
              onExpand={() => setIsExpanded(!isExpanded)}
              isExpanded={isExpanded}
              audioRef={audioRef}
            />
          </div>
        </div>
      </div>
    </>
  );
};