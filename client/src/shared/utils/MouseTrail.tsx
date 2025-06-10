import React, { useRef, useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleTrailProps {
  trailLength?: number;
  lineWidth?: number;
  fadeSpeed?: number;
  color?: string;
  enabled?: boolean;
  showCustomCursor?: boolean;
}

const TrailShaderMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color('#ff6b9d') },
      uTime: { value: 0 }
    },
    vertexShader: `
      attribute float alpha;
      attribute float linePosition;
      varying float vAlpha;
      varying float vLinePosition;

      void main() {
        vAlpha = alpha;
        vLinePosition = linePosition;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      varying float vAlpha;
      varying float vLinePosition;

      void main() {
        if (vAlpha <= 0.0) discard;
        
        float shimmer = sin(vLinePosition * 10.0 + uTime * 8.0) * 0.1 + 0.9;
        float intensity = vAlpha * shimmer;
        
        gl_FragColor = vec4(uColor, intensity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
};

const CustomCursor: React.FC<{ mousePos: { x: number, y: number }, isClicking: boolean }> = ({ mousePos, isClicking }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();

  useFrame((state) => {
    if (meshRef.current && ringRef.current) {
      const x = (mousePos.x / size.width) * 2 - 1;
      const y = -(mousePos.y / size.height) * 2 + 1;
      
      const vector = new THREE.Vector3(x, y, 0);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      meshRef.current.position.copy(worldPos);
      ringRef.current.position.copy(worldPos);
      
      const time = state.clock.elapsedTime;
      const scale = isClicking ? 1.3 : 1.0;
      const pulse = 1 + Math.sin(time * 4) * 0.08;
      
      meshRef.current.scale.setScalar(scale * pulse);
      ringRef.current.scale.setScalar(scale);
      
      ringRef.current.rotation.z = time * 0.4;
    }
  });

  return (
    <group>
      <mesh ref={ringRef} position={[0, 0, 0.01]}>
        <ringGeometry args={[0.15, 0.22, 24]} />
        <meshBasicMaterial 
          color="#ff6b9d" 
          transparent 
          opacity={isClicking ? 0.7 : 0.5}
        />
      </mesh>
      
      <mesh ref={meshRef} position={[0, 0, 0.02]}>
        <circleGeometry args={[0.06, 20]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

const TrailLineRenderer: React.FC<ParticleTrailProps> = ({
  trailLength = 60,
  lineWidth = 0.03,
  fadeSpeed = 0.97,
  color = '#ff6b9d',
  showCustomCursor = true
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const trailPositions = useRef<THREE.Vector3[]>([]);
  const trailAlphas = useRef<number[]>([]);

  const { geometry, positions, alphas, linePositions } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const maxVertices = trailLength * 6;
    const pos = new Float32Array(maxVertices * 3);
    const alpha = new Float32Array(maxVertices);
    const linePosArray = new Float32Array(maxVertices);
    const indices = [];
    
    for (let i = 0; i < trailLength - 1; i++) {
      const baseIndex = i * 6;
      indices.push(
        baseIndex, baseIndex + 1, baseIndex + 2,
        baseIndex + 2, baseIndex + 1, baseIndex + 3,
        baseIndex + 2, baseIndex + 3, baseIndex + 4,
        baseIndex + 4, baseIndex + 3, baseIndex + 5
      );
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1));
    geo.setAttribute('linePosition', new THREE.BufferAttribute(linePosArray, 1));
    geo.setIndex(indices);
    
    return { geometry: geo, positions: pos, alphas: alpha, linePositions: linePosArray };
  }, [trailLength]);

  const shaderMaterial = useMemo(() => {
    const material = TrailShaderMaterial();
    material.uniforms.uColor.value = new THREE.Color(color);
    return material;
  }, [color]);

  useEffect(() => {
    const hideDefaultCursor = () => {
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
      
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          cursor: none !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
        document.body.style.cursor = 'auto';
        document.documentElement.style.cursor = 'auto';
      };
    };

    const cleanupCursor = hideDefaultCursor();
    
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
      
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      
      const vector = new THREE.Vector3(x, y, 0);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      trailPositions.current.unshift(worldPos.clone());
      trailAlphas.current.unshift(1.0);
      
      if (trailPositions.current.length > trailLength) {
        trailPositions.current = trailPositions.current.slice(0, trailLength);
        trailAlphas.current = trailAlphas.current.slice(0, trailLength);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove, { passive: true, capture: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true, capture: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true, capture: true });
    document.addEventListener('drag', handleMouseMove, { passive: true, capture: true });
    document.addEventListener('dragover', handleMouseMove, { passive: true, capture: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, { capture: true });
      document.removeEventListener('mousedown', handleMouseDown, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
      document.removeEventListener('drag', handleMouseMove, { capture: true });
      document.removeEventListener('dragover', handleMouseMove, { capture: true });
      cleanupCursor();
    };
  }, [camera, size, trailLength]);

  useFrame((state) => {
    if (!meshRef.current) return;

    shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    for (let i = 0; i < trailAlphas.current.length; i++) {
      trailAlphas.current[i] *= fadeSpeed;
    }

    const minAlpha = 0.02;
    const validIndices: number[] = [];
    for (let i = 0; i < trailAlphas.current.length; i++) {
      if (trailAlphas.current[i] > minAlpha) {
        validIndices.push(i);
      }
    }
    
    trailPositions.current = validIndices.map(i => trailPositions.current[i]);
    trailAlphas.current = validIndices.map(i => trailAlphas.current[i]);

    for (let i = 0; i < trailLength; i++) {
      const baseIndex = i * 6;
      
      if (i < trailPositions.current.length - 1) {
        const current = trailPositions.current[i];
        const next = trailPositions.current[i + 1];
        
        const direction = new THREE.Vector3().subVectors(next, current).normalize();
        const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).multiplyScalar(lineWidth);
        
        const alpha = trailAlphas.current[i];
        const nextAlpha = trailAlphas.current[i + 1];
        const linePos = i / (trailLength - 1);
        
        positions[baseIndex * 3] = current.x - perpendicular.x;
        positions[baseIndex * 3 + 1] = current.y - perpendicular.y;
        positions[baseIndex * 3 + 2] = current.z;
        
        positions[(baseIndex + 1) * 3] = current.x + perpendicular.x;
        positions[(baseIndex + 1) * 3 + 1] = current.y + perpendicular.y;
        positions[(baseIndex + 1) * 3 + 2] = current.z;
        
        positions[(baseIndex + 2) * 3] = next.x - perpendicular.x;
        positions[(baseIndex + 2) * 3 + 1] = next.y - perpendicular.y;
        positions[(baseIndex + 2) * 3 + 2] = next.z;
        
        positions[(baseIndex + 3) * 3] = next.x + perpendicular.x;
        positions[(baseIndex + 3) * 3 + 1] = next.y + perpendicular.y;
        positions[(baseIndex + 3) * 3 + 2] = next.z;
        
        positions[(baseIndex + 4) * 3] = next.x - perpendicular.x;
        positions[(baseIndex + 4) * 3 + 1] = next.y - perpendicular.y;
        positions[(baseIndex + 4) * 3 + 2] = next.z;
        
        positions[(baseIndex + 5) * 3] = next.x + perpendicular.x;
        positions[(baseIndex + 5) * 3 + 1] = next.y + perpendicular.y;
        positions[(baseIndex + 5) * 3 + 2] = next.z;
        
        for (let j = 0; j < 6; j++) {
          alphas[baseIndex + j] = j < 2 ? alpha : (j < 4 ? nextAlpha : nextAlpha);
          linePositions[baseIndex + j] = linePos;
        }
      } else {
        for (let j = 0; j < 6; j++) {
          alphas[baseIndex + j] = 0;
          linePositions[baseIndex + j] = 0;
        }
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.alpha.needsUpdate = true;
    geometry.attributes.linePosition.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} />
      {showCustomCursor && (
        <CustomCursor mousePos={mousePos} isClicking={isClicking} />
      )}
    </group>
  );
};

const MouseTrail: React.FC<ParticleTrailProps> = ({
  enabled = true,
  ...props
}) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = document.createElement('div');
    container.id = 'mouse-trail-overlay';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      background: transparent;
    `;
    
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [enabled]);

  if (!enabled || !portalContainer) return null;

  return createPortal(
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ 
        width: '100%', 
        height: '100%',
        background: 'transparent',
        pointerEvents: 'none'
      }}
      gl={{ 
        alpha: true,
        antialias: true
      }}
    >
      <TrailLineRenderer {...props} />
    </Canvas>,
    portalContainer
  );
};

export default MouseTrail;