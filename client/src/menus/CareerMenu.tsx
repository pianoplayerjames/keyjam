// src/menus/CareerMenu.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CareerMenuProps {
  onBack: () => void;
  onStart: () => void;
}

const CareerMenu: React.FC<CareerMenuProps> = ({ onBack, onStart }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [enterTime, setEnterTime] = useState(0);

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

      {/* Career Mode Title */}
      <group position={[0, 2, 0]}>
        <Text
          fontSize={1.2}
          color="#ff4f7b"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
          outlineWidth={0.02}
          outlineColor="black"
        >
          CAREER MODE
        </Text>
      </group>

      {/* Description */}
      <group position={[0, 1.2, 0]}>
        <Text
          fontSize={0.4}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
        >
          Start your journey as a rhythm novice and climb the ranks!
          {'\n'}Begin with tutorial difficulty and unlock higher ranks as you progress.
          {'\n'}Each rank lasts 2 minutes - survive to advance!
        </Text>
      </group>

      {/* Current Rank Display */}
      <group position={[0, 0.2, 0]}>
        <mesh>
          <planeGeometry args={[6, 1.5]} />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
        </mesh>
        <Text
          position={[0, 0.3, 0.01]}
          fontSize={0.6}
          color="#4caf50"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
        >
          CURRENT RANK
        </Text>
        <Text
          position={[0, -0.1, 0.01]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
        >
          🎓 ROOKIE
        </Text>
        <Text
          position={[0, -0.5, 0.01]}
          fontSize={0.3}
          color="#888888"
          anchorX="center"
          anchorY="middle"
        >
          Difficulty: Tutorial (Level 3)
        </Text>
      </group>

      {/* Start Button */}
      <group position={[0, -1.5, 0]}>
        <mesh>
          <planeGeometry args={[4, 0.8]} />
          <meshBasicMaterial color="#ff4f7b" transparent opacity={0.8} />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
          onClick={onStart}
          onPointerOver={(e) => e.object.parent.children[0].material.opacity = 1}
          onPointerOut={(e) => e.object.parent.children[0].material.opacity = 0.8}
        >
          START CAREER
        </Text>
      </group>

      {/* Rank Preview */}
      <group position={[0, -2.8, 0]}>
        <Text
          fontSize={0.25}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          maxWidth={10}
          textAlign="center"
        >
          Next Ranks: Amateur → Intermediate → Advanced → Expert → Master → Legend
        </Text>
      </group>
    </group>
  );
};

export default CareerMenu;