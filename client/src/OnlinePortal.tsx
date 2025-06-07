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

const OnlinePortal: React.FC<OnlinePortalProps> = ({ onBack, onStartGame }) => {
  const [currentSection, setCurrentSection] = useState<PortalSection>('main');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [onlineStats, setOnlineStats] = useState({
    playersOnline: 0,
    gamesInProgress: 0,
    availableArenas: 0
  });

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

    // Simulate live stats
    const updateStats = () => {
      setOnlineStats({
        playersOnline: Math.floor(Math.random() * 500) + 1200,
        gamesInProgress: Math.floor(Math.random() * 150) + 80,
        availableArenas: Math.floor(Math.random() * 25) + 15
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

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
          <MainHub
            playerData={playerData}
            onlineStats={onlineStats}
            onNavigate={setCurrentSection}
            onBack={onBack}
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
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
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
    <div style={{ fontSize: '18px', color: '#ccc' }}>Connecting to online services...</div>
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

// Main Hub Component
interface MainHubProps {
  playerData: PlayerData;
  onlineStats: any;
  onNavigate: (section: PortalSection) => void;
  onBack: () => void;
}

const MainHub: React.FC<MainHubProps> = ({ playerData, onlineStats, onNavigate, onBack }) => {
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

  const calculateWinRate = () => {
    const total = playerData.wins + playerData.losses + playerData.draws;
    return total > 0 ? ((playerData.wins / total) * 100).toFixed(1) : '0.0';
  };

  const navigationOptions = [
    {
      id: 'arenas',
      title: 'Arenas',
      subtitle: 'Join competitive matches',
      icon: '🏟️',
      color: 'from-red-500 to-red-700',
      stats: `${onlineStats.availableArenas} available`
    },
    {
      id: 'leaderboards',
      title: 'Leaderboards',
      subtitle: 'Global rankings',
      icon: '🏆',
      color: 'from-yellow-500 to-orange-600',
      stats: 'Top 1000 players'
    },
    {
      id: 'friends',
      title: 'Friends',
      subtitle: 'Manage your friends list',
      icon: '👥',
      color: 'from-blue-500 to-blue-700',
      stats: '12 online'
    },
    {
      id: 'party',
      title: 'Party',
      subtitle: 'Create or join parties',
      icon: '🎉',
      color: 'from-purple-500 to-purple-700',
      stats: 'No active party'
    }
  ];

  return (
    <>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to Main Menu
        </button>

        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #4caf50, #2196f3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🌐 ONLINE PORTAL
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#ccc' }}>
          <div>🟢 {onlineStats.playersOnline.toLocaleString()} Online</div>
          <div>🎮 {onlineStats.gamesInProgress} Games</div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Left Sidebar - Player Info */}
        <div style={{
          width: '300px',
          padding: '20px',
          borderRight: '2px solid rgba(255, 255, 255, 0.1)',
          overflowY: 'auto'
        }}>
          {/* Player Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #4caf50, #2196f3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                👤
              </div>
              <div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  marginBottom: '5px'
                }}>
                  {playerData.username}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    background: getRankColor(playerData.rank),
                    color: 'black',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {playerData.rank}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '14px' }}>
                    Level {playerData.level}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>
                  {playerData.elo}
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>ELO Rating</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>
                  {calculateWinRate()}%
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Win Rate</div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              textAlign: 'center',
              fontSize: '12px'
            }}>
              <div>
                <div style={{ color: '#4caf50', fontWeight: 'bold' }}>{playerData.wins}</div>
                <div style={{ color: '#ccc' }}>Wins</div>
              </div>
              <div>
                <div style={{ color: '#f44336', fontWeight: 'bold' }}>{playerData.losses}</div>
                <div style={{ color: '#ccc' }}>Losses</div>
              </div>
              <div>
                <div style={{ color: '#ffc107', fontWeight: 'bold' }}>{playerData.draws}</div>
                <div style={{ color: '#ccc' }}>Draws</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('profile')}
              style={{
                width: '100%',
                marginTop: '15px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              View Full Profile
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
              🔥 Recent Activity
            </h3>
            <div style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.5' }}>
              <div>• Won a ranked match (+23 ELO)</div>
              <div>• Completed daily challenge</div>
              <div>• Reached Level 28</div>
              <div>• Added 2 new friends</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          padding: '30px',
          overflowY: 'auto'
        }}>
          <div style={{
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              margin: '0 0 10px 0',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Welcome to the Arena
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#ccc',
              margin: 0
            }}>
              Choose your battle, climb the ranks, and become a rhythm legend!
            </p>
          </div>

          {/* Navigation Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {navigationOptions.map((option, index) => (
              <div
                key={option.id}
                onClick={() => onNavigate(option.id as PortalSection)}
                style={{
                  background: `linear-gradient(135deg, ${option.color.split(' ')[1]}, ${option.color.split(' ')[3]})`,
                  borderRadius: '20px',
                  padding: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.1)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ fontSize: '36px' }}>{option.icon}</div>
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {option.title}
                      </h3>
                      <p style={{
                        margin: '5px 0 0 0',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}>
                        {option.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    📊 {option.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Updates Section */}
          <div style={{
            marginTop: '40px',
            maxWidth: '1000px',
            margin: '40px auto 0'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              🔴 Live Updates
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#4caf50' }}>🎯 Featured Arena</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>
                  "Diamond Championship" - 47 players competing
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2196f3' }}>⚡ Quick Match</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>
                  Average wait time: 1.2 minutes
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#ff9800' }}>🏆 Tournament</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>
                  Weekly Cup starts in 2h 15m
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlinePortal;