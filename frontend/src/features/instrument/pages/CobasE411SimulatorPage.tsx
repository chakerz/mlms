import React, { useEffect, useState } from 'react'
import { AnalyzerConfig, SimulatorState } from '../../../types/analyzer'
import { AnalyzerVisualizer } from '../components/AnalyzerVisualizer'
import { SimulatorLogPanel, LogEntry } from '../components/SimulatorLogPanel'

const WS_URL = (import.meta as any).env?.VITE_COBAS_SIM_WS_URL ?? 'ws://localhost:15003'

const MAX_LOG_ENTRIES = 100

const eventToLogEntry = (msg: any): LogEntry | null => {
  const ts = new Date().toISOString()
  switch (msg.event) {
    case 'SAMPLE_LOADED':
      return {
        timestamp: ts,
        event: 'PROBE GELADEN',
        message: `${msg.data.sampleId} → Slot ${msg.data.slotNumber}`,
        type: 'info',
      }
    case 'WORKLIST_RECEIVED':
      return {
        timestamp: ts,
        event: 'WORKLIST',
        message: `${msg.data.sampleId}: ${msg.data.tests?.join(', ')}`,
        type: 'info',
      }
    case 'SAMPLE_PROCESSING':
      return {
        timestamp: ts,
        event: 'MESSUNG',
        message: `${msg.data.sampleId} ${msg.data.progress}%`,
        type: 'info',
      }
    case 'SAMPLE_DONE':
      return {
        timestamp: ts,
        event: 'DONE',
        message: `${msg.data.sampleId} – ${msg.data.results?.length ?? 0} résultats`,
        type: 'success',
      }
    case 'RESULTS_SENT':
      return {
        timestamp: ts,
        event: 'ENVOYÉ',
        message: `${msg.data.sampleId}`,
        type: 'success',
      }
    case 'SAMPLE_ERROR':
      return {
        timestamp: ts,
        event: 'ERREUR',
        message: `${msg.data.sampleId ?? '–'}: ${msg.data.errorMessage}`,
        type: 'error',
      }
    case 'CONNECTION_CHANGED':
      return {
        timestamp: ts,
        event: 'CONNEXION',
        message: msg.data.lisConnected ? 'LIS connecté' : 'LIS déconnecté',
        type: msg.data.lisConnected ? 'success' : 'warning',
      }
    case 'CALIBRATION_STARTED':
      return { timestamp: ts, event: 'CALIBRATION', message: 'Démarrée', type: 'warning' }
    case 'CALIBRATION_DONE':
      return { timestamp: ts, event: 'CALIBRATION', message: 'Terminée', type: 'success' }
    default:
      return null
  }
}

const CobasE411SimulatorPage: React.FC = () => {
  const [config, setConfig] = useState<AnalyzerConfig | null>(null)
  const [state, setState] = useState<SimulatorState | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [wsStatus, setWsStatus] = useState<'connecting' | 'open' | 'closed'>('connecting')
  const wsRef = React.useRef<WebSocket | null>(null)

  useEffect(() => {
    let ws: WebSocket
    let retryTimeout: ReturnType<typeof setTimeout>

    const connect = () => {
      ws = new WebSocket(WS_URL)
      wsRef.current = ws
      setWsStatus('connecting')

      ws.onopen = () => setWsStatus('open')

      ws.onmessage = (ev) => {
        const msg = JSON.parse(ev.data)

        // Initial full state: includes config + state
        if (msg.event === 'ANALYZER_STATE') {
          if (msg.data.config) setConfig(msg.data.config)
          if (msg.data.state) setState(msg.data.state)
        }

        // Periodic updates: state only
        if (msg.event === 'ANALYZER_STATE_UPDATE') {
          if (msg.data.state) setState(msg.data.state)
        }

        const logEntry = eventToLogEntry(msg)
        if (logEntry) {
          setLogs((prev) => [...prev.slice(-(MAX_LOG_ENTRIES - 1)), logEntry])
        }
      }

      ws.onclose = () => {
        setWsStatus('closed')
        retryTimeout = setTimeout(connect, 3000)
      }
    }

    connect()
    return () => {
      ws?.close()
      clearTimeout(retryTimeout)
    }
  }, [])

  const sendCommand = (command: string, data?: any) => {
    wsRef.current?.send(JSON.stringify({ command, data }))
  }

  if (!config || !state) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        <div className="text-sm">
          {wsStatus === 'connecting'
            ? 'Connexion au Cobas e 411 Simulator…'
            : 'Simulateur non disponible – reconnexion dans 3s'}
        </div>
        <div className="text-xs text-gray-400">{WS_URL}</div>
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-5 max-w-6xl mx-auto">
      {/* Visualizer */}
      <AnalyzerVisualizer config={config} state={state} />

      {/* Control Panel */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => sendCommand('LOAD_RANDOM_SAMPLE')}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Charger échantillon
        </button>
        <button
          onClick={() => sendCommand('START_CALIBRATION')}
          className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Calibration
        </button>
        <button
          onClick={() => sendCommand('RESET_ANALYZER')}
          className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => sendCommand('TRIGGER_ERROR')}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Simuler erreur
        </button>
      </div>

      {/* Log */}
      <div>
        <div className="text-xs text-gray-400 font-medium mb-1.5">Journal en direct</div>
        <SimulatorLogPanel entries={logs} />
      </div>
    </div>
  )
}

export default CobasE411SimulatorPage
