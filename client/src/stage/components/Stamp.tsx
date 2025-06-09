import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface StampProps {
  id: number;
  position: [number, number, number];
  color: string;
  onFadeOut: (id: number) => void;
}

const Stamp = ({ id, position, color, onFadeOut }: StampProps) => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const life = useRef(0);
  const duration = 0.5; // The stamp will fade out in 0.5 seconds

  useFrame((state, delta) => {
    life.current += delta;
    if (materialRef.current) {
      // Calculate the fade-out progress
      const progress = Math.min(life.current / duration, 1);
      materialRef.current.opacity = 1 - progress;
    }
    // When the animation is done, remove the stamp
    if (life.current >= duration) {
      onFadeOut(id);
    }
  });

  return (
    <group position={position}>
      {/* The visual representation of the stamp, similar to a note head */}
      <RoundedBox args={[0.9, 1.2, 0.1]} radius={0.05} smoothness={4} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial ref={materialRef} color={color} transparent emissive={color} emissiveIntensity={2} />
      </RoundedBox>
    </group>
  );
};

export default Stamp;