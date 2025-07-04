// client/src/FeedbackText3D.tsx
import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../shared/stores/gameStore';

const FeedbackText3D = () => {
  const { hitFeedback } = useGameStore();
  
  const groupRef = useRef<THREE.Group>(null!);
  const textRef = useRef<any>(null!);
  const [currentFeedback, setCurrentFeedback] = useState(hitFeedback);
  const life = useRef(0);
  const animationDuration = 1.0;
  const initialColor = useRef<THREE.Color | null>(null);

  useEffect(() => {
    if (hitFeedback.text && hitFeedback.key !== currentFeedback.key) {
      life.current = animationDuration;
      setCurrentFeedback(hitFeedback);
      if (groupRef.current) {
        groupRef.current.scale.set(0.1, 0.1, 0.1);
        groupRef.current.rotation.z = (Math.random() - 0.5) * 0.4;
      }
      initialColor.current = new THREE.Color(hitFeedback.color);
    }
  }, [hitFeedback, currentFeedback.key]);

  useFrame((state, delta) => {
    if (life.current > 0) {
      life.current -= delta;
      const progress = 1 - life.current / animationDuration;

      const scale = 1 + 0.5 * Math.sin(progress * Math.PI);
      if (groupRef.current) {
        groupRef.current.scale.set(scale, scale, scale);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      }

      if (textRef.current) {
        const opacity = life.current < animationDuration / 2 ? (life.current / (animationDuration / 2)) : 1;
        textRef.current.fillOpacity = opacity;
        textRef.current.strokeOpacity = opacity * 0.5;

        if (initialColor.current) {
          const currentColor = initialColor.current.clone();
          currentColor.lerp(new THREE.Color('white'), progress * 0.5);
          textRef.current.color = currentColor;
        }
      }
    }
  });

  if (life.current <= 0) return null;

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      <Text
        ref={textRef}
        fontSize={0.6}
        color={currentFeedback.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
        material-transparent={true}
      >
        {currentFeedback.text}
      </Text>
    </group>
  );
};

export default FeedbackText3D;