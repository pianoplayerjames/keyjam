// client/src/HealthUI.tsx
import React from 'react';
import { useGameStore } from '../../shared/stores/gameStore';

const HealthUI: React.FC = () => {
  const health = useGameStore((state) => state.health);
  const score = useGameStore((state) => state.score);
  const combo = useGameStore((state) => state.combo);

  const healthBarColor = health > 50 ? '#4caf50' : health > 20 ? '#ffc107' : '#f44336';

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
        width: `${health}%`,
        height: '100%',
        backgroundColor: healthBarColor,
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
        <span>Combo: {combo}</span>
      </div>
    </div>
  );
};

export default HealthUI;