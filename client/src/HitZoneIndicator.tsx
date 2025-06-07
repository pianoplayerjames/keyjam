import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ComplexityManager } from './ComplexityManager';

interface HitZoneIndicatorProps {
  complexity: number;
  position?: [number, number, number];
}

const HitZoneIndicator: React.FC<HitZoneIndicatorProps> = ({ 
  complexity, 
  position = [0, 0.05, 2.0] 
}) => {
  const perfectRef = useRef<THREE.Mesh>(null!);
  const goodRef = useRef<THREE.Mesh>(null!);
  const almostRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const pulse = Math.sin(clock.getElapsedTime() * 8) * 0.05 + 1;
    const slowPulse = Math.sin(clock.getElapsedTime() * 2) * 0.02 + 1;
    
    if (perfectRef.current) {
      perfectRef.current.scale.set(pulse, pulse, 1);
    }
    if (goodRef.current) {
      goodRef.current.scale.set(slowPulse, slowPulse, 1);
    }
    if (almostRef.current) {
      almostRef.current.scale.set(1, 1, 1);
    }
  });

  const config = ComplexityManager.getConfig(complexity);
  
  // Scale timing windows for visual representation
  const perfectHeight = config.timingWindows.perfect * (complexity <= 30 ? 2 : complexity <= 60 ? 1.5 : 1) * 4;
  const goodHeight = config.timingWindows.good * (complexity <= 30 ? 1.8 : complexity <= 60 ? 1.3 : 1) * 4;
  const almostHeight = config.timingWindows.almost * (complexity <= 30 ? 1.5 : 1.2) * 4;

  return (
    <group position={position}>
      {/* Almost Zone (outermost, largest) */}
      <RoundedBox 
        ref={almostRef}
        args={[4.8, almostHeight, 0.05]} 
        radius={0.02} 
        smoothness={4}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#ffc107" 
          transparent 
          opacity={0.15}
          emissive="#ffc107"
          emissiveIntensity={0.1}
        />
      </RoundedBox>

      {/* Good Zone (middle) */}
      <RoundedBox 
        ref={goodRef}
        args={[4.6, goodHeight, 0.06]} 
        radius={0.02} 
        smoothness={4}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0.01]}
      >
        <meshStandardMaterial 
          color="#29b6f6" 
          transparent 
          opacity={0.25}
          emissive="#29b6f6"
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      {/* Perfect Zone (innermost, smallest) */}
      <RoundedBox 
        ref={perfectRef}
        args={[4.4, perfectHeight, 0.07]} 
        radius={0.02} 
        smoothness={4}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0.02]}
      >
        <meshStandardMaterial 
          color="#00e676" 
          transparent 
          opacity={0.35}
          emissive="#00e676"
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      {/* Center Line for reference */}
      <RoundedBox 
        args={[4.8, 0.02, 0.08]} 
        radius={0.01} 
        smoothness={4}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0.03]}
      >
        <meshStandardMaterial 
          color="white" 
          transparent 
          opacity={0.8}
          emissive="white"
          emissiveIntensity={0.5}
        />
      </RoundedBox>

      {/* Complexity indicator */}
      <group position={[2.8, 0, 0.1]}>
        <RoundedBox args={[0.3, 0.15, 0.05]} radius={0.02} smoothness={4}>
          <meshStandardMaterial 
            color={complexity <= 30 ? '#4caf50' : complexity <= 60 ? '#ffc107' : complexity <= 80 ? '#ff9800' : '#f44336'} 
            emissive={complexity <= 30 ? '#4caf50' : complexity <= 60 ? '#ffc107' : complexity <= 80 ? '#ff9800' : '#f44336'}
            emissiveIntensity={0.3}
          />
        </RoundedBox>
      </group>
    </group>
  );
};

export default HitZoneIndicator;