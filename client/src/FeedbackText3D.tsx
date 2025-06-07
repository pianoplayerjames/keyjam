import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface FeedbackText3DProps {
  feedback: {
    text: string;
    color: string;
    key: number;
  };
}

const FeedbackText3D = ({ feedback }: FeedbackText3DProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const textRef = useRef<any>(null!);
  const [currentFeedback, setCurrentFeedback] = useState(feedback);
  const life = useRef(0);
  const animationDuration = 1.0;

  useEffect(() => {
    if (feedback.text && feedback.key !== currentFeedback.key) {
      life.current = animationDuration;
      setCurrentFeedback(feedback);
      if (groupRef.current) {
        groupRef.current.scale.set(0.1, 0.1, 0.1);
        groupRef.current.rotation.z = (Math.random() - 0.5) * 0.4;
      }
      if (textRef.current) {
        // Reset color on new feedback
        textRef.current.color = new THREE.Color(feedback.color);
      }
    }
  }, [feedback, currentFeedback.key]);

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
        textRef.current.strokeOpacity = opacity * 0.5; // Apply opacity to stroke

        // Animate color from initial to white for a gradient effect over time
        if (textRef.current.color instanceof THREE.Color) {
            textRef.current.color.lerp(new THREE.Color('white'), delta * 2);
        }
      }
    }
  });

  if (life.current <= 0) return null;

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      <Text
        ref={textRef}
        fontSize={0.6} // Made text smaller
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