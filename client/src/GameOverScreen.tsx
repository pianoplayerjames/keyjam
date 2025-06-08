// src/GameOverScreen.tsx
import React from 'react';
import { useGameStore } from './stores/gameStore';

interface GameOverScreenProps {
  onRestart: () => void;
  onBackToMenu?: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ 
  onRestart, 
  onBackToMenu 
}) => {
  const { gameConfig, score, combo } = useGameStore();
  const isTimeMode = gameConfig.subMode === 'time';
  const title = isTimeMode ? 'TIME\'S UP!' : 'GAME OVER';
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      zIndex: 100,
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '4em', 
        margin: '0 0 20px 0',
        color: isTimeMode ? '#ffc107' : '#f44336',
        textShadow: '2px 2px 4px black'
      }}>
        {title}
      </h1>
      
      <div style={{
        fontSize: '2em',
        marginBottom: '40px',
        lineHeight: '1.5'
      }}>
        <div>Final Score: {Math.floor(score)}</div>
        <div>Best Combo: {combo}</div>
        {isTimeMode && <div style={{ color: '#4caf50' }}>Survived full {gameConfig.timeLimit / 60} minutes!</div>}
      </div>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        flexDirection: 'column'
      }}>
        <button 
          onClick={onRestart}
          style={{
            fontSize: '1.5em',
            padding: '15px 30px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}
        >
          Play Again
        </button>
        
        {onBackToMenu && (
          <button 
            onClick={onBackToMenu}
            style={{
              fontSize: '1.2em',
              padding: '10px 25px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'white';
            }}
          >
            Back to Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default GameOverScreen;