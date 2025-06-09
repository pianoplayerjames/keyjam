// src/Transition.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TransitionProps {
  onTransitionComplete: () => void;
  gameMode: string;
}

const Transition: React.FC<TransitionProps> = ({ onTransitionComplete, gameMode }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const textRef = useRef<any>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  const [phase, setPhase] = useState<'intro' | 'expand' | 'complete'>('intro');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Create particle system
  const particleCount = 200;
  const particles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Start particles in a sphere
      const radius = Math.random() * 2 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 10;
      velocities[i3 + 1] = (Math.random() - 0.5) * 10;
      velocities[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Random colors with theme
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.7, 0.8, 0.6); // Purple to pink range
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return { positions, velocities, colors };
  }, []);

  const modeText = gameMode === 'score' ? 'SCORE MODE' : gameMode === 'time' ? 'TIME MODE' : 'READY?';
  const modeColor = gameMode === 'score' ? '#ff4f7b' : gameMode === 'time' ? '#4caf50' : '#ffffff';

  useFrame((state, delta) => {
    setElapsedTime(prev => prev + delta);
    
    if (groupRef.current && textRef.current && particlesRef.current) {
      const time = elapsedTime;
      
      switch (phase) {
        case 'intro':
          // Fade in and scale up text
          const introProgress = Math.min(time / 1.0, 1);
          const scale = THREE.MathUtils.lerp(0, 1.5, THREE.MathUtils.smoothstep(introProgress, 0, 1));
          groupRef.current.scale.set(scale, scale, scale);
          textRef.current.fillOpacity = introProgress;
          
          // Animate particles inward
          const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const progress = Math.min(time / 1.5, 1);
            const ease = THREE.MathUtils.smoothstep(progress, 0, 1);
            
            positions[i3] = THREE.MathUtils.lerp(particles.positions[i3], 0, ease);
            positions[i3 + 1] = THREE.MathUtils.lerp(particles.positions[i3 + 1], 0, ease);
            positions[i3 + 2] = THREE.MathUtils.lerp(particles.positions[i3 + 2], 0, ease);
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
          
          // Rotate the whole group
          groupRef.current.rotation.y = time * 0.5;
          groupRef.current.rotation.x = Math.sin(time * 2) * 0.1;
          
          if (time > 1.5) {
            setPhase('expand');
            setElapsedTime(0);
          }
          break;
          
        case 'expand':
          // Explosive expansion
          const expandProgress = Math.min(time / 1.0, 1);
          const expandScale = THREE.MathUtils.lerp(1.5, 8, expandProgress * expandProgress);
          groupRef.current.scale.set(expandScale, expandScale, expandScale);
          
          // Fade out text
          textRef.current.fillOpacity = 1 - expandProgress;
          
          // Explode particles outward
          const expandPositions = particlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const velocity = expandProgress * expandProgress * 20;
            
            expandPositions[i3] += particles.velocities[i3] * delta * velocity;
            expandPositions[i3 + 1] += particles.velocities[i3 + 1] * delta * velocity;
            expandPositions[i3 + 2] += particles.velocities[i3 + 2] * delta * velocity;
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
          
          // Faster rotation
          groupRef.current.rotation.y += delta * 5;
          groupRef.current.rotation.z += delta * 2;
          
          if (time > 1.0) {
            setPhase('complete');
            onTransitionComplete();
          }
          break;
          
        case 'complete':
          // Keep expanding until fully off-screen
          const completeScale = 8 + time * 10;
          groupRef.current.scale.set(completeScale, completeScale, completeScale);
          groupRef.current.rotation.y += delta * 10;
          break;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particles.positions}
            count={particleCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={particles.colors}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Main text */}
      <Text
        ref={textRef}
        position={[0, 0, 0]}
        fontSize={1.2}
        color={modeColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Rajdhani-Regular.ttf"
        outlineWidth={0.05}
        outlineColor="black"
        material-transparent={true}
      >
        {modeText}
      </Text>
      
      {/* Background glow effect */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial
          color={modeColor}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

export default Transition;