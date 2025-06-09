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
interface Friend { id: string; username: string; status: 'online' | 'away' | 'in-game' | 'offline'; elo: number; rank: string; currentGame?: string; avatar: string; }

const ArenaTimetableView: React.FC<any> = ({ upcomingArenas, onJoinArena, getArenaTypeColor, height }) => {
  const [baseOffset, setBaseOffset] = useState({ x: 0, y: 0 }); // Accumulated offset
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Current drag offset
  const [currentTime, setCurrentTime] = useState(new Date());
  const viewportRef = useRef<HTMLDivElement>(null);
  const timelineStart = useMemo(() => { const d = new Date(); d.setMinutes(0,0,0); return d; }, []);

  const timelineHours = 8;
  const laneHeight = 60;
  const hourWidth = 400;
  const timelineTotalWidth = timelineHours * hourWidth;

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initial centering on current time
  useEffect(() => {
    if (viewportRef.current) {
      const viewportCenter = viewportRef.current.clientWidth / 2;
      const minutesFromStart = (currentTime.getTime() - timelineStart.getTime()) / 60000;
      const currentOffsetPx = minutesFromStart * (hourWidth / 60);
      const newBaseOffset = { x: viewportCenter - currentOffsetPx, y: 0 };
      setBaseOffset(newBaseOffset);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [timelineStart, currentTime]);

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
  const contentTotalHeight = Math.min(maxLanes, 30) * laneHeight + 45;

  const bind = useDrag({
    onStart: () => {
      // Optional: Add visual feedback when drag starts
    },
    onDrag: ({ offset: [ox, oy] }) => {
      setDragOffset({ x: ox, y: oy });
    },
    onEnd: ({ offset: [ox, oy] }) => {
      // When drag ends, merge the drag offset into the base offset
      const viewportWidth = viewportRef.current?.clientWidth ?? 0;
      const viewportHeight = viewportRef.current?.clientHeight ?? 0;

      const newBaseX = baseOffset.x + ox;
      const newBaseY = baseOffset.y + oy;

      const clampedX = Math.max(viewportWidth - timelineTotalWidth, Math.min(newBaseX, 0));
      const clampedY = Math.max(viewportHeight - contentTotalHeight, Math.min(newBaseY, 0));
      
      setBaseOffset({ x: clampedX, y: clampedY });
      setDragOffset({ x: 0, y: 0 });
    }
  });

  // Calculate the final offset (base + current drag)
  const finalOffset = {
    x: baseOffset.x + dragOffset.x,
    y: baseOffset.y + dragOffset.y
  };

  // Apply clamping to the final offset for display
  const viewportWidth = viewportRef.current?.clientWidth ?? 0;
  const viewportHeight = viewportRef.current?.clientHeight ?? 0;
  const clampedFinalOffset = {
    x: Math.max(viewportWidth - timelineTotalWidth, Math.min(finalOffset.x, 0)),
    y: Math.max(viewportHeight - contentTotalHeight, Math.min(finalOffset.y, 0))
  };

  const getCurrentTimePosition = () => {
    const minutesFromStart = (currentTime.getTime() - timelineStart.getTime()) / 60000;
    return minutesFromStart * (hourWidth / 60);
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div 
      ref={viewportRef} 
      {...bind()} 
      style={{ 
        width: '100%', 
        height: `${height}px`, 
        position: 'relative', 
        overflow: 'hidden', 
        background: '#1a1a2e', 
        cursor: 'grab', 
        userSelect: 'none',
        touchAction: 'none' // Prevent default touch behaviors
      }}
    >
      <div style={{ position: 'absolute', width: `${timelineTotalWidth}px`, transform: `translate(${clampedFinalOffset.x}px, ${clampedFinalOffset.y}px)` }}>
        {/* Sticky Header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#1a1a2e', borderBottom: '1px solid #4a4a6e' }}>
            <div style={{ display: 'flex', height: '45px', alignItems: 'center' }}>
                {Array.from({ length: timelineHours }).map((_, i) => (
                    <div key={`header-${i}`} style={{ width: `${hourWidth}px`, padding: '10px', borderLeft: '1px solid #4a4a6e', color: '#aaa' }}>
                        {new Date(timelineStart.getTime() + i * 3600000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                    </div>
                ))}
            </div>
            
            {/* Current Time Indicator - sticks to header when scrolling */}
            <div style={{ 
              position: 'absolute', 
              left: `${currentTimePosition}px`, 
              top: 0, 
              bottom: 0, 
              width: '3px', 
              background: 'linear-gradient(to bottom, #ff1493, #ff69b4)', 
              zIndex: 15, 
              pointerEvents: 'none',
              boxShadow: '0 0 10px #ff1493, 0 0 20px #ff1493'
            }} />
            
            {/* Current Time Label - also sticks to header */}
            <div style={{
              position: 'absolute',
              left: `${currentTimePosition}px`,
              top: '5px',
              transform: 'translateX(-50%)',
              background: '#ff1493',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 'bold',
              zIndex: 16,
              pointerEvents: 'none',
              boxShadow: '0 2px 10px rgba(255, 20, 147, 0.5)',
              whiteSpace: 'nowrap'
            }}>
              {currentTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
        </div>
        
        <div style={{ position: 'relative', height: `${contentTotalHeight - 45}px` }}>
            {/* Minute Lines */}
            {Array.from({ length: timelineHours * 2 }).map((_, i) => (
                <div key={`line-${i}`} style={{ position: 'absolute', left: `${i * (hourWidth / 2)}px`, top: 0, height: '100%', borderLeft: '1px dashed rgba(255, 255, 255, 0.1)' }} />
            ))}
            
            {/* Extended Current Time Indicator Line */}
            <div style={{ 
              position: 'absolute', 
              left: `${currentTimePosition}px`, 
              top: 0, 
              height: '100%',
              width: '3px', 
              background: 'linear-gradient(to bottom, #ff1493, #ff69b4)', 
              zIndex: 5, 
              pointerEvents: 'none',
              boxShadow: '0 0 10px #ff1493',
              opacity: 0.7
            }} />
            
            {/* Arenas */}
            {laidOutArenas.map(arena => {
              const startOffsetMinutes = (arena.startTime.getTime() - timelineStart.getTime()) / 60000;
              const leftPx = startOffsetMinutes * (hourWidth / 60);
              const widthPx = arena.duration * (hourWidth / 60) - 4;
              const bgColor = arena.status === 'finished' ? '#424242' : getArenaTypeColor(arena.type);
              return (
                <div 
                  key={arena.id} 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent drag when clicking arenas
                    onJoinArena(arena.id);
                  }} 
                  title={arena.name} 
                  style={{ 
                    position: 'absolute', 
                    top: `${arena.lane * laneHeight + 5}px`, 
                    left: `${leftPx}px`, 
                    width: `${widthPx}px`, 
                    height: '50px', 
                    background: bgColor, 
                    borderRadius: '5px', 
                    padding: '8px', 
                    color: 'white', 
                    cursor: 'pointer', 
                    zIndex: 1,
                    pointerEvents: 'auto' // Ensure arenas are clickable
                  }}
                >
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{arena.name}</div>
                  <div>{arena.players}/{arena.maxPlayers}</div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

// Resizable Timetable Component
const ResizableTimetable: React.FC<any> = ({ upcomingArenas, onJoinArena, getArenaTypeColor }) => {
  const [timetableHeight, setTimetableHeight] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  const minHeight = 200;
  const maxHeight = 600;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the drag gesture from interfering
    setIsResizing(true);
    
    const startY = e.clientY;
    const startHeight = timetableHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
      setTimetableHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const progressPercent = ((timetableHeight - minHeight) / (maxHeight - minHeight)) * 100;

  return (
    <div style={{ position: 'relative' }}>
      <ArenaTimetableView 
        upcomingArenas={upcomingArenas} 
        onJoinArena={onJoinArena} 
        getArenaTypeColor={getArenaTypeColor}
        height={timetableHeight}
      />
      
      {/* Resize Handle */}
      <div 
        ref={resizeRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          bottom: '-8px',
          left: 0,
          right: 0,
          height: '16px',
          cursor: 'ns-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isResizing ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderRadius: '8px',
          transition: 'background 0.2s ease',
          zIndex: 30, // Higher z-index to ensure it's above the draggable area
          pointerEvents: 'auto' // Ensure this element captures mouse events
        }}
        onMouseEnter={(e) => {
          if (!isResizing) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        {/* Resize Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.2s ease',
          opacity: isResizing ? 1 : 0.7,
          pointerEvents: 'none' // Let the parent handle the mouse events
        }}>
          {/* Drag Icon */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{
                width: '12px',
                height: '2px',
                background: '#fff',
                borderRadius: '1px',
                opacity: 0.6
              }} />
            ))}
          </div>
          
          {/* Height Display */}
          <span style={{
            fontSize: '11px',
            color: '#fff',
            fontWeight: 'bold',
            minWidth: '50px',
            textAlign: 'center'
          }}>
            {timetableHeight}px
          </span>
          
          {/* Progress Bar */}
          <div style={{
            width: '60px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4caf50, #2196f3)',
              borderRadius: '2px',
              transition: 'width 0.1s ease'
            }} />
          </div>
          
          {/* Size Labels */}
          <div style={{
            fontSize: '9px',
            color: '#aaa',
            display: 'flex',
            flexDirection: 'column',
            lineHeight: '1'
          }}>
            <span>{progressPercent < 25 ? 'Small' : progressPercent < 75 ? 'Medium' : 'Large'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Portal Component (Updated Layout)
const MainPortal: React.FC<any> = ({ upcomingArenas, friends, onNavigate, onStartGame, getArenaTypeColor }) => {
    const getRankColor = (rank: string) => ({ diamond: '#b9f2ff', platinum: '#e5e4e2', gold: '#ffd700' }[rank.toLowerCase()] || '#c0c0c0');
    const getStatusIcon = (status: Friend['status']) => ({ online: '🟢', away: '🟡', 'in-game': '🎮', offline: '⚫' }[status]);
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', padding: '0 0 20px 0' }}>
          <ResizableTimetable upcomingArenas={upcomingArenas} onJoinArena={onStartGame} getArenaTypeColor={getArenaTypeColor} />
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
      { id: 'friend_3', username: 'MelodyMate', status: 'away', elo: 1892, rank: 'Diamond', avatar: '/avatars/friend3.png' },
      { id: 'friend_4', username: 'SoundSibling', status: 'offline', elo: 1445, rank: 'Gold', avatar: '/avatars/friend4.png' },
      { id: 'friend_5', username: 'NoteMaster', status: 'online', elo: 2134, rank: 'Master', avatar: '/avatars/friend5.png' },
      { id: 'friend_6', username: 'BassDrop', status: 'away', elo: 1789, rank: 'Diamond', avatar: '/avatars/friend6.png' },
    ];
    setFriends(mockFriends);
    
    // Enhanced Mock Arenas with more categories
    const mockArenas: Arena[] = []; 
    const now = new Date();
    for (let i = -24; i < 48; i++) {
      // Expanded arena types with more categories
      const arenaTypes: Arena['type'][] = [
        'tournament', 'ranked', 'casual', 'speed', 'party', 
        'battle-royale', 'team-battle', 'practice', 'blitz', 
        'championship', 'seasonal', 'custom'
      ];
      
      if (Math.random() > 0.1) { // Increased spawn rate for more arenas
        const type = arenaTypes[Math.floor(Math.random() * arenaTypes.length)];
        const startTime = new Date(now.getTime() + i * 10 * 60 * 1000); // Every 10 minutes instead of 15
        
        const arenaNames = { 
          tournament: ['World Championship', 'Masters Cup', 'Elite Tournament', 'Pro League'],
          ranked: ['Ranked Climb', 'ELO Battle', 'Competitive Match', 'Ladder Challenge'], 
          casual: ['Fun Mode', 'Practice Arena', 'Chill Session', 'Social Play'],
          speed: ['Bullet Mayhem', 'Lightning Round', 'Quick Fire', 'Speed Demon'],
          party: ['Team Battle', 'Group Play', 'Squad Match', 'Friends Only'],
          'battle-royale': ['Last Player Standing', 'Survival Arena', 'BR Championship', 'Ultimate Showdown'],
          'team-battle': ['5v5 Showdown', 'Team Championship', 'Squad Wars', 'Alliance Battle'],
          practice: ['Training Ground', 'Skill Builder', 'Warm-up Arena', 'Drill Session'],
          blitz: ['Blitz Battle', 'Quick Match', 'Fast Track', 'Rapid Fire'],
          championship: ['Grand Finals', 'World Series', 'Championship Series', 'Title Match'],
          seasonal: ['Spring Event', 'Summer Festival', 'Autumn Cup', 'Winter Special'],
          custom: ['Custom Rules', 'Modded Match', 'Special Event', 'Community Game']
        };
        
        const durations = {
          tournament: 120, ranked: 45, casual: 30, speed: 15, party: 60,
          'battle-royale': 90, 'team-battle': 75, practice: 20, blitz: 10,
          championship: 150, seasonal: 100, custom: 40
        };
        
        const maxPlayers = {
          tournament: 64, ranked: 8, casual: 12, speed: 16, party: 6,
          'battle-royale': 100, 'team-battle': 10, practice: 20, blitz: 8,
          championship: 32, seasonal: 50, custom: 24
        };
        
        mockArenas.push({ 
          id: `arena_${i}`, 
          name: arenaNames[type][Math.floor(Math.random() * arenaNames[type].length)], 
          type, 
          startTime, 
          duration: durations[type], 
          players: Math.floor(Math.random() * maxPlayers[type] * 0.8) + 1, 
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
          host: `Host${Math.floor(Math.random() * 100)}` 
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