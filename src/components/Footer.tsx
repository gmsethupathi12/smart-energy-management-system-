import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full pt-4 pb-10 text-center">
      <div className="mx-auto inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 rounded-full border border-white/10 bg-[#14213d]/50 px-5 py-2 backdrop-blur-md shadow-lg text-xs text-slate-300">
        <span className="font-medium text-slate-200">
          Power = Voltage x Current x power factor (0.92).
        </span>
        <span className="hidden sm:inline text-slate-500">·</span>
        <span className="text-[11px] text-slate-400 font-mono">
          Single-phase 50Hz AC Prototype Telemetry
        </span>
      </div>
    </footer>
  );
};
