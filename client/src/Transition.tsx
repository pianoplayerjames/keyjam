// src/Transition.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TransitionProps {
  onTransitionComplete: () => void;
}

const Transition: React.FC<TransitionProps> = ({ onTransitionComplete }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const triangleShape = new THREE.Shape()
    .moveTo(0, 1)
    .lineTo(-1, -1)
    .lineTo(1, -1)
    .lineTo(0, 1);

  const extrudeSettings = {
    steps: 2,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  const geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);
  geometry.center();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 2;
      meshRef.current.rotation.y += delta * 1;
      meshRef.current.scale.x += delta * 20;
      meshRef.current.scale.y += delta * 20;
      meshRef.current.scale.z += delta * 20;

      if (meshRef.current.scale.x > 50) {
        onTransitionComplete();
      }
    }
  });

  return (
    <mesh ref={meshRef} scale={[0, 0, 0]} geometry={geometry} position={[0, 0, 2]}>
      <meshStandardMaterial color="hotpink" emissive="hotpink" emissiveIntensity={2} roughness={0.5} metalness={0.8} />
    </mesh>
  );
};

export default Transition;