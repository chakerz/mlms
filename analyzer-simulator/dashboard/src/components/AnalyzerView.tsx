import React from 'react';
import { InstrumentData } from '../types';
import { RackViewLight } from './RackViewLight';
import { LogPanelLight } from './LogPanelLight';

interface Props {
  instrument: InstrumentData;
  onCommand: (command: string, data?: any) => void;
}

const STATUS_COLOR: Record<string, string> = {
  IDLE: '#94a3b8', READY: '#16a34a', RUNNING: '#2563eb',
  PROCESSING: '#ea580c', SENDING_RESULTS: '#0891b2',
  CALIBRATING: '#9333ea', ERROR: '#dc2626',
  MAINTENANCE: '#d97706', OFFLINE: '#6b7280',
};

const STATUS_LABEL: Record<string, string> = {
  IDLE: 'En veille', READY: 'Prêt', RUNNING: 'En marche',
  PROCESSING: 'Traitement en cours', SENDING_RESULTS: 'Envoi des résultats',
  CALIBRATING: 'Calibration', ERROR: 'Erreur',
  MAINTENANCE: 'Maintenance', OFFLINE: 'Hors ligne',
};

const BTN = (bg: string, color = '#fff'): React.CSSProperties => ({
  padding: '7px 16px', fontSize: 13, background: bg, color,
  border: `1px solid ${bg}`, borderRadius: 8, cursor: 'pointer',
  fontWeight: 500, transition: 'opacity 0.15s',
});

export function AnalyzerView({ instrument, onCommand }: Props) {
  const { config, state, logs } = instrument;

  if (!state || !config) {
    return (
      <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 49px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
        Connexion en cours…
      </div>
    );
  }

  const status = state.analyzer.status;
  const statusColor = STATUS_COLOR[status] ?? '#94a3b8';
  const isAnimated = ['PROCESSING', 'SENDING_RESULTS', 'ERROR'].includes(status);
  const todayCount = state.stats.todaysSamples ?? state.stats.todayProcessed ?? 0;
  const avgMs = state.stats.averageProcessingMs ?? state.stats.avgProcessingTimeMs ?? 0;

  const statItems = [
    { label: "Aujourd'hui", value: todayCount, color: '#1e293b' },
    { label: 'En cours', value: state.analyzer.processingCount, color: '#2563eb' },
    { label: 'Total traités', value: state.analyzer.totalProcessed, color: '#16a34a' },
    { label: 'Erreurs', value: state.analyzer.errorCount, color: state.analyzer.errorCount > 0 ? '#dc2626' : '#94a3b8' },
    { label: 'Temps moyen', value: avgMs > 0 ? `${(avgMs / 1000).toFixed(1)}s` : '–', color: '#1e293b' },
    { label: 'Taux anormal', value: `${((state.stats.abnormalRate ?? 0) * 100).toFixed(0)}%`, color: '#d97706' },
  ];

  return (
    <div style={{ background: '#f1f5f9', minHeight: 'calc(100vh - 49px)', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header card */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 1px 4px #0000000a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: statusColor + '18',
            border: `2px solid ${statusColor}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: statusColor,
              boxShadow: `0 0 8px ${statusColor}`,
              animation: isAnimated ? 'pulse 1.2s ease-in-out infinite' : 'none',
            }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', lineHeight: 1.2 }}>
              {state.analyzer.name}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              {state.analyzer.model}
            </div>
          </div>
        </div>

        <div style={{
          padding: '4px 14px', borderRadius: 20,
          background: statusColor + '15',
          border: `1px solid ${statusColor}40`,
          fontSize: 13, fontWeight: 600, color: statusColor,
        }}>
          {STATUS_LABEL[status] ?? status}
        </div>

        <div style={{ flex: 1 }} />

        {/* LIS connection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: state.connection.lisConnected ? '#16a34a' : '#e2e8f0', border: state.connection.lisConnected ? 'none' : '1px solid #cbd5e1' }} />
          <span style={{ fontSize: 12, color: state.connection.lisConnected ? '#15803d' : '#94a3b8', fontWeight: 500 }}>
            {state.connection.lisConnected ? 'LIS connecté' : 'LIS déconnecté'}
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={BTN('#3b82f6')} onClick={() => onCommand('LOAD_RANDOM_SAMPLE')}>+ Échantillon</button>
          <button style={BTN('#7c3aed')} onClick={() => onCommand('START_CALIBRATION')}>Calibration</button>
          <button style={BTN('#f8fafc', '#64748b')} onClick={() => onCommand('RESET_ANALYZER')}>Reset</button>
          <button style={{ ...BTN('#fff1f2', '#dc2626'), border: '1px solid #fecaca' }} onClick={() => onCommand('TRIGGER_ERROR')}>Simuler erreur</button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {statItems.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 3px #0000000a' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Racks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {state.racks.map(rack => (
          <RackViewLight key={rack.rackId} rack={rack} config={config.visualization} />
        ))}
      </div>

      {/* Log */}
      <LogPanelLight logs={logs} />

    </div>
  );
}
