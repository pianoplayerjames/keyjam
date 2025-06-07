// src/MainMenu.tsx
import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Logo = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture('/logo.png');

  const image = texture.image;
  const aspectRatio = image ? image.width / image.height : 2;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Subtle floating animation for the logo
      meshRef.current.position.y = 0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 1;
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 1;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 1;
    }
  });

  return (
    // Position the logo on the left side of the screen
    <mesh ref={meshRef} position={[-0.2, -0.2, 0]} scale={6}>
      <planeGeometry args={[aspectRatio, 1]} />
      <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

interface MainMenuProps {
  onStartGame: (mode: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const menuOptions = ['Solo', 'Online', 'Training', 'Settings'];
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // A very subtle sway for the whole scene
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.025;
    }
  });

  return (
    <group ref={groupRef}>
      <Logo />
      {/* This group holds all menu items and positions them on the right */}
      <group position={[3.5, 0, 0]}>
        {menuOptions.map((option, index) => (
          <MenuItem
            key={option}
            text={option}
            // The Y position is adjusted to center the menu vertically
            position={[0, 1.5 - index * 1.3, 0]}
            onClick={() => onStartGame(option)}
          />
        ))}
      </group>
    </group>
  );
};

interface MenuItemProps {
  text: string;
  position: [number, number, number];
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ text, position, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<any>(null!);
  const originalColor = "white";
  const hoverColor = "hotpink";

  useFrame((state, delta) => {
    if (meshRef.current) {
        // Animate scale
        const targetScale = hovered ? 1.3 : 1;
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);


        // Animate color
        meshRef.current.material.color.lerp(new THREE.Color(hovered ? hoverColor : originalColor), 0.1);

        // Animate rotation
        if (hovered) {
          meshRef.current.rotation.y += delta * 0.5;
          meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.2;
        } else {
          meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
          meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
        }
    }
  });

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={0.8}
      color={originalColor}
      anchorX="center"
      anchorY="middle"
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      font="/fonts/Rajdhani-Regular.ttf"
    >
      {text}
    </Text>
  );
};

export default MainMenu;