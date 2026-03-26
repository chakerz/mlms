import React from 'react';
import { RackState, VisualizationConfig } from '../types';

interface Props {
  rack: RackState;
  config: VisualizationConfig;
}

const SLOT_SIZE = 52;
const PX = 20;
const PY = 40;
const HEIGHT = 90;

function getSlotFill(status: string, cs: VisualizationConfig['colorScheme']): string {
  switch (status) {
    case 'EMPTY': return '#1e293b';
    case 'DONE': return cs.ready;
    case 'ERROR': return cs.error;
    case 'PROCESSING': return cs.processing;
    case 'SENDING': return cs.sending;
    case 'LOADED': return cs.idle;
    case 'SCANNING': case 'WAITING': return '#f59e0b';
    default: return cs.idle;
  }
}

export function RackView({ rack, config }: Props) {
  const cs = config.colorScheme;
  const width = PX * 2 + config.slotsPerRack * SLOT_SIZE;
  const r = 16;

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 10, overflowX: 'auto' }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 4 }}>
        {rack.rackId}
        {config.supportsStatLane && (
          <span style={{ marginLeft: 10, color: '#f59e0b' }}>⚑ STAT: 1–{config.statLaneSlots}</span>
        )}
      </div>
      <svg width={width} height={HEIGHT}>
        {/* Rack bar */}
        <rect x={PX - 8} y={PY - 22} width={config.slotsPerRack * SLOT_SIZE + 16} height={44} rx={6} fill="#334155" />

        {rack.slots.map((slot, i) => {
          const cx = PX + i * SLOT_SIZE + SLOT_SIZE / 2;
          const cy = PY;
          const fill = getSlotFill(slot.status, cs);
          const inner = r - 4;
          const circ = 2 * Math.PI * r;
          const dash = circ * (1 - (slot.progress ?? 0) / 100);
          const blink = ['PROCESSING', 'ERROR', 'SENDING'].includes(slot.status);

          return (
            <g key={slot.slotNumber}>
              {slot.isStatSlot && (
                <rect x={cx - r - 2} y={cy - r - 2} width={(r + 2) * 2} height={(r + 2) * 2} rx={4} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2" />
              )}
              {slot.status === 'PROCESSING' && (
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={cs.processing} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={dash} transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
              )}
              <circle cx={cx} cy={cy} r={inner} fill={fill} style={blink ? { animation: 'pulse 1.2s ease-in-out infinite' } : undefined} />
              {slot.status === 'DONE' && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">✓</text>}
              {slot.status === 'ERROR' && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">!</text>}
              {slot.status === 'SENDING' && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="white">↗</text>}
              <text x={cx} y={cy + inner + 12} textAnchor="middle" fontSize="8" fill="#64748b">{slot.slotNumber}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
