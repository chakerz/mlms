import React from 'react';
import { SimulatorStateData } from '../types';

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>{value}</div>
    </div>
  );
}

export function StatsPanel({ stats, connection }: { stats: SimulatorStateData['stats']; connection: SimulatorStateData['connection'] }) {
  const uptimeS = Math.floor(stats.uptimeMs / 1000);
  const h = Math.floor(uptimeS / 3600);
  const m = Math.floor((uptimeS % 3600) / 60);
  const s = uptimeS % 60;
  const uptime = `${h}h ${m}m ${s}s`;

  return (
    <div style={{ background: '#1e293b', borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Statistics</div>
      <Stat label="Today Processed" value={stats.todayProcessed} />
      <Stat label="ASTM Sent" value={stats.astmSent} />
      <Stat label="ASTM Received" value={stats.astmReceived} />
      <Stat label="LIS Messages" value={connection.messagesSent} />
      <Stat label="Uptime" value={uptime} />
    </div>
  );
}
