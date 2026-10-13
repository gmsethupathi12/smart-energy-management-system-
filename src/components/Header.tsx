import React, { useRef, useState, useCallback } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface HeaderProps {
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLive }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [tiltStyle, setTiltStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotateX = -y * 6; // gentle tilt
      const rotateY = x * 6;
      setTiltStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`);
    },
    [reducedMotion]
  );

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <header
      ref={headerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: reducedMotion ? 'none' : tiltStyle,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
      }}
      className="relative z-10 w-full overflow-hidden rounded-2xl bg-[#14213d]/70 backdrop-blur-xl border border-white/10 p-5 sm:p-6 shadow-2xl shadow-black/40"
    >
      {/* Soft inner highlight top border */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute -top-16 left-1/3 h-32 w-72 rounded-full bg-[#4C72B0]/15 blur-2xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Smart Energy Management System
            </h1>

            {/* LIVE / OFFLINE Status Badge */}
            {isLive ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                role="status"
                aria-label="Live stream active"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                LIVE
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/40 bg-slate-800/40 px-2.5 py-0.5 text-xs font-medium tracking-wider text-slate-400"
                role="status"
                aria-label="Offline"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-slate-500" />
                OFFLINE
              </span>
            )}
          </div>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-normal">
            Prototype monitoring: voltage, current, power and energy
          </p>
        </div>

        {/* Ambient telemetry indicators */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4C72B0]" />
            <span>230V AC</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#55A868]" />
            <span>PF 0.92</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8172B3]" />
            <span>1 Hz Stream</span>
          </div>
        </div>
      </div>
    </header>
  );
};
