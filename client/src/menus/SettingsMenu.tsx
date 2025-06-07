// src/menus/SettingsMenu.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface SettingsMenuProps {
  onBack: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onBack }) => {
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

      {/* Settings Title */}
      <group position={[0, 2, 0]}>
        <Text
          fontSize={1.2}
          color="#9c27b0"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
          outlineWidth={0.02}
          outlineColor="black"
        >
          SETTINGS
        </Text>
      </group>

      {/* Coming Soon */}
      <group position={[0, 0, 0]}>
        <Text
          fontSize={0.6}
          color="#ffc107"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Rajdhani-Regular.ttf"
        >
          🚧 COMING SOON! 🚧
        </Text>
        
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.3}
          color="#888888"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
        >
          Settings menu is in development.
          {'\n'}Future options will include:
          {'\n'}• Audio settings
          {'\n'}• Visual effects toggle
          {'\n'}• Key bindings
          {'\n'}• Performance options
        </Text>
      </group>
    </group>
  );
};

export default SettingsMenu;