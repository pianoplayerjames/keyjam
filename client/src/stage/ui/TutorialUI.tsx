import React from 'react';
import { useGameStore } from '../../shared/stores/gameStore';

const TutorialUI: React.FC = () => {
  const tutorialPrompt = useGameStore((state) => state.tutorialPrompt);

  if (!tutorialPrompt || !tutorialPrompt.visible) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '20px 40px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      borderRadius: '15px',
      border: '2px solid #4caf50',
      fontSize: '2em',
      fontWeight: 'bold',
      textAlign: 'center',
      zIndex: 100,
      textShadow: '2px 2px 4px black'
    }}>
      {tutorialPrompt.text}
    </div>
  );
};

export default TutorialUI;