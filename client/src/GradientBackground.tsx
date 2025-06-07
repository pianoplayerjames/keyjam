import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useMemo } from 'react'

const GradientMaterial = shaderMaterial(
  // Uniforms
  {
    u_time: 0,
    u_colorA: new THREE.Color('#330867'),
    u_colorB: new THREE.Color('#30cfd0'),
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
    varying vec2 vUv;

    float random (vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))*
            43758.5453123);
    }

    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    void main() {
      // Background Gradient
      vec2 pos = vUv;
      float n = noise(pos * 5.0 + u_time * 0.2);
      vec3 gradient = mix(u_colorA, u_colorB, pos.y + n * 0.1);

      // Starfield Layer
      vec2 star_uv = vUv;
      star_uv.y -= u_time * 0.03; // Stars float upwards

      star_uv *= 10.0; // Scale to create a 10x10 grid

      vec2 tile_id = floor(star_uv);
      vec2 tiled_uv = fract(star_uv);

      // Jitter the position of the star within each tile
      vec2 star_center = vec2(0.5, 0.5);
      star_center.x += random(tile_id) * 0.8 - 0.4;
      star_center.y += random(tile_id + vec2(1.0, 0.0)) * 0.8 - 0.4;

      // Create a twinkling effect for each star
      float twinkle = sin(u_time * 3.0 + random(tile_id) * 6.28) * 0.5 + 0.5;
      twinkle = smoothstep(0.8, 1.0, twinkle); // Make the twinkle sharp

      // Draw a star (diamond shape) based on distance to the jittered center
      float d = abs(tiled_uv.x - star_center.x) + abs(tiled_uv.y - star_center.y);
      float star_shape = 1.0 - smoothstep(0.0, 0.07, d); // Small, sharp diamond

      float stars = star_shape * twinkle;
      vec3 star_color = vec3(1.0, 1.0, 0.9) * stars; // Soft white star color

      // Combine gradient and stars
      gl_FragColor = vec4(gradient + star_color, 1.0);
    }
  `
)

extend({ GradientMaterial })

const comboColors = [
  { colorA: '#330867', colorB: '#30cfd0' },
  { colorA: '#ff4f7b', colorB: '#ffc107' },
  { colorA: '#4caf50', colorB: '#2196f3' },
  { colorA: '#9c27b0', colorB: '#f44336' },
];

const GradientBackground = ({ combo }: { combo: number }) => {
  const ref = useRef<THREE.ShaderMaterial>(null!)
  
  const { colorA, colorB } = useMemo(() => {
    const colorIndex = Math.floor(combo / 10) % comboColors.length;
    return comboColors[colorIndex];
  }, [combo]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.u_time.value = clock.getElapsedTime()
      ref.current.uniforms.u_colorA.value.lerp(new THREE.Color(colorA), 0.05);
      ref.current.uniforms.u_colorB.value.lerp(new THREE.Color(colorB), 0.05);
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