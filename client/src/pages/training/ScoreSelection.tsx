import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/shared/stores/gameStore';
import { useMenuStore } from '@/shared/stores/menuStore';

interface ScoreSelectionMenuProps {
  onBack: () => void;
}

const ScoreSelectionMenu: React.FC<ScoreSelectionMenuProps> = ({ onBack }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [enterTime, setEnterTime] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const setTargetScore = useGameStore((state) => state.setTargetScore);
  const setMenuState = useMenuStore((state) => state.setMenuState);

  const scoreOptions = [
    { text: '1,000', subtitle: 'Quick win', value: 1000, color: '#4caf50', icon: '🌱' },
    { text: '2,500', subtitle: 'Warm-up', value: 2500, color: '#8bc34a', icon: '🎯' },
    { text: '5,000', subtitle: 'Standard goal', value: 5000, color: '#ffc107', icon: '⭐' },
    { text: '10,000', subtitle: 'Challenge mode', value: 10000, color: '#ff9800', icon: '🔥' },
    { text: '25,000', subtitle: 'Expert target', value: 25000, color: '#f44336', icon: '💎' },
    { text: '50,000', subtitle: 'Master level', value: 50000, color: '#9c27b0', icon: '👑' }
  ];

  const handleSelectScore = (scoreTarget: number) => {
    setTargetScore(scoreTarget);
    setMenuState('difficulty');
  };

  useFrame((state, delta) => {
    setEnterTime(prev => prev + delta);
    
    if (groupRef.current) {
      const progress = Math.min(enterTime / 1.2, 1);
      const ease = THREE.MathUtils.smoothstep(progress, 0, 1);
      
      groupRef.current.position.y = THREE.MathUtils.lerp(-5, 0, ease);
      groupRef.current.scale.setScalar(ease);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -3]}>
        <RoundedBox args={[12, 9, 0.3]} radius={0.4} smoothness={4}>
          <meshStandardMaterial 
            color="#0a0a0a" 
            transparent 
            opacity={0.9}
            emissive="#331a00"
            emissiveIntensity={0.1}
          />
        </RoundedBox>
      </mesh>

      <group position={[-4.5, 3.5, 0]}>
        <RoundedBox args={[1.5, 0.4, 0.1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial 
            color={hovered === -2 ? "#ff9800" : "#333333"} 
            emissive={hovered === -2 ? "#ff9800" : "#000000"}
            emissiveIntensity={hovered === -2 ? 0.3 : 0}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
          onClick={onBack}
          onPointerOver={() => setHovered(-2)}
          onPointerOut={() => setHovered(null)}
        >
          ← BACK
        </Text>
      </group>

      <group position={[0, 3, 0]}>
        <Text
          fontSize={0.7}
          color="#ff9800"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
          outlineWidth={0.02}
          outlineColor="black"
          material-emissive="#ff9800"
          material-emissiveIntensity={0.3}
        >
          SCORE CHALLENGE
        </Text>
      </group>

      <group position={[0, 2.2, 0]}>
        <Text
          fontSize={0.2}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          Set your target score to achieve
        </Text>
      </group>

      <group position={[0, 0.2, 0]}>
        {scoreOptions.map((option, index) => {
          const row = Math.floor(index / 2);
          const col = index % 2;
          const x = (col - 0.5) * 4.5;
          const y = 1 - row * 1.1;
          
          return (
            <ScoreCard
              key={option.value}
              {...option}
              position={[x, y, 0]}
              onClick={() => handleSelectScore(option.value)}
              isHovered={hovered === option.value}
              onHover={(hovering) => setHovered(hovering ? option.value : null)}
              animationDelay={index * 0.08}
            />
          );
        })}
      </group>
    </group>
  );
};

interface ScoreCardProps {
  text: string;
  subtitle: string;
  value: number;
  color: string;
  icon: string;
  position: [number, number, number];
  onClick: () => void;
  isHovered: boolean;
  onHover: (hovering: boolean) => void;
  animationDelay: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  text,
  subtitle,
  value,
  color,
  icon,
  position,
  onClick,
  isHovered,
  onHover,
  animationDelay
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [localTime, setLocalTime] = useState(0);

  useFrame((state, delta) => {
    setLocalTime(prev => prev + delta);
    
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const progress = Math.max(0, Math.min((localTime - animationDelay) / 0.5, 1));
      const ease = THREE.MathUtils.smoothstep(progress, 0, 1);
      
      groupRef.current.position.y = THREE.MathUtils.lerp(-2, 0, ease);
      groupRef.current.scale.setScalar(ease);
      
      const targetScale = isHovered ? 1.08 : 1;
      groupRef.current.scale.multiplyScalar(THREE.MathUtils.lerp(groupRef.current.scale.x / ease, targetScale, 0.12));
      
      if (isHovered) {
        groupRef.current.position.z = Math.sin(time * 6) * 0.01;
      } else {
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.1);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <RoundedBox args={[4, 0.9, 0.12]} radius={0.08} smoothness={4}>
        <meshStandardMaterial 
          color={isHovered ? color : "#1a1a1a"} 
          emissive={isHovered ? color : "#000000"}
          emissiveIntensity={isHovered ? 0.25 : 0.03}
          metalness={0.3}
          roughness={0.6}
        />
      </RoundedBox>

      <Text
        position={[-1.3, 0.1, 0.07]}
        fontSize={0.25}
        color={color}
        anchorX="center"
        anchorY="middle"
        material-emissive={color}
        material-emissiveIntensity={0.5}
      >
        {icon}
      </Text>
      
      <Text
        position={[0.2, 0.2, 0.07]}
        fontSize={0.28}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Rajdhani-Regular.ttf"
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
        material-emissive="#ffffff"
        material-emissiveIntensity={0.1}
      >
        {text}
      </Text>
      
      <Text
        position={[0.2, -0.15, 0.07]}
        fontSize={0.15}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
      >
        {subtitle}
      </Text>
    </group>
  );
};

export default ScoreSelectionMenu;