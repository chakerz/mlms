import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

const TYPE_COLORS = {
  info: '#60a5fa',
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
};

export function LogPanel({ logs }: { logs: LogEntry[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 10, padding: 12, height: 200, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
      {logs.length === 0 && <div style={{ color: '#334155' }}>En attente d'activité…</div>}
      {[...logs].reverse().map(entry => (
        <div key={entry.id} style={{ display: 'flex', gap: 10, padding: '2px 0' }}>
          <span style={{ color: '#475569', flexShrink: 0 }}>{entry.timestamp.slice(11, 19)}</span>
          <span style={{ color: TYPE_COLORS[entry.type], flexShrink: 0, width: 140 }}>{entry.event}</span>
          <span style={{ color: '#94a3b8' }}>
            {entry.data?.sampleId ? `${entry.data.sampleId}` : ''}
            {entry.data?.errorMessage ? ` ${entry.data.errorMessage}` : ''}
            {entry.data?.progress !== undefined ? ` ${entry.data.progress}%` : ''}
          </span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
