// client/src/TimeUI.tsx
import React from 'react';
import { useGameStore } from './stores/gameStore';

const TimeUI: React.FC = () => {
  const { timeLeft, score, combo, gameConfig } = useGameStore();
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  
  const timeBarColor = timeLeft > 60 ? '#4caf50' : timeLeft > 30 ? '#ffc107' : '#f44336';
  const timePercentage = gameConfig.timeLimit > 0 ? (timeLeft / gameConfig.timeLimit) * 100 : 100;

  return (
    <div style={{
      position: 'absolute',
      top: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '400px',
      height: '50px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '25px',
      border: '2px solid #fff',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      padding: '5px',
      zIndex: 10
    }}>
      <div style={{
        width: `${timePercentage}%`,
        height: '100%',
        backgroundColor: timeBarColor,
        borderRadius: '20px',
        transition: 'width 0.5s ease-in-out, background-color 0.5s ease-in-out',
        position: 'absolute',
        top: 0,
        left: 0
      }}></div>
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        color: 'white',
        fontSize: '1.5em',
        textShadow: '1px 1px 2px black'
      }}>
        <span>Score: {Math.floor(score)}</span>
        <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
          {gameConfig.timeLimit === -1 ? '∞' : `${minutes}:${seconds.toString().padStart(2, '0')}`}
        </span>
        <span>Combo: {combo}</span>
      </div>
    </div>
  );
};

export default TimeUI;