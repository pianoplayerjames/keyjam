// client/src/pages/online/QuickMatch.tsx
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
}

interface MatchmakingState {
  isSearching: boolean;
  timeInQueue: number;
  currentStep: 'searching' | 'found' | 'connecting' | 'ready';
}

const QuickMatch: React.FC<QuickMatchProps> = ({ onBack, onStartGame }) => {
  const [selectedGameMode, setSelectedGameMode] = useState<string>('ranked');
  const [matchmaking, setMatchmaking] = useState<MatchmakingState>({
    isSearching: false,
    timeInQueue: 0,
    currentStep: 'searching'
  });

  const gameModes = [
    {
      id: 'ranked',
      name: 'Ranked',
      description: 'Competitive matches',
      icon: '🏆',
      estimatedWait: '30s',
      playersInQueue: 1247
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Relaxed gameplay',
      icon: '🎮',
      estimatedWait: '15s',
      playersInQueue: 2836
    },
    {
      id: 'speed',
      name: 'Speed',
      description: 'Fast-paced battles',
      icon: '⚡',
      estimatedWait: '45s',
      playersInQueue: 634
    },
    {
      id: 'accuracy',
      name: 'Accuracy',
      description: 'Precision focused',
      icon: '🎯',
      estimatedWait: '1m',
      playersInQueue: 423
    },
    {
      id: 'party',
      name: 'Party',
      description: 'Up to 8 players',
      icon: '🎉',
      estimatedWait: '1m 30s',
      playersInQueue: 892
    },
    {
      id: 'battle-royale',
      name: 'Battle Royale',
      description: '100 players compete',
      icon: '👑',
      estimatedWait: '3m',
      playersInQueue: 4567
    }
  ];

  const selectedMode = gameModes.find(mode => mode.id === selectedGameMode);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (matchmaking.isSearching) {
      interval = setInterval(() => {
        setMatchmaking(prev => {
          const newTime = prev.timeInQueue + 1;
          
          if (newTime === 10) {
            return { ...prev, timeInQueue: newTime, currentStep: 'found' };
          } else if (newTime === 20) {
            return { ...prev, timeInQueue: newTime, currentStep: 'connecting' };
          } else if (newTime === 30) {
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

  const handleStartMatchmaking = () => {
    setMatchmaking({
      isSearching: true,
      timeInQueue: 0,
      currentStep: 'searching'
    });
  };

  const handleCancelMatchmaking = () => {
    setMatchmaking({
      isSearching: false,
      timeInQueue: 0,
      currentStep: 'searching'
    });
  };

  const handleAcceptMatch = () => {
    onStartGame({
      mode: 'online',
      subMode: selectedGameMode,
      matchType: 'quick-match'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  // Matchmaking Screen
  if (matchmaking.isSearching) {
    return (
      <div className="min-h-screen pt-8 pb-12 relative">
        {/* Floating Back Button */}
        <button
          onClick={handleCancelMatchmaking}
          className="fixed top-6 left-6 z-50 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg text-white font-medium transition-colors shadow-lg"
        >
          ← Cancel Search
        </button>

        <CenteredContainer maxWidth="md" accountForLeftNav={true}>
          <div className="text-center pt-16">
            <div className="bg-slate-800/50 rounded-2xl p-12">
              <div className="text-8xl mb-8">
                {matchmaking.currentStep === 'searching' && '🔍'}
                {matchmaking.currentStep === 'found' && '👥'}
                {matchmaking.currentStep === 'connecting' && '🔄'}
                {matchmaking.currentStep === 'ready' && '✅'}
              </div>

              <h2 className="text-4xl font-bold text-white mb-6">
                {matchmaking.currentStep === 'searching' && 'Finding Players...'}
                {matchmaking.currentStep === 'found' && 'Players Found!'}
                {matchmaking.currentStep === 'connecting' && 'Connecting...'}
                {matchmaking.currentStep === 'ready' && 'Match Ready!'}
              </h2>

              <div className="text-3xl font-bold text-blue-400 mb-8">
                {formatTime(matchmaking.timeInQueue)}
              </div>

              <div className="text-gray-400 mb-8 text-lg">
                {selectedMode?.name} • ~{selectedMode?.estimatedWait} average wait
                {selectedGameMode === 'battle-royale' && (
                  <div className="text-orange-400 mt-2">
                    100 players needed - filling lobby...
                  </div>
                )}
              </div>

              {matchmaking.currentStep === 'ready' && (
                <div className="space-y-4">
                  <p className="text-xl text-green-400 mb-8">
                    {selectedGameMode === 'battle-royale' ? 'Lobby full! 100 players ready!' : 'All players ready!'}
                  </p>
                  <div className="flex gap-6 justify-center">
                    <button
                      onClick={handleAcceptMatch}
                      className="bg-green-600 hover:bg-green-700 px-10 py-5 rounded-xl text-white font-bold text-xl transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={handleCancelMatchmaking}
                      className="bg-red-600 hover:bg-red-700 px-10 py-5 rounded-xl text-white font-bold text-xl transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  // Main Screen
  return (
    <div className="min-h-screen pt-8 pb-12 relative">
      {/* Floating Back Button */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white font-medium transition-colors shadow-lg"
      >
        ← Back
      </button>

      {/* Floating Find Match Button */}
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-600/50">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{selectedMode?.icon}</span>
            <div className="text-left">
              <div className="text-xl font-bold text-white">{selectedMode?.name}</div>
              <div className="text-gray-400 text-sm">
                ~{selectedMode?.estimatedWait} • {selectedMode?.playersInQueue.toLocaleString()} queued
              </div>
              {selectedGameMode === 'battle-royale' && (
                <div className="text-orange-400 text-xs font-bold">
                  🔥 100 PLAYERS
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleStartMatchmaking}
            className={`w-full py-4 px-8 rounded-xl text-white font-bold text-xl transition-all duration-200 hover:scale-105 shadow-lg ${
              selectedGameMode === 'battle-royale' 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {selectedGameMode === 'battle-royale' ? '👑 Join Battle' : '🚀 Find Match'}
          </button>
        </div>
      </div>

      <CenteredContainer maxWidth="xl" accountForLeftNav={true}>
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quick Match
            </span>
          </h1>
          <p className="text-gray-400 text-xl">
            Choose your game mode and jump into action
          </p>
        </div>

        {/* Game Mode Selection */}
        <div className="mr-80"> {/* Add right margin to avoid floating button */}
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Game Modes</h2>
          <div className="grid grid-cols-3 gap-6">
            {gameModes.map((mode) => (
              <div
                key={mode.id}
                onClick={() => setSelectedGameMode(mode.id)}
                className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                  selectedGameMode === mode.id
                    ? mode.id === 'battle-royale'
                      ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                      : 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{mode.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{mode.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{mode.description}</p>
                  <div className="text-sm">
                    <div className={`font-semibold ${
                      mode.id === 'battle-royale' ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      ~{mode.estimatedWait}
                    </div>
                    <div className="text-gray-500">{mode.playersInQueue.toLocaleString()} queued</div>
                    {mode.id === 'battle-royale' && (
                      <div className="text-orange-400 text-sm mt-2 font-bold">
                        100 PLAYERS
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-16 text-center mr-80">
          <div className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-8 inline-block">
            <div className="text-blue-400 font-bold mb-3 text-lg">💡 Pro Tip</div>
            <div className="text-gray-300">
              {selectedGameMode === 'battle-royale' 
                ? 'Battle Royale takes longer to fill but offers the ultimate competitive experience!'
                : 'Select your preferred game mode and use the floating Find Match button!'
              }
            </div>
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
};

export default QuickMatch;