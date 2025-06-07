// src/menus/TimeSelectionMenu.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TimeSelectionMenuProps {
  onBack: () => void;
  onSelectTime: (timeLimit: number) => void;
}

const TimeSelectionMenu: React.FC<TimeSelectionMenuProps> = ({ onBack, onSelectTime }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [enterTime, setEnterTime] = useState(0);

  const timeOptions = [
    { text: '1 Minute', value: 60, color: '#4caf50' },
    { text: '2 Minutes', value: 120, color: '#2196f3' },
    { text: '3 Minutes', value: 180, color: '#ff9800' },
    { text: '5 Minutes', value: 300, color: '#f44336' },
    { text: '10 Minutes', value: 600, color: '#9c27b0' },
    { text: 'Endless', value: -1, color: '#607d8b' }
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
      <group position={[0, 2, 0]}>
        <Text
          fontSize={1}
          color="#9c27b0"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
          outlineWidth={0.02}
          outlineColor="black"
        >
          SELECT TIME LIMIT
        </Text>
      </group>

      {/* Description */}
      <group position={[0, 1.4, 0]}>
        <Text
          fontSize={0.3}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
        >
          Choose how long you want to practice
        </Text>
      </group>

      {/* Time Options Grid */}
      <group position={[0, 0.2, 0]}>
        {timeOptions.map((option, index) => {
          const row = Math.floor(index / 2);
          const col = index % 2;
          const x = (col - 0.5) * 3.5;
          const y = 0.8 - row * 0.8;
          
          return (
            <TimeOption
              key={option.text}
              {...option}
              position={[x, y, 0]}
              onClick={() => onSelectTime(option.value)}
              animationDelay={index * 0.1}
            />
          );
        })}
      </group>
    </group>
  );
};

interface TimeOptionProps {
  text: string;
  value: number;
  color: string;
  position: [number, number, number];
  onClick: () => void;
  animationDelay: number;
}

const TimeOption: React.FC<TimeOptionProps> = ({
  text,
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
      
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.multiplyScalar(THREE.MathUtils.lerp(groupRef.current.scale.x / ease, targetScale, 0.1));
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <planeGeometry args={[3, 0.6]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.8 : 0.6} 
        />
      </mesh>
      
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Rajdhani-Regular.ttf"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        {text}
      </Text>
    </group>
  );
};

export default TimeSelectionMenu;