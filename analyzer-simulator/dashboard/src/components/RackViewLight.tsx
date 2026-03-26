import React from 'react';
import { RackState, VisualizationConfig } from '../types';

interface Props {
  rack: RackState;
  config: VisualizationConfig;
}

const SLOT_SIZE = 50;
const ROW_MAX = 15; // max slots per row before wrapping
const PX = 16;
const ROW_H = 88;
const ROW_PAD = 14;

function getSlotFill(status: string, cs: VisualizationConfig['colorScheme']): string {
  switch (status) {
    case 'EMPTY':      return '#e2e8f0';
    case 'DONE':       return cs.ready;
    case 'ERROR':      return cs.error;
    case 'PROCESSING': return cs.processing;
    case 'SENDING':    return cs.sending;
    case 'LOADED':     return '#94a3b8';
    case 'SCANNING':
    case 'WAITING':    return '#f59e0b';
    default:           return '#cbd5e1';
  }
}

export function RackViewLight({ rack, config }: Props) {
  const cs = config.colorScheme;
  const slots = rack.slots;
  const r = 16;
  const inner = r - 4;

  // Split slots into rows of ROW_MAX
  const rows: typeof slots[] = [];
  for (let i = 0; i < slots.length; i += ROW_MAX) {
    rows.push(slots.slice(i, i + ROW_MAX));
  }

  const svgW = PX * 2 + Math.min(slots.length, ROW_MAX) * SLOT_SIZE;
  const svgH = rows.length * ROW_H + ROW_PAD;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '12px 14px 10px',
      boxShadow: '0 1px 4px #0000000a',
    }}>
      {/* Header */}
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>{rack.rackId}</span>
        <span style={{ color: '#cbd5e1' }}>·</span>
        <span>{slots.length} positions</span>
        {config.supportsStatLane && (
          <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: 4 }}>
            · <span style={{ fontSize: 9 }}>⚑</span> STAT 1–{config.statLaneSlots}
          </span>
        )}
      </div>

      {/* SVG rows */}
      <svg width={svgW} height={svgH}>
        {rows.map((rowSlots, rowIdx) => {
          const rowY = rowIdx * ROW_H;
          const rowWidth = PX * 2 + rowSlots.length * SLOT_SIZE;
          const cy = rowY + 44;

          return (
            <g key={rowIdx}>
              {/* Rack bar */}
              <rect
                x={PX - 8} y={rowY + 20}
                width={rowWidth - PX * 2 + 16} height={60}
                rx={8} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={1.5}
              />

              {rowSlots.map((slot, i) => {
                const cx = PX + i * SLOT_SIZE + SLOT_SIZE / 2;
                const fill = getSlotFill(slot.status, cs);
                const circ = 2 * Math.PI * r;
                const dash = circ * (1 - (slot.progress ?? 0) / 100);
                const blink = ['PROCESSING', 'ERROR', 'SENDING'].includes(slot.status);
                const textColor = slot.status === 'EMPTY' ? '#94a3b8' : '#fff';

                return (
                  <g key={slot.slotNumber}>
                    {/* STAT marker */}
                    {slot.isStatSlot && (
                      <rect
                        x={cx - r - 2} y={cy - r - 2}
                        width={(r + 2) * 2} height={(r + 2) * 2}
                        rx={5} fill="none"
                        stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 2"
                      />
                    )}
                    {/* Progress ring */}
                    {slot.status === 'PROCESSING' && (
                      <circle
                        cx={cx} cy={cy} r={r}
                        fill="none" stroke={cs.processing} strokeWidth={3}
                        strokeDasharray={circ} strokeDashoffset={dash}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    )}
                    {/* Slot */}
                    <circle
                      cx={cx} cy={cy} r={inner}
                      fill={fill}
                      stroke={slot.status === 'EMPTY' ? '#cbd5e1' : 'none'} strokeWidth={1}
                      style={blink ? { animation: 'pulse 1.2s ease-in-out infinite' } : undefined}
                    />
                    {/* Icon */}
                    {slot.status === 'DONE' && <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fill={textColor} fontWeight="bold">✓</text>}
                    {slot.status === 'ERROR' && <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fill={textColor} fontWeight="bold">!</text>}
                    {slot.status === 'SENDING' && <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fill={textColor}>↗</text>}
                    {/* Slot number */}
                    <text x={cx} y={75} textAnchor="middle" fontSize={9} fill="#94a3b8">{slot.slotNumber}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
        {[
          { color: '#e2e8f0', stroke: '#cbd5e1', label: 'Vide' },
          { color: '#94a3b8', label: 'Chargé' },
          { color: cs.processing, label: 'Traitement' },
          { color: cs.ready, label: 'Terminé' },
          { color: cs.sending, label: 'Envoi' },
          { color: cs.error, label: 'Erreur' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width={12} height={12}>
              <circle cx={6} cy={6} r={5} fill={item.color} stroke={item.stroke ?? 'none'} strokeWidth={1} />
            </svg>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
