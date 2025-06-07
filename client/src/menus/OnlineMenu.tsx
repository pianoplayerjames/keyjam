// src/menus/OnlineMenu.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface OnlineMenuProps {
  onBack: () => void;
  onSelectMode: (mode: string) => void;
}

const OnlineMenu: React.FC<OnlineMenuProps> = ({ onBack, onSelectMode }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [enterTime, setEnterTime] = useState(0);

  const onlineOptions = [
    { 
      text: 'Arenas', 
      description: 'Join public rooms with up to 8 players', 
      color: '#4caf50',
      mode: 'arenas',
      comingSoon: true
    },
    { 
      text: 'Duels', 
      description: '1v1 competitive matches', 
      color: '#f44336',
      mode: 'duels',
      comingSoon: true
    },
    { 
      text: 'Invite Friend', 
      description: 'Play with friends via invite code', 
      color: '#2196f3',
      mode: 'invite',
      comingSoon: true
    }
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

      {/* Online Title */}
      <group position={[0, 2, 0]}>
        <Text
          fontSize={1.2}
          color="#4caf50"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
          outlineWidth={0.02}
          outlineColor="black"
        >
          ONLINE PLAY
        </Text>
      </group>

      {/* Options */}
      {onlineOptions.map((option, index) => (
        <OnlineMenuItem
          key={option.text}
          {...option}
          position={[0, 0.8 - index * 1.2, 0]}
          onClick={() => onSelectMode(option.mode)}
          animationDelay={index * 0.2}
        />
      ))}

      {/* Coming Soon Notice */}
      <group position={[0, -2.5, 0]}>
        <Text
          fontSize={0.4}
          color="#ffc107"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
        >
          🚧 ONLINE FEATURES COMING SOON! 🚧
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.25}
          color="#888888"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
        >
          For now, these options will start a practice game.
          {'\n'}Full multiplayer functionality is in development!
        </Text>
      </group>
    </group>
  );
};

interface OnlineMenuItemProps {
  text: string;
  description: string;
  color: string;
  mode: string;
  comingSoon: boolean;
  position: [number, number, number];
  onClick: () => void;
  animationDelay: number;
}

const OnlineMenuItem: React.FC<OnlineMenuItemProps> = ({
  text,
  description,
  color,
  comingSoon,
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
      const progress = Math.max(0, Math.min((localTime - animationDelay) / 1.0, 1));
      const ease = THREE.MathUtils.smoothstep(progress, 0, 1);
      
      groupRef.current.position.x = THREE.MathUtils.lerp(6, 0, ease);
      groupRef.current.scale.setScalar(ease);
      
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.multiplyScalar(THREE.MathUtils.lerp(groupRef.current.scale.x / ease, targetScale, 0.1));
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <planeGeometry args={[6, 0.8]} />
        <meshBasicMaterial 
          color={comingSoon ? '#444444' : color} 
          transparent 
          opacity={hovered ? 0.8 : 0.6} 
        />
      </mesh>
      
      <Text
        position={[0, 0.1, 0.01]}
        fontSize={0.5}
        color={comingSoon ? '#888888' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Rajdhani-Regular.ttf"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        {text} {comingSoon && '(Soon)'}
      </Text>
      
      <Text
        position={[0, -0.25, 0.01]}
        fontSize={0.25}
        color={comingSoon ? '#666666' : '#cccccc'}
        anchorX="center"
        anchorY="middle"
      >
        {description}
      </Text>
    </group>
  );
};

export default OnlineMenu;