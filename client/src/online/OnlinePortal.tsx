// client/src/online/OnlinePortal.tsx

import React, { useState, useEffect } from 'react';
import ArenasBrowser from './menus/ArenasBrowser';
import Leaderboards from './menus/Leaderboards';
import FriendsList from './menus/FriendsList';
import PlayerProfile from './menus/PlayerProfile';
import PartySystem from './menus/PartySystem';
import { MainPortal } from './components/MainPortal';
import { ArenaPage } from './components/ArenaPage';

interface OnlinePortalProps {
 onBack: () => void;
 onStartGame: (config: any) => void;
}

type PortalSection = 'main' | 'arenas' | 'leaderboards' | 'friends' | 'profile' | 'party' | 'arena';

interface PlayerData { 
 id: string; 
 username: string; 
 rank: string; 
 elo: number; 
 wins: number; 
 losses: number; 
 draws: number; 
 level: number; 
 avatar: string; 
 status: 'online' | 'away' | 'in-game' | 'offline'; 
 lastPlayed: Date; 
}

interface Arena { 
 id: string; 
 name: string; 
 type: 'tournament' | 'ranked' | 'casual' | 'speed' | 'party' | 'battle-royale' | 'team-battle' | 'practice' | 'blitz' | 'championship' | 'seasonal' | 'custom'; 
 startTime: Date; 
 duration: number; 
 players: number; 
 maxPlayers: number; 
 difficulty: number; 
 prizePool?: number; 
 status: 'waiting' | 'starting' | 'live' | 'finished'; 
 timeControl: string; 
 host: string; 
}

interface Friend { 
 id: string; 
 username: string; 
 status: 'online' | 'away' | 'in-game' | 'offline'; 
 elo: number; 
 rank: string; 
 currentGame?: string; 
 avatar: string; 
}

interface ArenaPlayer {
 id: string;
 username: string;
 elo: number;
 rank: string;
 avatar: string;
 status: 'ready' | 'not-ready' | 'away';
 joinedAt: Date;
 isHost: boolean;
}

interface DetailedArena extends Omit<Arena, 'players'> {
 requirements: {
   minElo?: number;
   maxElo?: number;
   rankRequired?: string;
   inviteOnly?: boolean;
 };
 gameMode: string;
 description: string;
 players: ArenaPlayer[];
}

