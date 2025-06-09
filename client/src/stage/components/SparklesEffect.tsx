// client/src/SparklesEffect.tsx
import { Sparkles } from '@react-three/drei'
import { useGameStore } from '../../shared/stores/gameStore'
import { useState, useEffect } from 'react';

const letters = '12345'
const channelPositions = [-2, -1, 0, 1, 2]
const channelColors = ['#ff4f7b', '#ffc107', '#4caf50', '#2196f3', '#9c27b0']

const SparklesEffect = () => {
    const heldKeys = useGameStore((state) => state.heldKeys)
    const [lastHeldKey, setLastHeldKey] = useState<string | null>(null);

    useEffect(() => {
        if (heldKeys.size > 0) {
            setLastHeldKey(Array.from(heldKeys).pop()!);
        }
    }, [heldKeys]);


    if (heldKeys.size === 0 || !lastHeldKey) {
        return null;
    }

    const index = letters.indexOf(lastHeldKey);
    if (index === -1) {
        return null;
    }

    const xPos = channelPositions[index];
    const color = channelColors[index];

    return (
        <Sparkles
            key={lastHeldKey}
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

export default SparklesEffect