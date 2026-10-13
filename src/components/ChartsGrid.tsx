import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MetricSample } from '../types/energy';

interface ChartsGridProps {
  data: MetricSample[];
}

interface ChartCardConfig {
  id: string;
  title: string;
  unit: string;
  dataKey: keyof MetricSample;
  color: string;
  decimals: number;
  domain: [string | number | ((min: number) => number), string | number | ((max: number) => number)];
  yTickFormatter: (val: number) => string;
}

const CHART_CONFIGS: ChartCardConfig[] = [
  {
    id: 'voltage',
    title: 'Voltage',
    unit: 'V',
    dataKey: 'voltage',
    color: '#4C72B0',
    decimals: 1,
    domain: [
      (min: number) => Math.floor(min - 1.5),
      (max: number) => Math.ceil(max + 1.5),
    ],
    yTickFormatter: (val: number) => `${val.toFixed(0)} V`,
  },
  {
    id: 'current',
    title: 'Current',
    unit: 'A',
    dataKey: 'current',
    color: '#DD8452',
    decimals: 2,
    domain: [
      (min: number) => Math.max(0, Number((min - 0.4).toFixed(1))),
      (max: number) => Number((max + 0.4).toFixed(1)),
    ],
    yTickFormatter: (val: number) => `${val.toFixed(1)} A`,
  },
  {
    id: 'power',
    title: 'Power',
    unit: 'W',
    dataKey: 'power',
    color: '#55A868',
    decimals: 1,
    domain: [
      (min: number) => Math.floor(min - 80),
      (max: number) => Math.ceil(max + 80),
    ],
    yTickFormatter: (val: number) => `${(val / 1000).toFixed(2)} kW`,
  },
  {
    id: 'energy',
    title: 'Cumulative Energy',
    unit: 'kWh',
    dataKey: 'energy',
    color: '#8172B3',
    decimals: 4,
    domain: ['auto', 'auto'],
    yTickFormatter: (val: number) => `${val.toFixed(3)}`,
  },
];

