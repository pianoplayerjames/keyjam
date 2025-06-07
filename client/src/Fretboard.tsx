import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FretboardProps {
    heldKeys: Set<string>;
    letters: string;
    channelPositions: number[];
    channelColors: string[];
}

const Fretboard = ({ heldKeys, letters, channelPositions, channelColors }: FretboardProps) => {
  const hitTargetRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (hitTargetRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 10) * 0.1;
      hitTargetRef.current.scale.set(1 + pulse * 0.1, 1 + pulse * 0.1, 1);
    }
  });

  return (
    <>
      {/* Fretboard Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
        <planeGeometry args={[5, 30]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Channel Lines */}
      {[-1.5, -0.5, 0.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 0.01, -10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 30]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}

      {/* Hit Target */}
      <mesh ref={hitTargetRef} position={[0, 0.1, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 1.2]} />
        <meshStandardMaterial color="white" transparent opacity={0.25} />
      </mesh>

      {/* Channel Highlights */}
      {channelPositions.map((x, index) => {
        const letter = letters[index];
        const isHeld = heldKeys.has(letter);
        const color = channelColors[index];

        return (
          <mesh key={x} position={[x, 0.015, -10]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.95, 30]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isHeld ? 2 : 0}
                transparent
                opacity={isHeld ? 0.25 : 0}
              />
          </mesh>
        )
      })}
    </>
  )
}

export default React.memo(Fretboard)