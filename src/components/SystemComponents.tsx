import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Zmpt101bModel,
  Sct013ClampModel,
  ArduinoUnoModel,
  Esp32Model,
  LcdI2cModel,
  BulbModel,
} from './HardwareModels3D';

interface ComponentItem {
  id: string;
  category: string;
  model: string;
  description: string;
  accentColor: string;
  renderModel: (isHovered: boolean) => React.ReactNode;
}

const COMPONENTS: ComponentItem[] = [
  {
    id: 'voltage-sensor',
    category: 'Voltage sensor',
    model: 'ZMPT101B',
    description: 'Measures the mains AC voltage safely for the Arduino.',
    accentColor: '#4C72B0',
    renderModel: (isHovered) => <Zmpt101bModel isHovered={isHovered} />,
  },
  {
    id: 'current-sensor',
    category: 'Current sensor',
    model: 'SCT013 clamp',
    description: 'Clamp-on sensor that measures the load current without cutting the wire.',
    accentColor: '#DD8452',
    renderModel: (isHovered) => <Sct013ClampModel isHovered={isHovered} />,
  },
  {
    id: 'microcontroller',
    category: 'Microcontroller',
    model: 'Arduino Uno',
    description: 'Reads the voltage and current sensors and calculates power and energy.',
    accentColor: '#008184',
    renderModel: (isHovered) => <ArduinoUnoModel isHovered={isHovered} />,
  },
  {
    id: 'iot-gateway',
    category: 'IoT gateway',
    model: 'ESP32 S',
    description: 'Sends the readings over Wi-Fi to the dashboard.',
    accentColor: '#eab308',
    renderModel: (isHovered) => <Esp32Model isHovered={isHovered} />,
  },
  {
    id: 'display',
    category: 'Display',
    model: 'LCD with I2C module',
    description: 'Shows the live readings on the device. The I2C module needs only two wires.',
    accentColor: '#10b981',
    renderModel: (isHovered) => <LcdI2cModel isHovered={isHovered} />,
  },
  {
    id: 'monitored-load',
    category: 'Monitored load',
    model: 'Bulb',
    description: 'The electrical load whose voltage, current, power and energy are measured.',
    accentColor: '#f59e0b',
    renderModel: (isHovered) => <BulbModel isHovered={isHovered} />,
  },
];

const ComponentCard: React.FC<{ item: ComponentItem }> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#14213d]/60 backdrop-blur-xl border border-white/10 p-5 shadow-lg transition-all duration-300 hover:border-white/25 hover:shadow-2xl"
      style={{
        boxShadow: isHovered
          ? `0 15px 30px -10px ${item.accentColor}33, inset 0 1px 0 rgba(255, 255, 255, 0.15)`
          : '0 8px 20px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Subtle top indicator bar */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
        }}
      />

      {/* 3D Floating Bobbing Canvas View */}
      <div className="relative mb-3 h-36 w-full cursor-grab overflow-hidden rounded-xl bg-slate-950/40 border border-white/5">
        <Canvas
          camera={{ position: [0, 0, 3.4], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 4]} intensity={1.3} />
          <directionalLight position={[-3, -2, -2]} intensity={0.4} color={item.accentColor} />
          {item.renderModel(isHovered)}
        </Canvas>
        
        {/* Hover hint badge */}
        <span
          className={`pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 transition-opacity duration-200 ${
            isHovered ? 'opacity-100 text-slate-200' : 'opacity-0'
          }`}
        >
          3D Interactive
        </span>
      </div>

      {/* Hardware info typography */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {item.category}
        </span>
        <h4 className="mt-0.5 text-base font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-emerald-300">
          {item.model}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-slate-300 font-normal">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export const SystemComponents: React.FC = () => {
  return (
    <section aria-labelledby="components-heading" className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 id="components-heading" className="text-lg font-bold tracking-tight text-white">
            System Components
          </h2>
          <p className="text-xs text-slate-300">
            Hardware architecture interfacing sensors, processing telemetry, and wireless transmission.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>6 Active Nodes</span>
        </div>
      </div>

      {/* 6 responsive cards grid: 1 on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {COMPONENTS.map((item) => (
          <ComponentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
