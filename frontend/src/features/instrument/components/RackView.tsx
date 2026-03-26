import React from 'react'
import { RackState, AnalyzerVisualizationConfig } from '../../../types/analyzer'
import { SlotCircle } from './SlotCircle'

interface Props {
  rack: RackState
  config: AnalyzerVisualizationConfig
}

const SLOT_SIZE = 52
const PADDING_X = 20
const PADDING_Y = 40
const HEIGHT = 90

export const RackView: React.FC<Props> = ({ rack, config }) => {
  const width = PADDING_X * 2 + config.slotsPerRack * SLOT_SIZE

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 overflow-x-auto">
      <div className="text-xs text-gray-500 font-medium mb-1 pl-1">
        {rack.rackId}
        {config.supportsStatLane && (
          <span className="ml-2 text-amber-500 text-xs">
            ⚑ STAT: Slot 1–{config.statLaneSlots}
          </span>
        )}
      </div>
      <svg width={width} height={HEIGHT}>
        {/* Rack-Hintergrundbalken */}
        <rect
          x={PADDING_X - 8}
          y={PADDING_Y - 22}
          width={config.slotsPerRack * SLOT_SIZE + 16}
          height={44}
          rx={6}
          fill="#e5e7eb"
        />

        {rack.slots.map((slot, index) => (
          <SlotCircle
            key={`${rack.rackId}-${slot.slotNumber}`}
            slot={slot}
            colorScheme={config.colorScheme}
            x={PADDING_X + index * SLOT_SIZE + SLOT_SIZE / 2}
            y={PADDING_Y}
            radius={16}
          />
        ))}
      </svg>
    </div>
  )
}
