import React from 'react';
import { InstrumentData } from '../types';

interface Props {
  instruments: InstrumentData[];
  onSelect: (code: string) => void;
}

const STATUS_COLOR: Record<string, string> = {
  IDLE: '#94a3b8', READY: '#16a34a', RUNNING: '#2563eb',
  PROCESSING: '#ea580c', SENDING_RESULTS: '#0891b2',
  CALIBRATING: '#9333ea', ERROR: '#dc2626',
  MAINTENANCE: '#d97706', OFFLINE: '#6b7280',
};

const STATUS_LABEL: Record<string, string> = {
  IDLE: 'En veille', READY: 'Prêt', RUNNING: 'En marche',
  PROCESSING: 'Traitement', SENDING_RESULTS: 'Envoi résultats',
  CALIBRATING: 'Calibration', ERROR: 'Erreur',
  MAINTENANCE: 'Maintenance', OFFLINE: 'Hors ligne',
};

function StatPill({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 14px', background: '#f8fafc', borderRadius: 8, minWidth: 60 }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: highlight ? '#dc2626' : '#0f172a' }}>{value}</span>
      <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{label}</span>
    </div>
  );
}

export function RoomView({ instruments, onSelect }: Props) {
  if (instruments.length === 0) {
    return (
      <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 49px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#94a3b8' }}>
        <svg width={40} height={40} viewBox="0 0 40 40">
          <circle cx={20} cy={20} r={16} fill="none" stroke="#e2e8f0" strokeWidth={3} />
          <path d="M20 4 A16 16 0 0 1 36 20" fill="none" stroke="#3b82f6" strokeWidth={3} strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite" />
          </path>
        </svg>
        <span style={{ fontSize: 14 }}>En attente des analyseurs MLMS…</span>
        <span style={{ fontSize: 12, color: '#cbd5e1' }}>ws://{window.location.hostname}:15001</span>
      </div>
    );
  }

  return (
    <div style={{ background: '#f1f5f9', minHeight: 'calc(100vh - 49px)', padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Analyseurs configurés</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{instruments.length} appareil{instruments.length > 1 ? 's' : ''} connecté{instruments.length > 1 ? 's' : ''}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 20 }}>
          {instruments.map(inst => {
            const status = inst.state?.analyzer.status ?? 'OFFLINE';
            const color = STATUS_COLOR[status] ?? '#94a3b8';
            const isAnimated = ['PROCESSING', 'SENDING_RESULTS', 'ERROR'].includes(status);
            const todayCount = inst.state?.stats.todaysSamples ?? inst.state?.stats.todayProcessed ?? 0;
            const conn = inst.state?.connection;

            return (
              <div
                key={inst.instrumentCode}
                onClick={() => onSelect(inst.instrumentCode)}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 16,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.18s, transform 0.18s',
                  boxShadow: '0 1px 4px #0000000a',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${color}22, 0 2px 12px #00000012`;
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px #0000000a';
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                }}
              >
                {/* Top row: status + name */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: color + '15', border: `2px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: color, boxShadow: `0 0 8px ${color}`,
                      animation: isAnimated ? 'pulse 1.2s ease-in-out infinite' : 'none',
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                      {inst.state?.analyzer.name ?? inst.instrumentCode}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                      {inst.state?.analyzer.model ?? '–'}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '3px 10px', borderRadius: 20,
                        background: color + '12', border: `1px solid ${color}30`,
                        fontSize: 12, fontWeight: 600, color,
                      }}>
                        {STATUS_LABEL[status] ?? status}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{inst.instrumentCode}</div>
                  </div>
                </div>

                {/* Connection info */}
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Connexion</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                    <ConnRow label="Hôte / IP" value={conn?.lisHost ?? '—'} mono />
                    <ConnRow label="Port" value={conn?.lisPort?.toString() ?? '—'} mono />
                    <ConnRow label="Messages envoyés" value={conn?.messagesSent ?? 0} />
                    <ConnRow label="Messages reçus" value={conn?.messagesReceived ?? 0} />
                  </div>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: conn?.lisConnected ? '#16a34a' : '#e2e8f0',
                      border: conn?.lisConnected ? 'none' : '1px solid #cbd5e1',
                    }} />
                    <span style={{ fontSize: 11, color: conn?.lisConnected ? '#15803d' : '#94a3b8', fontWeight: 500 }}>
                      {conn?.lisConnected ? 'LIS connecté' : 'LIS déconnecté'}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <StatPill label="Aujourd'hui" value={todayCount} />
                  <StatPill label="En cours" value={inst.state?.analyzer.processingCount ?? 0} />
                  <StatPill label="Total" value={inst.state?.analyzer.totalProcessed ?? 0} />
                  <StatPill label="Erreurs" value={inst.state?.analyzer.errorCount ?? 0} highlight={(inst.state?.analyzer.errorCount ?? 0) > 0} />
                </div>

                {/* Open hint */}
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    {inst.logs.length > 0 ? `Dernière activité: ${inst.logs[0].timestamp.slice(11, 19)}` : 'Aucune activité'}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>Ouvrir →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConnRow({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: 10, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#334155', fontFamily: mono ? 'monospace' : undefined, fontWeight: 500 }}>{value}</span>
    </div>
  );
}