// Custom 3D perspective grid SVG drawn beneath the chart
const PerspectiveGridUnderlay: React.FC<{ color: string }> = ({ color }) => (
  <div className="pointer-events-none absolute inset-x-4 bottom-8 top-16 overflow-hidden opacity-20">
    <svg
      className="h-full w-full"
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`persp-fade-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.05" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Perspective converging depth lines */}
      {[-80, -40, 0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480].map((x, i) => (
        <line
          key={i}
          x1="200"
          y1="-30"
          x2={x}
          y2="200"
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.35"
        />
      ))}

      {/* Perspective horizontal rungs spaced exponentially towards bottom */}
      {[50, 80, 110, 138, 162, 182, 198].map((y, i) => (
        <line
          key={`rung-${i}`}
          x1="0"
          y1={y}
          x2="400"
          y2={y}
          stroke={color}
          strokeWidth={0.7 + i * 0.25}
          strokeOpacity={0.25 + i * 0.1}
        />
      ))}
    </svg>
  </div>
);

// Custom Tooltip component
const CustomTooltip = ({
  active,
  payload,
  unit,
  decimals,
  color,
}: {
  active?: boolean;
  payload?: any[];
  unit: string;
  decimals: number;
  color: string;
}) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload as MetricSample;
  const val = payload[0].value as number;

  return (
    <div className="rounded-xl border border-white/15 bg-[#0b1220]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        <span className="font-mono">{point.timeLabel}</span>
        <span className="h-1 w-1 rounded-full bg-slate-500" />
        <span className="text-slate-300 font-medium">Sample #{point.id % 10000}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-base font-bold font-mono text-white">
          {typeof val === 'number' ? val.toFixed(decimals) : val}
        </span>
        <span className="text-xs font-semibold" style={{ color }}>
          {unit}
        </span>
      </div>
    </div>
  );
};

export const ChartsGrid: React.FC<ChartsGridProps> = ({ data }) => {
  const latestSample = data[data.length - 1];

  return (
    <section aria-label="Live Telemetry Charts" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {CHART_CONFIGS.map((config) => {
          const currentValue = latestSample
            ? (latestSample[config.dataKey] as number)
            : 0;

          // Glowing dot renderer at newest point (index === data.length - 1)
          const renderCustomDot = (dotProps: any) => {
            const { cx, cy, index } = dotProps;
            if (index !== data.length - 1) return null;

            return (
              <g key={`glow-dot-${index}`}>
                {/* Pulsing glow aura */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={8}
                  fill={config.color}
                  fillOpacity={0.4}
                  className="animate-pulse"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={13}
                  fill={config.color}
                  fillOpacity={0.15}
                />
                {/* Crisp center dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#ffffff"
                  stroke={config.color}
                  strokeWidth={2}
                />
              </g>
            );
          };

          return (
            <div
              key={config.id}
              className="relative overflow-hidden rounded-2xl bg-[#14213d]/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl transition-all duration-300 hover:border-white/20"
              style={{
                boxShadow: `0 10px 30px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
              }}
            >
              {/* Header inside Chart Card */}
              <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{
                      backgroundColor: config.color,
                      boxShadow: `0 0 10px ${config.color}`,
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide text-white">
                      {config.title}
                    </h3>
                    <span className="text-[11px] text-slate-300">
                      Rolling 60s window (1 Hz)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1 font-mono">
                    <span className="text-xl font-bold tracking-tight text-white">
                      {currentValue.toFixed(config.decimals)}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: config.color }}
                    >
                      {config.unit}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300">Latest read</span>
                </div>
              </div>

              {/* 3D Perspective Grid Underlay */}
              <PerspectiveGridUnderlay color={config.color} />

              {/* Chart Visual Canvas */}
              <div className="relative z-10 mt-3 h-56 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 12, right: 12, left: -14, bottom: 0 }}
                  >
                    <defs>
                      {/* Soft gradient fill under the line */}
                      <linearGradient
                        id={`gradient-${config.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={config.color}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="50%"
                          stopColor={config.color}
                          stopOpacity={0.12}
                        />
                        <stop
                          offset="100%"
                          stopColor={config.color}
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                      {/* Glow drop-shadow filter for the trace line */}
                      <filter
                        id={`glow-${config.id}`}
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="4"
                          stdDeviation="4"
                          floodColor={config.color}
                          floodOpacity="0.75"
                        />
                      </filter>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff"
                      strokeOpacity={0.05}
                      vertical={false}
                    />

                    <XAxis
                      dataKey="timeLabel"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff', strokeOpacity: 0.1 }}
                      minTickGap={25}
                    />

                    <YAxis
                      domain={config.domain}
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff', strokeOpacity: 0.1 }}
                      tickFormatter={config.yTickFormatter}
                      width={52}
                    />

                    <Tooltip
                      content={
                        <CustomTooltip
                          unit={config.unit}
                          decimals={config.decimals}
                          color={config.color}
                        />
                      }
                      cursor={{
                        stroke: config.color,
                        strokeWidth: 1,
                        strokeDasharray: '4 4',
                        strokeOpacity: 0.6,
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey={config.dataKey}
                      stroke={config.color}
                      strokeWidth={2.4}
                      fill={`url(#gradient-${config.id})`}
                      dot={renderCustomDot}
                      activeDot={{
                        r: 6,
                        fill: '#ffffff',
                        stroke: config.color,
                        strokeWidth: 2.5,
                      }}
                      style={{
                        filter: `drop-shadow(0px 3px 6px ${config.color}88)`,
                      }}
                      isAnimationActive={false} // Rolling real-time window moves frame by frame without lag
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Status and telemetry bounds footer */}
              <div className="relative z-10 mt-2 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                <span>Buffer: {data.length} / 60</span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Signal Synced
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