const OnlinePortal: React.FC<OnlinePortalProps> = ({ onBack, onStartGame }) => {
 const [currentSection, setCurrentSection] = useState<PortalSection>('main');
 const [playerData, setPlayerData] = useState<PlayerData | null>(null);
 const [upcomingArenas, setUpcomingArenas] = useState<Arena[]>([]);
 const [friends, setFriends] = useState<Friend[]>([]);
 const [selectedArena, setSelectedArena] = useState<DetailedArena | null>(null);
 const [isPlayerInSelectedArena, setIsPlayerInSelectedArena] = useState(false);

 const generateMockArenaPlayers = (count: number, hostName: string): ArenaPlayer[] => {
   const mockNames = [
     'BeatMaster99', 'RhythmPro', 'SoundWave', 'MelodyKing', 'ComboQueen',
     'NoteMaster', 'BassDrop', 'TrebleClef', 'SyncMaster', 'FlowState',
     'PulseRider', 'HarmonySeeker', 'VibeCheck', 'BeatBuddy', 'RhythmPal',
     'NoteNinja', 'BeatBoxer', 'SoundMaster', 'RhythmRocket', 'MusicMaven',
     'TuneTitan', 'BeatBeast', 'SoundSorcerer', 'RhythmRogue', 'MelodyMage'
   ];
   
   const ranks = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'];
   
   return Array.from({ length: count }, (_, index) => {
     const isHost = index === 0;
     const username = isHost ? hostName : mockNames[Math.floor(Math.random() * mockNames.length)];
     const rank = ranks[Math.floor(Math.random() * ranks.length)];
     const baseElo = ranks.indexOf(rank) * 300 + 1000;
     
     return {
       id: `arena_player_${index}`,
       username,
       elo: baseElo + Math.floor(Math.random() * 300),
       rank,
       avatar: `/avatars/player${index + 1}.png`,
       status: Math.random() > 0.2 ? 'ready' : Math.random() > 0.5 ? 'not-ready' : 'away',
       joinedAt: new Date(Date.now() - Math.random() * 600000),
       isHost
     };
   });
 };

 useEffect(() => {
   const mockPlayer: PlayerData = { 
     id: 'player_123', 
     username: 'RhythmMaster', 
     rank: 'Diamond', 
     elo: 1847, 
     wins: 156, 
     losses: 89, 
     draws: 12, 
     level: 28, 
     avatar: '/avatars/default.png', 
     status: 'online', 
     lastPlayed: new Date() 
   };
   setPlayerData(mockPlayer);

   const mockFriends: Friend[] = [
     { id: 'friend_1', username: 'BeatBuddy', status: 'online', elo: 1756, rank: 'Diamond', avatar: '/avatars/friend1.png' },
     { id: 'friend_2', username: 'RhythmPal', status: 'in-game', elo: 1623, rank: 'Platinum', currentGame: 'Tournament', avatar: '/avatars/friend2.png' },
     { id: 'friend_3', username: 'MelodyMate', status: 'away', elo: 1892, rank: 'Diamond', avatar: '/avatars/friend3.png' },
     { id: 'friend_4', username: 'SoundSibling', status: 'offline', elo: 1445, rank: 'Gold', avatar: '/avatars/friend4.png' },
     { id: 'friend_5', username: 'NoteMaster', status: 'online', elo: 2134, rank: 'Master', avatar: '/avatars/friend5.png' },
     { id: 'friend_6', username: 'BassDrop', status: 'away', elo: 1789, rank: 'Diamond', avatar: '/avatars/friend6.png' },
   ];
   setFriends(mockFriends);
   
   const mockArenas: Arena[] = []; 
   const now = new Date();
   for (let i = -24; i < 48; i++) {
     const arenaTypes: Arena['type'][] = [
       'tournament', 'ranked', 'casual', 'speed', 'party', 
       'battle-royale', 'team-battle', 'practice', 'blitz', 
       'championship', 'seasonal', 'custom'
     ];
     
     if (Math.random() > 0.1) {
       const type = arenaTypes[Math.floor(Math.random() * arenaTypes.length)];
       const startTime = new Date(now.getTime() + i * 10 * 60 * 1000);
       
       const arenaNames = { 
         tournament: ['World Championship Qualifiers', 'Masters Cup', 'Elite Tournament', 'Pro League'],
         ranked: ['Ranked Climb', 'ELO Battle', 'Competitive Match', 'Ladder Challenge'], 
         casual: ['Fun Mode', 'Practice Arena', 'Chill Session', 'Social Play'],
         speed: ['Bullet Mayhem', 'Lightning Round', 'Quick Fire', 'Speed Demon'],
         party: ['Team Battle', 'Group Play', 'Squad Match'],
         'battle-royale': ['Last Player Standing', 'Survival Arena', 'Battle Royale Championship', 'Ultimate Showdown'],
         'team-battle': ['5v5 Showdown', 'Team Championship', 'Squad Wars', 'Alliance Battle'],
         practice: ['Training Ground', 'Skill Builder', 'Warm-up Arena', 'Drill Session'],
         blitz: ['Blitz Battle', 'Quick Match', 'Fast Track', 'Rapid Fire'],
         championship: ['Grand Finals', 'World Series', 'Championship Series', 'Title Match'],
         seasonal: ['Spring Event', 'Summer Festival', 'Autumn Cup', 'Winter Special'],
         custom: ['Custom Rules', 'Modded Match', 'Special Event', 'Community Game']
       };
       
       const durations = {
         tournament: 120, ranked: 45, casual: 30, speed: 25, party: 60,
         'battle-royale': 90, 'team-battle': 75, practice: 20, blitz: 25,
         championship: 150, seasonal: 100, custom: 40
       };
       
       const maxPlayers = {
         tournament: 25000, ranked: 2500, casual: 2500, speed: 2500, party: 100,
         'battle-royale': 100, 'team-battle': 100, practice: 2500, blitz: 2500,
         championship: 32, seasonal: 50, custom: 24
       };
       
       const hostName = `Host${Math.floor(Math.random() * 100)}`;
       const playerCount = Math.floor(Math.random() * maxPlayers[type] * 0.8) + 1;
       
       mockArenas.push({ 
         id: `arena_${i}`, 
         name: arenaNames[type][Math.floor(Math.random() * arenaNames[type].length)], 
         type, 
         startTime, 
         duration: durations[type], 
         players: playerCount,
         maxPlayers: maxPlayers[type], 
         difficulty: Math.floor(Math.random() * 100) + 1, 
         prizePool: ['tournament', 'championship', 'seasonal'].includes(type) ? Math.floor(Math.random() * 50000) + 5000 : undefined, 
         status: (()=>{ 
           const diff = startTime.getTime() - new Date().getTime(); 
           if (diff < -(durations[type] * 60 * 1000)) return 'finished'; 
           if (diff < 0) return 'live'; 
           if (diff < 5*60*1000) return 'starting'; 
           return 'waiting'; 
         })(), 
         timeControl: '5+3', 
         host: hostName
       });
     }
   }
   setUpcomingArenas(mockArenas);
 }, []);

 const getArenaTypeColor = (type: Arena['type']): string => ({
   tournament: '#ff6b35',
   ranked: '#8e24aa', 
   casual: '#43a047',
   speed: '#f44336',
   party: '#ff9800',
   'battle-royale': '#e91e63',
   'team-battle': '#3f51b5',
   practice: '#4caf50',
   blitz: '#ff5722',
   championship: '#ffd700',
   seasonal: '#9c27b0',
   custom: '#607d8b'
 })[type] || '#666';

 const getArenaDescription = (arena: Arena): string => {
   const baseDescriptions = {
     tournament: `Join this competitive ${arena.type} and climb the brackets! `,
     ranked: `Test your skills in ranked play and improve your ELO rating. `,
     casual: `Relax and enjoy some casual rhythm gaming with fellow players. `,
     speed: `Lightning-fast gameplay that will test your reflexes and timing! `,
     party: `Grab your friends and enjoy some cooperative rhythm gaming. `,
     'battle-royale': `Survive against dozens of players in this intense competition! `,
     'team-battle': `Team up and battle against other squads in coordinated play. `,
     practice: `Perfect your skills in a low-pressure environment. `,
     blitz: `Quick matches for players who want fast-paced action. `,
     championship: `Elite competition featuring the best players worldwide. `,
     seasonal: `Special seasonal event with unique rewards and challenges. `,
     custom: `Unique rules and modifiers for a fresh gaming experience. `
   };

   let description = baseDescriptions[arena.type] || 'Join this exciting arena! ';
   
   description += `This ${arena.difficulty < 30 ? 'beginner-friendly' : 
                            arena.difficulty < 60 ? 'intermediate' : 
                            arena.difficulty < 80 ? 'advanced' : 'expert-level'} arena `;
   
   description += `features ${arena.duration} minutes of intense gameplay. `;
   
   if (arena.prizePool) {
     description += `Compete for a prize pool of $${arena.prizePool.toLocaleString()}! `;
   }
   
   description += `Hosted by ${arena.host}, this arena promises an exciting challenge for all participants.`;
   
   return description;
 };

 const handleViewArena = (arena: Arena) => {
   const detailedArena: DetailedArena = {
     ...arena,
     requirements: {
       minElo: arena.type === 'ranked' || arena.type === 'tournament' || arena.type === 'championship' ? 
         Math.floor(Math.random() * 500) + 1200 : undefined,
       maxElo: arena.type === 'casual' || arena.type === 'practice' ? 
         Math.floor(Math.random() * 500) + 2000 : undefined,
       inviteOnly: arena.type === 'party' && Math.random() > 0.6,
       rankRequired: arena.type === 'championship' ? 'Diamond' : undefined
     },
     gameMode: arena.type === 'tournament' ? 'Single Elimination' : 
               arena.type === 'ranked' ? 'Ranked Match' :
               arena.type === 'battle-royale' ? 'Last Player Standing' :
               arena.type === 'team-battle' ? 'Team vs Team' :
               arena.type === 'championship' ? 'Championship Format' :
               arena.type === 'speed' ? 'Speed Challenge' :
               arena.type === 'blitz' ? 'Blitz Mode' :
               'Standard Play',
     description: getArenaDescription(arena),
     players: generateMockArenaPlayers(arena.players, arena.host)
   };
   
   setSelectedArena(detailedArena);
   setIsPlayerInSelectedArena(Math.random() > 0.8); 
   setCurrentSection('arena');
 };

 const handleBackFromArena = () => {
   setSelectedArena(null);
   setIsPlayerInSelectedArena(false);
   setCurrentSection('main');
 };

 const handleJoinArena = () => {
   if (selectedArena && playerData) {
     const newPlayer: ArenaPlayer = {
       id: playerData.id,
       username: playerData.username,
       elo: playerData.elo,
       rank: playerData.rank,
       avatar: playerData.avatar,
       status: 'not-ready',
       joinedAt: new Date(),
       isHost: false
     };
     
     setSelectedArena({
       ...selectedArena,
       players: [...selectedArena.players, newPlayer]
     });
     setIsPlayerInSelectedArena(true);
     
     console.log('Joined arena:', selectedArena.name);
   }
 };

 const handleLeaveArena = () => {
   if (selectedArena && playerData) {
     setSelectedArena({
       ...selectedArena,
       players: selectedArena.players.filter(p => p.id !== playerData.id)
     });
     setIsPlayerInSelectedArena(false);
     
     console.log('Left arena:', selectedArena.name);
   }
 };

 const renderCurrentSection = () => {
   if (!playerData) return <div>Loading...</div>;
   
   switch (currentSection) {
     case 'arena':
       if (!selectedArena) {
         setCurrentSection('main');
         return null;
       }
       return (
         <ArenaPage
           arena={selectedArena}
           currentPlayer={{
             id: playerData.id,
             username: playerData.username,
             elo: playerData.elo,
             rank: playerData.rank,
             avatar: playerData.avatar,
             status: 'ready',
             joinedAt: new Date(),
             isHost: false
           }}
           onBack={handleBackFromArena}
           onJoinArena={handleJoinArena}
           onLeaveArena={handleLeaveArena}
           isPlayerInArena={isPlayerInSelectedArena}
         />
       );
     case 'arenas': 
       return (
         <ArenasBrowser 
           playerData={playerData} 
           onBack={() => setCurrentSection('main')} 
           onJoinArena={(id) => onStartGame({mode: 'online', arenaId: id})} 
         />
       );
     case 'leaderboards': 
       return (
         <Leaderboards 
           playerData={playerData} 
           onBack={() => setCurrentSection('main')} 
         />
       );
     case 'friends': 
       return (
         <FriendsList 
           playerData={playerData} 
           onBack={() => setCurrentSection('main')} 
           onInviteFriend={(id) => console.log('Inviting friend:', id)} 
         />
       );
     case 'profile': 
       return (
         <PlayerProfile 
           playerData={playerData} 
           onBack={() => setCurrentSection('main')} 
           onUpdateProfile={(data) => setPlayerData({ ...playerData, ...data })} 
         />
       );
     case 'party': 
       return (
         <PartySystem 
           onBack={() => setCurrentSection('main')} 
           onStartPartyGame={(config) => onStartGame(config)} 
         />
       );
     default:
       return (
         <MainPortal 
           friends={friends} 
           upcomingArenas={upcomingArenas} 
           onNavigate={setCurrentSection} 
           onStartGame={onStartGame} 
           onViewArena={handleViewArena}
           getArenaTypeColor={getArenaTypeColor} 
         />
       );
   }
 };

 return (
   <div className="h-full w-full overflow-hidden text-white flex flex-col">
     <div className="flex-grow overflow-hidden">{renderCurrentSection()}</div>
   </div>
 );
};

export default OnlinePortal;