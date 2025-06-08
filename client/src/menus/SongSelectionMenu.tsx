import React, { useState } from 'react';
import { songs } from '../songs/song-data';

interface SongSelectionMenuProps {
  onBack: () => void;
  onSelectSong: (songId: string) => void;
}

const DifficultyStars: React.FC<{ value: number }> = ({ value }) => {
    const totalStars = 10;
    const filledStars = Math.round((value / 100) * totalStars);
    const starColor = value > 70 ? 'text-red-500' : value > 40 ? 'text-yellow-400' : 'text-cyan-400';

    return (
        <div className="flex justify-center items-center">
            {[...Array(totalStars)].map((_, i) => (
                <span key={i} className={`text-3xl ${i < filledStars ? starColor : 'text-gray-600'}`}>★</span>
            ))}
        </div>
    );
};

const SongSelectionMenu: React.FC<SongSelectionMenuProps> = ({ onBack, onSelectSong }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSong = songs[selectedIndex];

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scrollAmount = Math.sign(e.deltaY);
    setSelectedIndex((prev) => Math.max(0, Math.min(prev + scrollAmount, songs.length - 1)));
  };

  return (
    <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900 overflow-hidden font-sans"
        onWheel={handleWheel}
    >
      {/* Dynamic Background */}
      <div 
        key={`${selectedSong.id}-bg`}
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${selectedSong.albumArt})`,
          filter: 'blur(16px) brightness(0.5)',
          transform: 'scale(1.1)',
        }}
      />
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '2rem 2rem' }} />

      <button onClick={onBack} className="absolute top-6 left-8 text-gray-300 hover:text-white transition-colors text-lg z-20 flex items-center gap-2">
        <span className="text-xl">←</span> Back
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pt-24 pb-12">
        
        {/* Song Info Section */}
        <div className="text-center h-48 transition-all duration-300" key={selectedSong.id}>
            <div className="animate-slide-up">
                <h2 className="text-6xl font-extrabold tracking-tight" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>{selectedSong.title}</h2>
                <h3 className="text-3xl text-gray-400 font-light" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>{selectedSong.artist}</h3>
                <div className="mt-4">
                    <DifficultyStars value={selectedSong.difficulty} />
                </div>
            </div>
        </div>

        {/* 3D Cover Flow Carousel */}
        <div className="flex-1 flex items-center w-full perspective-1500">
          <div 
            className="relative w-full h-80 transition-transform duration-500 ease-out flex items-center justify-center"
            style={{ transform: `translateX(${-selectedIndex * 30}%)` }}
          >
            {songs.map((song, index) => {
              const distance = index - selectedIndex;
              const isSelected = distance === 0;

              const scale = isSelected ? 1 : 0.7;
              const rotationY = distance * 35; // degrees
              const zIndex = songs.length - Math.abs(distance);
              const brightness = isSelected ? 1 : 0.4;
              const offsetX = distance * 60; // percentage based offset

              return (
                <div
                  key={song.id}
                  onClick={() => isSelected ? onSelectSong(song.id) : setSelectedIndex(index)}
                  className="absolute w-1/4 h-full cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    left: '37.5%', // Center the element
                    transform: `translateX(${offsetX}%) rotateY(${rotationY}deg) scale(${scale})`,
                    zIndex: zIndex,
                  }}
                >
                    <img 
                        src={song.albumArt} 
                        alt={song.title}
                        className="w-full h-full object-cover rounded-xl border-4 transition-all duration-500"
                        style={{
                            borderColor: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.3)',
                            filter: `brightness(${brightness})`,
                            boxShadow: isSelected ? '0 10px 40px rgba(56, 189, 248, 0.6)' : '0 10px 20px rgba(0,0,0,0.4)',
                        }}
                    />
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center h-16">
            <p className="text-xl text-gray-300 animate-pulse">Use mouse wheel to scroll, click to select</p>
        </div>
      </div>
    </div>
  );
};

export default SongSelectionMenu;