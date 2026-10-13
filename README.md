# Smart Energy Management System

A real-time electrical prototype monitoring dashboard built with **React**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Three.js** (`@react-three/fiber` & `@react-three/drei`).

This dashboard visualizes real-time electrical metrics (Voltage, Current, Power, and Cumulative Energy) measured by an IoT-enabled electrical monitoring prototype.

---

## ⚡ Features

- **3D Interactive Background**: Deep space navy gradient with a drifting field of soft glowing particles and perspective grid floor.
- **Glassmorphic Parallax Header & KPI Cards**:
  - **Average Voltage (V)**: Nominal 230 V nominal with a rotating 3D sine-wave ribbon.
  - **Average Current (A)**: Combined current with a rotating 3D torus coil.
  - **Peak Power (kW)**: Highest power reading with a pulsing 3D wireframe power sphere.
  - **Total Energy (kWh)**: Cumulative energy with a growing 3D stacked cylinder.
  - Interactive mouse tilt and parallax lift (with full `prefers-reduced-motion` accessibility support).
- **Live 1 Hz Rolling Line Charts**:
  - 60-second sliding window that smoothly scrolls in real time.
  - Soft gradient fills, glowing newest-sample cursor dots, and 3D perspective grid underlays.
  - Voltage (V), Current (A), Power (W), and Cumulative Energy (kWh).
- **System Components Overview**:
  - Interactive 3D floating and bobbing models for each hardware node with hover rotation.
- **Formulas & Standards**:
  - Active Power: $P = V \times I \times \text{power factor (0.92)}$
  - Cumulative Energy: $E = \int \frac{P}{1000} \, dt$ (kWh)

---

## 🛠️ Hardware Architecture

| Component | Model | Purpose |
| :--- | :--- | :--- |
| **Voltage Sensor** | ZMPT101B | Measures mains AC voltage safely for the microcontroller |
| **Current Sensor** | SCT013 clamp | Non-invasive split-core clamp measuring AC load current |
| **Microcontroller** | Arduino Uno | Reads analog sensor signals and computes power & energy |
| **IoT Gateway** | ESP32 S | Transmits telemetry packets wirelessly via Wi-Fi |
| **Display** | LCD with I2C module | Local 2-wire display of live electrical readings on device |
| **Monitored Load** | Bulb / Test Load | Physical load whose telemetry is monitored |

---

## 🔌 Connecting Real ESP32 Hardware

The data layer in `src/data/energySimulator.ts` is designed for drop-in replacement with real hardware telemetry:

```typescript
// src/data/energySimulator.ts
export async function fetchLatestReadings(timeSeconds: number): Promise<{
  devices: DeviceReading[];
  isOnline: boolean;
}> {
  // Replace the simulated feed with your live ESP32 endpoint:
  const res = await fetch('http://<ESP32_IP_ADDRESS>/api/telemetry');
  const data = await res.json();
  return { devices: data.devices, isOnline: true };
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
cd <YOUR_REPO_NAME>
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm run preview
```

---

## 📄 License
Apache-2.0
