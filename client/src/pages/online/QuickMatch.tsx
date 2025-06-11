import React, { useState, useEffect } from 'react';
import { CenteredContainer } from '@/shared/components/Layout';

interface QuickMatchProps {
  onBack: () => void;
  onStartGame: (config: any) => void;
}

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  estimatedWait: string;
  playersInQueue: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  reward?: string;
}

interface CustomChallenge {
  id: string;
  title: string;
  description: string;
  creator: string;
  difficulty: number;
  players: number;
  maxPlayers: number;
  tags: string[];
  timeLeft: string;
  reward: string;
  icon: string;
}

interface MatchmakingState {
  isSearching: boolean;
  timeInQueue: number;
  currentStep: 'searching' | 'found' | 'connecting' | 'ready';
  selectedMode: string;
}

const QuickMatch: React.FC<QuickMatchProps> = ({ onBack, onStartGame }) => {
  const [activeSection, setActiveSection] = useState<'modes' | 'challenges'>('modes');
  const [showWCTTooltip, setShowWCTTooltip] = useState(false);
  const [matchmaking, setMatchmaking] = useState<MatchmakingState>({
    isSearching: false,
    timeInQueue: 0,
    currentStep: 'searching',
    selectedMode: ''
  });

  const gameModes: GameMode[] = [
    {
      id: 'battle-royale',
      name: 'Battle Royale',
      description: '100 players, one winner takes all',
      icon: '👑',
      estimatedWait: '2m',
      playersInQueue: 4567,
      difficulty: 'Expert',
      reward: '1x WCT Ticket'
    },
    {
      id: 'ranked',
      name: 'Ranked',
      description: 'Competitive ranked matches',
      icon: '🏆',
      estimatedWait: '30s',
      playersInQueue: 1247,
      difficulty: 'Hard',
      reward: 'ELO Points'
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Relaxed gameplay',
      icon: '🎮',
      estimatedWait: '15s',
      playersInQueue: 2836,
      difficulty: 'Medium'
    },
    {
      id: 'speed',
      name: 'Speed Battle',
      description: 'Fast-paced 3-minute matches',
      icon: '⚡',
      estimatedWait: '45s',
      playersInQueue: 634,
      difficulty: 'Expert',
      reward: 'Speed Tokens'
    },
    {
      id: 'accuracy',
      name: 'Accuracy Arena',
      description: 'Precision-focused gameplay',
      icon: '🎯',
      estimatedWait: '1m',
      playersInQueue: 423,
      difficulty: 'Hard',
      reward: 'Accuracy Badges'
    },
    {
      id: 'party',
      name: 'Party Mix',
      description: 'Fun 4-8 player battles',
      icon: '🎉',
      estimatedWait: '1m 30s',
      playersInQueue: 892,
      difficulty: 'Easy',
      reward: 'Party Points'
    }
  ];

  const customChallenges: CustomChallenge[] = [
    {
      id: 'challenge_1',
      title: 'Perfect Accuracy Duel',
      description: 'First to miss a note loses instantly',
      creator: 'RhythmGod',
      difficulty: 95,
      players: 3,
      maxPlayers: 4,
      tags: ['accuracy', 'hardcore'],
      timeLeft: '2h 15m',
      reward: '1000 XP',
      icon: '💎'
    },
    {
      id: 'challenge_2',
      title: 'Speed Demon Challenge',
      description: 'Increasingly fast songs, survive as long as possible',
      creator: 'SpeedMaster',
      difficulty: 88,
      players: 1,
      maxPlayers: 8,
      tags: ['speed', 'survival'],
      timeLeft: '45m',
      reward: '750 XP',
      icon: '🔥'
    },
    {
      id: 'challenge_3',
      title: 'Blind Beat Battle',
      description: 'Play with notes hidden after they spawn',
      creator: 'ShadowPlayer',
      difficulty: 78,
      players: 6,
      maxPlayers: 6,
      tags: ['blind', 'memory'],
      timeLeft: '1h 30m',
      reward: '500 XP',
      icon: '👻'
    },
    {
      id: 'challenge_4',
      title: 'Combo Chain Championship',
      description: 'Maintain the longest combo streak',
      creator: 'ComboKing',
      difficulty: 82,
      players: 2,
      maxPlayers: 6,
      tags: ['combo', 'endurance'],
      timeLeft: '3h 45m',
      reward: '1250 XP',
      icon: '⚡'
    },
    {
      id: 'challenge_5',
      title: 'Retro Remix Rumble',
      description: 'Classic arcade songs only',
      creator: 'RetroGamer',
      difficulty: 65,
      players: 4,
      maxPlayers: 8,
      tags: ['retro', 'classic'],
      timeLeft: '5h 20m',
      reward: '400 XP',
      icon: '🕹️'
    },
    {
      id: 'challenge_6',
      title: 'Chaos Mode Mayhem',
      description: 'Random modifiers applied every 30 seconds',
      creator: 'ChaosLord',
      difficulty: 91,
      players: 0,
      maxPlayers: 4,
      tags: ['chaos', 'random'],
      timeLeft: '1h 10m',
      reward: '850 XP',
      icon: '🌪️'
    },
    {
      id: 'challenge_7',
      title: 'Mirror Master Challenge',
      description: 'Notes come from both sides simultaneously',
      creator: 'MirrorMage',
      difficulty: 89,
      players: 2,
      maxPlayers: 4,
      tags: ['mirror', 'extreme'],
      timeLeft: '4h 30m',
      reward: '900 XP',
      icon: '🪞'
    },
    {
      id: 'challenge_8',
      title: 'Minimalist Madness',
      description: 'Only basic notes, no visual effects',
      creator: 'PurePlayer',
      difficulty: 73,
      players: 5,
      maxPlayers: 8,
      tags: ['minimalist', 'pure'],
      timeLeft: '2h 45m',
      reward: '600 XP',
      icon: '⚪'
    }
  ];

  const getDifficultyColor = (difficulty: GameMode['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      accuracy: 'bg-blue-600/20 text-blue-300',
      speed: 'bg-red-600/20 text-red-300',
      hardcore: 'bg-purple-600/20 text-purple-300',
      survival: 'bg-orange-600/20 text-orange-300',
      blind: 'bg-slate-600/20 text-slate-300',
      memory: 'bg-pink-600/20 text-pink-300',
      combo: 'bg-yellow-600/20 text-yellow-300',
      endurance: 'bg-emerald-600/20 text-emerald-300',
      retro: 'bg-amber-600/20 text-amber-300',
      classic: 'bg-brown-600/20 text-brown-300',
      chaos: 'bg-red-800/20 text-red-200',
      random: 'bg-violet-600/20 text-violet-300',
      mirror: 'bg-cyan-600/20 text-cyan-300',
      extreme: 'bg-red-900/20 text-red-100',
      minimalist: 'bg-slate-500/20 text-slate-200',
      pure: 'bg-white/10 text-white'
    };
    return colors[tag] || 'bg-gray-600/20 text-gray-300';
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (matchmaking.isSearching) {
      interval = setInterval(() => {
        setMatchmaking(prev => {
          const newTime = prev.timeInQueue + 1;
          
          if (newTime === 8) {
            return { ...prev, timeInQueue: newTime, currentStep: 'found' };
          } else if (newTime === 15) {
            return { ...prev, timeInQueue: newTime, currentStep: 'connecting' };
          } else if (newTime === 22) {
            return { ...prev, timeInQueue: newTime, currentStep: 'ready' };
          }
          
          return { ...prev, timeInQueue: newTime };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [matchmaking.isSearching]);

  const handleStartMatchmaking = (modeId: string) => {
    setMatchmaking({
      isSearching: true,
      timeInQueue: 0,
      currentStep: 'searching',
      selectedMode: modeId
    });
  };

  const handleCancelMatchmaking = () => {
    setMatchmaking({
      isSearching: false,
      timeInQueue: 0,
      currentStep: 'searching',
      selectedMode: ''
    });
  };

  const handleAcceptMatch = () => {
    onStartGame({
      mode: 'online',
      subMode: matchmaking.selectedMode,
      matchType: 'quick-match'
    });
  };

  const handleJoinChallenge = (challengeId: string) => {
    onStartGame({
      mode: 'custom-challenge',
      challengeId,
      matchType: 'custom'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  // Matchmaking Screen
  if (matchmaking.isSearching) {
    const selectedMode = gameModes.find(mode => mode.id === matchmaking.selectedMode);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <CenteredContainer maxWidth="lg" accountForLeftNav={true} className="h-screen flex items-center justify-center">
          <div className="text-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative bg-slate-800/80 backdrop-blur-lg rounded-3xl p-12 border border-slate-600/50 shadow-2xl">
              <div className="text-8xl mb-6 animate-bounce">
                {matchmaking.currentStep === 'searching' && '🔍'}
                {matchmaking.currentStep === 'found' && '👥'}
                {matchmaking.currentStep === 'connecting' && '🔄'}
                {matchmaking.currentStep === 'ready' && '✅'}
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                {matchmaking.currentStep === 'searching' && 'Searching for Players...'}
                {matchmaking.currentStep === 'found' && 'Players Found!'}
                {matchmaking.currentStep === 'connecting' && 'Connecting to Match...'}
                {matchmaking.currentStep === 'ready' && 'Match Ready!'}
              </h2>

              <div className="text-2xl font-bold text-blue-400 mb-6">
                {formatTime(matchmaking.timeInQueue)}
              </div>

              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="text-3xl">{selectedMode?.icon}</span>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">{selectedMode?.name}</div>
                  <div className="text-gray-400 text-sm">
                    ~{selectedMode?.estimatedWait} • {selectedMode?.playersInQueue.toLocaleString()} in queue
                  </div>
                </div>
              </div>

              {matchmaking.currentStep === 'ready' && (
                <div className="space-y-4">
                  <p className="text-lg text-green-400 mb-6">
                    All players ready! Starting in 3 seconds...
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleAcceptMatch}
                      className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 hover:scale-105"
                    >
                      Accept Match
                    </button>
                    <button
                      onClick={handleCancelMatchmaking}
                      className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 hover:scale-105"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              {matchmaking.currentStep !== 'ready' && (
                <button
                  onClick={handleCancelMatchmaking}
                  className="bg-slate-600 hover:bg-slate-500 px-6 py-3 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel Search
                </button>
              )}
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  // Main Pool Layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <CenteredContainer maxWidth="xl" accountForLeftNav={true}>
        <div className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 px-4 py-2 rounded-lg text-white font-medium transition-colors border border-slate-600/50"
              >
                ← Back
              </button>
              
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Match Pool
                </h1>
                <p className="text-gray-400 mt-1">Jump into the action instantly</p>
              </div>
            </div>

            {/* Section Toggle */}
            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-600/50">
              <button
                onClick={() => setActiveSection('modes')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeSection === 'modes'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Quick Modes
              </button>
              <button
                onClick={() => setActiveSection('challenges')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeSection === 'challenges'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Custom Challenges
              </button>
            </div>
          </div>

          {/* Quick Modes Section */}
          {activeSection === 'modes' && (
            <div className="space-y-6">
              {/* Featured Mode - Battle Royale */}
              <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-2 border-orange-500/40 rounded-2xl p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-7xl animate-pulse">{gameModes[0].icon}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-white">{gameModes[0].name}</h2>
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                          HOT
                        </span>
                      </div>
                      <p className="text-gray-300 text-lg mb-4">{gameModes[0].description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">⚡</span>
                          <span className="text-green-400 font-bold">~{gameModes[0].estimatedWait} avg wait</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">👥</span>
                          <span className="text-blue-400 font-bold">{gameModes[0].playersInQueue.toLocaleString()} in queue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-400">🔥</span>
                          <span className={`font-bold ${getDifficultyColor(gameModes[0].difficulty)}`}>
                            {gameModes[0].difficulty} Difficulty
                          </span>
                        </div>
                        {gameModes[0].reward && (
                          <div className="bg-yellow-600/30 text-yellow-300 px-3 py-1 rounded-full font-bold flex items-center gap-2 relative">
                            🎫 {gameModes[0].reward}
                            <button
                              onMouseEnter={() => setShowWCTTooltip(true)}
                              onMouseLeave={() => setShowWCTTooltip(false)}
                              className="w-4 h-4 bg-blue-500 text-white rounded-full text-xs font-bold hover:bg-blue-400 transition-colors flex items-center justify-center"
                            >
                              ?
                            </button>
                            {showWCTTooltip && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                                <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 text-sm text-white shadow-2xl max-w-xs">
                                  <div className="font-bold text-yellow-300 mb-2">Weekly Cash Tournament (WCT)</div>
                                  <div className="text-gray-300 leading-relaxed">
                                    A premium tournament held every Sunday with real cash prizes. 
                                    Entry requires a WCT ticket. Top 16 players share a $10,000 prize pool!
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartMatchmaking(gameModes[0].id)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-10 py-5 rounded-xl text-white font-bold text-xl transition-all duration-200 hover:scale-110 shadow-2xl border-2 border-orange-400/50"
                  >
                    👑 JOIN BATTLE
                  </button>
                </div>
              </div>

              {/* Other Modes - Horizontal List */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎮</span> Other Game Modes
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {gameModes.slice(1).map((mode) => (
                    <div
                      key={mode.id}
                      className="bg-slate-800/40 border border-slate-600/50 rounded-xl px-6 py-4 hover:bg-slate-700/40 transition-all duration-200 flex items-center justify-between group hover:border-slate-500/70"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{mode.icon}</span>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-white">{mode.name}</h4>
                            <span className={`text-sm font-bold ${getDifficultyColor(mode.difficulty)}`}>
                              {mode.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{mode.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="text-green-400 font-bold">~{mode.estimatedWait}</div>
                            <div className="text-gray-500 text-xs">avg wait</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-blue-400 font-bold">{mode.playersInQueue.toLocaleString()}</div>
                            <div className="text-gray-500 text-xs">in queue</div>
                          </div>
                          
                          {mode.reward && (
                            <div className="text-center">
                              <div className="text-yellow-400 font-bold">{mode.reward}</div>
                              <div className="text-gray-500 text-xs">reward</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleStartMatchmaking(mode.id)}
                        className="ml-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        Find Match
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-lg">🟢</span>
                      <span className="text-sm text-gray-400">
                        <span className="text-green-400 font-bold">{gameModes.reduce((sum, mode) => sum + mode.playersInQueue, 0).toLocaleString()}</span> players online
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 text-lg">⚡</span>
                      <span className="text-sm text-gray-400">
                        Average wait time: <span className="text-blue-400 font-bold">{Math.round(gameModes.reduce((sum, mode) => sum + parseInt(mode.estimatedWait), 0) / gameModes.length)}s</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 text-lg">🎯</span>
                      <span className="text-sm text-gray-400">
                        Peak hours: <span className="text-purple-400 font-bold">6PM - 11PM EST</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-bold text-sm">All servers online</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Challenges Section */}
          {activeSection === 'challenges' && (
            <div className="space-y-6">
              {/* Create Challenge Button */}
              <div className="text-center">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                  ➕ Create Custom Challenge
                </button>
              </div>

              {/* Challenges List - Single Line Items */}
              <div className="space-y-2">
                {customChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 hover:bg-slate-700/50 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{challenge.icon}</span>
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-bold">{challenge.title}</span>
                        <span className="text-gray-400 text-sm ml-2">- {challenge.description}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm flex-shrink-0">
                        <span className="text-gray-400">by {challenge.creator}</span>
                        
                        <div className="flex gap-1">
                          {challenge.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className={`px-2 py-1 rounded text-xs ${getTagColor(tag)}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <span className="text-orange-400 font-bold">Diff: {challenge.difficulty}</span>
                        
                        <span className="flex items-center gap-1">
                          <span>👥</span>
                          <span className="text-white font-medium">
                            {challenge.players}/{challenge.maxPlayers}
                          </span>
                        </span>
                        
                        <span className="text-gray-400">{challenge.timeLeft}</span>
                        
                        <span className="text-yellow-400 font-bold">{challenge.reward}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      disabled={challenge.players >= challenge.maxPlayers}
                      className={`ml-4 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 flex-shrink-0 ${
                        challenge.players >= challenge.maxPlayers
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105'
                      }`}
                    >
                      {challenge.players >= challenge.maxPlayers ? 'Full' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats Footer */}
          <div className="mt-12 bg-slate-800/30 border border-slate-600/30 rounded-xl p-6">
            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {gameModes.reduce((sum, mode) => sum + mode.playersInQueue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Players in Queue</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {customChallenges.length}
                </div>
                <div className="text-sm text-gray-400">Active Challenges</div>
              </div>
<div>
               <div className="text-2xl font-bold text-purple-400">
                 {Math.round(gameModes.reduce((sum, mode) => sum + parseInt(mode.estimatedWait), 0) / gameModes.length)}s
               </div>
               <div className="text-sm text-gray-400">Avg Wait Time</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-orange-400">
                 {customChallenges.reduce((sum, challenge) => sum + challenge.players, 0)}
               </div>
               <div className="text-sm text-gray-400">Players in Challenges</div>
             </div>
           </div>
         </div>
       </div>
     </CenteredContainer>
   </div>
 );
};

export default QuickMatch;