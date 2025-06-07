// src/menus/PractiseMenu.tsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PractiseMenuProps {
  onBack: () => void;
  onSelectMode: (mode: string) => void;
}

const PractiseMenu: React.FC<PractiseMenuProps> = ({ onBack, onSelectMode }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [enterTime, setEnterTime] = useState(0);

  const practiseOptions = [
    { 
      text: 'Score Based', 
      description: 'Play until you reach a target score', 
      color: '#ff9800',
      mode: 'score'
    },
    { 
      text: 'Time Based', 
      description: 'Play for a set amount of time', 
      color: '#9c27b0',
      mode: 'time'
    }
  ];

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

     {/* Practise Title */}
     <group position={[0, 2, 0]}>
       <Text
         fontSize={1.2}
         color="#2196f3"
         anchorX="center"
         anchorY="middle"
         font="/fonts/Rajdhani-Regular.ttf"
         outlineWidth={0.02}
         outlineColor="black"
       >
         PRACTISE MODE
       </Text>
     </group>

     {/* Description */}
     <group position={[0, 1.2, 0]}>
       <Text
         fontSize={0.4}
         color="#cccccc"
         anchorX="center"
         anchorY="middle"
         maxWidth={8}
         textAlign="center"
       >
         Choose your practice mode and customize your session
       </Text>
     </group>

     {/* Options */}
     {practiseOptions.map((option, index) => (
       <PractiseMenuItem
         key={option.text}
         {...option}
         position={[0, 0.3 - index * 1.2, 0]}
         onClick={() => onSelectMode(option.mode)}
         animationDelay={index * 0.3}
       />
     ))}
   </group>
 );
};

interface PractiseMenuItemProps {
 text: string;
 description: string;
 color: string;
 mode: string;
 position: [number, number, number];
 onClick: () => void;
 animationDelay: number;
}

const PractiseMenuItem: React.FC<PractiseMenuItemProps> = ({
 text,
 description,
 color,
 position,
 onClick,
 animationDelay
}) => {
 const [hovered, setHovered] = useState(false);
 const groupRef = useRef<THREE.Group>(null!);
 const [localTime, setLocalTime] = useState(0);

 useFrame((state, delta) => {
   setLocalTime(prev => prev + delta);
   
   if (groupRef.current) {
     const progress = Math.max(0, Math.min((localTime - animationDelay) / 1.0, 1));
     const ease = THREE.MathUtils.smoothstep(progress, 0, 1);
     
     groupRef.current.position.x = THREE.MathUtils.lerp(6, 0, ease);
     groupRef.current.scale.setScalar(ease);
     
     const targetScale = hovered ? 1.1 : 1;
     groupRef.current.scale.multiplyScalar(THREE.MathUtils.lerp(groupRef.current.scale.x / ease, targetScale, 0.1));
   }
 });

 return (
   <group ref={groupRef} position={position}>
     <mesh>
       <planeGeometry args={[6, 1]} />
       <meshBasicMaterial 
         color={color} 
         transparent 
         opacity={hovered ? 0.8 : 0.6} 
       />
     </mesh>
     
     <Text
       position={[0, 0.15, 0.01]}
       fontSize={0.6}
       color="#ffffff"
       anchorX="center"
       anchorY="middle"
       font="/fonts/Rajdhani-Regular.ttf"
       onPointerOver={() => setHovered(true)}
       onPointerOut={() => setHovered(false)}
       onClick={onClick}
     >
       {text}
     </Text>
     
     <Text
       position={[0, -0.25, 0.01]}
       fontSize={0.3}
       color="#cccccc"
       anchorX="center"
       anchorY="middle"
     >
       {description}
     </Text>
   </group>
 );
};

export default PractiseMenu;