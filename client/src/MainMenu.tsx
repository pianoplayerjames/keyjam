// src/MainMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Logo = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture('/logo.png');

  const image = texture.image;
  const aspectRatio = image ? image.width / image.height : 2;

  useFrame(({ clock }) => {
    if (meshRef.current && glowRef.current) {
      const time = clock.getElapsedTime();
      
      // Floating animation
      meshRef.current.position.y = 0.5 + Math.sin(time * 0.5) * 0.3;
      meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      // Glow effect
      const glowIntensity = 0.5 + Math.sin(time * 2) * 0.3;
      glowRef.current.material.opacity = glowIntensity * 0.3;
      glowRef.current.scale.set(1.2 + glowIntensity * 0.1, 1.2 + glowIntensity * 0.1, 1);
      
      // Copy rotation from main mesh
      glowRef.current.rotation.copy(meshRef.current.rotation);
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.position.z -= 0.1;
    }
  });

  return (
    <group position={[-0.2, -0.2, 0]} scale={6}>
      {/* Glow effect behind logo */}
      <mesh ref={glowRef}>
        <planeGeometry args={[aspectRatio, 1]} />
        <meshBasicMaterial color="#ff4f7b" transparent side={THREE.DoubleSide} />
      </mesh>
      
      {/* Main logo */}
      <mesh ref={meshRef}>
        <planeGeometry args={[aspectRatio, 1]} />
        <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

interface MainMenuProps {
  onStartGame: (mode: string) => void;
  isTransitioning?: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, isTransitioning = false }) => {
  const menuOptions = [
    { text: 'Solo', description: 'Score-based challenge', color: '#ff4f7b' },
    { text: 'Training', description: 'Practice mode', color: '#4caf50' },
    { text: 'Online', description: 'Coming soon...', color: '#666666' },
    { text: 'Settings', description: 'Coming soon...', color: '#666666' }
  ];
  
  const groupRef = useRef<THREE.Group>(null!);
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'idle' | 'exiting'>('entering');
  const [enterTime, setEnterTime] = useState(0);

  useEffect(() => {
    if (isTransitioning) {
      setAnimationPhase('exiting');
    }
  }, [isTransitioning]);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      
      switch (animationPhase) {
        case 'entering':
          setEnterTime(prev => prev + delta);
          const enterProgress = Math.min(enterTime / 2.0, 1);
          const enterEase = THREE.MathUtils.smoothstep(enterProgress, 0, 1);
          
          // Slide in from the side
          groupRef.current.position.x = THREE.MathUtils.lerp(-10, 0, enterEase);
          groupRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI * 0.5, 0, enterEase);
          
          if (enterProgress >= 1) {
            setAnimationPhase('idle');
          }
          break;
          
        case 'idle':
          // Gentle floating animation
          groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.03;
          groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.015;
          groupRef.current.position.y = Math.sin(time * 0.3) * 0.05;
          break;
          
        case 'exiting':
          // Dramatic exit animation
          groupRef.current.rotation.y += delta * 3;
          groupRef.current.position.x += delta * 15;
          groupRef.current.scale.multiplyScalar(1 + delta * 2);
          break;
      }
    }
  });

  const handleMenuClick = (option: string) => {
    if (isTransitioning || animationPhase === 'exiting') return;
    setAnimationPhase('exiting');
    // Delay the actual transition to allow exit animation
    setTimeout(() => onStartGame(option), 500);
  };

  return (
    <group ref={groupRef}>
      <Logo />
      <group position={[3.5, 0, 0]}>
        {menuOptions.map((option, index) => (
          <MenuItem
            key={option.text}
            {...option}
            position={[0, 1.5 - index * 1.3, 0]}
            onClick={() => handleMenuClick(option.text)}
            isDisabled={option.color === '#666666' || isTransitioning}
            animationDelay={index * 0.2}
            animationPhase={animationPhase}
          />
        ))}
      </group>
    </group>
  );
};

interface MenuItemProps {
  text: string;
  description: string;
  color: string;
  position: [number, number, number];
  onClick: () => void;
  isDisabled: boolean;
  animationDelay: number;
  animationPhase: 'entering' | 'idle' | 'exiting';
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  text, 
  description, 
  color, 
  position, 
  onClick, 
  isDisabled,
  animationDelay,
  animationPhase
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null!);
  const textRef = useRef<any>(null!);
  const descRef = useRef<any>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [localTime, setLocalTime] = useState(0);

  useFrame((state, delta) => {
    setLocalTime(prev => prev + delta);
    
    if (groupRef.current && textRef.current && descRef.current && glowRef.current) {
      const time = state.clock.elapsedTime;
      
      switch (animationPhase) {
        case 'entering':
          const enterProgress = Math.max(0, Math.min((localTime - animationDelay) / 1.0, 1));
          const enterEase = THREE.MathUtils.smoothstep(enterProgress, 0, 1);
          
          // Slide in from right
          groupRef.current.position.x = THREE.MathUtils.lerp(5, 0, enterEase);
          groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.3, 1, enterEase));
          
          const opacity = enterEase;
          textRef.current.fillOpacity = opacity;
          descRef.current.fillOpacity = opacity * 0.7;
          break;
          
        case 'idle':
          // Hover animations
          const targetScale = hovered ? 1.15 : 1;
          groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
          
          // Color transitions
          const targetColor = new THREE.Color(hovered && !isDisabled ? '#ffffff' : color);
          textRef.current.color.lerp(targetColor, 0.1);
          
          // Glow effect when hovered
          glowRef.current.material.opacity = hovered && !isDisabled ? 0.3 : 0;
          glowRef.current.scale.setScalar(hovered ? 1.2 : 1);
          
          // Floating animation
          if (hovered && !isDisabled) {
            groupRef.current.position.y = Math.sin(time * 5) * 0.05;
            groupRef.current.rotation.z = Math.sin(time * 3) * 0.05;
          } else {
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
          }
          break;
          
        case 'exiting':
          // Quick exit animation
          groupRef.current.scale.multiplyScalar(1 + delta * 3);
          textRef.current.fillOpacity *= (1 - delta * 5);
          descRef.current.fillOpacity *= (1 - delta * 5);
          break;
      }
    }
  });

  const handleClick = () => {
    if (!isDisabled && animationPhase === 'idle') {
      onClick();
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Glow effect */}
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[4, 1]} />
        <meshBasicMaterial color={color} transparent />
      </mesh>
      
      {/* Main text */}
      <Text
        ref={textRef}
        position={[0, 0.1, 0]}
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => !isDisabled && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        font="/fonts/Rajdhani-Regular.ttf"
        outlineWidth={hovered && !isDisabled ? 0.02 : 0}
        outlineColor="black"
      >
        {text}
      </Text>
      
      {/* Description text */}
      <Text
        ref={descRef}
        position={[0, -0.3, 0]}
        fontSize={0.3}
        color={isDisabled ? '#666666' : '#cccccc'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Rajdhani-Regular.ttf"
      >
        {description}
      </Text>
    </group>
  );
};

export default MainMenu;