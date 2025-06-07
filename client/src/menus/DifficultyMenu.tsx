// src/menus/DifficultyMenu.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface DifficultyMenuProps {
  onBack: () => void;
  onSelectDifficulty: (difficulty: number) => void;
}

const DifficultyMenu: React.FC<DifficultyMenuProps> = ({ onBack, onSelectDifficulty }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [enterTime, setEnterTime] = useState(0);

  const difficultyOptions = [
    { text: 'Tutorial', description: 'Very slow, huge timing windows', value: 3, color: '#4caf50' },
    { text: 'Easy', description: 'Slow speed, generous timing', value: 15, color: '#8bc34a' },
    { text: 'Normal', description: 'Comfortable pace', value: 35, color: '#ffc107' },
    { text: 'Hard', description: 'Fast pace, tighter timing', value: 55, color: '#ff9800' },
    { text: 'Expert', description: 'Very precise timing required', value: 75, color: '#f44336' },
    { text: 'Master', description: 'Professional level difficulty', value: 90, color: '#9c27b0' }
  ];

  useFrame((state, delta) => {
    setEnterTime(prev => prev + delta);
    
    if (groupRef.current) {
      const progress = Math.min(enterTime / 1.5, 1);
      const ease = THREE.MathUtils.smoothstep(progress, 0, 1);
      
      groupRef.current.position.x = THREE.MathUtils.lerp(8, 0, ease);
      groupRef.current.scale.setScalar(ease);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Back Button */}
      <group position={[-3, 2.5, 0]}>
        <Text
          fontSize={0.4}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          onClick={onBack}
          onPointerOver={(e) => e.object.color.set('#ffffff')}
          onPointerOut={(e) => e.object.color.set('#cccccc')}
        >
          ← Back
        </Text>
      </group>

      {/* Title */}
      <group position={[0, 2.2, 0]}>
        <Text
          fontSize={1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
          outlineWidth={0.02}
          outlineColor="black"
        >
          SELECT DIFFICULTY
        </Text>
      </group>

      {/* Difficulty Options */}
      <group position={[0, 0.5, 0]}>
        {difficultyOptions.map((option, index) => {
          const row = Math.floor(index / 2);
          const col = index % 2;
          const x = (col - 0.5) * 4.5;
          const y = 1.2 - row * 1;
          
          return (
            <DifficultyOption
              key={option.text}
              {...option}
              position={[x, y, 0]}
              onClick={() => onSelectDifficulty(option.value)}
              animationDelay={index * 0.1}
            />
          );
        })}
      </group>
    </group>
  );
};

interface DifficultyOptionProps {
  text: string;
  description: string;
  value: number;
  color: string;
  position: [number, number, number];
  onClick: () => void;
  animationDelay: number;
}

const DifficultyOption: React.FC<DifficultyOptionProps> = ({
  text,
  description,
  value,
  color,
  position,
  onClick,
  animationDelay
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null!);
  const [localTime, setLocalTime] = useState(0);

  useFrame((state, delta) => {
    setLocalTime(prev => prev + delta);
    
    if (groupRef.current) {
      const progress = Math.max(0, Math.min((localTime - animationDelay) / 0.8, 1));
      const ease = THREE.MathUtils.smoothstep(progress, 0, 1);
      
      groupRef.current.scale.setScalar(ease);
      
      const targetScale = hovered ? 1.05 : 1;
      groupRef.current.scale.multiplyScalar(THREE.MathUtils.lerp(groupRef.current.scale.x / ease, targetScale, 0.1));
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <planeGeometry args={[4, 0.8]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.8 : 0.6} 
        />
      </mesh>
      
      <Text
        position={[0, 0.15, 0.01]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Rajdhani-Regular.ttf"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        {text} ({value})
      </Text>
      
      <Text
        position={[0, -0.2, 0.01]}
        fontSize={0.2}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
        textAlign="center"
      >
        {description}
      </Text>
    </group>
  );
};

export default DifficultyMenu;