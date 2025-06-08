// ReplayBrowser.tsx
import React, { useState } from 'react';
import { useReplayStore } from '../stores/replayStore';
import { ReplayData } from './ReplayRecorder';

interface ReplayBrowserProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SavedReplay extends ReplayData {
  id: string;
  timestamp: string;
}

const ReplayBrowser: React.FC<ReplayBrowserProps> = ({ isVisible, onClose }) => {
  const { savedReplays, deleteReplay, playReplay } = useReplayStore();
  const [sortBy, setSortBy] = useState<'timestamp' | 'score' | 'accuracy'>('timestamp');

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getModeLabel = (replay: SavedReplay) => {
    if (replay.gameConfig.mode === 'career') return 'Career';
    if (replay.gameConfig.subMode === 'time') return 'Time Attack';
    if (replay.gameConfig.subMode === 'score') return 'Score Challenge';
    return 'Practice';
  };

  const getGrade = (accuracy: number) => {
    if (accuracy >= 95) return { grade: 'S', color: '#FFD700' };
    if (accuracy >= 90) return { grade: 'A', color: '#00e676' };
    if (accuracy >= 80) return { grade: 'B', color: '#4caf50' };
    if (accuracy >= 70) return { grade: 'C', color: '#ffc107' };
    if (accuracy >= 60) return { grade: 'D', color: '#ff9800' };
    return { grade: 'F', color: '#f44336' };
  };

  const sortedReplays = [...savedReplays].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.metadata.finalScore - a.metadata.finalScore;
      case 'accuracy':
        return b.metadata.accuracy - a.metadata.accuracy;
      case 'timestamp':
      default:
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const handleWatchReplay = (replay: SavedReplay) => {
    playReplay(replay);
    // The main App component will now be responsible for showing the ReplayPlayer
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        border: '3px solid #fff',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '900px',
        width: '95%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '2.5em',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🎬 Replay Browser
          </h1>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Sort Controls */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '25px',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 'bold' }}>Sort by:</span>
          {(['timestamp', 'score', 'accuracy'] as const).map(option => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              style={{
                background: sortBy === option ? '#4caf50' : 'rgba(255, 255, 255, 0.1)',
                color: sortBy === option ? 'black' : 'white',
                border: `2px solid ${sortBy === option ? '#4caf50' : 'rgba(255, 255, 255, 0.3)'}`,
                borderRadius: '8px',
                padding: '8px 15px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {option === 'timestamp' ? 'Date' : option}
            </button>
          ))}
        </div>

        {/* Replay List */}
        {sortedReplays.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '4em', marginBottom: '20px' }}>🎮</div>
            <h2 style={{ margin: '0 0 10px 0' }}>No Replays Found</h2>
            <p>Complete a game to record your first replay!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '15px'
          }}>
            {sortedReplays.map((replay) => {
              const grade = getGrade(replay.metadata.accuracy);
              
              return (
                <div
                  key={replay.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '15px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    {/* Rank/Grade */}
                    <div style={{
                      background: `linear-gradient(135deg, ${grade.color}22, ${grade.color}44)`,
                      border: `2px solid ${grade.color}`,
                      borderRadius: '10px',
                      padding: '10px 15px',
                      textAlign: 'center',
                      minWidth: '60px'
                    }}>
                      <div style={{
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        color: grade.color
                      }}>
                        {grade.grade}
                      </div>
                    </div>

                    {/* Replay Info */}
                    <div>
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          background: '#2196f3',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8em',
                          fontWeight: 'bold'
                        }}>
                          {getModeLabel(replay)}
                        </span>
                        <span style={{ color: '#999', fontSize: '0.9em' }}>
                          {formatDate(replay.timestamp)}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '15px',
                        fontSize: '0.9em'
                      }}>
                        <div>
                          <div style={{ color: '#ffd700', fontWeight: 'bold' }}>
                            Score: {replay.metadata.finalScore.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#4ecdc4' }}>
                            Combo: {replay.metadata.maxCombo}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#ff6b6b' }}>
                            Accuracy: {replay.metadata.accuracy.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#9c27b0' }}>
                            Duration: {formatDuration(replay.duration)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleWatchReplay(replay)}
                        style={{
                          background: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 15px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        🎬 Watch
                      </button>
                      
                      <button
                        onClick={() => deleteReplay(replay.id)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 15px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplayBrowser;