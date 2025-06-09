import type { PatternNote } from '../shared/utils/ComplexityManager';

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  difficulty: number;
  pattern: PatternNote[];
  backgroundGradient: string;
  albumArt: string; // Add album art URL
}

export const songs: Song[] = [
  {
    id: 'song1',
    title: 'Cybernetic Dream',
    artist: 'Synthwave Surfer',
    bpm: 120,
    difficulty: 45,
    backgroundGradient: 'from-purple-500 to-indigo-600',
    albumArt: 'https://picsum.photos/seed/song1/800/800', // Placeholder art
    pattern: [
      { channels: [0], timing: 0, type: 'normal' },
      { channels: [1], timing: 1, type: 'normal' },
      { channels: [2], timing: 2, type: 'normal' },
      { channels: [3], timing: 3, type: 'normal' },
      { channels: [0, 2], timing: 4, type: 'chord' },
      { channels: [1, 3], timing: 5, type: 'chord' },
      { channels: [2, 4], timing: 6, type: 'chord' },
      { channels: [0, 4], timing: 7, type: 'chord' },
      { channels: [1], timing: 8, type: 'normal' },
      { channels: [3], timing: 8.5, type: 'normal' },
      { channels: [0], timing: 9, type: 'normal' },
      { channels: [4], timing: 9.5, type: 'normal' },
    ]
  },
  {
    id: 'song2',
    title: 'Pixel Paradise',
    artist: '8-Bit Hero',
    bpm: 140,
    difficulty: 60,
    backgroundGradient: 'from-green-400 to-cyan-500',
    albumArt: 'https://picsum.photos/seed/song2/800/800', // Placeholder art
    pattern: [
        { channels: [0], timing: 0, type: 'normal' },
        { channels: [0], timing: 0.5, type: 'normal' },
        { channels: [1], timing: 1, type: 'normal' },
        { channels: [1], timing: 1.5, type: 'normal' },
        { channels: [2], timing: 2, type: 'normal' },
        { channels: [2], timing: 2.5, type: 'normal' },
        { channels: [3], timing: 3, type: 'normal' },
        { channels: [3], timing: 3.5, type: 'normal' },
        { channels: [4], timing: 4, type: 'normal' },
        { channels: [3], timing: 4.5, type: 'normal' },
        { channels: [2], timing: 5, type: 'normal' },
        { channels: [1], timing: 5.5, type: 'normal' },
    ]
  },
  {
    id: 'song3',
    title: 'Starlight Runner',
    artist: 'Cosmic Drift',
    bpm: 160,
    difficulty: 75,
    backgroundGradient: 'from-red-500 to-orange-500',
    albumArt: 'https://picsum.photos/seed/song3/800/800', // Placeholder art
    pattern: [
        { channels: [0], timing: 0, type: 'normal' },
        { channels: [4], timing: 0.5, type: 'normal' },
        { channels: [1], timing: 1, type: 'normal' },
        { channels: [3], timing: 1.5, type: 'normal' },
        { channels: [2], timing: 2, type: 'normal' },
        { channels: [0, 4], timing: 2.5, type: 'chord' },
        { channels: [1, 3], timing: 3, type: 'chord' },
        { channels: [2], timing: 3.5, type: 'normal' },
    ]
  },
];