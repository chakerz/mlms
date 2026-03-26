import React from 'react';
import { AnalyzerStatus } from '../types';

const STATUS_CONFIG: Record<AnalyzerStatus, { color: string; animation: string }> = {
  IDLE: { color: '#64748b', animation: 'none' },
  READY: { color: '#22c55e', animation: 'none' },
  RUNNING: { color: '#3b82f6', animation: 'pulse-slow' },
  PROCESSING: { color: '#f97316', animation: 'blink-fast' },
  SENDING_RESULTS: { color: '#06b6d4', animation: 'blink-fast' },
  CALIBRATING: { color: '#a855f7', animation: 'pulse-slow' },
  ERROR: { color: '#ef4444', animation: 'blink-fast' },
  MAINTENANCE: { color: '#eab308', animation: 'pulse-slow' },
  OFFLINE: { color: '#374151', animation: 'none' },
};

export function StatusDot({ status, size = 12 }: { status: AnalyzerStatus; size?: number }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.OFFLINE;
  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: cfg.color,
      animation: cfg.animation !== 'none' ? `${cfg.animation} 1s infinite` : 'none',
      boxShadow: `0 0 ${size / 2}px ${cfg.color}80`,
    }} />
  );
}
