import React from 'react';
import { InstrumentData } from '../types';
import { RackView } from './RackView';
import { LogPanel } from './LogPanel';

interface Props {
  instrument: InstrumentData;
  onCommand: (command: string, data?: any) => void;
}

const STATUS_LABELS: Record<string, string> = {
  IDLE: 'Inactif', READY: 'Prêt', RUNNING: 'En marche', PROCESSING: 'En traitement',
  SENDING_RESULTS: 'Envoi résultats', CALIBRATING: 'Calibration',
  ERROR: 'Erreur', MAINTENANCE: 'Maintenance', OFFLINE: 'Hors ligne',
};

const BTN = (color: string) => ({
  padding: '6px 14px', fontSize: 13, background: color, color: '#fff',
  border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500,
});

export function InstrumentCard({ instrument, onCommand }: Props) {
  const { config, state, logs } = instrument;

  if (!state || !config) {
    return (
      <div style={{ color: '#475569', textAlign: 'center', padding: 40 }}>
        Connexion en cours…
      </div>
    );
  }

  const cs = config.visualization.colorScheme;
  const statusColor =
    state.analyzer.status === 'READY' ? cs.ready
    : state.analyzer.status === 'PROCESSING' ? cs.processing
    : state.analyzer.status === 'SENDING_RESULTS' ? cs.sending
    : state.analyzer.status === 'ERROR' ? cs.error
    : cs.idle;

  const todayCount = state.stats.todaysSamples ?? state.stats.todayProcessed ?? 0;
  const avgMs = state.stats.averageProcessingMs ?? state.stats.avgProcessingTimeMs ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%', background: statusColor,
            boxShadow: `0 0 8px ${statusColor}`,
            animation: ['PROCESSING','SENDING_RESULTS','ERROR'].includes(state.analyzer.status) ? 'pulse 1s infinite' : 'none',
          }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#f1f5f9' }}>{state.analyzer.name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{state.analyzer.model}</div>
          </div>
          <div style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: statusColor + '22', color: statusColor, fontWeight: 500 }}>
            {STATUS_LABELS[state.analyzer.status] ?? state.analyzer.status}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#94a3b8' }}>
          <div><span style={{ fontWeight: 600, color: '#f1f5f9' }}>{state.analyzer.totalProcessed}</span> traités</div>
          <div><span style={{ fontWeight: 600, color: '#f1f5f9' }}>{state.analyzer.processingCount}</span> en cours</div>
          <div><span style={{ fontWeight: 600, color: '#ef4444' }}>{state.analyzer.errorCount}</span> erreurs</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: state.connection.lisConnected ? cs.ready : cs.error }} />
            <span style={{ fontSize: 12 }}>{state.connection.lisConnected ? 'LIS connecté' : 'LIS déconnecté'}</span>
          </div>
        </div>
      </div>

      {/* Racks */}
      {state.racks.map(rack => (
        <RackView key={rack.rackId} rack={rack} config={config.visualization} />
      ))}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: "Aujourd'hui", value: todayCount },
          { label: 'Temps moyen', value: avgMs > 0 ? `${(avgMs / 1000).toFixed(1)}s` : '–' },
          { label: 'Taux anormal', value: `${((state.stats.abnormalRate ?? 0) * 100).toFixed(0)}%` },
          { label: "Taux d'erreur", value: `${((state.stats.errorRate ?? 0) * 100).toFixed(0)}%` },
        ].map(s => (
          <div key={s.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button style={BTN('#3b82f6')} onClick={() => onCommand('LOAD_RANDOM_SAMPLE')}>Charger échantillon</button>
        <button style={BTN('#8b5cf6')} onClick={() => onCommand('START_CALIBRATION')}>Calibration</button>
        <button style={BTN('#475569')} onClick={() => onCommand('RESET_ANALYZER')}>Reset</button>
        <button style={BTN('#ef4444')} onClick={() => onCommand('TRIGGER_ERROR')}>Simuler erreur</button>
      </div>

      {/* Log */}
      <div>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 6 }}>Journal en direct</div>
        <LogPanel logs={logs} />
      </div>
    </div>
  );
}
