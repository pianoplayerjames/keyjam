import React, { useState, useEffect, useMemo } from 'react';
import ArenasBrowser from './menus/ArenasBrowser';
import Leaderboards from './menus/Leaderboards';
import FriendsList from './menus/FriendsList';
import PlayerProfile from './menus/PlayerProfile';
import PartySystem from './menus/PartySystem';
import { ResizableTimetable } from './components/ArenaTimetable';
import { CenteredContainer } from '../shared/components/Layout';
import { ArenaPage } from './components/ArenaPage';

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

interface LiveStream {
  id: string;
  streamer: string;
  title: string;
  viewers: number;
  gameMode: string;
  thumbnail: string;
  isLive: boolean;
  rank: string;
}

interface Event {
  id: string;
  title: string;
  type: 'tournament' | 'season' | 'special' | 'update';
  startDate: Date;
  endDate?: Date;
  description: string;
  prizePool?: number;
  participants?: number;
  status: 'upcoming' | 'live' | 'ended';
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  elo: number;
  tier: string;
  change: number;
}

interface Update {
  id: string;
  title: string;
  type: 'patch' | 'feature' | 'event' | 'maintenance';
  date: Date;
  summary: string;
  version?: string;
}

interface MainPortalProps {
 onBack: () => void;
 onStartGame: (config: any) => void;
}

type PortalSection = 'main' | 'arenas' | 'leaderboards' | 'friends' | 'profile' | 'party' | 'arena';

