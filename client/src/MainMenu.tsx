// src/MainMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import CareerMenu from './menus/CareerMenu';
import OnlineMenu from './menus/OnlineMenu';
import PractiseMenu from './menus/PractiseMenu';
import SettingsMenu from './menus/SettingsMenu';
import DifficultyMenu from './menus/DifficultyMenu';
import TimeSelectionMenu from './menus/TimeSelectionMenu';
import ScoreSelectionMenu from './menus/ScoreSelectionMenu';

const Logo = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture('/logo.png');

  const image = texture.image;
  const aspectRatio = image ? image.width / image.height : 2;

  useFrame(({ clock }) => {
    if (meshRef.current && glowRef.current) {
      const time = clock.getElapsedTime();
      
      meshRef.current.position.y = 0.5 + Math.sin(time * 0.5) * 0.3;
      meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      const glowIntensity = 0.5 + Math.sin(time * 2) * 0.3;
      glowRef.current.material.opacity = glowIntensity * 0.3;
      glowRef.current.scale.set(1.2 + glowIntensity * 0.1, 1.2 + glowIntensity * 0.1, 1);
      
      glowRef.current.rotation.copy(meshRef.current.rotation);
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.position.z -= 0.1;
    }
  });

  return (
    <group position={[-0.2, -0.2, 0]} scale={6}>
      <mesh ref={glowRef}>
        <planeGeometry args={[aspectRatio, 1]} />
        <meshBasicMaterial color="#ff4f7b" transparent side={THREE.DoubleSide} />
      </mesh>
      
      <mesh ref={meshRef}>
        <planeGeometry args={[aspectRatio, 1]} />
        <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

interface GameConfig {
  mode: string;
  subMode: string;
  difficulty: number;
  timeLimit: number;
  scoreTarget: number;
}

interface MainMenuProps {
  menuState: string;
  onStartGame: (config: GameConfig) => void;
  onMenuNavigation: (state: string) => void;
  isTransitioning?: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  menuState, 
  onStartGame, 
  onMenuNavigation, 
  isTransitioning = false 
}) => {
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    mode: '',
    subMode: '',
    difficulty: 30,
    timeLimit: 120,
    scoreTarget: 1000
  });

  const menuOptions = [
    { text: 'Career Mode', description: 'Progress through difficulty ranks', color: '#ff4f7b', target: 'career' },
    { text: 'Online', description: 'Play with other players', color: '#4caf50', target: 'online' },
    { text: 'Practise', description: 'Free practice mode', color: '#2196f3', target: 'practise' },
    { text: 'Settings', description: 'Game settings', color: '#9c27b0', target: 'settings' }
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
          
          groupRef.current.position.x = THREE.MathUtils.lerp(-10, 0, enterEase);
          groupRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI * 0.5, 0, enterEase);
          
          if (enterProgress >= 1) {
            setAnimationPhase('idle');
          }
          break;
          
        case 'idle':
          groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.03;
          groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.015;
          groupRef.current.position.y = Math.sin(time * 0.3) * 0.05;
          break;
          
        case 'exiting':
          groupRef.current.rotation.y += delta * 3;
          groupRef.current.position.x += delta * 15;
          groupRef.current.scale.multiplyScalar(1 + delta * 2);
          break;
      }
    }
  });

  const handleMenuClick = (target: string) => {
    if (isTransitioning || animationPhase === 'exiting') return;
    onMenuNavigation(target);
  };

  const handleBackClick = () => {
    onMenuNavigation('main');
  };

  const handleConfigUpdate = (updates: Partial<GameConfig>) => {
    setGameConfig(prev => ({ ...prev, ...updates }));
  };

  const handleGameStart = () => {
    setAnimationPhase('exiting');
    setTimeout(() => onStartGame(gameConfig), 500);
  };

  const renderCurrentMenu = () => {
    switch (menuState) {
      case 'career':
        return (
          <CareerMenu 
            onBack={handleBackClick}
            onStart={() => {
              handleConfigUpdate({ mode: 'career', difficulty: 3 });
              handleGameStart();
            }}
          />
        );
      case 'online':
        return (
          <OnlineMenu 
            onBack={handleBackClick}
            onSelectMode={(mode) => {
              handleConfigUpdate({ mode: 'online', subMode: mode });
              // For now, just start the game. Later we'll add matchmaking
              handleGameStart();
            }}
          />
        );
      case 'practise':
        return (
          <PractiseMenu 
            onBack={handleBackClick}
            onSelectMode={(mode) => {
              handleConfigUpdate({ mode: 'practise', subMode: mode });
              onMenuNavigation(mode === 'time' ? 'time-selection' : 'score-selection');
            }}
          />
        );
      case 'time-selection':
        return (
          <TimeSelectionMenu 
            onBack={() => onMenuNavigation('practise')}
            onSelectTime={(timeLimit) => {
              handleConfigUpdate({ timeLimit });
              onMenuNavigation('difficulty');
            }}
          />
        );
      case 'score-selection':
        return (
          <ScoreSelectionMenu 
            onBack={() => onMenuNavigation('practise')}
            onSelectScore={(scoreTarget) => {
              handleConfigUpdate({ scoreTarget });
              onMenuNavigation('difficulty');
            }}
          />
        );
      case 'difficulty':
        return (
          <DifficultyMenu 
            onBack={() => onMenuNavigation(gameConfig.subMode === 'time' ? 'time-selection' : 'score-selection')}
            onSelectDifficulty={(difficulty) => {
              handleConfigUpdate({ difficulty });
              handleGameStart();
            }}
          />
        );
      case 'settings':
        return (
          <SettingsMenu 
            onBack={handleBackClick}
          />
        );
      default:
        return (
          <group position={[3.5, 0, 0]}>
            {menuOptions.map((option, index) => (
              <MenuItem
                key={option.text}
                {...option}
                position={[0, 1.5 - index * 1.3, 0]}
                onClick={() => handleMenuClick(option.target)}
                isDisabled={false}
                animationDelay={index * 0.2}
                animationPhase={animationPhase}
              />
            ))}
          </group>
        );
    }
  };

  return (
    <group ref={groupRef}>
      {menuState === 'main' && <Logo />}
      {renderCurrentMenu()}
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
          
          groupRef.current.position.x = THREE.MathUtils.lerp(5, 0, enterEase);
          groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.3, 1, enterEase));
          
          const opacity = enterEase;
          textRef.current.fillOpacity = opacity;
          descRef.current.fillOpacity = opacity * 0.7;
          break;
          
        case 'idle':
          const targetScale = hovered ? 1.15 : 1;
          groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
          
          const targetColor = new THREE.Color(hovered && !isDisabled ? '#ffffff' : color);
          textRef.current.color.lerp(targetColor, 0.1);
          
          glowRef.current.material.opacity = hovered && !isDisabled ? 0.3 : 0;
          glowRef.current.scale.setScalar(hovered ? 1.2 : 1);
          
          if (hovered && !isDisabled) {
            groupRef.current.position.y = Math.sin(time * 5) * 0.05;
            groupRef.current.rotation.z = Math.sin(time * 3) * 0.05;
          } else {
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
          }
          break;
          
        case 'exiting':
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
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[4, 1]} />
        <meshBasicMaterial color={color} transparent />
      </mesh>
      
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