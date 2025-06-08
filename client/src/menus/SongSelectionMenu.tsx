import React, { useState, useEffect, useRef } from 'react';
import { songs } from '../songs/song-data';

interface SongSelectionMenuProps {
  onBack: () => void;
  onSelectSong: (songId: string) => void;
}

const SongSelectionMenu: React.FC<SongSelectionMenuProps> = ({ onBack, onSelectSong }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedSong = songs[selectedIndex];

  useEffect(() => {
    if (listRef.current) {
      const listHeight = listRef.current.offsetHeight;
      const itemHeight = 72; // h-18 in tailwind
      const offset = (listHeight / 2) - (itemHeight / 2);
      listRef.current.scrollTop = (selectedIndex * (itemHeight + 8)) - offset; // 8 is gap-2
    }
  }, [selectedIndex]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scrollAmount = Math.sign(e.deltaY);
    setSelectedIndex((prev) => Math.max(0, Math.min(prev + scrollAmount, songs.length - 1)));
  };

  return (
    <div 
        ref={menuRef}
        onMouseMove={handleMouseMove}
        className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black overflow-hidden"
    >
      <style>
        {'.song-list::-webkit-scrollbar { display: none; } .song-list { -ms-overflow-style: none; scrollbar-width: none; }'}
      </style>

      {/* Updated Dynamic Background */}
      <div 
        key={`${selectedSong.id}-bg`}
        className="absolute inset-0 bg-cover bg-center opacity-25 blur-xl scale-110 transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${selectedSong.albumArt})`
        }}
      />
      
      <button onClick={onBack} className="absolute top-6 left-8 text-gray-300 hover:text-white transition-colors text-lg z-20">
        ← Back
      </button>

      <div className="w-full h-full flex pt-20">
        <div 
          ref={listRef}
          onWheel={handleWheel}
          className="w-1/2 song-list space-y-2 p-8 overflow-y-scroll transition-all duration-300 ease-out"
        >
          {songs.map((song, index) => {
            const isSelected = selectedIndex === index;
            const yParallax = (mousePosition.y / window.innerHeight - 0.5) * -15;
            const xParallax = (mousePosition.x / window.innerWidth - 0.5) * -10;

            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song.id)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`group h-18 w-full text-white font-bold uppercase p-3 relative bg-black bg-opacity-30 border-l-4 transition-all duration-200 ease-in-out flex items-center
                    ${ isSelected
                      ? 'border-cyan-400 bg-opacity-60 shadow-lg'
                      : 'border-pink-500 hover:border-cyan-400 hover:bg-opacity-50'
                    }`
                }
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
                  transform: `translate(${xParallax}px, ${yParallax}px)`
                }}
              >
                <div className="flex flex-col justify-center">
                    <p className="tracking-wider text-xl">{song.title}</p>
                    <p className="text-sm normal-case font-light opacity-70 tracking-normal">{song.artist}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-1/2 flex items-center justify-center p-8">
            <div className='relative w-full aspect-square max-w-lg'>
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedSong.backgroundGradient} rounded-2xl blur-lg opacity-60 transition-all duration-500`} key={`${selectedSong.id}-blur`}></div>
                <img 
                    key={selectedSong.id}
                    src={selectedSong.albumArt}
                    alt={`${selectedSong.title} album art`}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl animate-slide-in-right"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default SongSelectionMenu;