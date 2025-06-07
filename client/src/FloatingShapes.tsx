import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'

const shapeCount = 100;

// Generate data for each shape instance
const particles = Array.from({ length: shapeCount }, () => ({
  factor: 2 + Math.random() * 5, // speed factor
  position: [
    (Math.random() - 0.5) * 40, // x
    (Math.random() - 0.5) * 20, // y
    (Math.random() - 0.5) * 40, // z
  ],
  rotationSpeed: [
    (Math.random() - 0.5) * 0.5,
    (Math.random() - 0.5) * 0.5,
    (Math.random() - 0.5) * 0.5,
  ]
}));

function FloatingShape({ factor, position, rotationSpeed }) {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.y += Math.sin(t * factor * 0.1) * 0.01;
    ref.current.rotation.x += rotationSpeed[0] * delta;
    ref.current.rotation.y += rotationSpeed[1] * delta;
    ref.current.rotation.z += rotationSpeed[2] * delta;
  });

  return <Instance ref={ref} position={position} scale={1} />;
}

export default function FloatingShapes() {
  return (
    <Instances limit={shapeCount}>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial toneMapped={false} emissive="#330066" emissiveIntensity={0.5} roughness={0} metalness={0} transparent opacity={0.3} />
      {particles.map((data, i) => (
        <FloatingShape key={i} {...data} />
      ))}
    </Instances>
  )
}