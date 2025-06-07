// client/src/online/FriendsList.tsx - Complete file
import React, { useState, useEffect } from 'react';

interface Friend {
  id: string;
  username: string;
  status: 'online' | 'away' | 'in-game' | 'offline';
  elo: number;
  rank: string;
  lastSeen: Date;
  isPlaying?: boolean;
  currentGame?: string;
  avatar: string;
  mutualFriends: number;
}

interface FriendRequest {
  id: string;
  username: string;
  elo: number;
  rank: string;
  sentAt: Date;
  avatar: string;
}

interface FriendsListProps {
  playerData: any;
  onBack: () => void;
  onInviteFriend: (friendId: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ playerData, onBack, onInviteFriend }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'add'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);

  useEffect(() => {
    // Mock friends data
    const mockFriends: Friend[] = [
      {
        id: 'friend_1',
        username: 'BeatBuddy',
        status: 'online',
        elo: 1756,
        rank: 'Diamond',
        lastSeen: new Date(),
        avatar: '/avatars/friend1.png',
        mutualFriends: 3
      },
      {
        id: 'friend_2',
        username: 'RhythmPal',
        status: 'in-game',
        elo: 1623,
        rank: 'Platinum',
        lastSeen: new Date(),
        isPlaying: true,
        currentGame: 'Ranked Match',
        avatar: '/avatars/friend2.png',
        mutualFriends: 7
      },
      {
        id: 'friend_3',
        username: 'MelodyMate',
        status: 'away',
        elo: 1892,
        rank: 'Diamond',
        lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        avatar: '/avatars/friend3.png',
        mutualFriends: 1
      },
      {
        id: 'friend_4',
        username: 'SoundSibling',
        status: 'offline',
        elo: 1445,
        rank: 'Gold',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        avatar: '/avatars/friend4.png',
        mutualFriends: 5
      },
      {
        id: 'friend_5',
        username: 'NoteMaster',
        status: 'online',
        elo: 2134,
        rank: 'Master',
        lastSeen: new Date(),
        avatar: '/avatars/friend5.png',
        mutualFriends: 2
      },
      {
        id: 'friend_6',
        username: 'BassDrop',
        status: 'away',
        elo: 1789,
        rank: 'Diamond',
        lastSeen: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        avatar: '/avatars/friend6.png',
        mutualFriends: 8
      },
      {
        id: 'friend_7',
        username: 'TrebleClef',
        status: 'offline',
        elo: 1334,
        rank: 'Gold',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        avatar: '/avatars/friend7.png',
        mutualFriends: 1
      },
      {
        id: 'friend_8',
        username: 'VibeCheck',
        status: 'in-game',
        elo: 1923,
        rank: 'Diamond',
        lastSeen: new Date(),
        isPlaying: true,
        currentGame: 'Tournament',
        avatar: '/avatars/friend8.png',
        mutualFriends: 4
      },
      {
        id: 'friend_9',
        username: 'EchoWave',
        status: 'online',
        elo: 1567,
        rank: 'Platinum',
        lastSeen: new Date(),
        avatar: '/avatars/friend9.png',
        mutualFriends: 6
      },
      {
        id: 'friend_10',
        username: 'SyncMaster',
        status: 'offline',
        elo: 2045,
        rank: 'Master',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        avatar: '/avatars/friend10.png',
        mutualFriends: 2
      },
      {
        id: 'friend_11',
        username: 'PulseRider',
        status: 'away',
        elo: 1689,
        rank: 'Platinum',
        lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        avatar: '/avatars/friend11.png',
        mutualFriends: 3
      },
      {
        id: 'friend_12',
        username: 'HarmonySeeker',
        status: 'online',
        elo: 1456,
        rank: 'Gold',
        lastSeen: new Date(),
        avatar: '/avatars/friend12.png',
        mutualFriends: 5
      }
    ];

    const mockRequests: FriendRequest[] = [
      {
        id: 'req_1',
        username: 'NewPlayer123',
        elo: 1234,
        rank: 'Silver',
        sentAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        avatar: '/avatars/req1.png'
      },
      {
        id: 'req_2',
        username: 'RhythmSeeker',
        elo: 1567,
        rank: 'Gold',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        avatar: '/avatars/req2.png'
      },
      {
        id: 'req_3',
        username: 'BeatHunter',
        elo: 1789,
        rank: 'Platinum',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        avatar: '/avatars/req3.png'
      }
    ];

    setFriends(mockFriends);
    setFriendRequests(mockRequests);
  }, []);

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return '#4caf50';
      case 'away': return '#ff9800';
      case 'in-game': return '#2196f3';
      case 'offline': return '#666';
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

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length >= 3) {
      // Mock search results - simulate searching through a larger player database
      const mockPlayerDatabase = [
        'SearchResult1', 'SearchResult2', 'ProGamer123', 'RhythmKing', 'BeatQueen',
        'MusicLover', 'SoundMaster', 'NoteNinja', 'ComboKiller', 'PerfectPlayer',
        'ScoreChaser', 'RankClimber', 'EliteGamer', 'RhythmRocket', 'BeatBoxer'
      ];

      const mockResults: Friend[] = mockPlayerDatabase
        .filter(username => username.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 8) // Limit to 8 results
        .map((username, index) => ({
          id: `search_${index}`,
          username,
          status: Math.random() > 0.5 ? 'online' : 'offline',
          elo: Math.floor(Math.random() * 1500) + 1000,
          rank: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'][Math.floor(Math.random() * 5)],
          lastSeen: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24),
          avatar: `/avatars/search${index + 1}.png`,
          mutualFriends: Math.floor(Math.random() * 5)
        }));

      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      // Add to friends list
      const newFriend: Friend = {
        id: request.id,
        username: request.username,
        status: 'online',
        elo: request.elo,
        rank: request.rank,
        lastSeen: new Date(),
        avatar: request.avatar,
        mutualFriends: 0
      };
      setFriends(prev => [...prev, newFriend]);
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleSendFriendRequest = (playerId: string) => {
    // Remove from search results to show request was sent
    setSearchResults(prev => prev.filter(p => p.id !== playerId));
    
    // In a real app, this would send the request to the server
    console.log(`Friend request sent to player ${playerId}`);
  };

  const handleRemoveFriend = (friendId: string) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      setFriends(prev => prev.filter(f => f.id !== friendId));
    }
  };

  const onlineFriends = friends.filter(f => f.status === 'online' || f.status === 'away' || f.status === 'in-game');
  const offlineFriends = friends.filter(f => f.status === 'offline');

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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Portal
        </button>
        
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196f3, #4caf50)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          👥 Friends
        </h1>

        <div style={{
          fontSize: '14px',
          color: '#ccc'
        }}>
          {onlineFriends.length} online • {friends.length} total
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
          {/* Navigation */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>Navigation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'friends', label: 'Friends List', icon: '👥', count: friends.length },
                { id: 'requests', label: 'Friend Requests', icon: '📬', count: friendRequests.length },
                { id: 'add', label: 'Add Friends', icon: '➕', count: 0 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(33, 150, 243, 0.2)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid #2196f3' : '1px solid transparent',
                    color: 'white',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{tab.icon}</span>
                    {tab.label}
                  </div>
                  {tab.count > 0 && (
                    <div style={{
                      background: tab.id === 'requests' ? '#f44336' : '#2196f3',
                      color: 'white',
                      borderRadius: '50%',
                      minWidth: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {tab.count}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#2196f3' }}>
              📊 Friend Stats
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#4caf50', fontSize: '18px' }}>
                  {friends.filter(f => f.status === 'online').length}
                </div>
                <div style={{ color: '#ccc' }}>Online</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#2196f3', fontSize: '18px' }}>
                  {friends.filter(f => f.status === 'in-game').length}
                </div>
                <div style={{ color: '#ccc' }}>In Game</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#ff9800', fontSize: '18px' }}>
                  {friends.filter(f => f.status === 'away').length}
                </div>
                <div style={{ color: '#ccc' }}>Away</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#666', fontSize: '18px' }}>
                  {offlineFriends.length}
                </div>
                <div style={{ color: '#ccc' }}>Offline</div>
              </div>
            </div>
          </div>

          {/* Player Info */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(76, 175, 80, 0.1))',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid #2196f3'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#2196f3' }}>
              👤 Your Profile
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                👤
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {playerData.username}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: getRankColor(playerData.rank),
                  fontWeight: 'bold'
                }}>
                  {playerData.rank} • {playerData.elo} ELO
                </div>
              </div>
            </div>
  <div style={{
             fontSize: '12px',
             color: '#ccc',
             lineHeight: '1.4'
           }}>
             Status: <span style={{ color: '#4caf50' }}>🟢 Online</span><br/>
             Friends: {friends.length}<br/>
             Win Rate: {((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(1)}%
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
         {/* Friends List Tab */}
         {activeTab === 'friends' && (
           <>
             <div style={{
               padding: '20px',
               borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
               background: 'rgba(255, 255, 255, 0.02)'
             }}>
               <div style={{
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center'
               }}>
                 <h2 style={{ margin: 0, fontSize: '20px' }}>
                   Friends List ({friends.length})
                 </h2>
                 <div style={{
                   display: 'flex',
                   gap: '15px',
                   alignItems: 'center',
                   fontSize: '12px',
                   color: '#ccc'
                 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }} />
                     Online ({friends.filter(f => f.status === 'online').length})
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2196f3' }} />
                     In Game ({friends.filter(f => f.status === 'in-game').length})
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff9800' }} />
                     Away ({friends.filter(f => f.status === 'away').length})
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#666' }} />
                     Offline ({offlineFriends.length})
                   </div>
                 </div>
               </div>
             </div>

             <div style={{
               flex: 1,
               overflowY: 'auto',
               padding: '10px 20px'
             }}>
               {friends.length === 0 ? (
                 <div style={{
                   textAlign: 'center',
                   padding: '60px 20px',
                   color: '#666'
                 }}>
                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                   <h3 style={{ margin: '0 0 10px 0' }}>No Friends Yet</h3>
                   <p>Add some friends to get started!</p>
                   <button
                     onClick={() => setActiveTab('add')}
                     style={{
                       background: '#2196f3',
                       border: 'none',
                       color: 'white',
                       padding: '10px 20px',
                       borderRadius: '8px',
                       cursor: 'pointer',
                       fontSize: '14px',
                       fontWeight: 'bold',
                       marginTop: '15px'
                     }}
                   >
                     Find Friends
                   </button>
                 </div>
               ) : (
                 <>
                   {/* Online Friends */}
                   {onlineFriends.length > 0 && (
                     <>
                       <h3 style={{
                         margin: '20px 0 15px 0',
                         fontSize: '16px',
                         color: '#4caf50',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '8px'
                       }}>
                         🟢 Online ({onlineFriends.length})
                       </h3>
                       {onlineFriends.map(friend => (
                         <FriendItem
                           key={friend.id}
                           friend={friend}
                           onInvite={() => onInviteFriend(friend.id)}
                           onRemove={() => handleRemoveFriend(friend.id)}
                           getStatusColor={getStatusColor}
                           getStatusIcon={getStatusIcon}
                           getRankColor={getRankColor}
                           formatLastSeen={formatLastSeen}
                         />
                       ))}
                     </>
                   )}

                   {/* Offline Friends */}
                   {offlineFriends.length > 0 && (
                     <>
                       <h3 style={{
                         margin: '30px 0 15px 0',
                         fontSize: '16px',
                         color: '#666',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '8px'
                       }}>
                         ⚫ Offline ({offlineFriends.length})
                       </h3>
                       {offlineFriends.map(friend => (
                         <FriendItem
                           key={friend.id}
                           friend={friend}
                           onInvite={() => onInviteFriend(friend.id)}
                           onRemove={() => handleRemoveFriend(friend.id)}
                           getStatusColor={getStatusColor}
                           getStatusIcon={getStatusIcon}
                           getRankColor={getRankColor}
                           formatLastSeen={formatLastSeen}
                         />
                       ))}
                     </>
                   )}
                 </>
               )}
             </div>
           </>
         )}

         {/* Friend Requests Tab */}
         {activeTab === 'requests' && (
           <>
             <div style={{
               padding: '20px',
               borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
               background: 'rgba(255, 255, 255, 0.02)'
             }}>
               <h2 style={{ margin: 0, fontSize: '20px' }}>
                 Friend Requests ({friendRequests.length})
               </h2>
             </div>

             <div style={{
               flex: 1,
               overflowY: 'auto',
               padding: '20px'
             }}>
               {friendRequests.length === 0 ? (
                 <div style={{
                   textAlign: 'center',
                   padding: '60px 20px',
                   color: '#666'
                 }}>
                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>📬</div>
                   <h3 style={{ margin: '0 0 10px 0' }}>No Friend Requests</h3>
                   <p>You're all caught up! Share your username with friends so they can add you.</p>
                   <div style={{
                     background: 'rgba(255, 255, 255, 0.1)',
                     borderRadius: '8px',
                     padding: '15px',
                     marginTop: '20px',
                     fontSize: '14px'
                   }}>
                     <strong>Your Username:</strong> {playerData.username}
                   </div>
                 </div>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   {friendRequests.map(request => (
                     <div
                       key={request.id}
                       style={{
                         background: 'rgba(255, 255, 255, 0.05)',
                         borderRadius: '12px',
                         padding: '20px',
                         border: '1px solid rgba(255, 255, 255, 0.1)',
                         transition: 'all 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                       }}
                     >
                       <div style={{
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'space-between'
                       }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
                             <div style={{
                               fontWeight: 'bold',
                               fontSize: '16px',
                               marginBottom: '4px'
                             }}>
                               {request.username}
                             </div>
                             <div style={{
                               fontSize: '12px',
                               color: getRankColor(request.rank),
                               fontWeight: 'bold',
                               marginBottom: '2px'
                             }}>
                               {request.rank} • {request.elo} ELO
                             </div>
                             <div style={{
                               fontSize: '11px',
                               color: '#666'
                             }}>
                               Sent {formatLastSeen(request.sentAt)}
                             </div>
                           </div>
                         </div>
                         <div style={{ display: 'flex', gap: '10px' }}>
                           <button
                             onClick={() => handleAcceptRequest(request.id)}
                             style={{
                               background: '#4caf50',
                               border: 'none',
                               color: 'white',
                               padding: '10px 16px',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               fontSize: '14px',
                               fontWeight: 'bold',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '6px'
                             }}
                           >
                             ✓ Accept
                           </button>
                           <button
                             onClick={() => handleDeclineRequest(request.id)}
                             style={{
                               background: '#f44336',
                               border: 'none',
                               color: 'white',
                               padding: '10px 16px',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               fontSize: '14px',
                               fontWeight: 'bold',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '6px'
                             }}
                           >
                             ✗ Decline
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </>
         )}

         {/* Add Friends Tab */}
         {activeTab === 'add' && (
           <>
             <div style={{
               padding: '20px',
               borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
               background: 'rgba(255, 255, 255, 0.02)'
             }}>
               <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
                 Add Friends
               </h2>
               <div style={{ position: 'relative' }}>
                 <input
                   type="text"
                   value={searchTerm}
                   onChange={(e) => handleSearch(e.target.value)}
                   placeholder="Search by username... (min 3 characters)"
                   style={{
                     width: '100%',
                     padding: '12px 45px 12px 15px',
                     background: 'rgba(255, 255, 255, 0.1)',
                     border: '2px solid rgba(255, 255, 255, 0.3)',
                     borderRadius: '10px',
                     color: 'white',
                     fontSize: '16px',
                     outline: 'none',
                     transition: 'border-color 0.3s ease'
                   }}
                   onFocus={(e) => {
                     e.target.style.borderColor = '#2196f3';
                   }}
                   onBlur={(e) => {
                     e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                   }}
                 />
                 <div style={{
                   position: 'absolute',
                   right: '15px',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   fontSize: '18px',
                   color: '#666'
                 }}>
                   🔍
                 </div>
               </div>
             </div>

             <div style={{
               flex: 1,
               overflowY: 'auto',
               padding: '20px'
             }}>
               {searchTerm.length < 3 ? (
                 <div style={{
                   textAlign: 'center',
                   padding: '60px 20px',
                   color: '#666'
                 }}>
                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                   <h3 style={{ margin: '0 0 10px 0' }}>Find New Friends</h3>
                   <p>Enter at least 3 characters to search for players</p>
                   <div style={{
                     background: 'rgba(33, 150, 243, 0.1)',
                     borderRadius: '8px',
                     padding: '15px',
                     marginTop: '20px',
                     fontSize: '14px',
                     border: '1px solid #2196f3'
                   }}>
                     💡 <strong>Tip:</strong> You can also share your username ({playerData.username}) with friends so they can add you!
                   </div>
                 </div>
               ) : searchResults.length === 0 ? (
                 <div style={{
                   textAlign: 'center',
                   padding: '60px 20px',
                   color: '#666'
                 }}>
                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
                   <h3 style={{ margin: '0 0 10px 0' }}>No Results Found</h3>
                   <p>No players found matching "{searchTerm}"</p>
                   <p style={{ fontSize: '14px', color: '#888' }}>
                     Try a different username or check the spelling
                   </p>
                 </div>
               ) : (
                 <>
                   <div style={{
                     marginBottom: '20px',
                     fontSize: '14px',
                     color: '#ccc'
                   }}>
                     Found {searchResults.length} player{searchResults.length !== 1 ? 's' : ''} matching "{searchTerm}"
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                     {searchResults.map(player => (
                       <div
                         key={player.id}
                         style={{
                           background: 'rgba(255, 255, 255, 0.05)',
                           borderRadius: '12px',
                           padding: '20px',
                           border: '1px solid rgba(255, 255, 255, 0.1)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                           e.currentTarget.style.transform = 'translateY(-2px)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                           e.currentTarget.style.transform = 'translateY(0)';
                         }}
                       >
                         <div style={{
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'space-between'
                         }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                             <div style={{
                               width: '50px',
                               height: '50px',
                               borderRadius: '50%',
                               background: 'linear-gradient(45deg, #4caf50, #2196f3)',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               fontSize: '20px',
                               position: 'relative'
                             }}>
                               👤
                               {player.status === 'online' && (
                                 <div style={{
                                   position: 'absolute',
                                   bottom: '-2px',
                                   right: '-2px',
                                   width: '16px',
                                   height: '16px',
                                   borderRadius: '50%',
                                   background: '#4caf50',
                                   border: '2px solid #000'
                                 }} />
                               )}
                             </div>
                             <div>
                               <div style={{
                                 fontWeight: 'bold',
                                 fontSize: '16px',
                                 marginBottom: '4px'
                               }}>
                                 {player.username}
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
                                 fontSize: '11px',
                                 color: getStatusColor(player.status),
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '4px'
                               }}>
                                 {getStatusIcon(player.status)}
                                 {player.status === 'offline' ? 
                                   `Last seen ${formatLastSeen(player.lastSeen)}` :
                                   player.status.charAt(0).toUpperCase() + player.status.slice(1)
                                 }
                               </div>
                               {player.mutualFriends > 0 && (
                                 <div style={{
                                   fontSize: '11px',
                                   color: '#4caf50',
                                   marginTop: '2px'
                                 }}>
                                   👥 {player.mutualFriends} mutual friend{player.mutualFriends !== 1 ? 's' : ''}
                                 </div>
                               )}
                             </div>
                           </div>
                           <button
                             onClick={() => handleSendFriendRequest(player.id)}
                             style={{
                               background: '#2196f3',
                               border: 'none',
                               color: 'white',
                               padding: '10px 16px',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               fontSize: '14px',
                               fontWeight: 'bold',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '6px'
                             }}
                           >
                             ➕ Add Friend
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </>
               )}
             </div>
           </>
         )}
       </div>
     </div>
   </div>
 );
};

// Friend Item Component
interface FriendItemProps {
 friend: Friend;
 onInvite: () => void;
 onRemove: () => void;
 getStatusColor: (status: Friend['status']) => string;
 getStatusIcon: (status: Friend['status']) => string;
 getRankColor: (rank: string) => string;
 formatLastSeen: (date: Date) => string;
}

const FriendItem: React.FC<FriendItemProps> = ({
 friend,
 onInvite,
 onRemove,
 getStatusColor,
 getStatusIcon,
 getRankColor,
 formatLastSeen
}) => {
 const [showMenu, setShowMenu] = useState(false);

 return (
   <div style={{
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'space-between',
     padding: '15px',
     marginBottom: '10px',
     background: 'rgba(255, 255, 255, 0.03)',
     borderRadius: '12px',
     border: '1px solid rgba(255, 255, 255, 0.05)',
     transition: 'all 0.3s ease',
     position: 'relative'
   }}
   onMouseEnter={(e) => {
     e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
     e.currentTarget.style.transform = 'translateY(-1px)';
   }}
   onMouseLeave={(e) => {
     e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
     e.currentTarget.style.transform = 'translateY(0)';
     setShowMenu(false);
   }}
   >
     <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
       <div style={{
         width: '45px',
         height: '45px',
         borderRadius: '50%',
         background: 'linear-gradient(45deg, #4caf50, #2196f3)',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         fontSize: '18px',
         position: 'relative'
       }}>
         👤
         <div style={{
           position: 'absolute',
           bottom: '-2px',
           right: '-2px',
           width: '16px',
           height: '16px',
           borderRadius: '50%',
           background: getStatusColor(friend.status),
           border: '2px solid #000',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           fontSize: '8px'
         }}>
           {friend.status === 'in-game' ? '🎮' : ''}
         </div>
       </div>
       <div>
         <div style={{
           fontWeight: 'bold',
           fontSize: '16px',
           marginBottom: '4px'
         }}>
           {friend.username}
         </div>
         <div style={{
           fontSize: '12px',
           color: getRankColor(friend.rank),
           fontWeight: 'bold',
           marginBottom: '2px'
         }}>
           {friend.rank} • {friend.elo} ELO
         </div>
         <div style={{
           fontSize: '11px',
           color: getStatusColor(friend.status),
           display: 'flex',
           alignItems: 'center',
           gap: '4px'
         }}>
           {getStatusIcon(friend.status)}
           {friend.status === 'in-game' && friend.currentGame ? 
             `Playing ${friend.currentGame}` :
             friend.status === 'offline' ? 
             `Last seen ${formatLastSeen(friend.lastSeen)}` :
             friend.status.charAt(0).toUpperCase() + friend.status.slice(1)
           }
         </div>
         {friend.mutualFriends > 0 && (
           <div style={{
             fontSize: '10px',
             color: '#4caf50',
             marginTop: '2px'
           }}>
             👥 {friend.mutualFriends} mutual
           </div>
         )}
       </div>
     </div>

     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
       {friend.status === 'online' && (
         <button
           onClick={onInvite}
           style={{
             background: '#4caf50',
             border: 'none',
             color: 'white',
             padding: '6px 12px',
             borderRadius: '6px',
             cursor: 'pointer',
             fontSize: '12px',
             fontWeight: 'bold'
           }}
         >
           Invite
         </button>
       )}
       
       <div style={{ position: 'relative' }}>
         <button
           onClick={() => setShowMenu(!showMenu)}
           style={{
             background: 'rgba(255, 255, 255, 0.1)',
             border: '1px solid rgba(255, 255, 255, 0.3)',
             color: 'white',
             padding: '6px 8px',
             borderRadius: '6px',
             cursor: 'pointer',
             fontSize: '12px'
           }}
         >
           ⋮
         </button>
         
         {showMenu && (
           <div style={{
             position: 'absolute',
             top: '100%',
             right: 0,
             background: 'rgba(0, 0, 0, 0.9)',
             borderRadius: '8px',
             border: '1px solid rgba(255, 255, 255, 0.2)',
             minWidth: '120px',
             zIndex: 1000,
             marginTop: '5px'
           }}>
             <button
               style={{
                 width: '100%',
                 padding: '8px 12px',
                 background: 'transparent',
                 border: 'none',
                 color: 'white',
                 textAlign: 'left',
                 cursor: 'pointer',
                 fontSize: '12px',
                 borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
               }}
             >
               View Profile
             </button>
             <button
               style={{
                 width: '100%',
                 padding: '8px 12px',
                 background: 'transparent',
                 border: 'none',
                 color: 'white',
                 textAlign: 'left',
                 cursor: 'pointer',
                 fontSize: '12px',
                 borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
               }}
             >
               Send Message
             </button>
             <button
               onClick={onRemove}
               style={{
                 width: '100%',
                 padding: '8px 12px',
                 background: 'transparent',
                 border: 'none',
                 color: '#f44336',
                 textAlign: 'left',
                 cursor: 'pointer',
                 fontSize: '12px'
               }}
             >
               Remove Friend
             </button>
           </div>
         )}
       </div>
     </div>
   </div>
 );
};

export default FriendsList;