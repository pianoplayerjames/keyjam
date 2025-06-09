import React, { useState, useEffect, useRef } from 'react';

interface Player {
  id: string;
  username: string;
  elo: number;
  rank: string;
  avatar: string;
  status: 'ready' | 'not-ready' | 'away';
  joinedAt: Date;
  isHost: boolean;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'join' | 'leave';
}

interface Arena {
  id: string;
  name: string;
  type: 'tournament' | 'ranked' | 'casual' | 'speed' | 'party' | 'battle-royale' | 'team-battle' | 'practice' | 'blitz' | 'championship' | 'seasonal' | 'custom';
  startTime: Date;
  duration: number;
  players: Player[];
  maxPlayers: number;
  difficulty: number;
  prizePool?: number;
  status: 'waiting' | 'starting' | 'live' | 'finished';
  timeControl: string;
  host: string;
  requirements: {
    minElo?: number;
    maxElo?: number;
    rankRequired?: string;
    inviteOnly?: boolean;
  };
  gameMode: string;
  description: string;
}

interface ArenaPageProps {
  arena: Arena;
  currentPlayer: Player;
  onBack: () => void;
  onJoinArena: () => void;
  onLeaveArena: () => void;
  isPlayerInArena: boolean;
}

export const ArenaPage: React.FC<ArenaPageProps> = ({
  arena,
  currentPlayer,
  onBack,
  onJoinArena,
  onLeaveArena,
  isPlayerInArena
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeUntilStart, setTimeUntilStart] = useState<number>(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize mock chat messages
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        username: 'System',
        message: 'Arena created. Players can now join!',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        type: 'system'
      },
      {
        id: '2',
        username: arena.host,
        message: 'Welcome everyone! Good luck and have fun!',
        timestamp: new Date(Date.now() - 240000), // 4 minutes ago
        type: 'message'
      },
      {
        id: '3',
        username: 'BeatMaster99',
        message: 'Ready to crush this tournament 💪',
        timestamp: new Date(Date.now() - 180000), // 3 minutes ago
        type: 'message'
      },
      {
        id: '4',
        username: 'System',
        message: 'RhythmPro joined the arena',
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
        type: 'join'
      },
      {
        id: '5',
        username: 'RhythmPro',
        message: 'Hey everyone! Excited to play',
        timestamp: new Date(Date.now() - 60000), // 1 minute ago
        type: 'message'
      }
    ];
    setChatMessages(mockMessages);
  }, [arena.host]);

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const timeLeft = arena.startTime.getTime() - now.getTime();
      setTimeUntilStart(Math.max(0, timeLeft));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [arena.startTime]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isPlayerInArena) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      username: currentPlayer.username,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimeUntilStart = (ms: number): string => {
    if (ms <= 0) return 'Starting...';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatChatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const getRankColor = (rank: string): string => {
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

  const getArenaTypeColor = (type: Arena['type']): string => {
    const colors = {
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
    };
    return colors[type] || '#666';
  };

  const canJoinArena = (): { canJoin: boolean; reason?: string } => {
    if (isPlayerInArena) return { canJoin: false, reason: 'Already in arena' };
    if (arena.players.length >= arena.maxPlayers) return { canJoin: false, reason: 'Arena is full' };
    if (arena.status !== 'waiting') return { canJoin: false, reason: 'Arena has already started' };
    
    const { requirements } = arena;
    if (requirements.minElo && currentPlayer.elo < requirements.minElo) {
      return { canJoin: false, reason: `Minimum ELO required: ${requirements.minElo}` };
    }
    if (requirements.maxElo && currentPlayer.elo > requirements.maxElo) {
      return { canJoin: false, reason: `Maximum ELO allowed: ${requirements.maxElo}` };
    }
    if (requirements.inviteOnly) {
      return { canJoin: false, reason: 'Invite only arena' };
    }
    
    return { canJoin: true };
  };

  const joinStatus = canJoinArena();
  const sortedPlayers = [...arena.players].sort((a, b) => b.elo - a.elo);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to Portal
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            margin: '0 0 5px 0',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            {arena.name}
          </h1>
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              background: getArenaTypeColor(arena.type),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {arena.type.replace('-', ' ')}
            </span>
            <span style={{ color: '#ccc' }}>•</span>
            <span style={{ color: '#ccc' }}>Difficulty: {arena.difficulty}</span>
            <span style={{ color: '#ccc' }}>•</span>
            <span style={{ color: '#ccc' }}>Duration: {arena.duration}min</span>
            {arena.prizePool && (
              <>
                <span style={{ color: '#ccc' }}>•</span>
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>
                  💰 ${arena.prizePool.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: timeUntilStart <= 60000 ? '#f44336' : '#4caf50',
            marginBottom: '5px'
          }}>
            {formatTimeUntilStart(timeUntilStart)}
          </div>
          <div style={{ fontSize: '12px', color: '#ccc' }}>
            {timeUntilStart <= 0 ? 'Starting now!' : 'Until start'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        gap: '20px', 
        padding: '20px',
        overflow: 'hidden'
      }}>
        {/* Left Panel - Players List */}
        <div style={{
          width: '350px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              👥 Players ({arena.players.length}/{arena.maxPlayers})
            </h3>
            <div style={{
              fontSize: '12px',
              color: '#ccc',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Ranked by ELO</span>
              <span>{arena.players.filter(p => p.status === 'ready').length} ready</span>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px'
          }}>
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  marginBottom: '8px',
                  background: player.id === currentPlayer.id ? 
                    'rgba(76, 175, 80, 0.1)' : 
                    'rgba(255, 255, 255, 0.03)',
                  borderRadius: '10px',
                  border: player.isHost ? '1px solid #ffd700' : '1px solid transparent'
                }}
              >
                <div style={{
                  minWidth: '24px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: index < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][index] : '#666'
                }}>
                  #{index + 1}
                </div>

                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4caf50, #2196f3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  position: 'relative'
                }}>
                  👤
                  {player.isHost && (
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: '#ffd700',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px'
                    }}>
                      👑
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '2px'
                  }}>
                    {player.username}
                    {player.id === currentPlayer.id && ' (You)'}
                    {player.isHost && ' (Host)'}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: getRankColor(player.rank),
                    fontWeight: 'bold',
                    marginBottom: '2px'
                  }}>
                    {player.rank} • {player.elo} ELO
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: player.status === 'ready' ? '#4caf50' : 
                           player.status === 'away' ? '#ff9800' : '#f44336'
                  }}>
                    {player.status === 'ready' ? '✅ Ready' :
                     player.status === 'away' ? '⏰ Away' : '❌ Not Ready'}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: arena.maxPlayers - arena.players.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  marginBottom: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  border: '1px dashed rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{
                  minWidth: '24px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  #{arena.players.length + index + 1}
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#666'
                }}>
                  ?
                </div>
                <div style={{
                  flex: 1,
                  fontSize: '14px',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  Waiting for player...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat and Join */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Arena Info */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
              📝 Arena Information
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2196f3' }}>
                  {arena.gameMode}
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Game Mode</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9800' }}>
                  {arena.timeControl}
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Time Control</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9c27b0' }}>
                  {arena.host}
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Host</div>
              </div>
            </div>

            {/* Join Requirements */}
            {(arena.requirements.minElo || arena.requirements.maxElo || arena.requirements.inviteOnly) && (
              <div style={{
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#ffc107', fontSize: '14px' }}>
                  ⚠️ Join Requirements
                </h4>
                <div style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.4' }}>
                  {arena.requirements.minElo && (
                    <div>• Minimum ELO: {arena.requirements.minElo}</div>
                  )}
                  {arena.requirements.maxElo && (
                    <div>• Maximum ELO: {arena.requirements.maxElo}</div>
                  )}
                  {arena.requirements.inviteOnly && (
                    <div>• Invite only arena</div>
                  )}
                </div>
              </div>
            )}

            <p style={{
              margin: '15px 0 0 0',
              fontSize: '14px',
              color: '#ccc',
              lineHeight: '1.4'
            }}>
              {arena.description}
            </p>
          </div>

          {/* Chat */}
          <div style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '15px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>💬 Arena Chat</h3>
            </div>

            <div
              ref={chatContainerRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: msg.type === 'system' ? 'rgba(255, 193, 7, 0.1)' :
                               msg.type === 'join' ? 'rgba(76, 175, 80, 0.1)' :
                               msg.type === 'leave' ? 'rgba(244, 67, 54, 0.1)' :
                               msg.username === currentPlayer.username ? 'rgba(33, 150, 243, 0.1)' :
                               'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: msg.type === 'system' ? '#ffc107' :
                             msg.username === currentPlayer.username ? '#2196f3' : '#fff'
                    }}>
                      {msg.username}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: '#999'
                    }}>
                      {formatChatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    lineHeight: '1.3',
                    color: msg.type === 'system' ? '#ffc107' : '#fff'
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div style={{
              padding: '15px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isPlayerInArena ? "Type a message..." : "Join the arena to chat"}
                  disabled={!isPlayerInArena}
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isPlayerInArena}
                  style={{
                    padding: '10px 20px',
                    background: !newMessage.trim() || !isPlayerInArena ? '#666' : '#2196f3',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: !newMessage.trim() || !isPlayerInArena ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Join/Leave Button */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px',
            textAlign: 'center'
          }}>
            {isPlayerInArena ? (
              <button
                onClick={onLeaveArena}
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                🚪 Leave Arena
              </button>
            ) : (
              <div>
                <button
                  onClick={onJoinArena}
                  disabled={!joinStatus.canJoin}
                  style={{
                    padding: '15px 30px',
                    background: joinStatus.canJoin ? 
                      'linear-gradient(45deg, #4caf50, #45a049)' : '#666',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: joinStatus.canJoin ? 'pointer' : 'not-allowed',
                    width: '100%',
                    maxWidth: '300px',
                    marginBottom: joinStatus.reason ? '10px' : '0'
                  }}
                >
                  {joinStatus.canJoin ? '🎮 Join Arena' : '🚫 Cannot Join'}
                </button>
                {joinStatus.reason && (
                  <div style={{
                    fontSize: '14px',
                    color: '#f44336',
                    marginTop: '10px'
                  }}>
                    {joinStatus.reason}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};