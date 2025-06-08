import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useGameStore } from './stores/gameStore'

const GradientMaterial = shaderMaterial(
  // Uniforms
  {
    u_time: 0,
    u_colorA: new THREE.Color('#330867'),
    u_colorB: new THREE.Color('#30cfd0'),
    u_colorC: new THREE.Color('#ff006e'),
    u_combo: 0,
    u_intensity: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(uv * 2.0 - 1.0, 1.0, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float u_time;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    uniform vec3 u_colorC;
    uniform float u_combo;
    uniform float u_intensity;
    varying vec2 vUv;

    // Hash function for better randomness
    float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    // Improved noise function
    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    // Fractal brownian motion
    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    // Hexagonal distance for honeycomb pattern
    float hexDist(vec2 p) {
        p = abs(p);
        return max(dot(p, normalize(vec2(1.0, 1.73))), p.x);
    }

    // Create pulsing circles
    float circles(vec2 uv, float time) {
        vec2 center1 = vec2(0.3, 0.7) + 0.2 * vec2(sin(time * 0.8), cos(time * 0.6));
        vec2 center2 = vec2(0.7, 0.3) + 0.2 * vec2(cos(time * 0.7), sin(time * 0.9));
        vec2 center3 = vec2(0.5, 0.5) + 0.1 * vec2(sin(time * 1.2), cos(time * 1.1));
        
        float d1 = length(uv - center1);
        float d2 = length(uv - center2);
        float d3 = length(uv - center3);
        
        float circle1 = smoothstep(0.2, 0.0, d1) * sin(time * 2.0 + d1 * 10.0);
        float circle2 = smoothstep(0.15, 0.0, d2) * sin(time * 1.5 + d2 * 8.0);
        float circle3 = smoothstep(0.1, 0.0, d3) * sin(time * 3.0 + d3 * 12.0);
        
        return (circle1 + circle2 + circle3) * 0.3;
    }

    // Energy waves
    float waves(vec2 uv, float time) {
        float wave1 = sin(uv.x * 8.0 + time * 2.0) * 0.5 + 0.5;
        float wave2 = sin(uv.y * 12.0 + time * 1.5) * 0.5 + 0.5;
        float wave3 = sin((uv.x + uv.y) * 6.0 + time * 2.5) * 0.5 + 0.5;
        
        return (wave1 * wave2 + wave3) * 0.2;
    }

    // Grid pattern for tech feel
    float grid(vec2 uv, float time) {
        vec2 grid_uv = uv * 20.0 + time * 0.5;
        vec2 grid_id = floor(grid_uv);
        vec2 grid_fract = fract(grid_uv);
        
        float line_x = smoothstep(0.0, 0.05, grid_fract.x) * smoothstep(1.0, 0.95, grid_fract.x);
        float line_y = smoothstep(0.0, 0.05, grid_fract.y) * smoothstep(1.0, 0.95, grid_fract.y);
        
        float grid_intensity = (line_x + line_y) * 0.1;
        
        // Add some random bright spots
        float bright_spot = step(0.98, hash(grid_id + floor(time * 2.0)));
        grid_intensity += bright_spot * 0.5;
        
        return grid_intensity;
    }

    // Particle field
    float particles(vec2 uv, float time) {
        vec2 particle_uv = uv * 15.0;
        particle_uv.y += time * 3.0; // Particles move upward
        
        vec2 particle_id = floor(particle_uv);
        vec2 particle_pos = fract(particle_uv);
        
        // Random position within cell
        vec2 offset = vec2(hash(particle_id), hash(particle_id + vec2(1.0, 0.0)));
        offset = offset * 0.8 + 0.1; // Keep particles away from edges
        
        float dist = length(particle_pos - offset);
        float particle_size = 0.02 + 0.03 * hash(particle_id + vec2(2.0, 0.0));
        
        // Twinkle effect
        float twinkle = sin(time * 5.0 + hash(particle_id) * 6.28) * 0.5 + 0.5;
        twinkle = smoothstep(0.3, 1.0, twinkle);
        
        float particle = smoothstep(particle_size, 0.0, dist) * twinkle;
        return particle * 0.4;
    }

    void main() {
        vec2 uv = vUv;
        
        // Base gradient with combo-influenced colors
        float combo_factor = min(u_combo / 50.0, 1.0);
        vec3 base_gradient = mix(
            mix(u_colorA, u_colorB, uv.y + fbm(uv * 2.0 + u_time * 0.1) * 0.3),
            u_colorC,
            combo_factor * 0.4
        );
        
        // Add dynamic effects
        float effect_intensity = u_intensity * (1.0 + combo_factor);
        
        // Energy waves
        float wave_effect = waves(uv, u_time) * effect_intensity;
        
        // Pulsing circles
        float circle_effect = circles(uv, u_time) * effect_intensity;
        
        // Tech grid (more prominent at higher combos)
        float grid_effect = grid(uv, u_time) * combo_factor * 2.0;
        
        // Particle field
        float particle_effect = particles(uv, u_time);
        
        // Combine all effects
        vec3 final_color = base_gradient;
        final_color += wave_effect * u_colorB;
        final_color += circle_effect * u_colorC;
        final_color += grid_effect * vec3(1.0, 1.0, 0.8);
        final_color += particle_effect * vec3(1.0, 1.0, 1.0);
        
        // Add some overall glow based on combo
        final_color *= (1.0 + combo_factor * 0.5);
        
        // Vignette effect
        float vignette = 1.0 - length(uv - 0.5) * 0.8;
        final_color *= vignette;
        
        gl_FragColor = vec4(final_color, 1.0);
    }
  `
)

extend({ GradientMaterial })

const comboColors = [
  { colorA: '#1a0033', colorB: '#330066', colorC: '#ff006e' },    // Purple/Pink - Base
  { colorA: '#ff1744', colorB: '#ff9800', colorC: '#ffeb3b' },    // Red/Orange/Yellow - Fire
  { colorA: '#00e676', colorB: '#00bcd4', colorC: '#3f51b5' },    // Green/Cyan/Blue - Cool
  { colorA: '#9c27b0', colorB: '#e91e63', colorC: '#ff5722' },    // Purple/Pink/Red - Hot
  { colorA: '#ffc107', colorB: '#ff9800', colorC: '#f44336' },    // Gold/Orange/Red - Intense
  { colorA: '#00e5ff', colorB: '#1de9b6', colorC: '#76ff03' },    // Cyan/Teal/Lime - Electric
];

const GradientBackground = () => {
  const ref = useRef<THREE.ShaderMaterial>(null!)
  const combo = useGameStore((state) => state.combo)
  
  const { colorA, colorB, colorC } = useMemo(() => {
    const colorIndex = Math.floor(combo / 10) % comboColors.length;
    return comboColors[colorIndex];
  }, [combo]);

  // Intensity based on combo for more dramatic effects
  const intensity = useMemo(() => {
    return 1.0 + Math.min(combo / 20.0, 2.0);
  }, [combo]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.u_time.value = clock.getElapsedTime()
      ref.current.uniforms.u_combo.value = combo
      ref.current.uniforms.u_intensity.value = intensity
      
      // Smooth color transitions
      ref.current.uniforms.u_colorA.value.lerp(new THREE.Color(colorA), 0.02);
      ref.current.uniforms.u_colorB.value.lerp(new THREE.Color(colorB), 0.02);
      ref.current.uniforms.u_colorC.value.lerp(new THREE.Color(colorC), 0.02);
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore */}
      <gradientMaterial ref={ref} depthWrite={false} />
    </mesh>
  )
}

export default GradientBackground;