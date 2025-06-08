// client/src/components/AnimatedBackground.tsx
import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// This is the 3D part of the background
const BackgroundScene = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const particlesRef = useRef<THREE.Points>(null!);

    const particleCount = 150;
    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        return { positions, velocities };
    }, []);


    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.05;
        }

        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];

                if (Math.abs(positions[i * 3]) > 10) velocities[i * 3] *= -1;
                if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
                if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <mesh ref={meshRef} position={[0, 0, -15]}>
                <torusKnotGeometry args={[3, 1, 128, 16]} />
                <meshBasicMaterial color="#ff1493" wireframe transparent opacity={0.1} />
            </mesh>

            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={positions}
                        count={particleCount}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color="#00ffff"
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>
        </>
    );
};


// This is the main component that combines all background layers
export const AnimatedBackground: React.FC = () => {
    return (
        <div
            className="fixed inset-0 overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            }}
        >
            {/* Three.js Background */}
            <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <Suspense fallback={null}>
                        <BackgroundScene />
                    </Suspense>
                </Canvas>
            </div>

            {/* Animated triangles overlay (osu! style) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {useMemo(() =>
                    Array.from({ length: 15 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute opacity-10"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 30 + 10}px`,
                                height: `${Math.random() * 30 + 10}px`,
                                background: `linear-gradient(45deg, #ff69b4, #9c27b0)`,
                                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                                animation: `float ${Math.random() * 15 + 10}s infinite linear`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        />
                    )), []
                )}
            </div>

            <style jsx>{`
                @keyframes float {
                  from {
                    transform: translateY(100vh) rotate(0deg);
                  }
                  to {
                    transform: translateY(-100px) rotate(360deg);
                  }
                }
              `}</style>
        </div>
    );
};