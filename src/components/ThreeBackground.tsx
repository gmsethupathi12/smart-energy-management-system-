import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function ParticleField({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 280;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    // Palette: Voltage (#4C72B0), Current (#DD8452), Power (#55A868), Energy (#8172B3)
    const colorPalette = [
      new THREE.Color('#4C72B0'),
      new THREE.Color('#DD8452'),
      new THREE.Color('#55A868'),
      new THREE.Color('#8172B3'),
      new THREE.Color('#6488c4'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function PerspectiveGridFloor({ reducedMotion }: { reducedMotion: boolean }) {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !gridRef.current) return;
    const t = state.clock.getElapsedTime();
    gridRef.current.position.z = (t * 0.4) % 2;
  });

  return (
    <group ref={gridRef} position={[0, -7.5, -4]} rotation={[-Math.PI / 2.3, 0, 0]}>
      <gridHelper
        args={[50, 40, '#2d4373', '#162340']}
      />
    </group>
  );
}

export const ThreeBackground: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#060913] via-[#0c1426] to-[#04060d]"
    >
      {/* Soft radial glow centers */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#4C72B0]/10 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#14213d]/40 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] rounded-full bg-[#8172B3]/10 blur-3xl" />

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        className="h-full w-full opacity-80"
      >
        <ambientLight intensity={0.4} />
        <ParticleField reducedMotion={reducedMotion} />
        <PerspectiveGridFloor reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};
