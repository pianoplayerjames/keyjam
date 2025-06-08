import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from './stores/gameStore';

interface ScoreChartProps {
  onReplay: () => void;
  onBackToMenu: () => void;
  onWatchReplay: () => void;
  isVisible: boolean;
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  onComplete?: () => void;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  onComplete
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      countRef.current = value * easeOutQuart;
      setCount(countRef.current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(value);
        if (onComplete) onComplete();
      }
    };

    if (value > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
        setCount(value);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [value, duration, onComplete]);

  const formatNumber = (num: number) => {
    const formatted = num.toFixed(decimals);
    return decimals === 0 ? Math.floor(num).toLocaleString() : formatted;
  };

  return (
    <span>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

const ScoreChart: React.FC<ScoreChartProps> = ({
  onReplay,
  onBackToMenu,
  onWatchReplay,
  isVisible
}) => {
  const finalScore = useGameStore((state) => state.score);
  const maxCombo = useGameStore((state) => state.maxCombo);
  const totalNotes = useGameStore((state) => state.totalNotes);
  const perfectNotes = useGameStore((state) => state.perfectNotes);
  const goodNotes = useGameStore((state) => state.goodNotes);
  const almostNotes = useGameStore((state) => state.almostNotes);
  const missedNotes = useGameStore((state) => state.missedNotes);
  const calculateAccuracy = useGameStore((state) => state.calculateAccuracy);

  const [animationStage, setAnimationStage] = useState(0);
  const [showGrade, setShowGrade] = useState(false);
  const accuracy = calculateAccuracy();

  const calculateGrade = (acc: number): { grade: string; color: string; description: string } => {
    if (acc >= 95) return { grade: 'S', color: '#FFD700', description: 'Perfect!' };
    if (acc >= 90) return { grade: 'A', color: '#00e676', description: 'Excellent!' };
    if (acc >= 80) return { grade: 'B', color: '#4caf50', description: 'Great!' };
    if (acc >= 70) return { grade: 'C', color: '#ffc107', description: 'Good!' };
    if (acc >= 60) return { grade: 'D', color: '#ff9800', description: 'Fair' };
    return { grade: 'F', color: '#f44336', description: 'Try Again' };
  };

  const grade = calculateGrade(accuracy);

  useEffect(() => {
    if (isVisible) {
        setAnimationStage(0);
        setShowGrade(false);
        const stages = [
          () => setAnimationStage(1),
          () => setAnimationStage(2),
          () => setAnimationStage(3),
          () => setAnimationStage(4),
          () => setShowGrade(true)
        ];

        stages.forEach((stage, index) => {
          setTimeout(stage, index * 600);
        });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
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
        maxWidth: '700px',
        width: '95%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        animation: 'slideUp 0.8s ease-out'
      }}>
        <style>
          {`
            @keyframes slideUp {
              from { transform: translateY(50px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes bounceIn {
              0% { transform: scale(0.3); opacity: 0; }
              50% { transform: scale(1.05); }
              70% { transform: scale(0.9); }
              100% { transform: scale(1); opacity: 1; }
            }
            .grade-display {
              animation: bounceIn 1s ease-out;
            }
            .stat-row {
              opacity: 0;
              transform: translateX(-20px);
              transition: all 0.6s ease-out;
            }
            .stat-row.show {
              opacity: 1;
              transform: translateX(0);
            }
          `}
        </style>

        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '20px',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4em', color: '#ffd700' }}>FINAL SCORE</h2>
          <div style={{ 
            fontSize: '2.5em',
            fontWeight: 'bold',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
          }}>
            {animationStage >= 1 && (
              <AnimatedCounter 
                value={finalScore} 
                duration={2}
              />
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div className={`stat-row ${animationStage >= 2 ? 'show' : ''}`} style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '2px solid #ff6b6b',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff6b6b', fontSize: '1.1em' }}>🔥 MAX COMBO</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold' }}>
              {animationStage >= 2 && <AnimatedCounter value={maxCombo} duration={1.2} />}
            </div>
          </div>

          <div className={`stat-row ${animationStage >= 3 ? 'show' : ''}`} style={{
            background: 'rgba(78, 205, 196, 0.1)',
            border: '2px solid #4ecdc4',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#4ecdc4', fontSize: '1.1em' }}>🎵 NOTES HIT</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold' }}>
              {animationStage >= 3 && <AnimatedCounter value={totalNotes - missedNotes} duration={1.2} />}
              <span style={{ fontSize: '0.5em', color: '#ccc' }}>
                /{animationStage >= 3 && <AnimatedCounter value={totalNotes} duration={1.2} />}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div className={`stat-row ${animationStage >= 3 ? 'show' : ''}`} style={{
            background: 'rgba(0, 230, 118, 0.15)',
            borderLeft: '4px solid #00e676',
            padding: '12px 15px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#00e676', fontWeight: 'bold', fontSize: '0.9em' }}>✨ PERFECT</span>
              <span style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {animationStage >= 3 && <AnimatedCounter value={perfectNotes} duration={0.8} />}
              </span>
            </div>
          </div>

          <div className={`stat-row ${animationStage >= 3 ? 'show' : ''}`} style={{
            background: 'rgba(41, 182, 246, 0.15)',
            borderLeft: '4px solid #29b6f6',
            padding: '12px 15px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#29b6f6', fontWeight: 'bold', fontSize: '0.9em' }}>👍 GOOD</span>
              <span style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {animationStage >= 3 && <AnimatedCounter value={goodNotes} duration={0.8} />}
              </span>
            </div>
          </div>

          <div className={`stat-row ${animationStage >= 3 ? 'show' : ''}`} style={{
            background: 'rgba(255, 193, 7, 0.15)',
            borderLeft: '4px solid #ffc107',
            padding: '12px 15px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ffc107', fontWeight: 'bold', fontSize: '0.9em' }}>😐 ALMOST</span>
              <span style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {animationStage >= 3 && <AnimatedCounter value={almostNotes} duration={0.8} />}
              </span>
            </div>
          </div>

          <div className={`stat-row ${animationStage >= 3 ? 'show' : ''}`} style={{
            background: 'rgba(244, 67, 54, 0.15)',
            borderLeft: '4px solid #f44336',
            padding: '12px 15px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#f44336', fontWeight: 'bold', fontSize: '0.9em' }}>❌ MISS</span>
              <span style={{ fontSize: '1.3em', fontWeight: 'bold' }}>
                {animationStage >= 3 && <AnimatedCounter value={missedNotes} duration={0.8} />}
              </span>
            </div>
          </div>
        </div>

        <div className={`stat-row ${animationStage >= 4 ? 'show' : ''}`} style={{
          background: 'rgba(156, 39, 176, 0.1)',
          border: '2px solid #9c27b0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#9c27b0', fontSize: '1.2em' }}>🎯 ACCURACY</h3>
            <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: grade.color }}>
              {animationStage >= 4 && (
                <AnimatedCounter value={accuracy} duration={1.5} suffix="%" decimals={1} />
              )}
            </div>
          </div>

          {showGrade && (
            <div className="grade-display" style={{
              flex: '0 0 auto',
              textAlign: 'center',
              background: `linear-gradient(135deg, ${grade.color}22, ${grade.color}44)`,
              border: `3px solid ${grade.color}`,
              borderRadius: '15px',
              padding: '15px 20px',
            }}>
              <div style={{
                fontSize: '2.5em',
                fontWeight: 'bold',
                color: grade.color,
                textShadow: `0 0 20px ${grade.color}`,
                marginBottom: '5px'
              }}>
                {grade.grade}
              </div>
              <div style={{
                fontSize: '0.9em',
                color: grade.color,
                fontWeight: 'bold'
              }}>
                {grade.description}
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onReplay}
            style={{
              fontSize: '1.2em',
              padding: '12px 30px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            🔄 Play Again
          </button>
          
          <button
            onClick={onWatchReplay}
            style={{
              fontSize: '1.2em',
              padding: '12px 30px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            🎬 Watch Replay
          </button>

          <button
            onClick={onBackToMenu}
            style={{
              fontSize: '1.2em',
              padding: '12px 30px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🏠 Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;