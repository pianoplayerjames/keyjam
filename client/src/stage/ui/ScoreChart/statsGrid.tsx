import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatsGridProps {
  gameState: any;
  animationStage: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ gameState, animationStage }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <StatCard
        title="🔥 MAX COMBO"
        value={gameState.maxCombo}
        color="border-red-500 bg-red-500/10"
        textColor="text-red-500"
        animationStage={animationStage >= 2 ? animationStage : 0}
      />
      
      <StatCard
        title="🎵 NOTES HIT"
        value={gameState.totalNotes - gameState.missedNotes}
        totalValue={gameState.totalNotes}
        color="border-cyan-500 bg-cyan-500/10"
        textColor="text-cyan-500"
        animationStage={animationStage >= 3 ? animationStage : 0}
      />
      
      {/* More stat cards... */}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  totalValue?: number;
  color: string;
  textColor: string;
  animationStage: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  totalValue, 
  color, 
  textColor, 
  animationStage 
}) => {
  return (
    <div className={`${color} rounded-xl p-4 text-center border-2`}>
      <h3 className={`${textColor} text-lg font-bold mb-2`}>{title}</h3>
      <div className="text-2xl font-bold">
        {animationStage > 0 && <AnimatedCounter value={value} duration={1.2} />}
        {totalValue && (
          <span className="text-sm text-gray-400">
            /{animationStage > 0 && <AnimatedCounter value={totalValue} duration={1.2} />}
          </span>
        )}
      </div>
    </div>
  );
};