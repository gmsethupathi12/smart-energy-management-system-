/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  generateInitialHistory,
  fetchLatestReadings,
  formatTimeLabel,
  MAX_HISTORY_POINTS,
} from './data/energySimulator';
import { MetricSample, KpiSummary } from './types/energy';
import { ThreeBackground } from './components/ThreeBackground';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { ChartsGrid } from './components/ChartsGrid';
import { SystemComponents } from './components/SystemComponents';
import { Footer } from './components/Footer';

export default function App() {
  // Initialize with 60 historical points so graphs are pre-populated and start rolling smoothly
  const [initialData] = useState(() => generateInitialHistory());
  const [history, setHistory] = useState<MetricSample[]>(initialData.history);
  const [isLive, setIsLive] = useState<boolean>(true);
  const cumulativeEnergyRef = useRef<number>(initialData.cumulativeEnergy);

  useEffect(() => {
    // 1000 ms real-time telemetry tick
    const interval = setInterval(async () => {
      const now = Date.now();
      const timeSec = now / 1000;

      // ==========================================================================
      // Replace this with live readings from the ESP32 (WebSocket, MQTT or HTTP)
      // ==========================================================================
      const { devices, isOnline } = await fetchLatestReadings(timeSec);
      setIsLive(isOnline);

      if (!isOnline || devices.length === 0) {
        return;
      }

      // Compute combined totals across devices
      const avgVoltage =
        devices.reduce((acc, d) => acc + d.voltage, 0) / devices.length;
      const sumCurrent = devices.reduce((acc, d) => acc + d.current, 0);
      const totalPower = devices.reduce((acc, d) => acc + d.power, 0);

      // Energy calculation: P (W) / 1000 * (1 / 3600) hours = kWh per second
      const energyDeltaKWh = (totalPower / 1000) * (1 / 3600);
      cumulativeEnergyRef.current += energyDeltaKWh;

      const newSample: MetricSample = {
        id: now,
        timestamp: now,
        timeLabel: formatTimeLabel(new Date(now)),
        voltage: Number(avgVoltage.toFixed(2)),
        current: Number(sumCurrent.toFixed(3)),
        power: Number(totalPower.toFixed(2)),
        energy: Number(cumulativeEnergyRef.current.toFixed(6)),
        devices,
      };

      setHistory((prevHistory) => {
        const next = [...prevHistory, newSample];
        if (next.length > MAX_HISTORY_POINTS) {
          return next.slice(next.length - MAX_HISTORY_POINTS);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Compute live KPI summary
  const summary = useMemo<KpiSummary>(() => {
    const latest = history[history.length - 1] || {
      voltage: 230,
      current: 14,
      power: 2900,
      energy: cumulativeEnergyRef.current,
    };

    // Peak power (kW) in current rolling window
    const maxPowerWatts = history.reduce(
      (max, sample) => Math.max(max, sample.power),
      latest.power
    );
    const peakPowerKW = maxPowerWatts / 1000;

    return {
      voltage: latest.voltage,
      current: latest.current,
      power: latest.power,
      peakPower: peakPowerKW,
      totalEnergy: cumulativeEnergyRef.current,
      isLive,
    };
  }, [history, isLive]);

  return (
    <div className="relative min-h-screen w-full bg-[#060913] text-slate-100 selection:bg-[#4C72B0]/30 selection:text-white">
      {/* 3D WebGL drifting particles & perspective background */}
      <ThreeBackground />

      {/* Main Content Dashboard Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* 1. Header Bar */}
        <Header isLive={isLive} />

        {/* 2. Four KPI Cards */}
        <KpiCards summary={summary} />

        {/* 3. Four Live Rolling Line Charts (2x2 grid) */}
        <ChartsGrid data={history} />

        {/* 4. System Components (6 hardware cards) */}
        <SystemComponents />

        {/* 5. Footer */}
        <Footer />
      </main>
    </div>
  );
}
