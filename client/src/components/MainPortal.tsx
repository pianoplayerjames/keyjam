// client/src/components/MainPortal.tsx

import React from 'react';
import { ResizableTimetable } from './ArenaTimetable';

interface Friend { 
  id: string; 
  username: string; 
  status: 'online' | 'away' | 'in-game' | 'offline'; 
  elo: number; 
  rank: string; 
  currentGame?: string; 
  avatar: string; 
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

interface MainPortalProps {
  upcomingArenas: Arena[];
  friends: Friend[];
  onNavigate: (section: string) => void;
  onStartGame: (config: any) => void;
  onViewArena?: (arena: Arena) => void;
  getArenaTypeColor: (type: Arena['type']) => string;
}

export const MainPortal: React.FC<MainPortalProps> = ({ 
  upcomingArenas, 
  friends, 
  onNavigate, 
  onStartGame, 
  onViewArena,
  getArenaTypeColor 
}) => {
  const getRankColor = (rank: string) => ({ 
    diamond: '#b9f2ff', 
    platinum: '#e5e4e2', 
    gold: '#ffd700' 
  }[rank.toLowerCase()] || '#c0c0c0');
  
  const getStatusIcon = (status: Friend['status']) => ({ 
    online: '🟢', 
    away: '🟡', 
    'in-game': '🎮', 
    offline: '⚫' 
  }[status]);

  return (
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
        width: '300px', 
        flexShrink: 0, 
        background: 'rgba(0, 0, 0, 0.3)', 
        borderLeft: '1px solid #333', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>👥 Friends</h3>
            <button 
              onClick={() => onNavigate('friends')} 
              style={{ 
                background: 'transparent', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                color: 'white', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '12px' 
              }}
            >
              Manage
            </button>
          </div>
          <div style={{ fontSize: '14px', color: '#ccc' }}>
            {friends.filter(f => f.status !== 'offline').length} of {friends.length} online
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {friends.map((friend) => (
            <div 
              key={friend.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '8px', 
                borderRadius: '8px' 
              }}
            >
              <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(45deg, #4caf50, #2196f3)'
                }}/>
                <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
                  {getStatusIcon(friend.status)}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontWeight: '500', 
                  fontSize: '14px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {friend.username}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: getRankColor(friend.rank), 
                  fontWeight: 'bold' 
                }}>
                  {friend.rank}
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>
                  {friend.status === 'in-game' ? `Playing ${friend.currentGame}`: friend.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};