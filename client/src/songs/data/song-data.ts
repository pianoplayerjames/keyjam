import type { PatternNote } from '../shared/utils/ComplexityManager';

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  difficulty: number;
  pattern: PatternNote[];
  backgroundGradient: string;
  albumArt: string;
  genre: string;
  duration: number; // in seconds
}

export const songs: Song[] = [
  // Synthwave
  {
    id: 'song1',
    title: 'Cybernetic Dream',
    artist: 'Synthwave Surfer',
    bpm: 120,
    difficulty: 45,
    genre: 'Synthwave',
    duration: 180,
    backgroundGradient: 'from-purple-500 to-indigo-600',
    albumArt: 'https://picsum.photos/seed/cyber1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [1], timing: 1, type: 'normal' },
      { channels: [2], timing: 2, type: 'normal' },
      { channels: [3], timing: 3, type: 'normal' },
      { channels: [0, 2], timing: 4, type: 'chord' },
      { channels: [1, 3], timing: 5, type: 'chord' },
      { channels: [2, 4], timing: 6, type: 'chord' },
      { channels: [0, 4], timing: 7, type: 'chord' },
    ]
  },
  {
    id: 'song2',
    title: 'Neon Highways',
    artist: 'Retrowave Runner',
    bpm: 128,
    difficulty: 52,
    genre: 'Synthwave',
    duration: 200,
    backgroundGradient: 'from-pink-500 to-purple-600',
    albumArt: 'https://picsum.photos/seed/neon1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [2], timing: 0.5, type: 'normal' },
      { channels: [1], timing: 1, type: 'normal' },
      { channels: [3], timing: 1.5, type: 'normal' },
      { channels: [4], timing: 2, type: 'normal' },
      { channels: [0, 4], timing: 3, type: 'chord' },
    ]
  },
  {
    id: 'song3',
    title: 'Miami Nights',
    artist: 'Sunset Rider',
    bpm: 110,
    difficulty: 38,
    genre: 'Synthwave',
    duration: 195,
    backgroundGradient: 'from-orange-400 to-pink-500',
    albumArt: 'https://picsum.photos/seed/miami1/800/800',
    pattern: [
      { channels: [1], timing: 0, type: 'normal' },
      { channels: [3], timing: 1, type: 'normal' },
      { channels: [0], timing: 2, type: 'normal' },
      { channels: [2], timing: 3, type: 'normal' },
      { channels: [4], timing: 4, type: 'normal' },
    ]
  },

  // Chiptune / 8-bit
  {
    id: 'song4',
    title: 'Pixel Paradise',
    artist: '8-Bit Hero',
    bpm: 140,
    difficulty: 60,
    genre: 'Chiptune',
    duration: 150,
    backgroundGradient: 'from-green-400 to-cyan-500',
    albumArt: 'https://picsum.photos/seed/pixel1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [0], timing: 0.5, type: 'normal' },
      { channels: [1], timing: 1, type: 'normal' },
      { channels: [1], timing: 1.5, type: 'normal' },
      { channels: [2], timing: 2, type: 'normal' },
      { channels: [2], timing: 2.5, type: 'normal' },
    ]
  },
  {
    id: 'song5',
    title: 'Digital Dreams',
    artist: 'Chiptune Champion',
    bpm: 160,
    difficulty: 68,
    genre: 'Chiptune',
    duration: 165,
    backgroundGradient: 'from-blue-400 to-green-500',
    albumArt: 'https://picsum.photos/seed/digital1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [2], timing: 0.25, type: 'normal' },
      { channels: [4], timing: 0.5, type: 'normal' },
      { channels: [1], timing: 0.75, type: 'normal' },
      { channels: [3], timing: 1, type: 'normal' },
    ]
  },
  {
    id: 'song6',
    title: 'Arcade Glory',
    artist: 'Retro Master',
    bpm: 180,
    difficulty: 72,
    genre: 'Chiptune',
    duration: 140,
    backgroundGradient: 'from-yellow-400 to-red-500',
    albumArt: 'https://picsum.photos/seed/arcade1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'rapid' },
      { channels: [1], timing: 0.125, type: 'rapid' },
      { channels: [2], timing: 0.25, type: 'rapid' },
      { channels: [3], timing: 0.375, type: 'rapid' },
      { channels: [4], timing: 0.5, type: 'rapid' },
    ]
  },

  // Dubstep
  {
    id: 'song7',
    title: 'Bass Destroyer',
    artist: 'Wub Machine',
    bpm: 140,
    difficulty: 78,
    genre: 'Dubstep',
    duration: 220,
    backgroundGradient: 'from-purple-600 to-black',
    albumArt: 'https://picsum.photos/seed/bass1/800/800',
    pattern: [
      { channels: [0, 4], timing: 0, type: 'chord' },
      { channels: [1, 3], timing: 1, type: 'chord' },
      { channels: [2], timing: 1.5, type: 'normal' },
      { channels: [0, 2, 4], timing: 2, type: 'chord' },
    ]
  },
  {
    id: 'song8',
    title: 'Voltage Drop',
    artist: 'Electric Storm',
    bpm: 150,
    difficulty: 82,
    genre: 'Dubstep',
    duration: 195,
    backgroundGradient: 'from-yellow-500 to-purple-800',
    albumArt: 'https://picsum.photos/seed/voltage1/800/800',
    pattern: [
      { channels: [2], timing: 0, type: 'normal' },
      { channels: [0, 4], timing: 0.5, type: 'chord' },
      { channels: [1, 3], timing: 1, type: 'chord' },
      { channels: [2], timing: 1.25, type: 'rapid' },
      { channels: [0, 1, 2, 3, 4], timing: 2, type: 'chord' },
    ]
  },

  // Drum & Bass
  {
    id: 'song9',
    title: 'Breakbeat Frenzy',
    artist: 'DNB Master',
    bpm: 170,
    difficulty: 85,
    genre: 'Drum & Bass',
    duration: 180,
    backgroundGradient: 'from-red-500 to-orange-500',
    albumArt: 'https://picsum.photos/seed/break1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'rapid' },
      { channels: [2], timing: 0.1, type: 'rapid' },
      { channels: [4], timing: 0.2, type: 'rapid' },
      { channels: [1], timing: 0.3, type: 'rapid' },
      { channels: [3], timing: 0.4, type: 'rapid' },
    ]
  },
  {
    id: 'song10',
    title: 'Liquid Motion',
    artist: 'Smooth Operator',
    bpm: 175,
    difficulty: 65,
    genre: 'Liquid DNB',
    duration: 240,
    backgroundGradient: 'from-cyan-400 to-blue-600',
    albumArt: 'https://picsum.photos/seed/liquid1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [2], timing: 0.5, type: 'normal' },
      { channels: [4], timing: 1, type: 'normal' },
      { channels: [1, 3], timing: 1.5, type: 'chord' },
    ]
  },

  // Techno
  {
    id: 'song11',
    title: 'Industrial Pulse',
    artist: 'Machine Code',
    bpm: 130,
    difficulty: 55,
    genre: 'Techno',
    duration: 300,
    backgroundGradient: 'from-gray-600 to-black',
    albumArt: 'https://picsum.photos/seed/industrial1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [1], timing: 0.25, type: 'normal' },
      { channels: [2], timing: 0.5, type: 'normal' },
      { channels: [3], timing: 0.75, type: 'normal' },
      { channels: [4], timing: 1, type: 'normal' },
    ]
  },
  {
    id: 'song12',
    title: 'Underground Anthem',
    artist: 'Deep State',
    bpm: 125,
    difficulty: 62,
    genre: 'Techno',
    duration: 350,
    backgroundGradient: 'from-purple-800 to-gray-900',
    albumArt: 'https://picsum.photos/seed/underground1/800/800',
    pattern: [
      { channels: [2], timing: 0, type: 'normal' },
      { channels: [0, 4], timing: 1, type: 'chord' },
      { channels: [1, 3], timing: 2, type: 'chord' },
      { channels: [2], timing: 3, type: 'normal' },
    ]
  },

  // Trance
  {
    id: 'song13',
    title: 'Euphoric Heights',
    artist: 'Trance Master',
    bpm: 138,
    difficulty: 70,
    genre: 'Trance',
    duration: 420,
    backgroundGradient: 'from-blue-500 to-purple-600',
    albumArt: 'https://picsum.photos/seed/euphoric1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [2], timing: 1, type: 'normal' },
      { channels: [4], timing: 2, type: 'normal' },
      { channels: [1, 3], timing: 3, type: 'chord' },
      { channels: [0, 2, 4], timing: 4, type: 'chord' },
    ]
  },
  {
    id: 'song14',
    title: 'Cosmic Journey',
    artist: 'Astral Projection',
    bpm: 132,
    difficulty: 58,
    genre: 'Psytrance',
    duration: 480,
    backgroundGradient: 'from-indigo-600 to-purple-800',
    albumArt: 'https://picsum.photos/seed/cosmic1/800/800',
    pattern: [
      { channels: [1], timing: 0, type: 'normal' },
      { channels: [3], timing: 0.5, type: 'normal' },
      { channels: [0], timing: 1, type: 'normal' },
      { channels: [2], timing: 1.5, type: 'normal' },
      { channels: [4], timing: 2, type: 'normal' },
    ]
  },

  // House
  {
    id: 'song15',
    title: 'Deep Grooves',
    artist: 'House Master',
    bpm: 124,
    difficulty: 48,
    genre: 'Deep House',
    duration: 360,
    backgroundGradient: 'from-teal-500 to-blue-600',
    albumArt: 'https://picsum.photos/seed/deep1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [2], timing: 1, type: 'normal' },
      { channels: [1], timing: 2, type: 'normal' },
      { channels: [3], timing: 3, type: 'normal' },
    ]
  },
  {
    id: 'song16',
    title: 'Future Funk',
    artist: 'Groove Machine',
    bpm: 118,
    difficulty: 42,
    genre: 'Future House',
    duration: 280,
    backgroundGradient: 'from-pink-400 to-yellow-500',
    albumArt: 'https://picsum.photos/seed/future1/800/800',
    pattern: [
      { channels: [1], timing: 0, type: 'normal' },
      { channels: [3], timing: 1, type: 'normal' },
      { channels: [0, 4], timing: 2, type: 'chord' },
      { channels: [2], timing: 3, type: 'normal' },
    ]
  },

  // Ambient / IDM
  {
    id: 'song17',
    title: 'Ethereal Spaces',
    artist: 'Ambient Explorer',
    bpm: 90,
    difficulty: 25,
    genre: 'Ambient',
    duration: 450,
    backgroundGradient: 'from-blue-300 to-indigo-400',
    albumArt: 'https://picsum.photos/seed/ethereal1/800/800',
    pattern: [
      { channels: [2], timing: 0, type: 'normal' },
      { channels: [1], timing: 2, type: 'normal' },
      { channels: [3], timing: 4, type: 'normal' },
      { channels: [0], timing: 6, type: 'normal' },
      { channels: [4], timing: 8, type: 'normal' },
    ]
  },
  {
    id: 'song18',
    title: 'Glitch in the Matrix',
    artist: 'IDM Architect',
    bpm: 95,
    difficulty: 88,
    genre: 'IDM',
    duration: 320,
    backgroundGradient: 'from-green-500 to-gray-800',
    albumArt: 'https://picsum.photos/seed/glitch1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'glitch' },
      { channels: [2], timing: 0.33, type: 'glitch' },
      { channels: [4], timing: 0.66, type: 'glitch' },
      { channels: [1, 3], timing: 1, type: 'polyrhythm' },
    ]
  },

  // Hardstyle / Hardcore
  {
    id: 'song19',
    title: 'Hardstyle Revolution',
    artist: 'Bass Warrior',
    bpm: 150,
    difficulty: 90,
    genre: 'Hardstyle',
    duration: 240,
    backgroundGradient: 'from-red-600 to-black',
    albumArt: 'https://picsum.photos/seed/hardstyle1/800/800',
    pattern: [
      { channels: [0, 4], timing: 0, type: 'chord' },
      { channels: [2], timing: 0.5, type: 'rapid' },
      { channels: [1, 3], timing: 1, type: 'chord' },
      { channels: [0, 2, 4], timing: 1.5, type: 'chord' },
    ]
  },
  {
    id: 'song20',
    title: 'Hardcore Madness',
    artist: 'Extreme Beats',
    bpm: 180,
    difficulty: 95,
    genre: 'Hardcore',
    duration: 200,
    backgroundGradient: 'from-orange-500 to-red-700',
    albumArt: 'https://picsum.photos/seed/hardcore1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'rapid' },
      { channels: [1], timing: 0.1, type: 'rapid' },
      { channels: [2], timing: 0.2, type: 'rapid' },
      { channels: [3], timing: 0.3, type: 'rapid' },
      { channels: [4], timing: 0.4, type: 'rapid' },
      { channels: [0, 2, 4], timing: 0.5, type: 'chord' },
    ]
  },

  // Vaporwave / Lo-fi
  {
    id: 'song21',
    title: 'Neon Mall',
    artist: 'Vapor Dreams',
    bpm: 70,
    difficulty: 15,
    genre: 'Vaporwave',
    duration: 380,
    backgroundGradient: 'from-pink-300 to-purple-400',
    albumArt: 'https://picsum.photos/seed/vapor1/800/800',
    pattern: [
      { channels: [1], timing: 0, type: 'normal' },
      { channels: [3], timing: 2, type: 'normal' },
      { channels: [0], timing: 4, type: 'normal' },
      { channels: [2], timing: 6, type: 'normal' },
    ]
  },
  {
    id: 'song22',
    title: 'Late Night Study',
    artist: 'Lo-Fi Master',
    bpm: 85,
    difficulty: 20,
    genre: 'Lo-Fi Hip Hop',
    duration: 420,
    backgroundGradient: 'from-yellow-300 to-orange-400',
    albumArt: 'https://picsum.photos/seed/lofi1/800/800',
    pattern: [
      { channels: [2], timing: 0, type: 'normal' },
      { channels: [0], timing: 1.5, type: 'normal' },
      { channels: [4], timing: 3, type: 'normal' },
      { channels: [1], timing: 4.5, type: 'normal' },
    ]
  },

  // Electro Swing
  {
    id: 'song23',
    title: 'Swing Machine',
    artist: 'Electric Jazz',
    bpm: 128,
    difficulty: 56,
    genre: 'Electro Swing',
    duration: 195,
    backgroundGradient: 'from-amber-400 to-red-600',
    albumArt: 'https://picsum.photos/seed/swing1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [2], timing: 0.33, type: 'normal' },
      { channels: [1], timing: 0.66, type: 'normal' },
      { channels: [3, 4], timing: 1, type: 'chord' },
    ]
  },

  // More Synthwave variations
  {
    id: 'song24',
    title: 'Starlight Runner',
    artist: 'Cosmic Drift',
    bpm: 160,
    difficulty: 75,
    genre: 'Synthwave',
    duration: 185,
    backgroundGradient: 'from-indigo-500 to-pink-500',
    albumArt: 'https://picsum.photos/seed/starlight1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [4], timing: 0.5, type: 'normal' },
      { channels: [1], timing: 1, type: 'normal' },
      { channels: [3], timing: 1.5, type: 'normal' },
      { channels: [2], timing: 2, type: 'normal' },
      { channels: [0, 4], timing: 2.5, type: 'chord' },
    ]
  },
  {
    id: 'song25',
    title: 'Chrome Dreams',
    artist: 'Future Past',
    bpm: 115,
    difficulty: 40,
    genre: 'Synthwave',
    duration: 210,
    backgroundGradient: 'from-cyan-500 to-purple-600',
    albumArt: 'https://picsum.photos/seed/chrome1/800/800',
    pattern: [
      { channels: [1], timing: 0, type: 'normal' },
      { channels: [3], timing: 1, type: 'normal' },
      { channels: [0], timing: 2, type: 'normal' },
      { channels: [2], timing: 3, type: 'normal' },
      { channels: [4], timing: 4, type: 'normal' },
    ]
  },

  // More varied genres
  {
    id: 'song26',
    title: 'Neurofunk Bass',
    artist: 'Mind Control',
    bpm: 174,
    difficulty: 92,
    genre: 'Neurofunk',
    duration: 220,
    backgroundGradient: 'from-green-600 to-black',
    albumArt: 'https://picsum.photos/seed/neuro1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'rapid' },
      { channels: [2], timing: 0.125, type: 'rapid' },
      { channels: [4], timing: 0.25, type: 'rapid' },
      { channels: [1, 3], timing: 0.375, type: 'polyrhythm' },
      { channels: [0, 2, 4], timing: 0.5, type: 'chord' },
    ]
  },
  {
    id: 'song27',
    title: 'Trap Nation',
    artist: 'Beat Dropper',
    bpm: 140,
    difficulty: 65,
    genre: 'Trap',
    duration: 180,
    backgroundGradient: 'from-purple-600 to-red-500',
    albumArt: 'https://picsum.photos/seed/trap1/800/800',
    pattern: [
      { channels: [2], timing: 0, type: 'normal' },
      { channels: [0], timing: 0.5, type: 'normal' },
      { channels: [4], timing: 1, type: 'normal' },
      { channels: [1, 3], timing: 1.5, type: 'chord' },
    ]
  },
  {
    id: 'song28',
    title: 'Minimal Techno',
    artist: 'Less is More',
    bpm: 128,
    difficulty: 35,
    genre: 'Minimal Techno',
    duration: 420,
    backgroundGradient: 'from-gray-700 to-gray-900',
    albumArt: 'https://picsum.photos/seed/minimal1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [2], timing: 2, type: 'normal' },
      { channels: [4], timing: 4, type: 'normal' },
      { channels: [1], timing: 6, type: 'normal' },
    ]
  },
  {
    id: 'song29',
    title: 'Jungle Warfare',
    artist: 'Breakbeat Soldier',
    bpm: 180,
    difficulty: 88,
    genre: 'Jungle',
    duration: 200,
    backgroundGradient: 'from-green-500 to-yellow-600',
    albumArt: 'https://picsum.photos/seed/jungle1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'rapid' },
      { channels: [1], timing: 0.083, type: 'rapid' },
      { channels: [2], timing: 0.166, type: 'rapid' },
      { channels: [3], timing: 0.25, type: 'rapid' },
      { channels: [4], timing: 0.333, type: 'rapid' },
    ]
  },
  {
    id: 'song30',
    title: 'Big Room Energy',
    artist: 'Festival King',
    bpm: 128,
    difficulty: 50,
    genre: 'Big Room House',
    duration: 300,
    backgroundGradient: 'from-orange-500 to-red-600',
    albumArt: 'https://picsum.photos/seed/bigroom1/800/800',
    pattern: [
      { channels: [2], timing: 0, type: 'normal' },
      { channels: [0, 4], timing: 1, type: 'chord' },
      { channels: [1, 3], timing: 2, type: 'chord' },
      { channels: [0, 1, 2, 3, 4], timing: 3, type: 'chord' },
    ]
  },

  // Additional unique tracks
  {
    id: 'song31',
    title: 'Midnight Protocol',
    artist: 'Data Stream',
    bpm: 95,
    difficulty: 78,
    genre: 'Cyberpunk',
    duration: 280,
    backgroundGradient: 'from-teal-400 to-purple-700',
    albumArt: 'https://picsum.photos/seed/protocol1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'glitch' },
      { channels: [2], timing: 0.25, type: 'normal' },
      { channels: [4], timing: 0.5, type: 'glitch' },
      { channels: [1, 3], timing: 0.75, type: 'polyrhythm' },
    ]
  },
  {
    id: 'song32',
    title: 'Acid Rain',
    artist: 'Chemical Beats',
    bpm: 135,
    difficulty: 73,
    genre: 'Acid House',
    duration: 360,
    backgroundGradient: 'from-lime-400 to-green-700',
    albumArt: 'https://picsum.photos/seed/acid1/800/800',
    pattern: [
      { channels: [1], timing: 0, type: 'normal' },
      { channels: [3], timing: 0.25, type: 'normal' },
      { channels: [0], timing: 0.5, type: 'normal' },
      { channels: [2], timing: 0.75, type: 'normal' },
      { channels: [4], timing: 1, type: 'normal' },
    ]
  },
  {
    id: 'song33',
    title: 'Galactic Odyssey',
    artist: 'Space Cadet',
    bpm: 138,
    difficulty: 68,
    genre: 'Space Disco',
    duration: 420,
    backgroundGradient: 'from-purple-500 to-blue-800',
    albumArt: 'https://picsum.photos/seed/galactic1/800/800',
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [2], timing: 0.5, type: 'normal' },
      { channels: [4], timing: 1, type: 'normal' },
      { channels: [1, 3], timing: 1.5, type: 'chord' },
      { channels: [0, 2, 4], timing: 2, type: 'chord' },
    ]
  },
  {
    id: 'song34',
    title: 'Progressive Dreams',
    artist: 'Journey Maker',
    bpm: 128,
    difficulty: 60,
    genre: 'Progressive House',
    duration: 480,
    backgroundGradient: 'from-blue-400 to-indigo-600',
    albumArt: 'https://picsum.photos/seed/progressive1/800/800',
    pattern: [
      { channels: [1], timing: 0, type: 'normal' },
      { channels: [3], timing: 1, type: 'normal' },
      { channels: [0], timing: 2, type: 'normal' },
      { channels: [2], timing: 3, type: 'normal' },
      { channels: [4], timing: 4, type: 'normal' },
    ]
  }
];