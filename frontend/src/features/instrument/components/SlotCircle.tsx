import React from 'react'
import { SlotState, AnalyzerColorScheme } from '../../../types/analyzer'

interface Props {
  slot: SlotState
  colorScheme: AnalyzerColorScheme
  x: number
  y: number
  radius?: number
}

const CIRCUMFERENCE = (r: number) => 2 * Math.PI * r

export const SlotCircle: React.FC<Props> = ({
  slot,
  colorScheme,
  x,
  y,
  radius = 18,
}) => {
  const innerRadius = radius - 4
  const circ = CIRCUMFERENCE(radius)
  const dashOffset = circ * (1 - (slot.progress ?? 0) / 100)

  const fill =
    slot.status === 'EMPTY'        ? '#e5e7eb'
    : slot.status === 'DONE'       ? colorScheme.ready
    : slot.status === 'ERROR'      ? colorScheme.error
    : slot.status === 'PROCESSING' ? colorScheme.processing
    : slot.status === 'SENDING'    ? colorScheme.sending
    : slot.status === 'LOADED'     ? colorScheme.idle
    : slot.status === 'SCANNING'   ? '#facc15'
    : slot.status === 'WAITING'    ? '#facc15'
    : colorScheme.idle

  const isBlinking =
    slot.status === 'PROCESSING' ||
    slot.status === 'ERROR' ||
    slot.status === 'SENDING'

  return (
    <g>
      {/* STAT-Markierung */}
      {slot.isStatSlot && (
        <rect
          x={x - radius - 2}
          y={y - radius - 2}
          width={(radius + 2) * 2}
          height={(radius + 2) * 2}
          rx={4}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
      )}

      {/* Fortschrittsring */}
      {slot.status === 'PROCESSING' && (
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill="none"
          stroke={colorScheme.processing}
          strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${x} ${y})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      )}

      {/* Haupt-Kreis */}
      <circle
        cx={x}
        cy={y}
        r={innerRadius}
        fill={fill}
        style={
          isBlinking
            ? { animation: 'pulse 1.2s ease-in-out infinite' }
            : undefined
        }
      />

      {/* Icons */}
      {slot.status === 'DONE' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
          ✓
        </text>
      )}
      {slot.status === 'ERROR' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">
          !
        </text>
      )}
      {slot.status === 'SENDING' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fill="white">
          ↗
        </text>
      )}
      {slot.status === 'SCANNING' && (
        <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fill="white">
          ⌕
        </text>
      )}

      {/* Slot-Nummer */}
      <text x={x} y={y + innerRadius + 12} textAnchor="middle" fontSize="8" fill="#6b7280">
        {slot.slotNumber}
      </text>
    </g>
  )
}
