import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TimingDisplayProps {
  timingOffset: number;
  show: boolean;
  onComplete?: () => void;
}

const TimingDisplay: React.FC<TimingDisplayProps> = ({ timingOffset, show, onComplete }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const textRef = useRef<any>(null!);
  const life = useRef(0);
  const maxLife = 1.5;

  useEffect(() => {
    if (show) {
      life.current = maxLife;
    }
  }, [show]);

  useFrame((state, delta) => {
    if (life.current > 0) {
      life.current -= delta;
      const progress = 1 - (life.current / maxLife);
      
      if (groupRef.current) {
        groupRef.current.position.y = 1.8 + progress * 0.5;
        const scale = 1 - progress * 0.3;
        groupRef.current.scale.set(scale, scale, scale);
      }

      if (textRef.current) {
        textRef.current.fillOpacity = life.current / maxLife;
      }

      if (life.current <= 0 && onComplete) {
        onComplete();
      }
    }
  });

  if (!show || life.current <= 0) return null;

  const offsetMs = Math.round(timingOffset * 1000);
  const offsetText = offsetMs === 0 ? 'PERFECT TIMING!' : 
                   offsetMs > 0 ? `+${offsetMs}ms (Late)` : 
                   `${offsetMs}ms (Early)`;
  
  const color = Math.abs(offsetMs) <= 16 ? '#00e676' : 
                Math.abs(offsetMs) <= 50 ? '#29b6f6' : 
                Math.abs(offsetMs) <= 100 ? '#ffc107' : '#f44336';

  return (
    <group ref={groupRef} position={[0, 1.8, 0]}>
      <Text
        ref={textRef}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {offsetText}
      </Text>
    </group>
  );
};

export default TimingDisplay;