// client/src/Fretboard.tsx
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from './stores/gameStore'

const allLetters = '12345678'
const allChannelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0', '#f44336', '#673ab7', '#00bcd4']

const Fretboard = () => {
  const hitTargetRef = useRef<THREE.Mesh>(null!)
  const { heldKeys, gameConfig } = useGameStore()
  const lanes = gameConfig.lanes || 5;

  const letters = allLetters.slice(0, lanes);
  const channelColors = allChannelColors.slice(0, lanes);
  const channelPositions = Array.from({ length: lanes }, (_, i) => i - (lanes - 1) / 2);
  const fretboardWidth = lanes;

  useFrame(({ clock }) => {
    if (hitTargetRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 10) * 0.1;
      hitTargetRef.current.scale.set(1 + pulse * 0.1, 1 + pulse * 0.1, 1);
    }
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
        <planeGeometry args={[fretboardWidth, 30]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {Array.from({ length: lanes - 1 }).map((_, i) => (
        <mesh key={i} position={[i - (lanes - 1) / 2 + 0.5, 0.01, -10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 30]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}

      <mesh ref={hitTargetRef} position={[0, 0.1, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[fretboardWidth - 0.2, 1.2]} />
        <meshStandardMaterial color="white" transparent opacity={0.25} />
      </mesh>

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