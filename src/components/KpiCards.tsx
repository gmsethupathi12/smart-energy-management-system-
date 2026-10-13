import React, { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { KpiSummary } from '../types/energy';
import {
  VoltageRibbon,
  CurrentTorus,
  PowerSphere,
  EnergyStackedCylinder,
} from './KpiVisuals3D';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface KpiCardsProps {
  summary: KpiSummary;
}

interface TiltCardProps {
  children: React.ReactNode;
  accentColor: string;
  reducedMotion: boolean;
  className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  accentColor,
  reducedMotion,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

      // Tilt toward pointer
      const rotateX = -y * 14;
      const rotateY = x * 14;
      setTransformStyle(
        `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) translateZ(10px)`
      );
    },
    [reducedMotion]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: reducedMotion ? 'none' : transformStyle,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
        borderColor: isHovered ? `${accentColor}88` : 'rgba(255, 255, 255, 0.09)',
        boxShadow: isHovered
          ? `0 20px 35px -10px ${accentColor}33, 0 0 15px 1px ${accentColor}22, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
          : '0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      className={`relative overflow-hidden rounded-2xl bg-[#14213d]/65 backdrop-blur-xl border p-5 ${className}`}
    >
      {/* Top subtle highlight line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
      {children}
    </div>
  );
};

export const KpiCards: React.FC<KpiCardsProps> = ({ summary }) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section aria-label="Key Performance Indicators" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* 1. Voltage Card */}
        <TiltCard accentColor="#4C72B0" reducedMotion={reducedMotion}>
          <div className="flex items-start justify-between">
            <div className="z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Average Voltage
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {summary.voltage.toFixed(1)}
                </span>
                <span className="text-lg font-semibold text-[#4C72B0]">V</span>
              </div>
              <p className="mt-1 text-xs text-slate-300 font-medium">Nominal 230 V</p>
            </div>

            {/* 3D element in corner */}
            <div className="relative h-20 w-20 flex-shrink-0 -mr-2 -mt-2">
              <Canvas
                camera={{ position: [0, 0, 3], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                dpr={[1, 1.5]}
              >
                <ambientLight intensity={0.7} />
                <directionalLight position={[2, 4, 3]} intensity={1.2} />
                <VoltageRibbon />
              </Canvas>
            </div>
          </div>
          {/* Subtle indicator bar */}
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, ((summary.voltage - 210) / 40) * 100))}%`,
                backgroundColor: '#4C72B0',
              }}
            />
          </div>
        </TiltCard>

        {/* 2. Current Card */}
        <TiltCard accentColor="#DD8452" reducedMotion={reducedMotion}>
          <div className="flex items-start justify-between">
            <div className="z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Average Current
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {summary.current.toFixed(2)}
                </span>
                <span className="text-lg font-semibold text-[#DD8452]">A</span>
              </div>
              <p className="mt-1 text-xs text-slate-300 font-medium">Sum across all devices</p>
            </div>

            {/* 3D element in corner */}
            <div className="relative h-20 w-20 flex-shrink-0 -mr-2 -mt-2">
              <Canvas
                camera={{ position: [0, 0, 3.2], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                dpr={[1, 1.5]}
              >
                <ambientLight intensity={0.8} />
                <directionalLight position={[2, 3, 4]} intensity={1.4} />
                <CurrentTorus />
              </Canvas>
            </div>
          </div>
          {/* Subtle indicator bar */}
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, (summary.current / 20) * 100))}%`,
                backgroundColor: '#DD8452',
              }}
            />
          </div>
        </TiltCard>

        {/* 3. Peak Power Card */}
        <TiltCard accentColor="#55A868" reducedMotion={reducedMotion}>
          <div className="flex items-start justify-between">
            <div className="z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Peak Power
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {summary.peakPower.toFixed(3)}
                </span>
                <span className="text-lg font-semibold text-[#55A868]">kW</span>
              </div>
              <p className="mt-1 text-xs text-slate-300 font-medium">Highest reading in view</p>
            </div>

            {/* 3D element in corner */}
            <div className="relative h-20 w-20 flex-shrink-0 -mr-2 -mt-2">
              <Canvas
                camera={{ position: [0, 0, 3.2], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                dpr={[1, 1.5]}
              >
                <ambientLight intensity={0.7} />
                <pointLight position={[0, 0, 2]} intensity={1.5} color="#8fe09f" />
                <directionalLight position={[2, 3, 2]} intensity={1.0} />
                <PowerSphere powerWatts={summary.power} />
              </Canvas>
            </div>
          </div>
          {/* Instantaneous power subtext & bar */}
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, (summary.power / 4500) * 100))}%`,
                backgroundColor: '#55A868',
              }}
            />
          </div>
        </TiltCard>

        {/* 4. Total Energy Card */}
        <TiltCard accentColor="#8172B3" reducedMotion={reducedMotion}>
          <div className="flex items-start justify-between">
            <div className="z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Total Energy
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {summary.totalEnergy.toFixed(4)}
                </span>
                <span className="text-lg font-semibold text-[#8172B3]">kWh</span>
              </div>
              <p className="mt-1 text-xs text-slate-300 font-medium">Cumulative since start</p>
            </div>

            {/* 3D element in corner */}
            <div className="relative h-20 w-20 flex-shrink-0 -mr-2 -mt-2">
              <Canvas
                camera={{ position: [0, 0, 3.4], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                dpr={[1, 1.5]}
              >
                <ambientLight intensity={0.8} />
                <directionalLight position={[3, 4, 3]} intensity={1.4} />
                <EnergyStackedCylinder energyKWh={summary.totalEnergy} />
              </Canvas>
            </div>
          </div>
          {/* Subtle indicator bar */}
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(15, (summary.totalEnergy / 0.1) * 100))}%`,
                backgroundColor: '#8172B3',
              }}
            />
          </div>
        </TiltCard>

      </div>
    </section>
  );
};
