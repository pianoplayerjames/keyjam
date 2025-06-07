import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface FallingLetterProps {
  id: number
  letter: string
  position: [number, number, number]
  duration?: number
  color?: string
  isMissed?: boolean
  isHit?: boolean
  isBeingHeld?: boolean
  opacity?: number
}

const FallingLetter = ({ position, letter, duration = 0, color = 'hotpink', isMissed, isHit, isBeingHeld, opacity = 1 }: FallingLetterProps) => {
  const trailHeight = duration || 0;
  const noteHeadSize = 1.2; 
  const borderColor = new THREE.Color(color).multiplyScalar(0.5);

  if (trailHeight + noteHeadSize < 0.1) {
    return null;
  }

  // The trail will glow intensely when successfully held
  const emissiveIntensity = isBeingHeld ? 5 : 2;

  return (
    <group position={position}>
      <group position={[0, 0.05, -0.8 - trailHeight / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        
        <RoundedBox args={[1, trailHeight + noteHeadSize, 0.1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color={borderColor} emissive={borderColor} emissiveIntensity={1} transparent opacity={0.9 * opacity} />
        </RoundedBox>

        <RoundedBox args={[0.9, trailHeight + noteHeadSize - 0.1, 0.1]} radius={0.05} smoothness={4} position={[0, 0, 0.01]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissiveIntensity} transparent opacity={1 * opacity} />
        </RoundedBox>

        {isMissed && !isBeingHeld && ( // The cap should hide if we are holding the note
          <RoundedBox args={[0.9, noteHeadSize - 0.1, 0.1]} radius={0.05} smoothness={4} position={[0, -trailHeight / 2, 0.02]} >
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissiveIntensity} transparent opacity={1 * opacity} />
          </RoundedBox>
        )}

        <Text position={[0, -trailHeight / 2 + 0.15, 0.5]} rotation={[Math.PI / 2, 0, 0]} fontSize={1} color="white" anchorX="center" anchorY="middle" textAlign="center" fillOpacity={opacity}>
          {letter}
        </Text>
      </group>
    </group>
  )
}

export default FallingLetter