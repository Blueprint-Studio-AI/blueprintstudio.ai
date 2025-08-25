"use client";

import { MutableRefObject, useEffect, useRef } from 'react'
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useTrailTexture } from '@react-three/drei'
import { useTheme } from 'next-themes' // lub twój provider
import * as THREE from 'three'
import { extend } from "@react-three/fiber";
import type { ReactThreeFiber } from "@react-three/fiber";

const DotMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    dotColor: new THREE.Color('#FFFFFF'),
    bgColor: new THREE.Color('#121212'),
    mouseTrail: null,
    render: 0,
    rotation: 0,
    gridSize: 70,
    dotOpacity: 0.05,
    dotScale: 0.2,
    dotCap: 0.2
  },
  /* glsl */ `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform int render;
    uniform vec2 resolution;
    uniform vec3 dotColor;
    uniform vec3 bgColor;
    uniform sampler2D mouseTrail;
    uniform float rotation;
    uniform float gridSize;
    uniform float dotOpacity;
    uniform float dotScale;
    uniform float dotCap;

    vec2 rotate(vec2 uv, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        mat2 rotationMatrix = mat2(c, -s, s, c);
        return rotationMatrix * (uv - 0.5) + 0.5;
    }

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 rotatedUv = rotate(uv, rotation);

      // Create a grid
      vec2 gridUv = fract(rotatedUv * gridSize);
      vec2 gridUvCenterInScreenCoords = rotate((floor(rotatedUv * gridSize) + 0.5) / gridSize, -rotation);

      // Calculate distance from the center of each cell
      float baseDot = sdfCircle(gridUv, 0.25);

      // Keep center distance for size shaping only (no opacity fade)
      vec2 centerDisplace = vec2(0.7, 1.1);
      float circleMaskCenter = length(uv - centerDisplace);

      // Mouse trail effect — sharper curve and higher gain
      float mouseInfluence = texture2D(mouseTrail, gridUvCenterInScreenCoords).r; // 0..1
      float m = pow(mouseInfluence, 0.6); // brighten the mid range
      float scaleInfluence = m * 1.75; // stronger size reaction

      // Create dots with animated scale, influenced by mouse
      float dotSize = min(pow(circleMaskCenter, 2.0) * dotScale, dotCap);

      float sdfDot = sdfCircle(gridUv, dotSize * (1.0 + scaleInfluence));

      float smoothDot = smoothstep(0.03, 0.0, sdfDot);

      float dotAlpha = smoothDot * dotOpacity * (m * 4.0); // no opacity if no mouse influence
      vec3 dotCol = mix(dotColor, vec3(1.0), m * 1.2); // brighten toward white under cursor
      vec3 composition = mix(bgColor, dotCol, dotAlpha);

      gl_FragColor = vec4(composition, dotAlpha);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
)

extend({ DotMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    dotMaterial: any;
  }
}

function Scene() {
  const size = useThree((s) => s.size)
  const viewport = useThree((s) => s.viewport)
  const { theme } = useTheme()
  const matRef = useRef<any>(null);

  const rotation = 0
  const gridSize = 160

  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          dotColor: '#FFFFFF',
          bgColor: '#121212',
          dotOpacity: 0.025
        }
      case 'light':
        return {
          dotColor: '#e1e1e1',
          bgColor: '#F4F5F5',
          dotOpacity: 0.15
        }
      default:
        return {
          dotColor: '#FFFFFF',
          bgColor: '#121212',
          dotOpacity: 0.05
        }
    }
  }

  const themeColors = getThemeColors()

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.1,
    maxAge: 200,
    interpolate: 1,
    ease: function easeInOutCirc(x) {
      return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
    }
  })

  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.dotColor.value = new THREE.Color(themeColors.dotColor);
    matRef.current.uniforms.bgColor.value = new THREE.Color(themeColors.bgColor);
    matRef.current.uniforms.dotOpacity.value = themeColors.dotOpacity;
  }, [themeColors]);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.time.value = state.clock.elapsedTime;
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    onMove(e)
  }

  const scale = Math.max(viewport.width, viewport.height) / 2

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={handlePointerMove}>
      <planeGeometry args={[2, 2]} />
      <dotMaterial
        ref={matRef}
        time={0}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        dotColor={new THREE.Color(themeColors.dotColor)}
        bgColor={new THREE.Color(themeColors.bgColor)}
        dotOpacity={themeColors.dotOpacity}
        dotScale={0.15}
        dotCap={0.2}
        rotation={rotation}
        gridSize={gridSize}
        mouseTrail={trail}
        render={0}
      />
    </mesh>
  )
}

const DotScreenShader = ({ zoneRef } : { zoneRef: MutableRefObject<HTMLDivElement | null> }) => {
  return (
    <Canvas
      // eventSource={zoneRef.current ?? undefined}
      eventSource={typeof window !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping,
        alpha: true,
      }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <Scene />
    </Canvas>
  )
}

export default DotScreenShader;