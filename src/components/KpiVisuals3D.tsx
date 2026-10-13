import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// 1. Voltage: Glowing 3D sine-wave ribbon
export const VoltageRibbon: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Create ribbon geometry from sine wave
  const geometry = useMemo(() => {
    const segments = 48;
    const vertices: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 4;
      const x = (i / segments - 0.5) * 3.2;
      const y = Math.sin(u) * 0.55;
      const z = Math.cos(u) * 0.3;
      const ribbonWidth = 0.18;

      // Two points per segment to form a ribbon strip
      vertices.push(x, y - ribbonWidth, z);
      vertices.push(x, y + ribbonWidth, z);

      if (i < segments) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.9;
    meshRef.current.rotation.z = Math.sin(t * 0.6) * 0.2;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#4C72B0"
        emissive="#4C72B0"
        emissiveIntensity={0.65}
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.7}
      />
    </mesh>
  );
};

// 2. Current: Slowly spinning 3D torus / coil
export const CurrentTorus: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = t * 0.7;
    groupRef.current.rotation.y = t * 0.85;
  });

  return (
    <group ref={groupRef}>
      {/* Outer coil torus */}
      <mesh>
        <torusGeometry args={[0.95, 0.22, 20, 48]} />
        <meshStandardMaterial
          color="#DD8452"
          emissive="#DD8452"
          emissiveIntensity={0.5}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>
      {/* Inner accent ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.08, 16, 32]} />
        <meshStandardMaterial
          color="#ffaa77"
          emissive="#DD8452"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// 3. Power: Pulsing sphere whose size follows power value
export const PowerSphere: React.FC<{ powerWatts: number }> = ({ powerWatts }) => {
  const sphereRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Normalize scale: baseline around 2900W -> scale 1.0, varies smoothly
  const targetScale = useMemo(() => {
    const normalized = Math.min(1.4, Math.max(0.7, powerWatts / 2900));
    return normalized;
  }, [powerWatts]);

  useFrame((state, delta) => {
    if (!sphereRef.current) return;
    const t = state.clock.getElapsedTime();
    const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 4) * 0.06;
    const s = targetScale * pulse;
    sphereRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    if (!reducedMotion) {
      sphereRef.current.rotation.y += delta * 0.6;
      sphereRef.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <group ref={sphereRef}>
      {/* Core glowing sphere */}
      <mesh>
        <sphereGeometry args={[0.78, 24, 24]} />
        <meshStandardMaterial
          color="#55A868"
          emissive="#55A868"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      {/* Wireframe outer shell */}
      <mesh>
        <sphereGeometry args={[0.92, 16, 16]} />
        <meshBasicMaterial
          color="#8fe09f"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
};

// 4. Energy: 3D stacked cylinder that grows in height as cumulative energy increases
export const EnergyStackedCylinder: React.FC<{ energyKWh: number }> = ({ energyKWh }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Height factor based on cumulative energy
  // Baseline ~0.045 -> factor 1.0, scales upward smoothly
  const heightMultiplier = useMemo(() => {
    const factor = 0.85 + (energyKWh - 0.045) * 20;
    return Math.min(1.6, Math.max(0.7, factor));
  }, [energyKWh]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!reducedMotion) {
      groupRef.current.rotation.y += delta * 0.75;
    }
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, heightMultiplier, 0.08);
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Bottom cylinder segment */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.45, 32]} />
        <meshStandardMaterial
          color="#8172B3"
          emissive="#8172B3"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Middle cylinder segment */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.45, 32]} />
        <meshStandardMaterial
          color="#9b8ccd"
          emissive="#8172B3"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Top cylinder segment */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.45, 32]} />
        <meshStandardMaterial
          color="#b8abe0"
          emissive="#8172B3"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
};
