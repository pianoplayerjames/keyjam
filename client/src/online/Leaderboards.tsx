// client/src/online/Leaderboards.tsx
import React, { useState, useEffect } from 'react';

interface LeaderboardPlayer {
  rank: number;
  username: string;
  elo: number;
  tier: string;
  wins: number;
  losses: number;
  winRate: number;
  recentChange: number;
  country: string;
  avatar: string;
  isOnline: boolean;
}

interface LeaderboardsProps {
  playerData: any;
  onBack: () => void;
}

const Leaderboards: React.FC<LeaderboardsProps> = ({ playerData, onBack }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'regional'>('global');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([]);
  const [playerRanking, setPlayerRanking] = useState<LeaderboardPlayer | null>(null);

  useEffect(() => {
    // Mock leaderboard data
    const mockData: LeaderboardPlayer[] = [
      {
        rank: 1,
        username: 'RhythmGod',
        elo: 2547,
        tier: 'Grandmaster',
        wins: 342,
        losses: 58,
        winRate: 85.5,
        recentChange: +23,
        country: 'KR',
        avatar: '/avatars/1.png',
        isOnline: true
      },
      {
        rank: 2,
        username: 'BeatMachine',
        elo: 2489,
        tier: 'Grandmaster',
        wins: 298,
        losses: 67,
        winRate: 81.6,
        recentChange: +15,
        country: 'JP',
        avatar: '/avatars/2.png',
        isOnline: false
      },
      {
        rank: 3,
        username: 'SoundWave',
        elo: 2423,
        tier: 'Master',
        wins: 267,
        losses: 89,
        winRate: 75.0,
        recentChange: -8,
        country: 'US',
        avatar: '/avatars/3.png',
        isOnline: true
      },
      {
        rank: 4,
        username: 'MelodyMaster',
        elo: 2391,
        tier: 'Master',
        wins: 245,
        losses: 76,
        winRate: 76.3,
        recentChange: +12,
        country: 'DE',
        avatar: '/avatars/4.png',
        isOnline: true
      },
      {
        rank: 5,
        username: 'NoteNinja',
        elo: 2356,
        tier: 'Master',
        wins: 234,
        losses: 92,
        winRate: 71.8,
        recentChange: +5,
        country: 'FR',
        avatar: '/avatars/5.png',
        isOnline: false
      }
    ];

    // Add more players to fill the leaderboard
    for (let i = 6; i <= 100; i++) {
      mockData.push({
        rank: i,
        username: `Player${i}`,
        elo: 2350 - (i - 5) * 15 + Math.floor(Math.random() * 20) - 10,
        tier: i <= 10 ? 'Master' : i <= 50 ? 'Diamond' : 'Platinum',
        wins: Math.floor(Math.random() * 200) + 50,
        losses: Math.floor(Math.random() * 100) + 20,
        winRate: Math.random() * 30 + 60,
        recentChange: Math.floor(Math.random() * 40) - 20,
        country: ['US', 'KR', 'JP', 'DE', 'FR', 'GB', 'CA', 'AU'][Math.floor(Math.random() * 8)],
        avatar: `/avatars/${Math.floor(Math.random() * 10) + 1}.png`,
        isOnline: Math.random() > 0.5
      });
    }

    setLeaderboardData(mockData);

    // Find player's ranking (mock)
    setPlayerRanking({
      rank: 47,
      username: playerData.username,
      elo: playerData.elo,
      tier: playerData.rank,
      wins: playerData.wins,
      losses: playerData.losses,
      winRate: (playerData.wins / (playerData.wins + playerData.losses)) * 100,
      recentChange: +8,
      country: 'US',
      avatar: '/avatars/player.png',
      isOnline: true
    });
  }, [activeTab, timeRange, playerData]);

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'grandmaster': return '#ff1744';
      case 'master': return '#ff6b35';
      case 'diamond': return '#b9f2ff';
      case 'platinum': return '#e5e4e2';
      case 'gold': return '#ffd700';
      case 'silver': return '#c0c0c0';
      case 'bronze': return '#cd7f32';
      default: return '#666';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return '#4caf50';
    if (change < 0) return '#f44336';
    return '#666';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  const tabs = [
    { id: 'global', label: 'Global', icon: '🌍' },
    { id: 'friends', label: 'Friends', icon: '👥' },
    { id: 'regional', label: 'Regional', icon: '🏛️' }
  ];

  const timeRanges = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'all-time', label: 'All Time' }
  ];

  return (
    <div style={{ padding: '20px', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ffd700, #ff6b35)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏆 Leaderboards
        </h1>

        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id as any)}
              style={{
                background: timeRange === range.id ? '#4caf50' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: timeRange === range.id ? 'black' : 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Tabs */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid #4caf50' : '1px solid transparent',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Your Ranking */}
          {playerRanking && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(33, 150, 243, 0.2))',
              borderRadius: '15px',
              padding: '20px',
              border: '2px solid #4caf50'
            }}>
              <h3 style={{
                margin: '0 0 15px 0',
                fontSize: '16px',
                color: '#4caf50'
              }}>
                📊 Your Ranking
              </h3>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4caf50, #2196f3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  👤
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    #{playerRanking.rank}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: getTierColor(playerRanking.tier),
                    fontWeight: 'bold'
                  }}>
                    {playerRanking.tier}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', color: '#ffd700' }}>
                    {playerRanking.elo}
                  </div>
                  <div style={{ color: '#ccc' }}>ELO</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: getChangeColor(playerRanking.recentChange)
                  }}>
                    {getChangeIcon(playerRanking.recentChange)}{Math.abs(playerRanking.recentChange)}
                  </div>
                  <div style={{ color: '#ccc' }}>Recent</div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4caf50' }}>
              📈 Statistics
            </h4>
            <div style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.5' }}>
              <div>Total Players: 47,839</div>
              <div>Active Today: 12,456</div>
              <div>Average ELO: 1,547</div>
              <div>Top Player: 2,547 ELO</div>
            </div>
          </div>
        </div>

        {/* Main Leaderboard */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 100px 120px 100px 80px 100px',
              gap: '15px',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ccc'
            }}>
              <div>Rank</div>
              <div>Player</div>
              <div>ELO</div>
              <div>W/L/D</div>
              <div>Win Rate</div>
              <div>Change</div>
              <div>Status</div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 20px'
          }}>
            {leaderboardData.slice(0, 50).map((player, index) => (
              <div
                key={player.rank}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 100px 120px 100px 80px 100px',
                  gap: '15px',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  background: player.username === playerData.username ? 
                    'rgba(76, 175, 80, 0.1)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (player.username !== playerData.username) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (player.username !== playerData.username) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {/* Rank */}
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: player.rank <= 3 ? '#ffd700' : '#fff'
                }}>
                  {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : `#${player.rank}`}
                </div>

                {/* Player Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
height: '32px',
                   borderRadius: '50%',
                   background: 'linear-gradient(45deg, #4caf50, #2196f3)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   fontSize: '14px',
                   position: 'relative'
                 }}>
                   👤
                   {player.isOnline && (
                     <div style={{
                       position: 'absolute',
                       bottom: '-2px',
                       right: '-2px',
                       width: '12px',
                       height: '12px',
                       borderRadius: '50%',
                       background: '#4caf50',
                       border: '2px solid #000'
                     }} />
                   )}
                 </div>
                 <div>
                   <div style={{
                     fontWeight: 'bold',
                     fontSize: '14px',
                     color: player.username === playerData.username ? '#4caf50' : '#fff'
                   }}>
                     {player.username}
                     {player.username === playerData.username && ' (You)'}
                   </div>
                   <div style={{
                     fontSize: '12px',
                     color: getTierColor(player.tier),
                     fontWeight: 'bold'
                   }}>
                     {player.tier} • {player.country}
                   </div>
                 </div>
               </div>

               {/* ELO */}
               <div style={{
                 fontSize: '16px',
                 fontWeight: 'bold',
                 color: '#ffd700'
               }}>
                 {player.elo.toLocaleString()}
               </div>

               {/* W/L/D */}
               <div style={{ fontSize: '12px' }}>
                 <span style={{ color: '#4caf50' }}>{player.wins}W</span>
                 <span style={{ color: '#666' }}> / </span>
                 <span style={{ color: '#f44336' }}>{player.losses}L</span>
                 <span style={{ color: '#666' }}> / </span>
                 <span style={{ color: '#ffc107' }}>{Math.floor(Math.random() * 10)}D</span>
               </div>

               {/* Win Rate */}
               <div style={{
                 fontSize: '14px',
                 fontWeight: 'bold',
                 color: player.winRate >= 70 ? '#4caf50' : 
                        player.winRate >= 50 ? '#ff9800' : '#f44336'
               }}>
                 {player.winRate.toFixed(1)}%
               </div>

               {/* Recent Change */}
               <div style={{
                 fontSize: '12px',
                 fontWeight: 'bold',
                 color: getChangeColor(player.recentChange),
                 display: 'flex',
                 alignItems: 'center',
                 gap: '2px'
               }}>
                 {getChangeIcon(player.recentChange)}
                 {Math.abs(player.recentChange)}
               </div>

               {/* Status */}
               <div style={{
                 fontSize: '12px',
                 color: player.isOnline ? '#4caf50' : '#666'
               }}>
                 {player.isOnline ? '🟢 Online' : '⚫ Offline'}
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>
   </div>
 );
};

export default Leaderboards;