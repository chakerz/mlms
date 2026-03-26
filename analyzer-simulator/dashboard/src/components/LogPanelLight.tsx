import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

const TYPE_STYLES: Record<LogEntry['type'], { color: string; bg: string; dot: string }> = {
  info:    { color: '#3b82f6', bg: '#eff6ff', dot: '#3b82f6' },
  success: { color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
  error:   { color: '#dc2626', bg: '#fef2f2', dot: '#dc2626' },
  warning: { color: '#d97706', bg: '#fffbeb', dot: '#d97706' },
};

const EVENT_LABELS: Record<string, string> = {
  SAMPLE_LOADED:     'Chargé',
  SAMPLE_PROCESSING: 'Traitement',
  SAMPLE_DONE:       'Terminé',
  RESULTS_SENT:      'Résultats envoyés',
  SAMPLE_ERROR:      'Erreur',
  CONNECTION_CHANGED:'Connexion',
  CALIBRATION_STARTED:'Calibration',
  CALIBRATION_DONE:  'Calibration OK',
};

function formatMsg(entry: LogEntry): string {
  if (entry.data?.sampleId) return entry.data.sampleId;
  if (entry.data?.errorMessage) return entry.data.errorMessage;
  if (entry.data?.lisConnected !== undefined) return entry.data.lisConnected ? 'LIS connecté' : 'LIS déconnecté';
  return '';
}

export function LogPanelLight({ logs }: { logs: LogEntry[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 1px 4px #0000000a',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #f1f5f9',
        fontSize: 12, fontWeight: 600, color: '#64748b',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>Journal en direct</span>
        <span style={{ fontWeight: 400, color: '#94a3b8' }}>{logs.length} entrées</span>
      </div>
      <div style={{ height: 480, overflowY: 'auto', padding: '8px 0' }}>
        {logs.length === 0 && (
          <div style={{ color: '#cbd5e1', fontSize: 13, textAlign: 'center', padding: 24 }}>
            En attente d'activité…
          </div>
        )}
        {[...logs].map(entry => {
          const style = TYPE_STYLES[entry.type];
          return (
            <div
              key={entry.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '5px 16px',
                borderLeft: `3px solid transparent`,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot, marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 10, color: '#cbd5e1', flexShrink: 0, fontFamily: 'monospace' }}>
                    {entry.timestamp.slice(11, 19)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: style.color, flexShrink: 0 }}>
                    {EVENT_LABELS[entry.event] ?? entry.event}
                  </span>
                </div>
                {formatMsg(entry) && (
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 1, fontFamily: 'monospace' }}>
                    {formatMsg(entry)}
                    {entry.data?.progress !== undefined && (
                      <span style={{ color: '#94a3b8' }}> · {entry.data.progress}%</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
