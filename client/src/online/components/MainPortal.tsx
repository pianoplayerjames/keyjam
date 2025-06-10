// client/src/online/components/MainPortal.tsx
import React, { useState } from 'react';
import { ResizableTimetable } from './ArenaTimetable';
import { CenteredContainer } from '../../shared/components/Layout';

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
  upcomingArenas: Arena[];
  onNavigate: (section: string) => void;
  onStartGame: (config: any) => void;
  onViewArena?: (arena: Arena) => void;
  getArenaTypeColor: (type: Arena['type']) => string;
}

export const MainPortal: React.FC<MainPortalProps> = ({ 
  upcomingArenas, 
  onNavigate, 
  onStartGame, 
  onViewArena,
  getArenaTypeColor 
}) => {
  const [sidebarTab, setSidebarTab] = useState<'streams' | 'leaderboard' | 'events' | 'updates'>('streams');

  // Mock data
  const liveStreams: LiveStream[] = [
    {
      id: '1',
      streamer: 'RhythmKing',
      title: 'Road to Grandmaster - Tournament Prep',
      viewers: 2847,
      gameMode: 'Ranked',
      thumbnail: '/thumbnails/stream1.jpg',
      isLive: true,
      rank: 'Master'
    },
    {
      id: '2',
      streamer: 'BeatQueen',
      title: 'Perfect Accuracy Challenge',
      viewers: 1523,
      gameMode: 'Challenge',
      thumbnail: '/thumbnails/stream2.jpg',
      isLive: true,
      rank: 'Diamond'
    },
    {
      id: '3',
      streamer: 'ComboMaster',
      title: 'Teaching Advanced Techniques',
      viewers: 892,
      gameMode: 'Tutorial',
      thumbnail: '/thumbnails/stream3.jpg',
      isLive: true,
      rank: 'Grandmaster'
    },
    {
      id: '4',
      streamer: 'NoteNinja',
      title: 'Speedrun Practice Session',
      viewers: 654,
      gameMode: 'Speedrun',
      thumbnail: '/thumbnails/stream4.jpg',
      isLive: true,
      rank: 'Master'
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'RhythmGod', elo: 2847, tier: 'Grandmaster', change: +23 },
    { rank: 2, username: 'BeatMachine', elo: 2789, tier: 'Grandmaster', change: -5 },
    { rank: 3, username: 'SoundWave', elo: 2734, tier: 'Master', change: +18 },
    { rank: 4, username: 'MelodyKing', elo: 2698, tier: 'Master', change: +7 },
    { rank: 5, username: 'ComboQueen', elo: 2645, tier: 'Master', change: -12 },
    { rank: 6, username: 'NoteMaster', elo: 2612, tier: 'Master', change: +34 },
    { rank: 7, username: 'RhythmPro', elo: 2587, tier: 'Master', change: +9 },
    { rank: 8, username: 'BeatBoss', elo: 2534, tier: 'Diamond', change: -8 },
  ];

  const events: Event[] = [
    {
      id: '1',
      title: 'World Championship 2025',
      type: 'tournament',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      description: 'The biggest tournament of the year with $100,000 prize pool',
      prizePool: 100000,
      participants: 0,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Season 2 Launch',
      type: 'season',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      description: 'New songs, features, and ranked reset',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Community Challenge Weekend',
      type: 'special',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      description: 'Double XP and exclusive rewards',
      status: 'upcoming'
    }
  ];

  const updates: Update[] = [
    {
      id: '1',
      title: 'Performance Improvements',
      type: 'patch',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      summary: 'Reduced input lag by 15% and improved frame stability',
      version: 'v11.8.2'
    },
    {
      id: '2',
      title: 'New Song Pack: Electronic Dreams',
      type: 'feature',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      summary: '10 new electronic tracks from top artists',
    },
    {
      id: '3',
      title: 'Server Maintenance Complete',
      type: 'maintenance',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      summary: 'Upgraded servers for better global connectivity',
    }
  ];

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      case 'diamond': return '#b9f2ff';
      case 'master': return '#ff6b35';
      case 'grandmaster': return '#ff1744';
      default: return '#666';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `in ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const getUpdateIcon = (type: Update['type']) => {
    switch (type) {
      case 'patch': return '🔧';
      case 'feature': return '✨';
      case 'event': return '🎉';
      case 'maintenance': return '⚙️';
      default: return '📢';
    }
  };

  const renderSidebarContent = () => {
    switch (sidebarTab) {
      case 'streams':
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {liveStreams.map((stream) => (
              <div 
                key={stream.id}
                style={{ 
                  marginBottom: '12px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#f44336',
                    animation: 'pulse 2s infinite'
                  }} />
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#f44336', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    LIVE
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    color: '#ccc'
                  }}>
                    {stream.viewers.toLocaleString()} viewers
                  </span>
                </div>
                <div style={{
                  fontWeight: '600',
                  fontSize: '13px',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {stream.title}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: getRankColor(stream.rank),
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  {stream.streamer} • {stream.rank}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#999',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {stream.gameMode}
                </div>
              </div>
            ))}
          </div>
        );

      case 'leaderboard':
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {leaderboard.map((entry) => (
              <div 
                key={entry.rank}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  marginBottom: '6px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '6px'
                }}
              >
                <div style={{
                  minWidth: '24px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: entry.rank <= 3 ? '#ffd700' : '#ccc'
                }}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {entry.username}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: getRankColor(entry.tier),
                    fontWeight: 'bold'
                  }}>
                    {entry.tier} • {entry.elo}
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: entry.change > 0 ? '#4caf50' : entry.change < 0 ? '#f44336' : '#666'
                }}>
                  {entry.change > 0 ? '+' : ''}{entry.change}
                </div>
              </div>
            ))}
          </div>
        );

      case 'events':
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {events.map((event) => (
              <div 
                key={event.id}
                style={{ 
                  marginBottom: '12px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>
                    {event.type === 'tournament' ? '🏆' :
                     event.type === 'season' ? '🌟' :
                     event.type === 'special' ? '🎉' : '📅'}
                  </span>
                  <div style={{
                    background: event.status === 'live' ? '#4caf50' : '#ff9800',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {event.status}
                  </div>
                </div>
                <div style={{
                  fontWeight: '600',
                  fontSize: '13px',
                  marginBottom: '6px'
                }}>
                  {event.title}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#ccc',
                  marginBottom: '6px',
                  lineHeight: '1.4'
                }}>
                  {event.description}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#999'
                }}>
                  {formatDate(event.startDate)}
                  {event.prizePool && (
                    <span style={{ color: '#ffd700', marginLeft: '8px' }}>
                      💰 ${event.prizePool.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'updates':
        return (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {updates.map((update) => (
              <div 
                key={update.id}
                style={{ 
                  marginBottom: '12px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{getUpdateIcon(update.type)}</span>
                  {update.version && (
                    <div style={{
                      background: '#2196f3',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {update.version}
                    </div>
                  )}
                  <div style={{
                    fontSize: '10px',
                    color: '#666',
                    marginLeft: 'auto'
                  }}>
                    {formatDate(update.date)}
                  </div>
                </div>
                <div style={{
                  fontWeight: '600',
                  fontSize: '13px',
                  marginBottom: '6px'
                }}>
                  {update.title}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#ccc',
                  lineHeight: '1.4'
                }}>
                  {update.summary}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <CenteredContainer maxWidth="2xl" accountForLeftNav={true}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', padding: '0 0 20px 0' }}>
            <ResizableTimetable 
              upcomingArenas={upcomingArenas} 
              onJoinArena={onStartGame} 
              onViewArena={onViewArena}
              getArenaTypeColor={getArenaTypeColor} 
            />
          </div>
          
          <div style={{ 
            padding: '20px', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '15px', 
            background: 'rgba(0,0,0,0.2)', 
            borderTop: '1px solid #333' 
          }}>
            {[
              { 
                title: 'Quick Match', 
                description: 'Jump into a game', 
                icon: '⚡', 
                color: '#4caf50', 
                action: () => onStartGame({ mode: 'quick' }) 
              },
              { 
                title: 'Leaderboards', 
                description: 'See rankings', 
                icon: '🏆', 
                color: '#ff9800', 
                action: () => onNavigate('leaderboards') 
              },
              { 
                title: 'Create Arena', 
                description: 'Host your own game', 
                icon: '🏟️', 
                color: '#2196f3', 
                action: () => onNavigate('arenas') 
              },
              { 
                title: 'Party Up', 
                description: 'Play with friends', 
                icon: '🎉', 
                color: '#9c27b0', 
                action: () => onNavigate('party') 
              }
            ].map((action) => (
              <button 
                key={action.title} 
                onClick={action.action} 
                style={{ 
                  background: `linear-gradient(135deg, ${action.color}20, ${action.color}40)`, 
                  border: `1px solid ${action.color}`, 
                  borderRadius: '12px', 
                  padding: '20px', 
                  color: 'white', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease', 
                  textAlign: 'left' 
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{action.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{action.title}</div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>{action.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ 
          width: '320px', 
          flexShrink: 0, 
          background: 'rgba(0, 0, 0, 0.3)', 
          borderLeft: '1px solid #333', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          {/* Tab Navigation */}
          <div style={{ 
            padding: '15px 10px', 
            borderBottom: '1px solid #333',
            background: 'rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              {[
                { id: 'streams', label: 'Live Streams', icon: '📺' },
                { id: 'leaderboard', label: 'Top Players', icon: '🏆' },
                { id: 'events', label: 'Events', icon: '📅' },
                { id: 'updates', label: 'Updates', icon: '📢' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id as any)}
                  style={{
                    background: sidebarTab === tab.id ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: sidebarTab === tab.id ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '8px 6px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: sidebarTab === tab.id ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '14px', marginBottom: '2px' }}>{tab.icon}</div>
                  <div>{tab.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          {renderSidebarContent()}
        </div>
      </div>
    </CenteredContainer>
  );
};