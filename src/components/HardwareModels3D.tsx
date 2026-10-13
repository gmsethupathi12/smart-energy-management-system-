import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ModelProps {
  isHovered: boolean;
}

// 1. ZMPT101B Voltage Sensor: Blue PCB with micro-transformer coil & trimpot
export const Zmpt101bModel: React.FC<ModelProps> = ({ isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (!reducedMotion) {
      groupRef.current.position.y = Math.sin(t * 2.2) * 0.08;
    }
    const targetRotY = isHovered ? t * 1.8 : t * 0.5;
    groupRef.current.rotation.y = reducedMotion ? (isHovered ? 0.6 : 0) : targetRotY;
    groupRef.current.rotation.x = isHovered ? 0.35 : 0.2;
  });

  return (
    <group ref={groupRef} scale={1.15}>
      {/* PCB Base */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1.6, 0.08, 1.1]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Blue Voltage Transformer Coil Cylinder */}
      <mesh position={[-0.2, 0.22, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.6, 24]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.4} emissive="#1d4ed8" emissiveIntensity={0.3} />
      </mesh>
      {/* Blue Top cap */}
      <mesh position={[-0.2, 0.53, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 24]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Blue Trimpot Adjustment Potentiometer */}
      <mesh position={[0.45, 0.08, 0.15]}>
        <boxGeometry args={[0.32, 0.38, 0.32]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>
      {/* Trimpot brass screw */}
      <mesh position={[0.45, 0.28, 0.15]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* 4-pin Header */}
      <mesh position={[0.55, -0.05, -0.3]}>
        <boxGeometry args={[0.15, 0.22, 0.4]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
    </group>
  );
};

