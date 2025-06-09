import React, { useEffect, useState } from 'react';
import { ScoreHeader } from './ScoreHeader';
import { StatsGrid } from './StatsGrid';
import { AccuracySection } from './AccuracySection';
import { ActionButtons } from './ActionButtons';
import { useGameStore } from '../../../shared/stores/gameStore';

interface ScoreChartProps {
  onReplay: () => void;
  onBackToMenu: () => void;
  onWatchReplay: () => void;
  isVisible: boolean;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({
  onReplay,
  onBackToMenu,
  onWatchReplay,
  isVisible
}) => {
  const gameState = useGameStore();
  const [animationStage, setAnimationStage] = useState(0);
  const [showGrade, setShowGrade] = useState(false);

  // Animation logic here...

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-1000 text-white p-5">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <ScoreHeader 
          finalScore={gameState.score} 
          animationStage={animationStage} 
        />
        
        <StatsGrid 
          gameState={gameState}
          animationStage={animationStage} 
        />
        
        <AccuracySection 
          accuracy={gameState.calculateAccuracy()}
          animationStage={animationStage}
          showGrade={showGrade}
        />
        
        <ActionButtons 
          onReplay={onReplay}
          onWatchReplay={onWatchReplay}
          onBackToMenu={onBackToMenu}
        />
        
      </div>
    </div>
  );
};