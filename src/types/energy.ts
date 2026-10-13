export interface DeviceReading {
  deviceName: string;
  voltage: number; // Volts
  current: number; // Amperes
  power: number;   // Watts
}

export interface MetricSample {
  id: number;
  timestamp: number;
  timeLabel: string; // HH:MM:SS
  voltage: number;   // Average across devices (V)
  current: number;   // Sum across devices (A)
  power: number;     // Total power (W)
  energy: number;    // Cumulative energy (kWh)
  devices: DeviceReading[];
}

export interface KpiSummary {
  voltage: number;      // Average V
  current: number;      // Sum A
  power: number;        // Current total W
  peakPower: number;    // Max total kW in window
  totalEnergy: number;  // Cumulative kWh
  isLive: boolean;
}