// 2. SCT013 Clamp: Split-core current transformer clamp
export const Sct013ClampModel: React.FC<ModelProps> = ({ isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (!reducedMotion) {
      groupRef.current.position.y = Math.sin(t * 2.0 + 1) * 0.08;
    }
    const targetRotY = isHovered ? t * 1.8 : t * 0.5;
    groupRef.current.rotation.y = reducedMotion ? (isHovered ? 0.6 : 0) : targetRotY;
    groupRef.current.rotation.x = isHovered ? 0.3 : 0.15;
  });

  return (
    <group ref={groupRef} scale={1.1}>
      {/* Main split-core clamp body (ring loop) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.26, 16, 32]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Clamp Latch & Handle Block */}
      <mesh position={[0, -0.75, 0]}>
        <boxGeometry args={[0.5, 0.65, 0.42]} />
        <meshStandardMaterial color="#0369a1" roughness={0.5} />
      </mesh>
      {/* Yellow core hinge clip */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.3, 0.18, 0.35]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Cable lead */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.45, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* 3.5mm Audio/Sensor Jack */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// 3. Arduino Uno Microcontroller
export const ArduinoUnoModel: React.FC<ModelProps> = ({ isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (!reducedMotion) {
      groupRef.current.position.y = Math.sin(t * 2.1 + 2) * 0.08;
    }
    const targetRotY = isHovered ? t * 1.8 : t * 0.5;
    groupRef.current.rotation.y = reducedMotion ? (isHovered ? 0.6 : 0) : targetRotY;
    groupRef.current.rotation.x = isHovered ? 0.45 : 0.3;
  });

  return (
    <group ref={groupRef} scale={1.05}>
      {/* Teal Arduino Board */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.8, 0.08, 1.3]} />
        <meshStandardMaterial color="#008184" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Silver USB Type-B Port */}
      <mesh position={[-0.75, 0.18, -0.3]}>
        <boxGeometry args={[0.38, 0.28, 0.35]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Black DC Barrel Jack */}
      <mesh position={[-0.75, 0.18, 0.35]}>
        <boxGeometry args={[0.42, 0.32, 0.32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      {/* ATmega328P DIP IC Chip */}
      <mesh position={[0.2, 0.08, 0.15]}>
        <boxGeometry args={[0.75, 0.1, 0.25]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      {/* Female Header Pin Strips (Top & Bottom rails) */}
      <mesh position={[0.2, 0.1, -0.55]}>
        <boxGeometry args={[1.1, 0.18, 0.12]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.1, 0.55]}>
        <boxGeometry args={[1.1, 0.18, 0.12]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>
      {/* Red Reset Button */}
      <mesh position={[-0.6, 0.1, -0.5]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>
    </group>
  );
};

// 4. ESP32 S: Metallic RF shield & golden PCB antenna
export const Esp32Model: React.FC<ModelProps> = ({ isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (!reducedMotion) {
      groupRef.current.position.y = Math.sin(t * 1.9 + 3) * 0.08;
    }
    const targetRotY = isHovered ? t * 1.8 : t * 0.5;
    groupRef.current.rotation.y = reducedMotion ? (isHovered ? 0.6 : 0) : targetRotY;
    groupRef.current.rotation.x = isHovered ? 0.4 : 0.25;
  });

  return (
    <group ref={groupRef} scale={1.1}>
      {/* Black PCB Carrier */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.4, 0.08, 1.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      {/* Silver Metallic RF Shield Can (ESP-WROOM-32) */}
      <mesh position={[0, 0.12, 0.15]}>
        <boxGeometry args={[0.95, 0.14, 0.95]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Meandered PCB Antenna Traces (Gold) */}
      <mesh position={[0, 0.02, -0.65]}>
        <boxGeometry args={[0.8, 0.03, 0.35]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Micro USB Port */}
      <mesh position={[0, 0.1, 0.92]}>
        <boxGeometry args={[0.3, 0.12, 0.15]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Side Pin Headers */}
      <mesh position={[-0.62, -0.15, 0]}>
        <boxGeometry args={[0.08, 0.35, 1.6]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.62, -0.15, 0]}>
        <boxGeometry args={[0.08, 0.35, 1.6]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// 5. LCD with I2C Module: Backlit display with 2-wire I2C backpack
export const LcdI2cModel: React.FC<ModelProps> = ({ isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (!reducedMotion) {
      groupRef.current.position.y = Math.sin(t * 2.3 + 4) * 0.08;
    }
    const targetRotY = isHovered ? t * 1.8 : t * 0.5;
    groupRef.current.rotation.y = reducedMotion ? (isHovered ? 0.6 : 0) : targetRotY;
    groupRef.current.rotation.x = isHovered ? 0.35 : 0.2;
  });

  return (
    <group ref={groupRef} scale={1.1}>
      {/* Green LCD Module PCB Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.8, 0.08, 1.1]} />
        <meshStandardMaterial color="#15803d" roughness={0.4} />
      </mesh>
      {/* Dark Bezel Frame */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.85]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      {/* Glowing Blue Backlit LCD Screen */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.3, 0.04, 0.65]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0284c7"
          emissiveIntensity={0.65}
          roughness={0.15}
        />
      </mesh>
      {/* Rear I2C Backpack module PCB (underneath) */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.6]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.5} />
      </mesh>
      {/* 4-pin I2C connector header (VCC, GND, SDA, SCL) */}
      <mesh position={[0.55, -0.22, 0]}>
        <boxGeometry args={[0.12, 0.15, 0.35]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

// 6. Monitored Load: Bulb with glowing filament & brass screw base
export const BulbModel: React.FC<ModelProps> = ({ isHovered }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (!reducedMotion) {
      groupRef.current.position.y = Math.sin(t * 1.8 + 5) * 0.08;
    }
    const targetRotY = isHovered ? t * 1.8 : t * 0.5;
    groupRef.current.rotation.y = reducedMotion ? (isHovered ? 0.6 : 0) : targetRotY;
    groupRef.current.rotation.x = isHovered ? 0.25 : 0.1;
  });

  return (
    <group ref={groupRef} scale={1.05}>
      {/* Glass Bulb Sphere */}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#eab308"
          emissiveIntensity={0.7}
          transparent
          opacity={0.75}
          roughness={0.1}
        />
      </mesh>
      {/* Inner Glowing Filament */}
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[0.18, 0.04, 16, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fbbf24"
          emissiveIntensity={1.4}
        />
      </mesh>
      {/* Filament Stem mount */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Brass Screw Base */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.45, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Base Contact Solder Tip */}
      <mesh position={[0, -0.72, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};
