import React from 'react'
import { AnalyzerConfig, SimulatorState } from '../../../types/analyzer'
import { AnalyzerHeader } from './AnalyzerHeader'
import { RackView } from './RackView'

interface Props {
  config: AnalyzerConfig
  state: SimulatorState
}

export const AnalyzerVisualizer: React.FC<Props> = ({ config, state }) => {
  const { visualization } = config

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <AnalyzerHeader
        analyzer={state.analyzer}
        connection={state.connection}
        colorScheme={visualization.colorScheme}
      />

      {/* Racks */}
      <div className="flex flex-col gap-3">
        {state.racks.map((rack) => (
          <RackView key={rack.rackId} rack={rack} config={visualization} />
        ))}
      </div>

      {/* Statistik-Zeile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Échantillons aujourd'hui", value: state.stats.todaysSamples },
          {
            label: 'Temps moyen',
            value: state.stats.averageProcessingMs > 0
              ? `${(state.stats.averageProcessingMs / 1000).toFixed(1)}s`
              : '–',
          },
          { label: 'Taux anormal', value: `${(state.stats.abnormalRate * 100).toFixed(0)}%` },
          { label: "Taux d'erreur", value: `${(state.stats.errorRate * 100).toFixed(0)}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-3 text-center"
          >
            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
