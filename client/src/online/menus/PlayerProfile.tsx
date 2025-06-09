// client/src/online/PlayerProfile.tsx
import React, { useState } from 'react';

interface PlayerProfileProps {
  playerData: any;
  onBack: () => void;
  onUpdateProfile: (data: any) => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface MatchHistory {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  mode: string;
  difficulty: number;
  score: number;
  eloChange: number;
  playedAt: Date;
  duration: number;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ playerData, onBack, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'history' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: playerData.username,
    bio: 'Rhythm game enthusiast | Diamond player | Always up for a challenge!',
    favoriteMode: 'Ranked',
    country: 'United States'
  });

  const achievements: Achievement[] = [
    {
      id: 'first_win',
      name: 'First Victory',
      description: 'Win your first match',
      icon: '🏆',
      rarity: 'common',
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: 'combo_master',
      name: 'Combo Master',
      description: 'Achieve a 100+ note combo',
      icon: '🔥',
      rarity: 'rare',
      unlockedAt: new Date('2024-02-20')
    },
    {
      id: 'perfect_game',
      name: 'Perfectionist',
      description: 'Complete a song with 100% accuracy',
      icon: '💎',
      rarity: 'epic',
      unlockedAt: new Date('2024-03-10')
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete 10 songs at maximum difficulty',
      icon: '⚡',
      rarity: 'legendary'
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Add 50 friends',
      icon: '🦋',
      rarity: 'rare',
      progress: 12,
      maxProgress: 50
    }
  ];

  const matchHistory: MatchHistory[] = [
    {
      id: 'match_1',
      opponent: 'BeatMaster99',
      result: 'win',
      mode: 'Ranked',
      difficulty: 75,
      score: 89456,
      eloChange: +23,
      playedAt: new Date(Date.now() - 1000 * 60 * 30),
      duration: 180
    },
    {
      id: 'match_2',
      opponent: 'RhythmGod',
      result: 'loss',
      mode: 'Ranked',
      difficulty: 90,
      score: 76234,
      eloChange: -18,
      playedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      duration: 165
    },
    {
      id: 'match_3',
      opponent: 'MelodyMaster',
      result: 'win',
      mode: 'Casual',
      difficulty: 60,
      score: 92341,
      eloChange: +15,
      playedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      duration: 200
    }
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#666';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateWinRate = () => {
    const total = playerData.wins + playerData.losses + playerData.draws;
    return total > 0 ? ((playerData.wins / total) * 100).toFixed(1) : '0.0';
  };

  const handleSaveProfile = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

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
          background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          👤 Player Profile
        </h1>

        <button
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          style={{
            background: isEditing ? '#4caf50' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isEditing ? '💾 Save' : '✏️ Edit'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>
        {/* Profile Card & Navigation */}
        <div style={{
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Profile Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(233, 30, 99, 0.2))',
            borderRadius: '20px',
            padding: '25px',
            border: '2px solid #9c27b0',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 15px'
            }}>
              👤
            </div>
            
            {isEditing ? (
              <input
                value={editData.username}
                onChange={(e) => setEditData({...editData, username: e.target.value})}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                  marginBottom: '10px'
                }}
              />
            ) : (
              <h2 style={{
                margin: '0 0 10px 0',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {playerData.username}
              </h2>
            )}

            <div style={{
              background: '#9c27b0',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '15px',
              display: 'inline-block'
            }}>
              {playerData.rank} • Level {playerData.level}
            </div>

            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: 'white',
                  fontSize: '14px',
                  width: '100%',
                  height: '60px',
                  resize: 'none'
                }}
              />
            ) : (
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#ccc',
                lineHeight: '1.4'
              }}>
                {editData.bio}
              </p>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              marginTop: '20px',
              padding: '15px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffd700' }}>
                  {playerData.elo}
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>ELO</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>
                  {calculateWinRate()}%
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Win Rate</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>
                  {playerData.wins + playerData.losses + playerData.draws}
                </div>
                <div style={{ fontSize: '12px', color: '#ccc' }}>Games</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'stats', label: 'Statistics', icon: '📈' },
                { id: 'achievements', label: 'Achievements', icon: '🏆' },
                { id: 'history', label: 'Match History', icon: '📜' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(156, 39, 176, 0.3)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid #9c27b0' : '1px solid transparent',
                    color: 'white',
                    padding: '12px 15px',
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
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Overview</h2>
              </div>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    background: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid #4caf50',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#4caf50' }}>🏆 Recent Achievements</h3>
                    <div style={{ fontSize: '14px', color: '#ccc' }}>
                      <div>• Perfect Game completed</div>
                      <div>• 50 wins milestone reached</div>
                      <div>• Diamond rank achieved</div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(33, 150, 243, 0.1)',
                    border: '1px solid #2196f3',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#2196f3' }}>📈 Performance</h3>
                    <div style={{ fontSize: '14px', color: '#ccc' }}>
                      <div>• 7-game win streak</div>
                      <div>• +89 ELO this week</div>
                      <div>• 23% accuracy improvement</div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 152, 0, 0.1)',
                    border: '1px solid #ff9800',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#ff9800' }}>🎯 Goals</h3>
                    <div style={{ fontSize: '14px', color: '#ccc' }}>
                      <div>• Reach Master rank</div>
                      <div>• Complete Speed Demon</div>
                      <div>• Add 38 more friends</div>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>📊 Quick Stats</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '20px'
                  }}>
                    {[
                      { label: 'Total Playtime', value: '127h 42m', color: '#9c27b0' },
                      { label: 'Perfect Notes', value: '12,456', color: '#4caf50' },
                      { label: 'Best Combo', value: '287', color: '#ff9800' },
                      { label: 'Favorite Song', value: 'Neon Beats', color: '#2196f3' },
                      { label: 'Best Accuracy', value: '98.7%', color: '#e91e63' },
                      { label: 'Tournaments Won', value: '3', color: '#ffd700' }
                    ].map(stat => (
                      <div key={stat.label} style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: stat.color,
                          marginBottom: '5px'
                        }}>
                          {stat.value}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#ccc'
                        }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>
                  Achievements ({achievements.filter(a => a.unlockedAt).length}/{achievements.length})
                </h2>
              </div>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '15px'
                }}>
                  {achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      style={{
                        background: achievement.unlockedAt ? 
                          `rgba(${getRarityColor(achievement.rarity).slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.1)` : 
                          'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${achievement.unlockedAt ? getRarityColor(achievement.rarity) : '#666'}`,
                        borderRadius: '12px',
                        padding: '20px',
                        opacity: achievement.unlockedAt ? 1 : 0.6
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        marginBottom: '10px'
                      }}>
                        <div style={{
                          fontSize: '32px',
                          filter: achievement.unlockedAt ? 'none' : 'grayscale(100%)'
                        }}>
                          {achievement.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            marginBottom: '4px'
                          }}>
                            {achievement.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: getRarityColor(achievement.rarity),
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}>
                            {achievement.rarity}
                          </div>
                        </div>
                      </div>
                      <p style={{
                        margin: '0 0 10px 0',
                        fontSize: '14px',
                        color: '#ccc'
                      }}>
                        {achievement.description}
                      </p>
                      {achievement.progress !== undefined && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          height: '6px',
                          marginBottom: '8px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            background: getRarityColor(achievement.rarity),
                            height: '100%',
                            width: `${(achievement.progress / achievement.maxProgress!) * 100}%`,
                            borderRadius: '10px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      )}
                      {achievement.unlockedAt ? (
                        <div style={{
                          fontSize: '11px',
                          color: '#4caf50'
                        }}>
                          ✅ Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                      ) : achievement.progress !== undefined ? (
                        <div style={{
                          fontSize: '11px',
                          color: '#ccc'
                        }}>
                          Progress: {achievement.progress}/{achievement.maxProgress}
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '11px',
                          color: '#666'
                        }}>
                          🔒 Locked
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Match History Tab */}
          {activeTab === 'history' && (
            <>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>
                  Recent Matches ({matchHistory.length})
                </h2>
              </div>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px 20px'
              }}>
                {matchHistory.map(match => (
                  <div
                    key={match.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '15px',
                      border: `1px solid ${
                        match.result === 'win' ? '#4caf50' : 
                        match.result === 'loss' ? '#f44336' : '#ff9800'
                      }`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                      }}>
                        <div style={{
                          fontSize: '24px'
                        }}>
                          {match.result === 'win' ? '🏆' : 
                           match.result === 'loss' ? '💔' : '🤝'}
                        </div>
                        <div>
                          <div style={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: match.result === 'win' ? '#4caf50' : 
                                   match.result === 'loss' ? '#f44336' : '#ff9800'
                          }}>
                            {match.result.toUpperCase()} vs {match.opponent}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#ccc'
                          }}>
                            {match.mode} • Difficulty {match.difficulty} • {formatDuration(match.duration)}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: match.eloChange > 0 ? '#4caf50' : '#f44336'
                        }}>
                          {match.eloChange > 0 ? '+' : ''}{match.eloChange} ELO
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#ccc'
                        }}>
                          Score: {match.score.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      {match.playedAt.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Other tabs would be implemented similarly... */}
          {activeTab === 'stats' && (
            <div style={{ padding: '20px' }}>
              <h2>Detailed Statistics</h2>
              <p style={{ color: '#ccc' }}>Advanced statistics and analytics coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ padding: '20px' }}>
              <h2>Profile Settings</h2>
              <p style={{ color: '#ccc' }}>Privacy settings and preferences coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;