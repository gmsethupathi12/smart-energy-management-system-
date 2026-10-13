import { MetricSample, DeviceReading } from '../types/energy';

export const POWER_FACTOR = 0.92;
export const MAX_HISTORY_POINTS = 60;

interface DeviceConfig {
  name: string;
  baseVoltage: number;
  baseCurrent: number;
  frequency: number; // in Hz
  phase: number;
  voltageNoiseAmp: number;
  currentNoiseAmp: number;
}

const DEVICE_CONFIGS: DeviceConfig[] = [
  {
    name: 'Device 1 (Lab Bench)',
    baseVoltage: 230,
    baseCurrent: 4.0,
    frequency: 0.07,
    phase: 0.0,
    voltageNoiseAmp: 0.45,
    currentNoiseAmp: 0.12,
  },
  {
    name: 'Device 2 (Motor Load)',
    baseVoltage: 228,
    baseCurrent: 7.0,
    frequency: 0.05,
    phase: 1.2,
    voltageNoiseAmp: 0.55,
    currentNoiseAmp: 0.22,
  },
  {
    name: 'Device 3 (Solar Inverter)',
    baseVoltage: 232,
    baseCurrent: 3.0,
    frequency: 0.09,
    phase: 2.5,
    voltageNoiseAmp: 0.4,
    currentNoiseAmp: 0.15,
  },
];

/**
 * Pseudo-random gaussian/smooth noise for natural physical telemetry.
 */
function getSmoothNoise(timeSeconds: number, seed: number): number {
  return (
    Math.sin(timeSeconds * 1.7 + seed * 10) * 0.5 +
    Math.cos(timeSeconds * 3.1 + seed * 5) * 0.3 +
    Math.sin(timeSeconds * 7.3 + seed * 2) * 0.2
  );
}

// ==========================================================================
// Replace this with live readings from the ESP32 (WebSocket, MQTT or HTTP)
// ==========================================================================
/**
 * Reads electrical telemetry from a specific device at a given point in time.
 * When integrating physical hardware, replace the simulation logic in this
 * function or swap with `fetchLatestReadingsFromGateway()`.
 */
export function readSignal(deviceIndex: number, timeSeconds: number): { V: number; I: number } {
  const config = DEVICE_CONFIGS[deviceIndex] || DEVICE_CONFIGS[0];
  
  // Natural sinusoidal variation according to specified frequency
  const omega = 2 * Math.PI * config.frequency;
  const primaryWave = Math.sin(omega * timeSeconds + config.phase);
  
  // Secondary harmonic for realism
  const secondaryWave = 0.25 * Math.sin(2 * omega * timeSeconds + config.phase * 1.5);
  
  // Organic noise fluctuation
  const noiseV = getSmoothNoise(timeSeconds, deviceIndex * 3 + 1) * config.voltageNoiseAmp;
  const noiseI = getSmoothNoise(timeSeconds, deviceIndex * 3 + 2) * config.currentNoiseAmp;

  // Compute instantaneous V and I
  // Voltage has a gentle swing (+/- 1.8V) around nominal
  const V = config.baseVoltage + (primaryWave * 1.6 + secondaryWave * 0.4) + noiseV;
  // Current varies by +/- 8% around rated load
  const currentFluctuation = (primaryWave * 0.35 + secondaryWave * 0.15) * (config.baseCurrent / 4.0);
  const I = Math.max(0.1, config.baseCurrent + currentFluctuation + noiseI);

  return {
    V: Number(V.toFixed(2)),
    I: Number(I.toFixed(3)),
  };
}

/**
 * High-level telemetry fetcher designed to allow instantaneous switching between
 * local simulated signals and a live ESP32 endpoint (e.g., REST API / IoT Gateway).
 */
export async function fetchLatestReadings(timeSeconds: number): Promise<{
  devices: DeviceReading[];
  isOnline: boolean;
}> {
  // If integrating live ESP32 via HTTP endpoint, uncomment the snippet below:
  /*
  try {
    const res = await fetch('/api/esp32/telemetry', { cache: 'no-store' });
    if (!res.ok) throw new Error('ESP32 unreachable');
    const json = await res.json();
    return { devices: json.devices, isOnline: true };
  } catch (err) {
    console.warn('ESP32 telemetry unavailable, falling back:', err);
    return { devices: [], isOnline: false };
  }
  */

  // Default simulated real-time feed:
  const devices: DeviceReading[] = DEVICE_CONFIGS.map((config, index) => {
    const { V, I } = readSignal(index, timeSeconds);
    const P = V * I * POWER_FACTOR;
    return {
      deviceName: config.name,
      voltage: V,
      current: I,
      power: P,
    };
  });

  return {
    devices,
    isOnline: true,
  };
}

/**
 * Format a Date object as HH:MM:SS
 */
export function formatTimeLabel(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/**
 * Generates an initial buffer of the past 60 seconds of telemetry
 * so the dashboard loads with full rolling charts right from startup.
 */
export function generateInitialHistory(): {
  history: MetricSample[];
  cumulativeEnergy: number;
} {
  const history: MetricSample[] = [];
  const now = Date.now();
  let cumulativeEnergy = 0.0450; // Starting historical baseline in kWh

  for (let i = MAX_HISTORY_POINTS - 1; i >= 0; i--) {
    const sampleTimestamp = now - i * 1000;
    const sampleDate = new Date(sampleTimestamp);
    const timeSec = sampleTimestamp / 1000;

    const deviceReadings: DeviceReading[] = DEVICE_CONFIGS.map((cfg, idx) => {
      const { V, I } = readSignal(idx, timeSec);
      const P = V * I * POWER_FACTOR;
      return {
        deviceName: cfg.name,
        voltage: V,
        current: I,
        power: P,
      };
    });

    const avgVoltage =
      deviceReadings.reduce((sum, d) => sum + d.voltage, 0) / deviceReadings.length;
    const sumCurrent = deviceReadings.reduce((sum, d) => sum + d.current, 0);
    const totalPower = deviceReadings.reduce((sum, d) => sum + d.power, 0);

    // Energy tick: P (Watts) / 1000 = kW * (1 / 3600 h) = kWh
    const energyDeltaKWh = (totalPower / 1000) * (1 / 3600);
    cumulativeEnergy += energyDeltaKWh;

    history.push({
      id: sampleTimestamp,
      timestamp: sampleTimestamp,
      timeLabel: formatTimeLabel(sampleDate),
      voltage: Number(avgVoltage.toFixed(2)),
      current: Number(sumCurrent.toFixed(3)),
      power: Number(totalPower.toFixed(2)),
      energy: Number(cumulativeEnergy.toFixed(6)),
      devices: deviceReadings,
    });
  }

  return { history, cumulativeEnergy };
}
