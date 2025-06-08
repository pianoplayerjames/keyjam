// client/src/SparklesEffect.tsx
import { Sparkles } from '@react-three/drei'
import { useGameStore } from './stores/gameStore'

const letters = '12345'
const channelPositions = [-2, -1, 0, 1, 2]
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0']

const SparklesEffect = () => {
    const { heldKeys } = useGameStore()

    return (
        <>
            {letters.split('').map((letter, index) => {
                if (heldKeys.has(letter)) {
                    const xPos = channelPositions[index];
                    const color = channelColors[index];
                    return (
                        <Sparkles
                            key={letter}
                            position={[xPos, 0.2, 3]}
                            count={50}
                            scale={1.5}
                            size={5}
                            speed={1}
                            noise={1}
                            color={color}
                        />
                    )
                }
                return null;
            })}
        </>
    )
}

export default SparklesEffect