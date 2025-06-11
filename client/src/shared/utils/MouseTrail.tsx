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
  cursorStyle?: 'modern' | 'gaming' | 'minimal' | 'magnetic' | 'morphing' | 'subtle' | 'micro';
  opacity?: number;
  size?: number;
  hideWhenIdle?: boolean;
  idleTimeout?: number;
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

const SubtleCursor: React.FC<{ 
  mousePos: { x: number, y: number }, 
  isClicking: boolean, 
  isHovering: boolean,
  opacity: number,
  size: number,
  isIdle: boolean
}> = ({ mousePos, isClicking, isHovering, opacity, size, isIdle }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { camera, size: canvasSize } = useThree();

  useFrame((state) => {
    if (meshRef.current && ringRef.current) {
      const x = (mousePos.x / canvasSize.width) * 2 - 1;
      const y = -(mousePos.y / canvasSize.height) * 2 + 1;
      
      const vector = new THREE.Vector3(x, y, 0);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      meshRef.current.position.copy(worldPos);
      ringRef.current.position.copy(worldPos);
      
      const time = state.clock.elapsedTime;
      const clickScale = isClicking ? 0.7 : 1.0;
      const hoverScale = isHovering ? 1.3 : 1.0;
      const idleScale = isIdle ? 0.5 : 1.0;
      const pulse = 1 + Math.sin(time * 4) * 0.05;
      
      meshRef.current.scale.setScalar(clickScale * pulse * size * idleScale);
      ringRef.current.scale.setScalar(hoverScale * pulse * size * idleScale);
      
      ringRef.current.rotation.z = time * 0.2;
      
      const finalOpacity = opacity * (isIdle ? 0.3 : 1.0);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = finalOpacity;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = finalOpacity * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <ringGeometry args={[0.08, 0.1, 16]} />
        <meshBasicMaterial 
          color="#ff6b9d" 
          transparent 
          opacity={opacity * 0.4}
        />
      </mesh>
      
      <mesh ref={meshRef} position={[0, 0, 0.01]}>
        <circleGeometry args={[0.03, 12]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={opacity * 0.8}
        />
      </mesh>
    </group>
  );
};

const MicroCursor: React.FC<{ 
  mousePos: { x: number, y: number }, 
  isClicking: boolean, 
  isHovering: boolean,
  opacity: number,
  size: number,
  isIdle: boolean
}> = ({ mousePos, isClicking, isHovering, opacity, size, isIdle }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, size: canvasSize } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const x = (mousePos.x / canvasSize.width) * 2 - 1;
      const y = -(mousePos.y / canvasSize.height) * 2 + 1;
      
      const vector = new THREE.Vector3(x, y, 0);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      meshRef.current.position.copy(worldPos);
      
      const clickScale = isClicking ? 0.5 : 1.0;
      const hoverScale = isHovering ? 1.5 : 1.0;
      const idleScale = isIdle ? 0.2 : 1.0;
      
      meshRef.current.scale.setScalar(clickScale * hoverScale * size * idleScale * 0.5);
      
      const finalOpacity = opacity * (isIdle ? 0.2 : 1.0);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = finalOpacity;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <circleGeometry args={[0.02, 8]} />
      <meshBasicMaterial 
        color={isHovering ? "#ffffff" : "#ff6b9d"} 
        transparent 
        opacity={opacity}
      />
    </mesh>
  );
};

const ModernCursorMinimal: React.FC<{ 
  mousePos: { x: number, y: number }, 
  isClicking: boolean, 
  isHovering: boolean,
  opacity: number,
  size: number,
  isIdle: boolean
}> = ({ mousePos, isClicking, isHovering, opacity, size, isIdle }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { camera, size: canvasSize } = useThree();

  useFrame((state) => {
    if (meshRef.current && ringRef.current) {
      const x = (mousePos.x / canvasSize.width) * 2 - 1;
      const y = -(mousePos.y / canvasSize.height) * 2 + 1;
      
      const vector = new THREE.Vector3(x, y, 0);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      meshRef.current.position.copy(worldPos);
      ringRef.current.position.copy(worldPos);
      
      const time = state.clock.elapsedTime;
      const clickScale = isClicking ? 0.8 : 1.0;
      const hoverScale = isHovering ? 1.2 : 1.0;
      const idleScale = isIdle ? 0.4 : 1.0;
      const pulse = 1 + Math.sin(time * 3) * 0.03;
      
      meshRef.current.scale.setScalar(clickScale * pulse * size * 0.7 * idleScale);
      ringRef.current.scale.setScalar(hoverScale * pulse * size * 0.8 * idleScale);
      
      ringRef.current.rotation.z = time * 0.15;
      
      const finalOpacity = opacity * (isIdle ? 0.2 : 1.0);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = finalOpacity * 0.7;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = finalOpacity * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <ringGeometry args={[0.06, 0.08, 12]} />
        <meshBasicMaterial 
          color="#ff6b9d" 
          transparent 
          opacity={opacity * 0.3}
        />
      </mesh>
      
      <mesh ref={meshRef} position={[0, 0, 0.01]}>
        <circleGeometry args={[0.025, 10]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={opacity * 0.6}
        />
      </mesh>
    </group>
  );
};

const CustomCursor: React.FC<{ 
  mousePos: { x: number, y: number }, 
  isClicking: boolean,
  cursorStyle: 'modern' | 'gaming' | 'minimal' | 'magnetic' | 'morphing' | 'subtle' | 'micro',
  opacity: number,
  size: number,
  isIdle: boolean
}> = ({ mousePos, isClicking, cursorStyle, opacity, size, isIdle }) => {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const checkHover = () => {
      const elements = document.elementsFromPoint(mousePos.x, mousePos.y);
      const isHoveringInteractive = elements.some(el => 
        el.tagName === 'BUTTON' || 
        el.tagName === 'A' || 
        el.getAttribute('role') === 'button' ||
        el.classList.contains('clickable') ||
        window.getComputedStyle(el).cursor === 'pointer'
      );
      setIsHovering(isHoveringInteractive);
    };

    checkHover();
  }, [mousePos]);

  const renderCursor = () => {
    const props = { mousePos, isClicking, isHovering, opacity, size, isIdle };
    
    switch (cursorStyle) {
      case 'subtle':
        return <SubtleCursor {...props} />;
      case 'micro':
        return <MicroCursor {...props} />;
      case 'minimal':
        return <ModernCursorMinimal {...props} />;
      default:
        return <ModernCursorMinimal {...props} />;
    }
  };

  return renderCursor();
};

const TrailLineRenderer: React.FC<ParticleTrailProps> = ({
  trailLength = 60,
  lineWidth = 0.015,
  fadeSpeed = 0.97,
  color = '#ff6b9d',
  showCustomCursor = true,
  cursorStyle = 'subtle',
  opacity = 0.6,
  size = 0.8,
  hideWhenIdle = true,
  idleTimeout = 2000
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, size: canvasSize } = useThree();
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
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
    if (hideWhenIdle) {
      const checkIdle = () => {
        const now = Date.now();
        setIsIdle(now - lastMoveTime > idleTimeout);
      };

      const interval = setInterval(checkIdle, 100);
      return () => clearInterval(interval);
    }
  }, [lastMoveTime, idleTimeout, hideWhenIdle]);

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
      setLastMoveTime(Date.now());
      setIsIdle(false);
      
      const x = (event.clientX / canvasSize.width) * 2 - 1;
      const y = -(event.clientY / canvasSize.height) * 2 + 1;
      
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
  }, [camera, canvasSize, trailLength]);

  useFrame((state) => {
    if (!meshRef.current) return;

    shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    const trailOpacity = isIdle ? opacity * 0.3 : opacity;

    for (let i = 0; i < trailAlphas.current.length; i++) {
      trailAlphas.current[i] *= fadeSpeed;
    }

    const minAlpha = 0.01;
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
        
        const alpha = trailAlphas.current[i] * trailOpacity;
        const nextAlpha = trailAlphas.current[i + 1] * trailOpacity;
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
        <CustomCursor 
          mousePos={mousePos} 
          isClicking={isClicking} 
          cursorStyle={cursorStyle}
          opacity={opacity}
          size={size}
          isIdle={isIdle}
        />
      )}
    </group>
  );
};

const MouseTrail: React.FC<ParticleTrailProps> = ({
  enabled = true,
  cursorStyle = 'subtle',
  opacity = 0.6,
  size = 0.8,
  hideWhenIdle = true,
  idleTimeout = 2000,
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
      <TrailLineRenderer 
        cursorStyle={cursorStyle}
        opacity={opacity}
        size={size}
        hideWhenIdle={hideWhenIdle}
        idleTimeout={idleTimeout}
        {...props} 
      />
    </Canvas>,
    portalContainer
  );
};

export default MouseTrail;