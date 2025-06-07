import { Sparkles } from '@react-three/drei'

interface SparklesEffectProps {
    heldKeys: Set<string>;
    letters: string;
    channelPositions: number[];
    channelColors: string[];
}

const SparklesEffect = ({ heldKeys, letters, channelPositions, channelColors }: SparklesEffectProps) => {
    return (
        <>
            {letters.split('').map((letter, index) => {
                if (heldKeys.has(letter)) {
                    const xPos = channelPositions[index];
                    const color = channelColors[index];
                    return (
                        <Sparkles
                            key={letter}
                            position={[xPos, 0.2, 3]} // Positioned in the hit zone
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

export default SparklesEffect;