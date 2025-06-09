import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import ArenasBrowser from './online/ArenasBrowser';
import Leaderboards from './online/Leaderboards';
import FriendsList from './online/FriendsList';
import PlayerProfile from './online/PlayerProfile';
import PartySystem from './online/PartySystem';

// Type Definitions
interface OnlinePortalProps {
  onBack: () => void;
  onStartGame: (config: any) => void;
}
type PortalSection = 'main' | 'arenas' | 'leaderboards' | 'friends' | 'profile' | 'party';
interface PlayerData { id: string; username: string; rank: string; elo: number; wins: number; losses: number; draws: number; level: number; avatar: string; status: 'online' | 'away' | 'in-game' | 'offline'; lastPlayed: Date; }
interface Arena { id: string; name: string; type: 'tournament' | 'ranked' | 'casual' | 'speed' | 'party'; startTime: Date; duration: number; players: number; maxPlayers: number; difficulty: number; prizePool?: number; status: 'waiting' | 'starting' | 'live' | 'finished'; timeControl: string; host: string; }
interface Friend { id: string; username: string; status: 'online' | 'away' | 'in-game' | 'offline'; elo: number; rank: string; currentGame?: string; avatar: string; }


const ArenaTimetableView: React.FC<any> = ({ upcomingArenas, onJoinArena, getArenaTypeColor }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const timelineStart = useMemo(() => { const d = new Date(); d.setMinutes(0,0,0); return d; }, []);

  const timelineHours = 8;
  const laneHeight = 60;
  const hourWidth = 400;
  const timelineTotalWidth = timelineHours * hourWidth;

  useEffect(() => {
    if (viewportRef.current) {
      const viewportCenter = viewportRef.current.clientWidth / 2;
      const minutesFromStart = (new Date().getTime() - timelineStart.getTime()) / 60000;
      const currentOffsetPx = minutesFromStart * (hourWidth / 60);
      setOffset({ x: viewportCenter - currentOffsetPx, y: 0 });
    }
  }, [timelineStart]);

  const laidOutArenas = useMemo(() => {
    const lanes: Date[] = [];
    const sortedArenas = [...upcomingArenas].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    return sortedArenas.map(arena => {
      let placedLane = -1;
      for (let i = 0; i < lanes.length; i++) { if (lanes[i] <= arena.startTime) { placedLane = i; break; } }
      if (placedLane === -1) { placedLane = lanes.length; }
      lanes[placedLane] = new Date(arena.startTime.getTime() + arena.duration * 60000);
      return { ...arena, lane: placedLane };
    });
  }, [upcomingArenas]);

  const maxLanes = laidOutArenas.length > 0 ? Math.max(...laidOutArenas.map(a => a.lane)) + 1 : 0;
  // Cap the height to prevent extreme empty space
  const contentTotalHeight = Math.min(maxLanes, 20) * laneHeight + 45; // Max 20 lanes visible + header

  const bind = useDrag(({ offset: [ox, oy] }) => {
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    const viewportHeight = viewportRef.current?.clientHeight ?? 0;

    const clampedX = Math.max(viewportWidth - timelineTotalWidth, Math.min(ox, 0));
    const clampedY = Math.max(viewportHeight - contentTotalHeight, Math.min(oy, 0));
    
    setOffset({ x: clampedX, y: clampedY });
  });

  return (
    <div ref={viewportRef} {...bind()} style={{ width: '100%', height: '280px', position: 'relative', overflow: 'hidden', background: '#1a1a2e', cursor: 'grab', userSelect: 'none' }}>
      <div style={{ position: 'absolute', width: `${timelineTotalWidth}px`, transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 3, background: '#1a1a2e' }}>
            {/* Time Header */}
            <div style={{ display: 'flex', height: '45px', alignItems: 'center' }}>
                {Array.from({ length: timelineHours }).map((_, i) => (
                    <div key={`header-${i}`} style={{ width: `${hourWidth}px`, padding: '10px', borderLeft: '1px solid #4a4a6e', color: '#aaa' }}>
                        {new Date(timelineStart.getTime() + i * 3600000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                    </div>
                ))}
            </div>
        </div>
        <div style={{ position: 'relative', height: `${contentTotalHeight - 45}px` }}>
            {/* Minute Lines */}
            {Array.from({ length: timelineHours * 2 }).map((_, i) => (
                <div key={`line-${i}`} style={{ position: 'absolute', left: `${i * (hourWidth / 2)}px`, top: 0, height: '100%', borderLeft: '1px dashed rgba(255, 255, 255, 0.1)' }} />
            ))}
            {/* Arenas */}
            {laidOutArenas.map(arena => {
              const startOffsetMinutes = (arena.startTime.getTime() - timelineStart.getTime()) / 60000;
              const leftPx = startOffsetMinutes * (hourWidth / 60);
              const widthPx = arena.duration * (hourWidth / 60) - 4;
              const bgColor = arena.status === 'finished' ? '#424242' : getArenaTypeColor(arena.type);
              return (
                <div key={arena.id} onClick={() => onJoinArena(arena.id)} title={arena.name} style={{ position: 'absolute', top: `${arena.lane * laneHeight + 5}px`, left: `${leftPx}px`, width: `${widthPx}px`, height: '50px', background: bgColor, borderRadius: '5px', padding: '8px', color: 'white', cursor: 'pointer', zIndex: 1 }}>
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{arena.name}</div>
                  <div>{arena.players}/{arena.maxPlayers}</div>
                </div>
              );
            })}
        </div>
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#ff1493', zIndex: 2, pointerEvents: 'none', boxShadow: '0 0 10px #ff1493' }} />
    </div>
  );
};


// Main Portal Component (Original Layout)
const MainPortal: React.FC<any> = ({ upcomingArenas, friends, onNavigate, onStartGame, getArenaTypeColor }) => {
    const getRankColor = (rank: string) => ({ diamond: '#b9f2ff', platinum: '#e5e4e2', gold: '#ffd700' }[rank.toLowerCase()] || '#c0c0c0');
    const getStatusIcon = (status: Friend['status']) => ({ online: '🟢', away: '🟡', 'in-game': '🎮', offline: '⚫' }[status]);
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <ArenaTimetableView upcomingArenas={upcomingArenas} onJoinArena={onStartGame} getArenaTypeColor={getArenaTypeColor} />
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid #333' }}>
          {[
            { title: 'Quick Match', description: 'Jump into a game', icon: '⚡', color: '#4caf50', action: () => onStartGame({ mode: 'quick' }) },
            { title: 'Leaderboards', description: 'See rankings', icon: '🏆', color: '#ff9800', action: () => onNavigate('leaderboards') },
            { title: 'Create Arena', description: 'Host your own game', icon: '🏟️', color: '#2196f3', action: () => onNavigate('arenas') },
            { title: 'Party Up', description: 'Play with friends', icon: '🎉', color: '#9c27b0', action: () => onNavigate('party') }
          ].map((action) => (
            <button key={action.title} onClick={action.action} style={{ background: `linear-gradient(135deg, ${action.color}20, ${action.color}40)`, border: `1px solid ${action.color}`, borderRadius: '12px', padding: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'left' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{action.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>{action.title}</div>
              <div style={{ fontSize: '12px', color: '#ccc' }}>{action.description}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: '300px', flexShrink: 0, background: 'rgba(0, 0, 0, 0.3)', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>👥 Friends</h3>
            <button onClick={() => onNavigate('friends')} style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Manage</button>
          </div>
          <div style={{ fontSize: '14px', color: '#ccc' }}>{friends.filter(f => f.status !== 'offline').length} of {friends.length} online</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {friends.map((friend) => (
            <div key={friend.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px' }}>
              <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, #4caf50, #2196f3)'}}/>
                <div style={{ position: 'absolute', bottom: -2, right: -2 }}>{getStatusIcon(friend.status)}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '500', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{friend.username}</div>
                <div style={{ fontSize: '11px', color: getRankColor(friend.rank), fontWeight: 'bold' }}>{friend.rank}</div>
                <div style={{ fontSize: '10px', color: '#999' }}>{friend.status === 'in-game' ? `Playing ${friend.currentGame}`: friend.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ========= TOP-LEVEL WRAPPER COMPONENT =========
const OnlinePortal: React.FC<OnlinePortalProps> = ({ onBack, onStartGame }) => {
  const [currentSection, setCurrentSection] = useState<PortalSection>('main');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [upcomingArenas, setUpcomingArenas] = useState<Arena[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    // Mock Data Fetching...
    const mockPlayer: PlayerData = { id: 'player_123', username: 'RhythmMaster', rank: 'Diamond', elo: 1847, wins: 156, losses: 89, draws: 12, level: 28, avatar: '/avatars/default.png', status: 'online', lastPlayed: new Date() };
    setPlayerData(mockPlayer);
    const mockFriends: Friend[] = [
      { id: 'friend_1', username: 'BeatBuddy', status: 'online', elo: 1756, rank: 'Diamond', avatar: '/avatars/friend1.png' },
      { id: 'friend_2', username: 'RhythmPal', status: 'in-game', elo: 1623, rank: 'Platinum', currentGame: 'Tournament', avatar: '/avatars/friend2.png' },
    ];
    setFriends(mockFriends);
    const mockArenas: Arena[] = []; const now = new Date();
    for (let i = -24; i < 48; i++) {
      const arenaTypes: Arena['type'][] = ['tournament', 'ranked', 'casual', 'speed', 'party'];
      if (Math.random() > 0.15) {
        const type = arenaTypes[Math.floor(Math.random() * arenaTypes.length)];
        const startTime = new Date(now.getTime() + i * 15 * 60 * 1000);
        const arenaNames = { tournament: ['Championship', 'Masters Cup'], ranked: ['Ranked Blitz', 'ELO Climb'], casual: ['Fun Mode', 'Practice Arena'], speed: ['Bullet Mayhem', 'Lightning Round'], party: ['Team Battle', 'Group Play']};
        mockArenas.push({ id: `arena_${i}`, name: arenaNames[type][Math.floor(Math.random() * arenaNames[type].length)], type, startTime, duration: ({ tournament: 90, ranked: 30, casual: 20, speed: 15, party: 45 }[type]), players: Math.floor(Math.random() * 50) + 10, maxPlayers: ({ tournament: 64, ranked: 8, casual: 12, speed: 16, party: 6 }[type]), difficulty: Math.floor(Math.random() * 100) + 1, prizePool: type === 'tournament' ? Math.floor(Math.random() * 10000) + 1000 : undefined, status: (()=>{ const diff = startTime.getTime() - new Date().getTime(); if (diff < -(90*60*1000)) return 'finished'; if (diff < 0) return 'live'; if (diff < 5*60*1000) return 'starting'; return 'waiting'; })(), timeControl: '5+3', host: `Host${Math.floor(Math.random() * 100)}` });
      }
    }
    setUpcomingArenas(mockArenas);
  }, []);

  const getArenaTypeColor = (type: Arena['type']): string => ({ tournament: '#ff6b35', ranked: '#8e24aa', casual: '#43a047', speed: '#f44336', party: '#ff9800' })[type];

  const renderCurrentSection = () => {
    if (!playerData) return <div>Loading...</div>;
    switch (currentSection) {
      case 'arenas': return <ArenasBrowser playerData={playerData} onBack={() => setCurrentSection('main')} onJoinArena={(id) => onStartGame({mode: 'online', arenaId: id})} />;
      case 'leaderboards': return <Leaderboards playerData={playerData} onBack={() => setCurrentSection('main')} />;
      case 'friends': return <FriendsList playerData={playerData} onBack={() => setCurrentSection('main')} onInviteFriend={(id) => console.log('Inviting friend:', id)} />;
      case 'profile': return <PlayerProfile playerData={playerData} onBack={() => setCurrentSection('main')} onUpdateProfile={(data) => setPlayerData({ ...playerData, ...data })} />;
      case 'party': return <PartySystem onBack={() => setCurrentSection('main')} onStartPartyGame={(config) => onStartGame(config)} />;
      default:
        return <MainPortal friends={friends} upcomingArenas={upcomingArenas} onNavigate={setCurrentSection} onStartGame={onStartGame} getArenaTypeColor={getArenaTypeColor} />;
    }
  };

  return (
    <div className="h-full w-full overflow-hidden bg-gray-900 text-white flex flex-col">
      <div className="flex-grow overflow-hidden">{renderCurrentSection()}</div>
    </div>
  );
};

export default OnlinePortal;