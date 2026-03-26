import React, { useEffect, useRef } from 'react'

export interface LogEntry {
  timestamp: string
  event: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

interface Props {
  entries: LogEntry[]
}

const TYPE_COLORS: Record<LogEntry['type'], string> = {
  info: 'text-blue-400',
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
}

export const SimulatorLogPanel: React.FC<Props> = ({ entries }) => {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-3 h-52 overflow-y-auto font-mono text-xs">
      {entries.length === 0 && (
        <div className="text-gray-600 py-2">En attente d'activité…</div>
      )}
      {entries.map((entry, i) => (
        <div key={i} className="flex gap-2 py-0.5">
          <span className="text-gray-500 shrink-0">{entry.timestamp.slice(11, 19)}</span>
          <span className={`shrink-0 w-36 ${TYPE_COLORS[entry.type]}`}>{entry.event}</span>
          <span className="text-gray-300">{entry.message}</span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
