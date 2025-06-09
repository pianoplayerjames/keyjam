import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 group">
      <div className="relative">
        <img 
          src="/logo.png" 
          alt="KeyJam" 
          className="h-10 w-auto animate-tilt group-hover:scale-110 transition-transform duration-300" 
        />
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
      </div>
      <div>
        <div className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          KeyJam
        </div>
        <div className="text-xs text-gray-400">V11.8.2 / Season 1</div>
      </div>
    </div>
  );
};