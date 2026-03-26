import React from 'react'
import { AnalyzerInfo, ConnectionState, AnalyzerColorScheme } from '../../../types/analyzer'

interface Props {
  analyzer: AnalyzerInfo
  connection: ConnectionState
  colorScheme: AnalyzerColorScheme
}

const STATUS_LABELS: Record<string, string> = {
  IDLE: 'Inactif',
  READY: 'Prêt',
  RUNNING: 'En marche',
  PROCESSING: 'En traitement',
  SENDING_RESULTS: 'Envoi résultats',
  CALIBRATING: 'Calibration',
  ERROR: 'Erreur',
  MAINTENANCE: 'Maintenance',
  OFFLINE: 'Hors ligne',
}

export const AnalyzerHeader: React.FC<Props> = ({ analyzer, connection, colorScheme }) => {
  const statusColor =
    analyzer.status === 'READY'             ? colorScheme.ready
    : analyzer.status === 'PROCESSING'      ? colorScheme.processing
    : analyzer.status === 'SENDING_RESULTS' ? colorScheme.sending
    : analyzer.status === 'ERROR'           ? colorScheme.error
    : colorScheme.idle

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm flex-wrap gap-3">
      <div className="flex items-center gap-3">
        {/* Status-Kreis */}
        <span
          className="inline-block w-4 h-4 rounded-full shrink-0"
          style={{
            backgroundColor: statusColor,
            boxShadow: `0 0 8px ${statusColor}`,
            animation: ['PROCESSING', 'SENDING_RESULTS', 'ERROR'].includes(analyzer.status)
              ? 'pulse 1s ease-in-out infinite'
              : 'none',
          }}
        />
        <div>
          <div className="font-semibold text-gray-800 text-sm">{analyzer.name}</div>
          <div className="text-xs text-gray-400">{analyzer.model}</div>
        </div>
        <span
          className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: statusColor + '20', color: statusColor }}
        >
          {STATUS_LABELS[analyzer.status] ?? analyzer.status}
        </span>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
        <div>
          <span className="font-medium text-gray-700">{analyzer.totalProcessed}</span>
          <span className="ml-1 text-xs">traités</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{analyzer.processingCount}</span>
          <span className="ml-1 text-xs">en cours</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{analyzer.errorCount}</span>
          <span className="ml-1 text-xs">erreurs</span>
        </div>
        {/* LIS-Verbindung */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: connection.lisConnected ? colorScheme.ready : colorScheme.error,
              animation: connection.lisConnected ? 'none' : 'pulse 1.5s infinite',
            }}
          />
          <span className="text-xs">
            {connection.lisConnected ? 'LIS connecté' : 'LIS déconnecté'}
          </span>
        </div>
      </div>
    </div>
  )
}