const MainPortal: React.FC<MainPortalProps> = ({ onBack, onStartGame }) => {
  const [currentSection, setCurrentSection] = useState<PortalSection>('main');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [upcomingArenas, setUpcomingArenas] = useState<Arena[]>([]);
  const [selectedArena, setSelectedArena] = useState<DetailedArena | null>(null);
  const [isPlayerInSelectedArena, setIsPlayerInSelectedArena] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'streams' | 'leaderboard' | 'events' | 'updates'>('streams');

  const generateMockArenaPlayers = (count: number, hostName: string): ArenaPlayer[] => {
    const mockNames = [
      'BeatMaster99', 'RhythmPro', 'SoundWave', 'MelodyKing', 'ComboQueen', 'NoteMaster', 'BassDrop'
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
        status: Math.random() > 0.2 ? 'ready' : 'not-ready',
        joinedAt: new Date(Date.now() - Math.random() * 600000),
        isHost
      };
    });
  };

  const getArenaTypeColor = (type: Arena['type']): string => ({
    tournament: '#ff6b35', ranked: '#8e24aa', casual: '#43a047', speed: '#f44336', party: '#ff9800',
    'battle-royale': '#e91e63', 'team-battle': '#3f51b5', practice: '#4caf50', blitz: '#ff5722',
    championship: '#ffd700', seasonal: '#9c27b0', custom: '#607d8b'
  })[type] || '#666';
  
  const getRankColor = (rank: string) => ({
    'bronze': '#cd7f32', 'silver': '#c0c0c0', 'gold': '#ffd700', 'platinum': '#e5e4e2',
    'diamond': '#b9f2ff', 'master': '#ff6b35', 'grandmaster': '#ff1744'
  }[rank.toLowerCase()] || '#666');

  useEffect(() => {
    setPlayerData({
      id: 'player_123', username: 'RhythmMaster', rank: 'Diamond', elo: 1847, wins: 156,
      losses: 89, draws: 12, level: 28, avatar: '/avatars/default.png', status: 'online',
      lastPlayed: new Date()
    });
    
    const mockArenas: Arena[] = Array.from({ length: 50 }).map((_, i) => {
        const arenaTypes: Arena['type'][] = ['tournament', 'ranked', 'casual', 'speed', 'party', 'battle-royale', 'team-battle'];
        const type = arenaTypes[Math.floor(Math.random() * arenaTypes.length)];
        return {
            id: `arena_${i}`, name: `${type.charAt(0).toUpperCase() + type.slice(1)} Arena #${i}`, type,
            startTime: new Date(Date.now() + (i - 25) * 20 * 60 * 1000), duration: 30,
            players: Math.floor(Math.random() * 8), maxPlayers: 8, difficulty: Math.floor(Math.random() * 100),
            status: 'waiting', timeControl: '5+3', host: `Host${i}`
        };
    });
    setUpcomingArenas(mockArenas);
  }, []);
  
  const handleViewArena = (arena: Arena) => {
    const detailedArena: DetailedArena = {
      ...arena,
      requirements: { minElo: 1200 }, gameMode: 'Standard',
      description: `An exciting ${arena.type} arena hosted by ${arena.host}.`,
      players: generateMockArenaPlayers(arena.players, arena.host)
    };
    setSelectedArena(detailedArena);
    setCurrentSection('arena');
  };

  const handleJoinArena = () => {
    if (selectedArena && playerData) {
        setIsPlayerInSelectedArena(true);
        console.log('Joined arena:', selectedArena.name);
    }
  };

  const handleLeaveArena = () => {
    setIsPlayerInSelectedArena(false);
    console.log('Left arena:', selectedArena?.name);
  };
  
  const liveStreams: LiveStream[] = [
    { id: '1', streamer: 'RhythmKing', title: 'Road to Grandmaster', viewers: 2847, gameMode: 'Ranked', thumbnail: '', isLive: true, rank: 'Master' },
    { id: '2', streamer: 'BeatQueen', title: 'Perfect Accuracy Challenge', viewers: 1523, gameMode: 'Challenge', thumbnail: '', isLive: true, rank: 'Diamond' },
    { id: '3', streamer: 'ComboMaster', title: 'Teaching Advanced Techniques', viewers: 892, gameMode: 'Tutorial', thumbnail: '', isLive: true, rank: 'Grandmaster' },
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'RhythmGod', elo: 2847, tier: 'Grandmaster', change: +23 },
    { rank: 2, username: 'BeatMachine', elo: 2789, tier: 'Grandmaster', change: -5 },
    { rank: 3, username: 'SoundWave', elo: 2734, tier: 'Master', change: +18 },
  ];

  const events: Event[] = [
    { id: '1', title: 'World Championship 2025', type: 'tournament', startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), description: 'The biggest tournament of the year', prizePool: 100000, status: 'upcoming' },
    { id: '2', title: 'Season 2 Launch', type: 'season', startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), description: 'New songs, features, and ranked reset', status: 'upcoming' },
  ];

  const updates: Update[] = [
    { id: '1', title: 'Performance Improvements', type: 'patch', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), summary: 'Reduced input lag and improved frame stability', version: 'v11.8.2' },
    { id: '2', title: 'New Song Pack: Electronic Dreams', type: 'feature', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), summary: '10 new electronic tracks added' },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `in ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const getUpdateIcon = (type: Update['type']) => ({
    'patch': '🔧', 'feature': '✨', 'event': '🎉', 'maintenance': '⚙️'
  })[type] || '📢';

  const renderSidebarContent = () => {
    switch (sidebarTab) {
      case 'streams':
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {liveStreams.map((stream) => (
              <div key={stream.id} style={{ marginBottom: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f44336', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '10px', color: '#f44336', fontWeight: 'bold', textTransform: 'uppercase' }}>LIVE</span>
                  <span style={{ fontSize: '11px', color: '#ccc' }}>{stream.viewers.toLocaleString()} viewers</span>
                </div>
                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stream.title}</div>
                <div style={{ fontSize: '11px', color: getRankColor(stream.rank), fontWeight: 'bold', marginBottom: '4px' }}>{stream.streamer} • {stream.rank}</div>
                <div style={{ fontSize: '10px', color: '#999', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>{stream.gameMode}</div>
              </div>
            ))}
          </div>
        );
      case 'leaderboard':
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {leaderboard.map((entry) => (
              <div key={entry.rank} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', marginBottom: '6px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
                <div style={{ minWidth: '24px', textAlign: 'center', fontWeight: 'bold', fontSize: '12px', color: entry.rank <= 3 ? '#ffd700' : '#ccc' }}>{entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.username}</div>
                  <div style={{ fontSize: '11px', color: getRankColor(entry.tier), fontWeight: 'bold' }}>{entry.tier} • {entry.elo}</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: entry.change > 0 ? '#4caf50' : entry.change < 0 ? '#f44336' : '#666' }}>{entry.change > 0 ? '+' : ''}{entry.change}</div>
              </div>
            ))}
          </div>
        );
      case 'events':
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {events.map((event) => (
              <div key={event.id} style={{ marginBottom: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{event.type === 'tournament' ? '🏆' : event.type === 'season' ? '🌟' : '🎉'}</span>
                  <div style={{ background: event.status === 'live' ? '#4caf50' : '#ff9800', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{event.status}</div>
                </div>
                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>{event.title}</div>
                <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '6px', lineHeight: '1.4' }}>{event.description}</div>
                <div style={{ fontSize: '10px', color: '#999' }}>{formatDate(event.startDate)}{event.prizePool && <span style={{ color: '#ffd700', marginLeft: '8px' }}>💰 ${event.prizePool.toLocaleString()}</span>}</div>
              </div>
            ))}
          </div>
        );
      case 'updates':
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {updates.map((update) => (
              <div key={update.id} style={{ marginBottom: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{getUpdateIcon(update.type)}</span>
                  {update.version && <div style={{ background: '#2196f3', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>{update.version}</div>}
                  <div style={{ fontSize: '10px', color: '#666', marginLeft: 'auto' }}>{formatDate(update.date)}</div>
                </div>
                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>{update.title}</div>
                <div style={{ fontSize: '11px', color: '#ccc', lineHeight: '1.4' }}>{update.summary}</div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderMainPortalView = () => (
    <CenteredContainer maxWidth="2xl" accountForLeftNav={true}>
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative', padding: '0 0 20px 0' }}>
                    <ResizableTimetable upcomingArenas={upcomingArenas} onJoinArena={(id) => onStartGame({mode: 'online', arenaId: id})} onViewArena={handleViewArena} getArenaTypeColor={getArenaTypeColor}/>
                </div>
                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid #333' }}>
                    {[{ title: 'Quick Match', description: 'Jump into a game', icon: '⚡', color: '#4caf50', action: () => onStartGame({ mode: 'quick' }) }, { title: 'Leaderboards', description: 'See rankings', icon: '🏆', color: '#ff9800', action: () => setCurrentSection('leaderboards') }, { title: 'Create Arena', description: 'Host your own game', icon: '🏟️', color: '#2196f3', action: () => setCurrentSection('arenas') }, { title: 'Party Up', description: 'Play with friends', icon: '🎉', color: '#9c27b0', action: () => setCurrentSection('party') }].map((action) => (
                        <button key={action.title} onClick={action.action} style={{ background: `linear-gradient(135deg, ${action.color}20, ${action.color}40)`, border: `1px solid ${action.color}`, borderRadius: '12px', padding: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'left' }}>
                            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{action.icon}</div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>{action.title}</div>
                            <div style={{ fontSize: '12px', color: '#ccc' }}>{action.description}</div>
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ width: '320px', flexShrink: 0, background: 'rgba(0, 0, 0, 0.3)', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '15px 10px', borderBottom: '1px solid #333', background: 'rgba(0, 0, 0, 0.2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {[{ id: 'streams', label: 'Streams', icon: '📺' }, { id: 'leaderboard', label: 'Top', icon: '🏆' }, { id: 'events', label: 'Events', icon: '📅' }, { id: 'updates', label: 'Updates', icon: '📢' }].map((tab) => (
                            <button key={tab.id} onClick={() => setSidebarTab(tab.id as any)} style={{ background: sidebarTab === tab.id ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)', border: sidebarTab === tab.id ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)', color: 'white', padding: '8px 6px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: sidebarTab === tab.id ? 'bold' : 'normal', transition: 'all 0.3s ease', textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', marginBottom: '2px' }}>{tab.icon}</div>
                                <div>{tab.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
                {renderSidebarContent()}
            </div>
        </div>
    </CenteredContainer>
  );

  const renderCurrentSection = () => {
    if (!playerData) return <div>Loading...</div>;

    switch (currentSection) {
      case 'arena':
        return selectedArena ? (
          <ArenaPage
            arena={selectedArena} currentPlayer={playerData as any} onBack={() => setCurrentSection('main')}
            onJoinArena={handleJoinArena} onLeaveArena={handleLeaveArena} isPlayerInArena={isPlayerInSelectedArena}
          />
        ) : null;
      case 'arenas': return <ArenasBrowser onBack={() => setCurrentSection('main')} onJoinArena={(id) => onStartGame({ mode: 'online', arenaId: id })} />;
      case 'leaderboards': return <Leaderboards onBack={() => setCurrentSection('main')} />;
      case 'friends': return <FriendsList playerData={playerData} onBack={() => setCurrentSection('main')} onInviteFriend={(id) => console.log('Inviting friend:', id)} />;
      case 'profile': return <PlayerProfile playerData={playerData} onBack={() => setCurrentSection('main')} onUpdateProfile={(data) => setPlayerData({ ...playerData, ...data })} />;
      case 'party': return <PartySystem onBack={() => setCurrentSection('main')} onStartPartyGame={(config) => onStartGame(config)} />;
      default: return renderMainPortalView();
    }
  };

  return (
    <div className="h-full w-full overflow-hidden text-white flex flex-col">
      <div className="flex-grow overflow-hidden">{renderCurrentSection()}</div>
    </div>
  );
};

export default MainPortal;