// client/src/ComplexityUI.tsx
import React from 'react';
import { useGameStore } from './stores/gameStore';

interface ComplexityUIProps {
  showDetails?: boolean;
}

const ComplexityUI: React.FC<ComplexityUIProps> = ({ 
  showDetails = false 
}) => {
  const { complexity, setComplexity, gameConfig } = useGameStore();
  const isCareerMode = gameConfig.mode === 'career';

  // Don't show complexity UI in career mode
  if (isCareerMode) return null;

  const getComplexityLabel = (level: number): string => {
    if (level <= 5) return 'Tutorial';
    if (level <= 15) return 'Super Easy';
    if (level <= 25) return 'Easy';
    if (level <= 35) return 'Beginner';
    if (level <= 45) return 'Casual';
    if (level <= 55) return 'Intermediate';
    if (level <= 65) return 'Moderate';
    if (level <= 75) return 'Advanced';
    if (level <= 85) return 'Expert';
    if (level <= 95) return 'Master';
    return 'World Class';
  };

  const getComplexityColor = (level: number): string => {
    if (level <= 15) return '#4caf50';
    if (level <= 35) return '#8bc34a';
    if (level <= 55) return '#ffc107';
    if (level <= 75) return '#ff9800';
    if (level <= 90) return '#f44336';
    return '#9c27b0';
  };

  const getComplexityDescription = (level: number): string => {
    if (level <= 5) return 'Very slow, huge timing windows, single notes only';
    if (level <= 15) return 'Slow speed, generous timing, simple patterns';
    if (level <= 25) return 'Easy pace, forgiving timing, basic rhythms';
    if (level <= 35) return 'Comfortable speed, good timing windows';
    if (level <= 45) return 'Normal pace, introducing chords';
    if (level <= 55) return 'Moderate challenge, complex patterns';
    if (level <= 65) return 'Faster pace, tighter timing';
    if (level <= 75) return 'Advanced techniques, precise timing';
    if (level <= 85) return 'Expert patterns, very precise timing';
    if (level <= 95) return 'Master-level complexity, frame-perfect timing';
    return 'World-class professional difficulty';
  };

  const getDifficultyIcon = (level: number): string => {
    if (level <= 15) return '🟢';
    if (level <= 35) return '🟡';
    if (level <= 55) return '🟠';
    if (level <= 75) return '🔴';
    if (level <= 90) return '🟣';
    return '⭐';
  };

  const getSpeedIndicator = (level: number): string => {
    if (level <= 10) return '🐌 Very Slow';
    if (level <= 25) return '🚶 Slow';
    if (level <= 45) return '🏃 Normal';
    if (level <= 70) return '🏃‍♂️ Fast';
    if (level <= 90) return '🚀 Very Fast';
    return '⚡ Lightning';
  };

  const getTimingIndicator = (level: number): string => {
    if (level <= 20) return '🎯 Very Forgiving';
    if (level <= 40) return '🎯 Forgiving';
    if (level <= 60) return '🎯 Moderate';
    if (level <= 80) return '🎯 Precise';
    return '🎯 Frame Perfect';
  };

  return (
    <div style={{
      position: 'absolute',
      top: '100px',
      right: '20px',
      width: '350px',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderRadius: '20px',
      border: '3px solid #fff',
      padding: '25px',
      color: 'white',
      zIndex: 10,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        textAlign: 'center',
        fontSize: '1.8em',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
      }}>
        🎵 Complexity Level
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="range"
          min="1"
          max="100"
          value={complexity}
          onChange={(e) => setComplexity(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '12px',
            background: `linear-gradient(to right, 
              #4caf50 0%, 
              #8bc34a 15%, 
              #ffc107 35%, 
              #ff9800 55%, 
              #f44336 75%, 
              #9c27b0 90%, 
              #673ab7 100%)`,
            borderRadius: '6px',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        />
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        padding: '20px',
        background: `linear-gradient(135deg, ${getComplexityColor(complexity)}22, ${getComplexityColor(complexity)}44)`,
        borderRadius: '15px',
        border: `2px solid ${getComplexityColor(complexity)}`,
        boxShadow: `0 4px 15px ${getComplexityColor(complexity)}33`
      }}>
        <div style={{ 
          fontSize: '3em', 
          fontWeight: 'bold',
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
          marginBottom: '5px'
        }}>
          {getDifficultyIcon(complexity)} {complexity}
        </div>
        <div style={{ 
          fontSize: '1.4em',
          fontWeight: 'bold',
          color: getComplexityColor(complexity),
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
        }}>
          {getComplexityLabel(complexity)}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9em'
        }}>
          <span style={{ fontWeight: 'bold' }}>Speed:</span>
          <span style={{ color: getComplexityColor(complexity) }}>
            {getSpeedIndicator(complexity)}
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9em'
        }}>
          <span style={{ fontWeight: 'bold' }}>Timing:</span>
          <span style={{ color: getComplexityColor(complexity) }}>
            {getTimingIndicator(complexity)}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9em'
        }}>
          <span style={{ fontWeight: 'bold' }}>Patterns:</span>
          <span style={{ color: getComplexityColor(complexity) }}>
            {complexity <= 20 ? '🔵 Single Notes' :
             complexity <= 40 ? '🟡 Basic Chords' :
             complexity <= 60 ? '🟠 Complex Patterns' :
             complexity <= 80 ? '🔴 Advanced Techniques' :
             '🟣 Professional Level'}
          </span>
        </div>
      </div>

      {showDetails && (
        <div style={{ 
          fontSize: '0.85em', 
          lineHeight: '1.5',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          borderLeft: `4px solid ${getComplexityColor(complexity)}`
        }}>
          {getComplexityDescription(complexity)}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '10px',
        marginBottom: '15px'
      }}>
        {[
          { label: 'Tutorial', value: 3, icon: '🎓' },
          { label: 'Easy', value: 15, icon: '🟢' },
          { label: 'Normal', value: 35, icon: '🟡' },
          { label: 'Hard', value: 55, icon: '🟠' },
          { label: 'Expert', value: 75, icon: '🔴' },
          { label: 'Master', value: 90, icon: '⭐' }
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => setComplexity(preset.value)}
            style={{
              padding: '12px 8px',
              backgroundColor: complexity === preset.value ? 
                getComplexityColor(preset.value) : 
                'rgba(255, 255, 255, 0.1)',
              color: complexity === preset.value ? '#000' : '#fff',
              border: `2px solid ${complexity === preset.value ? 
                getComplexityColor(preset.value) : 
                'rgba(255, 255, 255, 0.3)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.8em',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              textShadow: complexity === preset.value ? 'none' : '1px 1px 2px rgba(0, 0, 0, 0.8)',
              transform: complexity === preset.value ? 'scale(1.05)' : 'scale(1)',
              boxShadow: complexity === preset.value ? 
                `0 4px 15px ${getComplexityColor(preset.value)}44` : 
                '0 2px 5px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (complexity !== preset.value) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (complexity !== preset.value) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {preset.icon} {preset.label}
          </button>
        ))}
      </div>

      {complexity >= 80 && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          borderRadius: '12px',
          fontSize: '0.8em',
          border: '2px solid #9c27b0'
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            color: '#e1bee7',
            marginBottom: '8px',
            fontSize: '1.1em'
          }}>
            ⚡ Professional Level ⚡
          </div>
          <div style={{ color: '#ce93d8', lineHeight: '1.4' }}>
            • Frame-perfect timing required<br/>
            • Complex polyrhythms & patterns<br/>
            • Cross-hand techniques<br/>
            • Rapid-fire sequences<br/>
            • Years of practice recommended
          </div>
        </div>
      )}

      {complexity <= 25 && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderRadius: '12px',
          fontSize: '0.8em',
          border: '2px solid #4caf50'
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            color: '#a5d6a7',
            marginBottom: '8px',
            fontSize: '1.1em'
          }}>
            💡 Beginner Tips
          </div>
          <div style={{ color: '#c8e6c9', lineHeight: '1.4' }}>
            • Focus on timing over speed<br/>
            • Watch the hit zone indicators<br/>
            • Use keys 1-5 on your keyboard<br/>
            • Take breaks to avoid fatigue
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplexityUI;