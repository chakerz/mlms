import React, { useState } from 'react';
import { useSimulatorWs } from './useSimulatorWs';
import { RoomView } from './components/RoomView';
import { AnalyzerView } from './components/AnalyzerView';

const CSS = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 6px currentColor} 50%{box-shadow:0 0 14px currentColor} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #1e293b; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
`;

export default function App() {
  const { instruments, connected, sendCommand } = useSimulatorWs();
  const [selected, setSelected] = useState<string | null>(null);

  const instrumentList = Array.from(instruments.values());
  const current = selected ? instruments.get(selected) : null;

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0' }}>

        {/* Top bar */}
        <div style={{ background: selected ? '#0a0e17' : '#fff', borderBottom: `1px solid ${selected ? '#1e293b' : '#e2e8f0'}`, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              style={{ background: 'none', border: '1px solid #334155', borderRadius: 8, color: '#94a3b8', padding: '4px 12px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← Plan
            </button>
          )}
          <div style={{ fontWeight: 700, fontSize: 15, color: selected ? '#f1f5f9' : '#0f172a', letterSpacing: '0.02em' }}>
            {selected ? (current?.state?.analyzer.name ?? selected) : 'MLMS · Analyzer Simulator'}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? '#22c55e' : '#ef4444', animation: connected ? 'none' : 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: 12, color: selected ? '#475569' : '#94a3b8' }}>{connected ? 'WebSocket OK' : 'Déconnecté'}</span>
          </div>
        </div>

        {/* Content */}
        {!selected ? (
          <RoomView
            instruments={instrumentList}
            onSelect={setSelected}
          />
        ) : current ? (
          <AnalyzerView
            instrument={current}
            onCommand={(cmd, data) => sendCommand(cmd, current.instrumentCode, data)}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#475569', fontSize: 14 }}>
            En attente des données…
          </div>
        )}

      </div>
    </>
  );
}
