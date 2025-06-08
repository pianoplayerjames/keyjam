// client/src/OnlinePortal.tsx
import React, { useState, useEffect } from 'react';
import ArenasBrowser from './online/ArenasBrowser';
import Leaderboards from './online/Leaderboards';
import FriendsList from './online/FriendsList';
import PlayerProfile from './online/PlayerProfile';
import PartySystem from './online/PartySystem';

interface OnlinePortalProps {
  onBack: () => void;
  onStartGame: (config: any) => void;
}

type PortalSection = 'main' | 'arenas' | 'leaderboards' | 'friends' | 'profile' | 'party';

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
  type: 'tournament' | 'ranked' | 'casual' | 'speed' | 'party';
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

// Enhanced Arena Timetable Component
const EnhancedArenaTimetable = ({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  upcomingArenas,
  onJoinArena,
  getArenaTypeColor,
  getStatusColor,
  formatTime
}) => {
  // Group arenas by time slots for better organization
  const getArenasForTimeSlot = (slotIndex) => {
    const slot = timeSlots[slotIndex];
    const slotStart = slot.getTime();
    const slotEnd = slotStart + 30 * 60 * 1000; // 30 minutes
    
    return upcomingArenas.filter(arena => {
      const arenaTime = arena.startTime.getTime();
      return arenaTime >= slotStart && arenaTime < slotEnd;
    });
  };

  // Generate hourly time slots (24 hours)
  const generateHourlySlots = () => {
    const slots = [];
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    for (let hour = 0; hour < 24; hour++) {
      const slotTime = new Date(startOfDay);
      slotTime.setHours(hour);
      slots.push(slotTime);
    }
    
    return slots;
  };

  const hourlySlots = generateHourlySlots();
  const currentHour = new Date().getHours();

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '25px 30px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <div>
          <h2 style={{
            margin: '0 0 5px 0',
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(45deg, #4caf50, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🏟️ Hourly Arenas
          </h2>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#999'
          }}>
            Browse upcoming tournaments and battles by time
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid #4caf50',
            borderRadius: '8px',
            padding: '8px 15px',
            fontSize: '14px',
            color: '#4caf50',
            fontWeight: '600'
          }}>
            🕐 Live Schedule
          </div>
          
          <button
            onClick={() => {}} // Add navigation to arena creation
            style={{
              background: 'linear-gradient(45deg, #4caf50, #45a049)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Create Arena
          </button>
        </div>
      </div>

      {/* Time Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: '20px',
        height: '500px'
      }}>
        {/* Time Slots Sidebar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '15px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#4caf50',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              Time Slots
            </div>
          </div>
          
          <div style={{
            height: '435px',
            overflowY: 'auto',
            padding: '5px'
          }}>
            {hourlySlots.map((slot, index) => {
              const hour = slot.getHours();
              const isCurrentHour = hour === currentHour;
              const arenasInSlot = upcomingArenas.filter(arena => {
                return arena.startTime.getHours() === hour;
              });
              
              return (
                <button
                  key={index}
                  onClick={() => onTimeSlotSelect(index)}
                  style={{
                    width: '100%',
                    padding: '12px 8px',
                    margin: '2px 0',
                    background: selectedTimeSlot === index 
                      ? 'linear-gradient(45deg, #4caf50, #45a049)' 
                      : isCurrentHour
                        ? 'rgba(76, 175, 80, 0.1)'
                        : arenasInSlot.length > 0 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'transparent',
                    border: selectedTimeSlot === index 
                      ? '2px solid #4caf50' 
                      : isCurrentHour
                        ? '1px solid #4caf50'
                        : '1px solid transparent',
                    borderRadius: '8px',
                    color: selectedTimeSlot === index ? '#000' : '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: selectedTimeSlot === index ? '700' : '500',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTimeSlot !== index) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTimeSlot !== index) {
                      e.currentTarget.style.background = isCurrentHour
                        ? 'rgba(76, 175, 80, 0.1)'
                        : arenasInSlot.length > 0 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'transparent';
                    }
                  }}
                >
                  <div style={{ fontWeight: '600' }}>
                    {slot.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </div>
                  
                  {isCurrentHour && (
                    <div style={{
                      fontSize: '8px',
                      color: selectedTimeSlot === index ? '#000' : '#4caf50',
                      fontWeight: '600'
                    }}>
                      NOW
                    </div>
                  )}
                  
                  {arenasInSlot.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: selectedTimeSlot === index ? '#000' : '#4caf50'
                    }} />
                  )}
                  
                  {arenasInSlot.length > 0 && (
                    <div style={{
                      fontSize: '9px',
                      color: selectedTimeSlot === index ? '#000' : '#4caf50',
                      fontWeight: '600'
                    }}>
                      {arenasInSlot.length} arena{arenasInSlot.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Arenas Display */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Arena Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '15px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '2px'
              }}>
                {selectedTimeSlot < hourlySlots.length 
                  ? formatTime(hourlySlots[selectedTimeSlot])
                  : formatTime(timeSlots[selectedTimeSlot])
                } Arenas
              </div>
              <div style={{
                fontSize: '12px',
                color: '#999'
              }}>
                {getArenasForTimeSlot(selectedTimeSlot).length} arena{getArenasForTimeSlot(selectedTimeSlot).length !== 1 ? 's' : ''} available
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
              fontSize: '11px',
              color: '#ccc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }} />
                Waiting
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff9800' }} />
                Starting
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f44336' }} />
                Live
              </div>
            </div>
          </div>

          {/* Arena Cards Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px 20px'
          }}>
            {getArenasForTimeSlot(selectedTimeSlot).length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#666',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏟️</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No Arenas Scheduled</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  No tournaments or battles at{' '}
                  {selectedTimeSlot < hourlySlots.length 
                    ? formatTime(hourlySlots[selectedTimeSlot])
                    : formatTime(timeSlots[selectedTimeSlot])
                  }
                </p>
                <button
                  style={{
                    marginTop: '20px',
                    background: '#4caf50',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Create Arena for This Time
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '15px'
              }}>
                {getArenasForTimeSlot(selectedTimeSlot).map((arena) => (
                  <div
                    key={arena.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${getArenaTypeColor(arena.type)}`,
                      borderRadius: '12px',
                      padding: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${getArenaTypeColor(arena.type)}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => onJoinArena(arena.id)}
                  >
                    {/* Arena Type Indicator */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${getArenaTypeColor(arena.type)}, ${getArenaTypeColor(arena.type)}88)`
                    }} />

                    {/* Arena Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          margin: '0 0 6px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#fff'
                        }}>
                          {arena.name}
                        </h3>
                        
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          marginBottom: '6px'
                        }}>
                          <span style={{
                            background: getArenaTypeColor(arena.type),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {arena.type}
                          </span>
                          <span style={{
                            background: getStatusColor(arena.status),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {arena.status}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#4caf50',
                        textAlign: 'right'
                      }}>
                        {formatTime(arena.startTime)}
                      </div>
                    </div>

                    {/* Arena Stats Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#2196f3',
                          marginBottom: '2px'
                        }}>
                          {arena.players}/{arena.maxPlayers}
                        </div>
                        <div style={{ fontSize: '10px', color: '#999' }}>Players</div>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#ff9800',
                          marginBottom: '2px'
                        }}>
                          {arena.difficulty}
                        </div>
                        <div style={{ fontSize: '10px', color: '#999' }}>Difficulty</div>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#4caf50',
                          marginBottom: '2px'
                        }}>
                          {arena.duration}m
                        </div>
                        <div style={{ fontSize: '10px', color: '#999' }}>Duration</div>
                      </div>
                    </div>

                    {/* Host Info */}
                    <div style={{
                      fontSize: '12px',
                      color: '#ccc',
                      marginBottom: '8px'
                    }}>
                      Hosted by <span style={{ color: '#4caf50', fontWeight: '600' }}>{arena.host}</span>
                    </div>

                    {/* Prize Pool (if exists) */}
                    {arena.prizePool && (
                      <div style={{
                        background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.1))',
                        border: '1px solid #ffd700',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        fontSize: '11px',
                        color: '#ffd700',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        💰 ${arena.prizePool.toLocaleString()} Prize Pool
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OnlinePortal: React.FC<OnlinePortalProps> = ({ onBack, onStartGame }) => {
  const [currentSection, setCurrentSection] = useState<PortalSection>('main');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [onlineStats, setOnlineStats] = useState({
    playersOnline: 0,
    gamesInProgress: 0,
    availableArenas: 0
  });
  const [upcomingArenas, setUpcomingArenas] = useState<Arena[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number>(0);

  // Mock authentication and data loading
  useEffect(() => {
    // Simulate loading player data
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

    // Generate mock arenas for the next 24 hours
    const mockArenas: Arena[] = [];
    const now = new Date();
    
    for (let i = 0; i < 48; i++) {
      const startTime = new Date(now.getTime() + i * 30 * 60 * 1000); // Every 30 minutes
      const arenaTypes: Arena['type'][] = ['tournament', 'ranked', 'casual', 'speed', 'party'];
      const type = arenaTypes[Math.floor(Math.random() * arenaTypes.length)];
      
      if (Math.random() > 0.3) { // 70% chance of having an arena
        mockArenas.push({
          id: `arena_${i}`,
          name: getArenaName(type),
          type,
          startTime,
          duration: getDurationByType(type),
          players: Math.floor(Math.random() * 50) + 10,
          maxPlayers: getMaxPlayersByType(type),
          difficulty: Math.floor(Math.random() * 100) + 1,
          prizePool: type === 'tournament' ? Math.floor(Math.random() * 10000) + 1000 : undefined,
          status: getArenaStatus(startTime),
          timeControl: getTimeControl(type),
          host: `Host${Math.floor(Math.random() * 100)}`
        });
      }
    }

    setUpcomingArenas(mockArenas);

    // Mock friends data
    const mockFriends: Friend[] = [
      {
        id: 'friend_1',
        username: 'BeatBuddy',
        status: 'online',
        elo: 1756,
        rank: 'Diamond',
        avatar: '/avatars/friend1.png'
      },
      {
        id: 'friend_2',
        username: 'RhythmPal',
        status: 'in-game',
        elo: 1623,
        rank: 'Platinum',
        currentGame: 'Tournament',
        avatar: '/avatars/friend2.png'
      },
      {
        id: 'friend_3',
        username: 'MelodyMate',
        status: 'away',
        elo: 1892,
        rank: 'Diamond',
        avatar: '/avatars/friend3.png'
      },
      {
        id: 'friend_4',
        username: 'SoundSibling',
        status: 'offline',
        elo: 1445,
        rank: 'Gold',
        avatar: '/avatars/friend4.png'
      },
      {
        id: 'friend_5',
        username: 'NoteMaster',
        status: 'online',
        elo: 2134,
        rank: 'Master',
        avatar: '/avatars/friend5.png'
      }
    ];

    setFriends(mockFriends);

    // Simulate live stats
    const updateStats = () => {
      setOnlineStats({
        playersOnline: Math.floor(Math.random() * 500) + 1200,
        gamesInProgress: Math.floor(Math.random() * 150) + 80,
        availableArenas: mockArenas.filter(a => a.status === 'waiting').length
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const getArenaName = (type: Arena['type']): string => {
    const names = {
      tournament: ['Championship Cup', 'Elite Tournament', 'Grand Prix', 'Masters Cup'],
      ranked: ['Ranked Battle', 'Ladder Climb', 'Competitive Match', 'Rank Rush'],
      casual: ['Chill Session', 'Fun Match', 'Practice Arena', 'Casual Beats'],
      speed: ['Lightning Round', 'Speed Challenge', 'Rapid Fire', 'Blitz Battle'],
      party: ['Party Time', 'Group Session', 'Team Battle', 'Social Match']
    };
    return names[type][Math.floor(Math.random() * names[type].length)];
  };

  const getDurationByType = (type: Arena['type']): number => {
    const durations = {
      tournament: 120,
      ranked: 90,
      casual: 60,
      speed: 30,
      party: 75
    };
    return durations[type];
  };

  const getMaxPlayersByType = (type: Arena['type']): number => {
    const maxPlayers = {
      tournament: 64,
      ranked: 8,
      casual: 12,
      speed: 16,
      party: 6
    };
    return maxPlayers[type];
  };

  const getTimeControl = (type: Arena['type']): string => {
    const controls = {
      tournament: 'Swiss',
      ranked: '5+3',
      casual: '10+5',
      speed: '3+0',
      party: '7+2'
    };
    return controls[type];
  };

  const getArenaStatus = (startTime: Date): Arena['status'] => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    
    if (diff < -30 * 60 * 1000) return 'finished';
    if (diff < 0) return 'live';
    if (diff < 5 * 60 * 1000) return 'starting';
    return 'waiting';
  };

  const getArenaTypeColor = (type: Arena['type']): string => {
    const colors = {
      tournament: '#ff6b35',
      ranked: '#8e24aa',
      casual: '#43a047',
      speed: '#f44336',
      party: '#ff9800'
    };
    return colors[type];
  };

  const getStatusColor = (status: Arena['status']): string => {
    const colors = {
      waiting: '#4caf50',
      starting: '#ff9800',
      live: '#f44336',
      finished: '#666'
    };
    return colors[status];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const generateTimeSlots = (): Date[] => {
    const slots: Date[] = [];
    const now = new Date();
    const startTime = new Date(now);
    startTime.setMinutes(0, 0, 0);
    
    for (let i = 0; i < 48; i++) {
      slots.push(new Date(startTime.getTime() + i * 30 * 60 * 1000));
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const renderCurrentSection = () => {
    if (!playerData) {
      return <LoadingScreen />;
    }

    switch (currentSection) {
      case 'arenas':
        return (
          <ArenasBrowser
            playerData={playerData}
            onBack={() => setCurrentSection('main')}
            onJoinArena={(arenaId) => {
              console.log('Joining arena:', arenaId);
              onStartGame({ mode: 'online', arenaId });
            }}
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
            onInviteFriend={(friendId) => console.log('Inviting friend:', friendId)}
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
            playerData={playerData}
            onBack={() => setCurrentSection('main')}
            onStartPartyGame={(config) => onStartGame(config)}
         />
       );
     default:
       return (
         <MainPortal
           playerData={playerData}
           onlineStats={onlineStats}
           upcomingArenas={upcomingArenas}
           friends={friends}
           timeSlots={timeSlots}
           selectedTimeSlot={selectedTimeSlot}
           onTimeSlotSelect={setSelectedTimeSlot}
           onNavigate={setCurrentSection}
           onBack={onBack}
           onJoinArena={(arenaId) => onStartGame({ mode: 'online', arenaId })}
           getArenaTypeColor={getArenaTypeColor}
           getStatusColor={getStatusColor}
           formatTime={formatTime}
         />
       );
   }
 };

 return (
   <div style={{
     position: 'fixed',
     top: 0,
     left: 0,
     width: '100vw',
     height: '100vh',
     background: 'linear-gradient(135deg, #0a0f1c 0%, #1a2332 50%, #2d3748 100%)',
     color: 'white',
     fontFamily: 'system-ui, -apple-system, sans-serif',
     overflow: 'hidden'
   }}>
     {renderCurrentSection()}
   </div>
 );
};

// Loading Screen Component
const LoadingScreen: React.FC = () => (
 <div style={{
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   height: '100vh',
   flexDirection: 'column',
   gap: '20px'
 }}>
   <div style={{
     width: '60px',
     height: '60px',
     border: '4px solid rgba(255, 255, 255, 0.1)',
     borderTop: '4px solid #4caf50',
     borderRadius: '50%',
     animation: 'spin 1s linear infinite'
   }} />
   <div style={{ fontSize: '18px', color: '#ccc' }}>Connecting to KeyJam Online...</div>
   <style>
     {`
       @keyframes spin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
     `}
   </style>
 </div>
);

// Main Portal Component
interface MainPortalProps {
 playerData: PlayerData;
 onlineStats: any;
 upcomingArenas: Arena[];
 friends: Friend[];
 timeSlots: Date[];
 selectedTimeSlot: number;
 onTimeSlotSelect: (slot: number) => void;
 onNavigate: (section: PortalSection) => void;
 onBack: () => void;
 onJoinArena: (arenaId: string) => void;
 getArenaTypeColor: (type: Arena['type']) => string;
 getStatusColor: (status: Arena['status']) => string;
 formatTime: (date: Date) => string;
}

const MainPortal: React.FC<MainPortalProps> = ({
 playerData,
 onlineStats,
 upcomingArenas,
 friends,
 timeSlots,
 selectedTimeSlot,
 onTimeSlotSelect,
 onNavigate,
 onBack,
 onJoinArena,
 getArenaTypeColor,
 getStatusColor,
 formatTime
}) => {
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

 const getStatusIcon = (status: Friend['status']) => {
   switch (status) {
     case 'online': return '🟢';
     case 'away': return '🟡';
     case 'in-game': return '🎮';
     case 'offline': return '⚫';
     default: return '⚫';
   }
 };

 return (
   <>
     {/* Header Bar */}
     <div style={{
       height: '70px',
       background: 'rgba(0, 0, 0, 0.3)',
       borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
       padding: '0 30px',
       backdropFilter: 'blur(10px)'
     }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
         <button
           onClick={onBack}
           style={{
             background: 'rgba(255, 255, 255, 0.1)',
             border: '1px solid rgba(255, 255, 255, 0.2)',
             color: 'white',
             padding: '10px 20px',
             borderRadius: '8px',
             cursor: 'pointer',
             fontSize: '14px',
             fontWeight: '500',
             transition: 'all 0.3s ease'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
           }}
         >
           ← Back to Game
         </button>

         <div style={{
           fontSize: '24px',
           fontWeight: 'bold',
           background: 'linear-gradient(45deg, #4caf50, #2196f3)',
           WebkitBackgroundClip: 'text',
           WebkitTextFillColor: 'transparent',
           backgroundClip: 'text'
         }}>
           KeyJam Online
         </div>
       </div>

       <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
         <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#ccc' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
             <div style={{ 
               width: '8px', 
               height: '8px', 
               borderRadius: '50%', 
               background: '#4caf50' 
             }} />
             {onlineStats.playersOnline.toLocaleString()} Online
           </div>
           <div>🎮 {onlineStats.gamesInProgress} Games</div>
           <div>🏟️ {onlineStats.availableArenas} Arenas</div>
         </div>

         <div style={{
           display: 'flex',
           alignItems: 'center',
           gap: '15px',
           padding: '8px 16px',
           background: 'rgba(255, 255, 255, 0.05)',
           borderRadius: '12px',
           border: '1px solid rgba(255, 255, 255, 0.1)'
         }}>
           <div style={{
             width: '32px',
             height: '32px',
             borderRadius: '50%',
             background: 'linear-gradient(45deg, #4caf50, #2196f3)',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             fontSize: '14px'
           }}>
             👤
           </div>
           <div>
             <div style={{ fontSize: '14px', fontWeight: '600' }}>
               {playerData.username}
             </div>
             <div style={{
               fontSize: '12px',
               color: getRankColor(playerData.rank),
               fontWeight: '500'
             }}>
               {playerData.rank} • {playerData.elo} ELO
             </div>
           </div>
         </div>
       </div>
     </div>

     <div style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>
       {/* Main Content */}
       <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
         {/* Enhanced Arena Timetable */}
         <EnhancedArenaTimetable
           timeSlots={timeSlots}
           selectedTimeSlot={selectedTimeSlot}
           onTimeSlotSelect={onTimeSlotSelect}
           upcomingArenas={upcomingArenas}
           onJoinArena={onJoinArena}
           getArenaTypeColor={getArenaTypeColor}
           getStatusColor={getStatusColor}
           formatTime={formatTime}
         />

         {/* Quick Actions */}
         <div style={{
           padding: '30px',
           display: 'grid',
           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
           gap: '20px'
         }}>
           {[
             {
               title: 'Quick Match',
               description: 'Jump into a game instantly',
               icon: '⚡',
               color: '#4caf50',
               action: () => onStartGame({ mode: 'quick' })
             },
             {
               title: 'Leaderboards',
               description: 'See global rankings',
               icon: '🏆',
               color: '#ff9800',
               action: () => onNavigate('leaderboards')
             },
             {
               title: 'Create Arena',
               description: 'Host your own tournament',
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
           ].map((action, index) => (
             <button
               key={index}
               onClick={action.action}
               style={{
                 background: `linear-gradient(135deg, ${action.color}20, ${action.color}40)`,
                 border: `1px solid ${action.color}`,
                 borderRadius: '16px',
                 padding: '24px',
                 color: 'white',
                 cursor: 'pointer',
                 transition: 'all 0.3s ease',
                 textAlign: 'left'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px)';
                 e.currentTarget.style.boxShadow = `0 8px 25px ${action.color}40`;
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = 'none';
               }}
             >
               <div style={{
                 fontSize: '32px',
                 marginBottom: '12px'
               }}>
                 {action.icon}
               </div>
               <div style={{
                 fontSize: '18px',
                 fontWeight: '600',
                 marginBottom: '6px'
               }}>
                 {action.title}
               </div>
               <div style={{
                 fontSize: '14px',
                 color: '#ccc',
                 lineHeight: '1.4'
               }}>
                 {action.description}
               </div>
             </button>
           ))}
         </div>
       </div>

       {/* Right Sidebar - Friends List */}
       <div style={{
         width: '320px',
         background: 'rgba(0, 0, 0, 0.2)',
         borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
         display: 'flex',
         flexDirection: 'column'
       }}>
         {/* Friends Header */}
         <div style={{
           padding: '20px',
           borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
         }}>
           <div style={{
             display: 'flex',
             justifyContent: 'space-between',
             alignItems: 'center',
             marginBottom: '15px'
           }}>
             <h3 style={{
               margin: 0,
               fontSize: '18px',
               fontWeight: '600'
             }}>
               👥 Friends
             </h3>
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
           <div style={{
             fontSize: '14px',
             color: '#ccc'
           }}>
             {friends.filter(f => f.status === 'online' || f.status === 'in-game').length} of {friends.length} online
           </div>
         </div>

         {/* Friends List */}
         <div style={{
           flex: 1,
           overflowY: 'auto',
           padding: '10px'
         }}>
           {/* Online Friends */}
           {friends.filter(f => f.status === 'online' || f.status === 'in-game' || f.status === 'away').length > 0 && (
             <>
               <div style={{
                 fontSize: '12px',
                 fontWeight: '600',
                 color: '#4caf50',
                 padding: '10px 15px 8px',
                 textTransform: 'uppercase',
                 letterSpacing: '0.5px'
               }}>
                 Online ({friends.filter(f => f.status === 'online' || f.status === 'in-game' || f.status === 'away').length})
               </div>
               {friends
                 .filter(f => f.status === 'online' || f.status === 'in-game' || f.status === 'away')
                 .map((friend) => (
                   <div
                     key={friend.id}
                     style={{
                       display: 'flex',
                       alignItems: 'center',
                       gap: '12px',
                       padding: '12px 15px',
                       margin: '2px 5px',
                       borderRadius: '8px',
                       cursor: 'pointer',
                       transition: 'all 0.2s ease'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.background = 'transparent';
                     }}
                   >
                     <div style={{
                       width: '36px',
                       height: '36px',
                       borderRadius: '50%',
                       background: 'linear-gradient(45deg, #4caf50, #2196f3)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       fontSize: '14px',
                       position: 'relative'
                     }}>
                       👤
                       <div style={{
                         position: 'absolute',
                         bottom: '-2px',
                         right: '-2px',
                         width: '12px',
                         height: '12px',
                         borderRadius: '50%',
                         background: friend.status === 'online' ? '#4caf50' : 
                                    friend.status === 'in-game' ? '#2196f3' : '#ff9800',
                         border: '2px solid rgba(0, 0, 0, 0.5)'
                       }} />
                     </div>
                     <div style={{ flex: 1, minWidth: 0 }}>
                       <div style={{
                         fontSize: '14px',
                         fontWeight: '500',
                         marginBottom: '2px',
                         overflow: 'hidden',
                         textOverflow: 'ellipsis',
                         whiteSpace: 'nowrap'
                       }}>
                         {friend.username}
                       </div>
                       <div style={{
                         fontSize: '11px',
                         color: getRankColor(friend.rank),
                         fontWeight: '500',
                         marginBottom: '1px'
                       }}>
                         {friend.rank} • {friend.elo}
                       </div>
                       <div style={{
                         fontSize: '10px',
                         color: friend.status === 'online' ? '#4caf50' : 
                                friend.status === 'in-game' ? '#2196f3' : '#ff9800',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '4px'
                       }}>
                         {getStatusIcon(friend.status)}
                         {friend.status === 'in-game' && friend.currentGame ? 
                           `Playing ${friend.currentGame}` :
                           friend.status.charAt(0).toUpperCase() + friend.status.slice(1)
                         }
                       </div>
                     </div>
                     {friend.status === 'online' && (
                       <button
                         style={{
                           background: '#4caf50',
                           border: 'none',
                           color: 'white',
                           padding: '4px 8px',
                           borderRadius: '4px',
                           cursor: 'pointer',
                           fontSize: '10px',
                           fontWeight: '500'
                         }}
                       >
                         Invite
                       </button>
                     )}
                   </div>
                 ))}
             </>
           )}

           {/* Offline Friends */}
           {friends.filter(f => f.status === 'offline').length > 0 && (
             <>
               <div style={{
                 fontSize: '12px',
                 fontWeight: '600',
                 color: '#666',
                 padding: '15px 15px 8px',
                 textTransform: 'uppercase',
                 letterSpacing: '0.5px'
               }}>
                 Offline ({friends.filter(f => f.status === 'offline').length})
               </div>
               {friends
                 .filter(f => f.status === 'offline')
                 .slice(0, 5) // Show only first 5 offline friends
                 .map((friend) => (
                   <div
                     key={friend.id}
                     style={{
                       display: 'flex',
                       alignItems: 'center',
                       gap: '12px',
                       padding: '10px 15px',
                       margin: '2px 5px',
                       borderRadius: '8px',
                       opacity: 0.6
                     }}
                   >
                     <div style={{
                       width: '32px',
                       height: '32px',
                       borderRadius: '50%',
                       background: 'linear-gradient(45deg, #666, #999)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       fontSize: '12px'
                     }}>
                       👤
                     </div>
                     <div style={{ flex: 1 }}>
                       <div style={{
                         fontSize: '13px',
                         fontWeight: '500',
                         marginBottom: '2px'
                       }}>
                         {friend.username}
                       </div>
                       <div style={{
                         fontSize: '10px',
                         color: '#666'
                       }}>
                         {friend.rank} • Offline
                       </div>
                     </div>
                   </div>
                 ))}
               {friends.filter(f => f.status === 'offline').length > 5 && (
                 <div style={{
                   textAlign: 'center',
                   padding: '10px',
                   fontSize: '12px',
                   color: '#666'
                 }}>
                   +{friends.filter(f => f.status === 'offline').length - 5} more offline
                 </div>
               )}
             </>
           )}
         </div>

         {/* Add Friends Button */}
         <div style={{
           padding: '15px',
           borderTop: '1px solid rgba(255, 255, 255, 0.1)'
         }}>
           <button
             onClick={() => onNavigate('friends')}
             style={{
               width: '100%',
               background: 'linear-gradient(45deg, #4caf50, #2196f3)',
               border: 'none',
               color: 'white',
               padding: '12px',
               borderRadius: '8px',
               cursor: 'pointer',
               fontSize: '14px',
               fontWeight: '600',
               transition: 'all 0.3s ease'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.transform = 'translateY(-1px)';
               e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.transform = 'translateY(0)';
               e.currentTarget.style.boxShadow = 'none';
             }}
           >
             ➕ Add Friends
           </button>
         </div>

         {/* Recent Activity */}
         <div style={{
           background: 'rgba(255, 255, 255, 0.02)',
           padding: '15px',
           borderTop: '1px solid rgba(255, 255, 255, 0.1)'
         }}>
           <h4 style={{
             margin: '0 0 12px 0',
             fontSize: '14px',
             fontWeight: '600',
             color: '#ccc'
           }}>
             🔥 Recent Activity
           </h4>
           <div style={{
             fontSize: '12px',
             color: '#999',
             lineHeight: '1.5'
           }}>
             <div style={{ marginBottom: '6px' }}>
               • <span style={{ color: '#4caf50' }}>BeatBuddy</span> won a tournament
             </div>
             <div style={{ marginBottom: '6px' }}>
               • <span style={{ color: '#2196f3' }}>RhythmPal</span> reached Platinum
             </div>
             <div style={{ marginBottom: '6px' }}>
               • <span style={{ color: '#ff9800' }}>MelodyMate</span> set new personal best
             </div>
           </div>
         </div>
       </div>
     </div>
   </>
 );
};

// Component to show replay statistics on main menu
const ReplayStatsDisplay = () => {
 const [replayStats, setReplayStats] = useState<{
   totalReplays: number;
   bestScore: number;
   bestAccuracy: number;
   totalPlayTime: number;
 } | null>(null);

 useEffect(() => {
   try {
     const replays = JSON.parse(localStorage.getItem('rhythm_game_replays') || '[]');
     if (replays.length > 0) {
       const bestScore = Math.max(...replays.map((r: any) => r.metadata.finalScore));
       const bestAccuracy = Math.max(...replays.map((r: any) => r.metadata.accuracy));
       const totalPlayTime = replays.reduce((sum: number, r: any) => sum + r.duration, 0);
       
       setReplayStats({
         totalReplays: replays.length,
         bestScore,
         bestAccuracy,
         totalPlayTime
       });
     }
   } catch (error) {
     console.error('Failed to load replay stats:', error);
   }
 }, []);

 if (!replayStats || replayStats.totalReplays === 0) return null;

 const formatPlayTime = (ms: number) => {
   const minutes = Math.floor(ms / 60000);
   const hours = Math.floor(minutes / 60);
   if (hours > 0) {
     return `${hours}h ${minutes % 60}m`;
   }
   return `${minutes}m`;
 };

 return (
   <div style={{
     marginTop: '8px',
     padding: '6px',
     background: 'rgba(0, 0, 0, 0.3)',
     borderRadius: '8px',
     border: '1px solid #666'
   }}>
     <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', textAlign: 'center', color: '#ccc' }}>📊 Your Stats</h3>
     <div style={{
       display: 'grid',
       gridTemplateColumns: 'repeat(2, 1fr)',
       gap: '4px',
       textAlign: 'center'
     }}>
       <div>
         <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2196f3' }}>{replayStats.totalReplays}</div>
         <div style={{ fontSize: '10px', color: '#999' }}>Replays</div>
       </div>
       <div>
         <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffd700' }}>{replayStats.bestScore.toLocaleString()}</div>
         <div style={{ fontSize: '10px', color: '#999' }}>Best Score</div>
       </div>
       <div>
         <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4caf50' }}>{replayStats.bestAccuracy.toFixed(1)}%</div>
         <div style={{ fontSize: '10px', color: '#999' }}>Best Accuracy</div>
       </div>
       <div>
         <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9c27b0' }}>{formatPlayTime(replayStats.totalPlayTime)}</div>
         <div style={{ fontSize: '10px', color: '#999' }}>Play Time</div>
       </div>
     </div>
   </div>
 );
};

export default OnlinePortal;