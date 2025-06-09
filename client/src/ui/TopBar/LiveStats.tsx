import React from 'react';

export const LiveStats: React.FC = () => {
  return (
    <div className="hidden xl:flex items-center gap-4 ml-8">
      <StatItem 
        icon="🟢" 
        value="1,247" 
        label="Online Now" 
        color="text-green-400"
        animated 
      />
      <StatItem 
        icon="🎮" 
        value="34,636" 
        label="Active Games" 
        color="text-blue-400" 
      />
      <StatItem 
        icon="🏆" 
        value="23" 
        label="Live Arenas" 
        color="text-purple-400" 
      />
    </div>
  );
};

interface StatItemProps {
  icon: string;
  value: string;
  label: string;
  color: string;
  animated?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, color, animated }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      {animated && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>}
      <span className={`${color} text-lg`}>{icon}</span>
      <span className={`${color} text-sm font-semibold`}>{value}</span>
      <span className="text-gray-400 text-xs">{label}</span>
    </div>
  );
};