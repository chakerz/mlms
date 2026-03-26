import { useState, useEffect, useRef, useCallback } from 'react';
import { InstrumentData, LogEntry } from './types';

const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:15001`;

let logIdCounter = 0;

function eventToLog(event: string, data: any): LogEntry | null {
  const ts = new Date().toISOString();
  const type: LogEntry['type'] =
    event.includes('ERROR') ? 'error'
    : event === 'SAMPLE_DONE' || event === 'RESULTS_SENT' || event === 'CALIBRATION_DONE' ? 'success'
    : event === 'CONNECTION_CHANGED' || event === 'CALIBRATION_STARTED' ? 'warning'
    : 'info';

  const message =
    event === 'SAMPLE_LOADED' ? `${data?.sampleId} → Slot ${data?.slotNumber}`
    : event === 'SAMPLE_PROCESSING' ? `${data?.sampleId} ${data?.progress}%`
    : event === 'SAMPLE_DONE' ? `${data?.sampleId} – ${data?.results?.length ?? 0} résultats`
    : event === 'RESULTS_SENT' ? `${data?.sampleId}`
    : event === 'SAMPLE_ERROR' ? `${data?.sampleId ?? '–'}: ${data?.errorMessage}`
    : event === 'CONNECTION_CHANGED' ? (data?.lisConnected ? 'LIS connecté' : 'LIS déconnecté')
    : event === 'CALIBRATION_STARTED' ? 'Démarrée'
    : event === 'CALIBRATION_DONE' ? 'Terminée'
    : JSON.stringify(data ?? {}).slice(0, 80);

  return { id: ++logIdCounter, timestamp: ts, event, data, type };
}

export function useSimulatorWs() {
  const [instruments, setInstruments] = useState<Map<string, InstrumentData>>(new Map());
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => { ws.close(); };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const { event, instrumentCode, data } = msg;
        if (!instrumentCode) return;

        setInstruments(prev => {
          const next = new Map(prev);
          const existing = next.get(instrumentCode) ?? {
            instrumentCode,
            config: null,
            state: null,
            logs: [],
          };

          let updated = { ...existing };

          if (event === 'ANALYZER_STATE') {
            updated.config = data.config ?? existing.config;
            updated.state = data.state ?? existing.state;
          } else if (event === 'ANALYZER_STATE_UPDATE') {
            updated.state = data.state ?? existing.state;
          } else {
            // State partial updates
            if (event === 'CONNECTION_CHANGED' && updated.state) {
              updated.state = { ...updated.state, connection: { ...updated.state.connection, lisConnected: data.lisConnected } };
            }
            if (event === 'SAMPLE_PROCESSING' && updated.state) {
              updated.state = {
                ...updated.state,
                racks: updated.state.racks.map(rack =>
                  rack.rackId === data.rackId ? {
                    ...rack,
                    slots: rack.slots.map(slot =>
                      slot.slotNumber === data.slotNumber
                        ? { ...slot, progress: data.progress, status: 'PROCESSING' as const }
                        : slot
                    ),
                  } : rack
                ),
              };
            }
            // Add log entry
            const logEntry = eventToLog(event, data);
            if (logEntry) {
              updated.logs = [logEntry, ...existing.logs].slice(0, 100);
            }
          }

          next.set(instrumentCode, updated);
          return next;
        });
      } catch (e) {
        console.error('WS parse error', e);
      }
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendCommand = useCallback((command: string, instrumentCode: string, data?: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command, instrumentCode, data }));
    }
  }, []);

  return { instruments, connected, sendCommand };
}
