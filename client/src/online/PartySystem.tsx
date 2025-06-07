// client/src/online/PartySystem.tsx
import React, { useState, useEffect } from 'react';

interface Party {
  id: string;
  name: string;
  leader: string;
  members: PartyMember[];
  maxMembers: number;
  isPublic: boolean;
  gameMode?: string;
  difficulty?: number;
  region: string;
  createdAt: Date;
  status: 'waiting' | 'in-queue' | 'in-game';
}

interface PartyMember {
  id: string;
  username: string;
  elo: number;
  rank: string;
  status: 'ready' | 'not-ready' | 'away';
  joinedAt: Date;
  avatar: string;
  isLeader: boolean;
}

interface PartyInvite {
  id: string;
  fromUsername: string;
  fromElo: number;
  fromRank: string;
  partyName: string;
  sentAt: Date;
  expiresAt: Date;
}

interface PartySystemProps {
  playerData: any;
  onBack: () => void;
  onStartPartyGame: (config: any) => void;
}

const PartySystem: React.FC<PartySystemProps> = ({ playerData, onBack, onStartPartyGame }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'browse' | 'invites' | 'create'>('current');
  const [currentParty, setCurrentParty] = useState<Party | null>(null);
  const [availableParties, setAvailableParties] = useState<Party[]>([]);
  const [partyInvites, setPartyInvites] = useState<PartyInvite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [createPartyForm, setCreatePartyForm] = useState({
    name: '',
    maxMembers: 4,
    isPublic: true,
    gameMode: 'Ranked',
    difficulty: 50,
    region: 'NA-East'
  });

  useEffect(() => {
    // Mock data initialization
    const mockParties: Party[] = [
      {
        id: 'party_1',
        name: 'Elite Squad',
        leader: 'ProGamer123',
        members: [
          {
            id: 'member_1',
            username: 'ProGamer123',
            elo: 2156,
            rank: 'Master',
            status: 'ready',
            joinedAt: new Date(Date.now() - 1000 * 60 * 30),
            avatar: '/avatars/1.png',
            isLeader: true
          },
          {
            id: 'member_2',
            username: 'RhythmKing',
            elo: 1987,
            rank: 'Diamond',
            status: 'ready',
            joinedAt: new Date(Date.now() - 1000 * 60 * 15),
            avatar: '/avatars/2.png',
            isLeader: false
          },
          {
            id: 'member_3',
            username: 'BeatMaster',
            elo: 1834,
            rank: 'Diamond',
            status: 'not-ready',
            joinedAt: new Date(Date.now() - 1000 * 60 * 10),
            avatar: '/avatars/3.png',
            isLeader: false
          }
        ],
        maxMembers: 4,
        isPublic: true,
        gameMode: 'Tournament',
        difficulty: 80,
        region: 'NA-East',
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
        status: 'waiting'
      },
      {
        id: 'party_2',
        name: 'Casual Beats',
        leader: 'ChillPlayer',
        members: [
          {
            id: 'member_4',
            username: 'ChillPlayer',
            elo: 1456,
            rank: 'Gold',
            status: 'ready',
            joinedAt: new Date(Date.now() - 1000 * 60 * 20),
            avatar: '/avatars/4.png',
            isLeader: true
          },
          {
            id: 'member_5',
            username: 'MelodySeeker',
            elo: 1523,
            rank: 'Gold',
            status: 'ready',
            joinedAt: new Date(Date.now() - 1000 * 60 * 5),
            avatar: '/avatars/5.png',
            isLeader: false
          }
        ],
        maxMembers: 6,
        isPublic: true,
        gameMode: 'Casual',
        difficulty: 35,
        region: 'EU-West',
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
        status: 'waiting'
      }
    ];

    const mockInvites: PartyInvite[] = [
      {
        id: 'invite_1',
        fromUsername: 'BeatBuddy',
        fromElo: 1756,
        fromRank: 'Diamond',
        partyName: 'Diamond Crushers',
        sentAt: new Date(Date.now() - 1000 * 60 * 10),
        expiresAt: new Date(Date.now() + 1000 * 60 * 50)
      },
      {
        id: 'invite_2',
        fromUsername: 'RhythmPal',
        fromElo: 1623,
        fromRank: 'Platinum',
        partyName: 'Weekend Warriors',
        sentAt: new Date(Date.now() - 1000 * 60 * 25),
        expiresAt: new Date(Date.now() + 1000 * 60 * 35)
      }
    ];

    setAvailableParties(mockParties);
    setPartyInvites(mockInvites);

    // Check if player is already in a party (mock)
    const isInParty = Math.random() > 0.7; // 30% chance player is in a party
    if (isInParty) {
      setCurrentParty({
        id: 'my_party',
        name: 'My Squad',
        leader: playerData.username,
        members: [
          {
            id: 'me',
            username: playerData.username,
            elo: playerData.elo,
            rank: playerData.rank,
            status: 'ready',
            joinedAt: new Date(Date.now() - 1000 * 60 * 60),
            avatar: '/avatars/player.png',
            isLeader: true
          },
          {
            id: 'friend_1',
            username: 'BeatBuddy',
            elo: 1756,
            rank: 'Diamond',
            status: 'not-ready',
            joinedAt: new Date(Date.now() - 1000 * 60 * 30),
            avatar: '/avatars/friend1.png',
            isLeader: false
          }
        ],
        maxMembers: 4,
        isPublic: false,
        gameMode: 'Ranked',
        difficulty: 60,
        region: 'NA-East',
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        status: 'waiting'
      });
    }
  }, [playerData]);

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

  const getStatusColor = (status: PartyMember['status']) => {
    switch (status) {
      case 'ready': return '#4caf50';
      case 'not-ready': return '#f44336';
      case 'away': return '#ff9800';
      default: return '#666';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const handleCreateParty = () => {
    const newParty: Party = {
      id: `party_${Date.now()}`,
      name: createPartyForm.name || `${playerData.username}'s Party`,
      leader: playerData.username,
      members: [{
        id: 'me',
        username: playerData.username,
        elo: playerData.elo,
        rank: playerData.rank,
        status: 'ready',
        joinedAt: new Date(),
        avatar: '/avatars/player.png',
        isLeader: true
      }],
      maxMembers: createPartyForm.maxMembers,
      isPublic: createPartyForm.isPublic,
      gameMode: createPartyForm.gameMode,
      difficulty: createPartyForm.difficulty,
      region: createPartyForm.region,
      createdAt: new Date(),
      status: 'waiting'
    };
    
    setCurrentParty(newParty);
    setActiveTab('current');
    
    // Reset form
    setCreatePartyForm({
      name: '',
      maxMembers: 4,
      isPublic: true,
      gameMode: 'Ranked',
      difficulty: 50,
      region: 'NA-East'
    });
  };

  const handleJoinParty = (party: Party) => {
    if (party.members.length >= party.maxMembers) return;
    
    const updatedParty = {
      ...party,
      members: [
        ...party.members,
        {
          id: 'me',
          username: playerData.username,
          elo: playerData.elo,
          rank: playerData.rank,
          status: 'not-ready' as const,
          joinedAt: new Date(),
          avatar: '/avatars/player.png',
          isLeader: false
        }
      ]
    };
    
    setCurrentParty(updatedParty);
    setActiveTab('current');
  };

  const handleLeaveParty = () => {
    if (confirm('Are you sure you want to leave the party?')) {
      setCurrentParty(null);
    }
  };

  const handleToggleReady = () => {
    if (!currentParty) return;
    
    const updatedParty = {
      ...currentParty,
      members: currentParty.members.map(member => 
        member.username === playerData.username 
          ? { ...member, status: member.status === 'ready' ? 'not-ready' : 'ready' }
          : member
      )
    };
    
    setCurrentParty(updatedParty);
  };

  const handleStartGame = () => {
    if (!currentParty) return;
    
    const allReady = currentParty.members.every(member => member.status === 'ready');
    if (!allReady) {
      alert('All party members must be ready before starting!');
      return;
    }
    
    onStartPartyGame({
      mode: 'party',
      gameMode: currentParty.gameMode,
      difficulty: currentParty.difficulty,
      partyId: currentParty.id,
      members: currentParty.members
    });
  };

  const handleAcceptInvite = (inviteId: string) => {
    const invite = partyInvites.find(i => i.id === inviteId);
    if (invite) {
      // Create a mock party from the invite
      const newParty: Party = {
        id: `party_${Date.now()}`,
        name: invite.partyName,
        leader: invite.fromUsername,
        members: [
          {
            id: 'leader',
            username: invite.fromUsername,
            elo: invite.fromElo,
            rank: invite.fromRank,
            status: 'ready',
            joinedAt: new Date(Date.now() - 1000 * 60 * 30),
            avatar: '/avatars/leader.png',
            isLeader: true
          },
          {
            id: 'me',
            username: playerData.username,
            elo: playerData.elo,
            rank: playerData.rank,
            status: 'not-ready',
            joinedAt: new Date(),
            avatar: '/avatars/player.png',
            isLeader: false
          }
        ],
        maxMembers: 4,
        isPublic: false,
        gameMode: 'Ranked',
        difficulty: 60,
        region: 'NA-East',
        createdAt: new Date(),
        status: 'waiting'
      };
      
      setCurrentParty(newParty);
      setPartyInvites(prev => prev.filter(i => i.id !== inviteId));
      setActiveTab('current');
    }
  };

  const handleDeclineInvite = (inviteId: string) => {
    setPartyInvites(prev => prev.filter(i => i.id !== inviteId));
  };

  const filteredParties = availableParties.filter(party => 
    party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.gameMode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'current', label: currentParty ? 'My Party' : 'No Party', icon: currentParty ? '👥' : '❌' },
    { id: 'browse', label: 'Browse Parties', icon: '🔍', count: availableParties.length },
    { id: 'invites', label: 'Invitations', icon: '📧', count: partyInvites.length },
    { id: 'create', label: 'Create Party', icon: '➕' }
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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to Portal
        </button>
        
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎉 Party System
        </h1>

        {currentParty && (
          <div style={{
            fontSize: '14px',
            color: '#4caf50',
            fontWeight: 'bold'
          }}>
            In Party: {currentParty.name}
          </div>
        )}
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
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Navigation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tabs.map(tab => (
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
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{tab.icon}</span>
                    {tab.label}
                  </div>
                  {tab.count && tab.count > 0 && (
                    <div style={{
                      background: tab.id === 'invites' ? '#f44336' : '#9c27b0',
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

          {/* Party Quick Info */}
          {currentParty && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(233, 30, 99, 0.2))',
              borderRadius: '15px',
              padding: '20px',
              border: '2px solid #9c27b0'
            }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#9c27b0' }}>
                🎉 Current Party
              </h4>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {currentParty.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#ccc',
                marginBottom: '10px'
              }}>
                {currentParty.members.length}/{currentParty.maxMembers} members
              </div>
              <div style={{
                fontSize: '12px',
                color: '#ccc'
              }}>
                Leader: {currentParty.leader}<br/>
                Mode: {currentParty.gameMode}<br/>
                Ready: {currentParty.members.filter(m => m.status === 'ready').length}/{currentParty.members.length}
              </div>
            </div>
          )}

          {/* Party Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9c27b0' }}>
              📊 Party Stats
            </h4>
            <div style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.5' }}>
              <div>Available Parties: {availableParties.length}</div>
              <div>Pending Invites: {partyInvites.length}</div>
              <div>Players in Parties: {availableParties.reduce((sum, p) => sum + p.members.length, 0)}</div>
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
          {/* Current Party Tab */}
          {activeTab === 'current' && (
            <>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>
                  {currentParty ? `Party: ${currentParty.name}` : 'No Active Party'}
                </h2>
              </div>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px'
              }}>
                {!currentParty ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#666'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
                    <h3 style={{ margin: '0 0 10px 0' }}>No Active Party</h3>
                    <p>Create a new party or join an existing one to get started!</p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
                      <button
                        onClick={() => setActiveTab('create')}
                        style={{
                          background: '#9c27b0',
                          border: 'none',
                          color: 'white',
                          padding: '12px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        Create Party
                      </button>
                      <button
                        onClick={() => setActiveTab('browse')}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'white',
                          padding: '12px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        Browse Parties
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Party Info */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                      }}>
                        <div>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
                            {currentParty.name}
                          </h3>
                          <div style={{ fontSize: '14px', color: '#ccc' }}>
                            Created by {currentParty.leader} • {formatTimeAgo(currentParty.createdAt)}
                          </div>
                        </div>
                        <div style={{
                          background: currentParty.status === 'waiting' ? '#4caf50' : '#ff9800',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          {currentParty.status}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '15px'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2196f3' }}>
                            {currentParty.members.length}/{currentParty.maxMembers}
                          </div>
                          <div style={{ fontSize: '12px', color: '#ccc' }}>Members</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4caf50' }}>
                            {currentParty.members.filter(m => m.status === 'ready').length}
                          </div>
                          <div style={{ fontSize: '12px', color: '#ccc' }}>Ready</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9800' }}>
                            {currentParty.difficulty || 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#ccc' }}>Difficulty</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9c27b0' }}>
                            {currentParty.gameMode || 'TBD'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#ccc' }}>Mode</div>
                        </div>
                      </div>
                    </div>

                    {/* Party Members */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                        Party Members ({currentParty.members.length}/{currentParty.maxMembers})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentParty.members.map(member => (
                          <div
                            key={member.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px',
                              background: member.username === playerData.username ? 
                                'rgba(156, 39, 176, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                              borderRadius: '8px',
                              border: member.isLeader ? '1px solid #ffd700' : '1px solid transparent'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                position: 'relative'
                              }}>
                                👤
                                {member.isLeader && (
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
                              <div>
                                <div style={{
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                  marginBottom: '2px'
                                }}>
                                  {member.username}
                                  {member.username === playerData.username && ' (You)'}
                                  {member.isLeader && ' (Leader)'}
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  color: getRankColor(member.rank),
                                  fontWeight: 'bold'
                                }}>
                                  {member.rank} • {member.elo} ELO
                                </div>
                              </div>
                            </div>
                            <div style={{
                              background: getStatusColor(member.status),
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase'
                            }}>
                              {member.status.replace('-', ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Party Controls */}
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={handleToggleReady}
                        style={{
                          background: currentParty.members.find(m => m.username === playerData.username)?.status === 'ready' 
                            ? '#f44336' : '#4caf50',
                          border: 'none',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
fontWeight: 'bold'
                       }}
                     >
                       {currentParty.members.find(m => m.username === playerData.username)?.status === 'ready' 
                         ? '❌ Not Ready' : '✅ Ready Up'}
                     </button>

                     {currentParty.leader === playerData.username && (
                       <button
                         onClick={handleStartGame}
                         disabled={!currentParty.members.every(m => m.status === 'ready')}
                         style={{
                           background: currentParty.members.every(m => m.status === 'ready') 
                             ? '#9c27b0' : '#666',
                           border: 'none',
                           color: 'white',
                           padding: '12px 24px',
                           borderRadius: '8px',
                           cursor: currentParty.members.every(m => m.status === 'ready') 
                             ? 'pointer' : 'not-allowed',
                           fontSize: '16px',
                           fontWeight: 'bold'
                         }}
                       >
                         🎮 Start Game
                       </button>
                     )}

                     <button
                       onClick={handleLeaveParty}
                       style={{
                         background: 'rgba(244, 67, 54, 0.2)',
                         border: '1px solid #f44336',
                         color: '#f44336',
                         padding: '12px 24px',
                         borderRadius: '8px',
                         cursor: 'pointer',
                         fontSize: '16px',
                         fontWeight: 'bold'
                       }}
                     >
                       🚪 Leave Party
                     </button>
                   </div>
                 </>
               )}
             </div>
           </>
         )}

         {/* Browse Parties Tab */}
         {activeTab === 'browse' && (
           <>
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
                 <h2 style={{ margin: 0, fontSize: '20px' }}>
                   Browse Parties ({availableParties.length})
                 </h2>
               </div>
               <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search parties..."
                 style={{
                   width: '100%',
                   padding: '10px 15px',
                   background: 'rgba(255, 255, 255, 0.1)',
                   border: '1px solid rgba(255, 255, 255, 0.3)',
                   borderRadius: '8px',
                   color: 'white',
                   fontSize: '14px'
                 }}
               />
             </div>

             <div style={{
               flex: 1,
               overflowY: 'auto',
               padding: '20px'
             }}>
               {filteredParties.length === 0 ? (
                 <div style={{
                   textAlign: 'center',
                   padding: '60px 20px',
                   color: '#666'
                 }}>
                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                   <h3 style={{ margin: '0 0 10px 0' }}>No Parties Found</h3>
                   <p>No parties match your search criteria</p>
                 </div>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   {filteredParties.map(party => (
                     <div
                       key={party.id}
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
                         justifyContent: 'space-between',
                         alignItems: 'flex-start',
                         marginBottom: '15px'
                       }}>
                         <div>
                           <div style={{
                             display: 'flex',
                             alignItems: 'center',
                             gap: '10px',
                             marginBottom: '8px'
                           }}>
                             <h3 style={{
                               margin: 0,
                               fontSize: '18px',
                               fontWeight: 'bold'
                             }}>
                               {party.name}
                             </h3>
                             <div style={{
                               background: party.isPublic ? '#4caf50' : '#ff9800',
                               color: 'white',
                               padding: '2px 8px',
                               borderRadius: '12px',
                               fontSize: '10px',
                               fontWeight: 'bold'
                             }}>
                               {party.isPublic ? 'PUBLIC' : 'PRIVATE'}
                             </div>
                           </div>
                           <div style={{
                             fontSize: '14px',
                             color: '#ccc',
                             marginBottom: '5px'
                           }}>
                             Leader: <strong>{party.leader}</strong> • {formatTimeAgo(party.createdAt)}
                           </div>
                           <div style={{
                             fontSize: '12px',
                             color: '#ccc'
                           }}>
                             {party.gameMode} • Difficulty {party.difficulty} • {party.region}
                           </div>
                         </div>
                         <button
                           onClick={() => handleJoinParty(party)}
                           disabled={party.members.length >= party.maxMembers || !!currentParty}
                           style={{
                             background: party.members.length >= party.maxMembers || currentParty 
                               ? '#666' : '#9c27b0',
                             border: 'none',
                             color: 'white',
                             padding: '8px 16px',
                             borderRadius: '6px',
                             cursor: party.members.length >= party.maxMembers || currentParty 
                               ? 'not-allowed' : 'pointer',
                             fontSize: '14px',
                             fontWeight: 'bold'
                           }}
                         >
                           {party.members.length >= party.maxMembers ? 'Full' : 
                            currentParty ? 'In Party' : 'Join'}
                         </button>
                       </div>

                       <div style={{
                         display: 'grid',
                         gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                         gap: '15px'
                       }}>
                         <div style={{ textAlign: 'center' }}>
                           <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2196f3' }}>
                             {party.members.length}/{party.maxMembers}
                           </div>
                           <div style={{ fontSize: '12px', color: '#ccc' }}>Members</div>
                         </div>
                         <div style={{ textAlign: 'center' }}>
                           <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4caf50' }}>
                             {party.members.filter(m => m.status === 'ready').length}
                           </div>
                           <div style={{ fontSize: '12px', color: '#ccc' }}>Ready</div>
                         </div>
                         <div style={{ textAlign: 'center' }}>
                           <div style={{
                             fontSize: '16px',
                             fontWeight: 'bold',
                             color: party.status === 'waiting' ? '#4caf50' : '#ff9800'
                           }}>
                             {party.status.toUpperCase()}
                           </div>
                           <div style={{ fontSize: '12px', color: '#ccc' }}>Status</div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </>
         )}

         {/* Party Invites Tab */}
         {activeTab === 'invites' && (
           <>
             <div style={{
               padding: '20px',
               borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
             }}>
               <h2 style={{ margin: 0, fontSize: '20px' }}>
                 Party Invitations ({partyInvites.length})
               </h2>
             </div>

             <div style={{
               flex: 1,
               overflowY: 'auto',
               padding: '20px'
             }}>
               {partyInvites.length === 0 ? (
                 <div style={{
                   textAlign: 'center',
                   padding: '60px 20px',
                   color: '#666'
                 }}>
                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>📧</div>
                   <h3 style={{ margin: '0 0 10px 0' }}>No Party Invitations</h3>
                   <p>You haven't received any party invites yet</p>
                 </div>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   {partyInvites.map(invite => (
                     <div
                       key={invite.id}
                       style={{
                         background: 'rgba(255, 255, 255, 0.05)',
                         borderRadius: '12px',
                         padding: '20px',
                         border: '1px solid rgba(255, 255, 255, 0.1)'
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
                             background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
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
                               {invite.fromUsername}
                             </div>
                             <div style={{
                               fontSize: '12px',
                               color: getRankColor(invite.fromRank),
                               fontWeight: 'bold',
                               marginBottom: '2px'
                             }}>
                               {invite.fromRank} • {invite.fromElo} ELO
                             </div>
                             <div style={{
                               fontSize: '14px',
                               color: '#ccc',
                               marginBottom: '2px'
                             }}>
                               Invited you to: <strong>{invite.partyName}</strong>
                             </div>
                             <div style={{
                               fontSize: '11px',
                               color: '#666'
                             }}>
                               {formatTimeAgo(invite.sentAt)} • Expires in {Math.ceil((invite.expiresAt.getTime() - Date.now()) / (1000 * 60))}m
                             </div>
                           </div>
                         </div>
                         <div style={{ display: 'flex', gap: '10px' }}>
                           <button
                             onClick={() => handleAcceptInvite(invite.id)}
                             disabled={!!currentParty}
                             style={{
                               background: currentParty ? '#666' : '#4caf50',
                               border: 'none',
                               color: 'white',
                               padding: '8px 16px',
                               borderRadius: '6px',
                               cursor: currentParty ? 'not-allowed' : 'pointer',
                               fontSize: '14px',
                               fontWeight: 'bold'
                             }}
                           >
                             {currentParty ? 'In Party' : '✓ Accept'}
                           </button>
                           <button
                             onClick={() => handleDeclineInvite(invite.id)}
                             style={{
                               background: '#f44336',
                               border: 'none',
                               color: 'white',
                               padding: '8px 16px',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               fontSize: '14px',
                               fontWeight: 'bold'
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

         {/* Create Party Tab */}
         {activeTab === 'create' && (
           <>
             <div style={{
               padding: '20px',
               borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
             }}>
               <h2 style={{ margin: 0, fontSize: '20px' }}>
                 Create New Party
               </h2>
             </div>

             <div style={{
               flex: 1,
               overflowY: 'auto',
               padding: '20px'
             }}>
               {currentParty ? (
                 <div style={{
                   textAlign: 'center',
                   padding: '60px 20px',
                   color: '#666'
                 }}>
                   <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚫</div>
                   <h3 style={{ margin: '0 0 10px 0' }}>Already in a Party</h3>
                   <p>You must leave your current party before creating a new one</p>
                 </div>
               ) : (
                 <div style={{
                   maxWidth: '500px',
                   margin: '0 auto'
                 }}>
                   <div style={{
                     background: 'rgba(255, 255, 255, 0.05)',
                     borderRadius: '12px',
                     padding: '25px'
                   }}>
                     <div style={{ marginBottom: '20px' }}>
                       <label style={{
                         display: 'block',
                         marginBottom: '8px',
                         fontSize: '14px',
                         fontWeight: 'bold'
                       }}>
                         Party Name
                       </label>
                       <input
                         type="text"
                         value={createPartyForm.name}
                         onChange={(e) => setCreatePartyForm({...createPartyForm, name: e.target.value})}
                         placeholder={`${playerData.username}'s Party`}
                         style={{
                           width: '100%',
                           padding: '12px',
                           background: 'rgba(255, 255, 255, 0.1)',
                           border: '1px solid rgba(255, 255, 255, 0.3)',
                           borderRadius: '8px',
                           color: 'white',
                           fontSize: '14px'
                         }}
                       />
                     </div>

                     <div style={{
                       display: 'grid',
                       gridTemplateColumns: '1fr 1fr',
                       gap: '20px',
                       marginBottom: '20px'
                     }}>
                       <div>
                         <label style={{
                           display: 'block',
                           marginBottom: '8px',
                           fontSize: '14px',
                           fontWeight: 'bold'
                         }}>
                           Max Members
                         </label>
                         <select
                           value={createPartyForm.maxMembers}
                           onChange={(e) => setCreatePartyForm({...createPartyForm, maxMembers: parseInt(e.target.value)})}
                           style={{
                             width: '100%',
                             padding: '12px',
                             background: 'rgba(255, 255, 255, 0.1)',
                             border: '1px solid rgba(255, 255, 255, 0.3)',
                             borderRadius: '8px',
                             color: 'white',
                             fontSize: '14px'
                           }}
                         >
                           <option value={2}>2 Players</option>
                           <option value={3}>3 Players</option>
                           <option value={4}>4 Players</option>
                           <option value={6}>6 Players</option>
                           <option value={8}>8 Players</option>
                         </select>
                       </div>

                       <div>
                         <label style={{
                           display: 'block',
                           marginBottom: '8px',
                           fontSize: '14px',
                           fontWeight: 'bold'
                         }}>
                           Game Mode
                         </label>
                         <select
                           value={createPartyForm.gameMode}
                           onChange={(e) => setCreatePartyForm({...createPartyForm, gameMode: e.target.value})}
                           style={{
                             width: '100%',
                             padding: '12px',
                             background: 'rgba(255, 255, 255, 0.1)',
                             border: '1px solid rgba(255, 255, 255, 0.3)',
                             borderRadius: '8px',
                             color: 'white',
                             fontSize: '14px'
                           }}
                         >
                           <option value="Ranked">Ranked</option>
                           <option value="Casual">Casual</option>
                           <option value="Tournament">Tournament</option>
                           <option value="Practice">Practice</option>
                         </select>
                       </div>
                     </div>

                     <div style={{
                       display: 'grid',
                       gridTemplateColumns: '1fr 1fr',
                       gap: '20px',
                       marginBottom: '20px'
                     }}>
                       <div>
                         <label style={{
                           display: 'block',
                           marginBottom: '8px',
                           fontSize: '14px',
                           fontWeight: 'bold'
                         }}>
                           Difficulty
                         </label>
                         <input
                           type="range"
                           min="1"
                           max="100"
                           value={createPartyForm.difficulty}
                           onChange={(e) => setCreatePartyForm({...createPartyForm, difficulty: parseInt(e.target.value)})}
                           style={{
                             width: '100%',
                             marginBottom: '5px'
                           }}
                         />
                         <div style={{
                           textAlign: 'center',
                           fontSize: '12px',
                           color: '#ccc'
                         }}>
                           {createPartyForm.difficulty}
                         </div>
                       </div>

                       <div>
                         <label style={{
                           display: 'block',
                           marginBottom: '8px',
                           fontSize: '14px',
                           fontWeight: 'bold'
                         }}>
                           Region
                         </label>
                         <select
                           value={createPartyForm.region}
                           onChange={(e) => setCreatePartyForm({...createPartyForm, region: e.target.value})}
                           style={{
                             width: '100%',
                             padding: '12px',
                             background: 'rgba(255, 255, 255, 0.1)',
                             border: '1px solid rgba(255, 255, 255, 0.3)',
                             borderRadius: '8px',
                             color: 'white',
                             fontSize: '14px'
                           }}
                         >
                           <option value="NA-East">NA East</option>
                           <option value="NA-West">NA West</option>
                           <option value="EU-West">EU West</option>
                           <option value="Asia">Asia</option>
                         </select>
                       </div>
                     </div>

                     <div style={{ marginBottom: '25px' }}>
                       <label style={{
                         display: 'flex',
                         alignItems: 'center',
                         gap: '10px',
                         fontSize: '14px',
                         fontWeight: 'bold',
                         cursor: 'pointer'
                       }}>
                         <input
                           type="checkbox"
                           checked={createPartyForm.isPublic}
                           onChange={(e) => setCreatePartyForm({...createPartyForm, isPublic: e.target.checked})}
                           style={{ accentColor: '#9c27b0' }}
                         />
                         Public Party (visible to all players)
                       </label>
                     </div>

                     <button
                       onClick={handleCreateParty}
                       style={{
                         width: '100%',
                         padding: '15px',
                         background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                         border: 'none',
                         color: 'white',
                         borderRadius: '8px',
                         cursor: 'pointer',
                         fontSize: '16px',
                         fontWeight: 'bold'
                       }}
                     >
                       🎉 Create Party
                     </button>
                   </div>
                 </div>
               )}
             </div>
           </>
         )}
       </div>
     </div>
   </div>
 );
};

export default PartySystem;