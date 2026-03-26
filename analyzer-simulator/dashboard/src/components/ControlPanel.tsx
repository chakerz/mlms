import React, { useState } from 'react';

interface Props {
  onCommand: (command: string, data?: any) => void;
}

const BTN = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { color?: string }) => {
  const { color = '#334155', ...rest } = props;
  return (
    <button
      {...rest}
      style={{
        background: color,
        color: '#e2e8f0',
        border: 'none',
        borderRadius: 6,
        padding: '8px 14px',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        ...props.style,
      }}
    />
  );
};

export function ControlPanel({ onCommand }: Props) {
  const [speed, setSpeed] = useState(1);
  const [sampleId, setSampleId] = useState('');

  return (
    <div style={{ background: '#1e293b', borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Controls</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <BTN color="#1d4ed8" onClick={() => onCommand('LOAD_RANDOM_SAMPLE')}>
          + Load Random Sample
        </BTN>
        <BTN color="#065f46" onClick={() => onCommand('START_CALIBRATION')}>
          Start Calibration
        </BTN>
        <BTN color="#7e22ce" onClick={() => onCommand('RESET_ANALYZER')}>
          Reset Analyzer
        </BTN>
        <BTN color="#92400e" onClick={() => onCommand('CLEAR_ALL_SLOTS')}>
          Clear All Slots
        </BTN>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>Speed: {speed}x</span>
        <input
          type="range" min="0.5" max="10" step="0.5"
          value={speed}
          onChange={e => {
            const v = parseFloat(e.target.value);
            setSpeed(v);
            onCommand('SET_PROCESSING_SPEED', { speedMultiplier: v });
          }}
          style={{ flex: 1 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Sample ID (e.g. SMP-001)"
          value={sampleId}
          onChange={e => setSampleId(e.target.value)}
          style={{
            flex: 1, background: '#0f172a', color: '#e2e8f0',
            border: '1px solid #334155', borderRadius: 6, padding: '8px 10px', fontSize: 13,
          }}
        />
        <BTN color="#0f766e" onClick={() => {
          if (!sampleId.trim()) return;
          const slot = { rackId: 'RACK_01', slotNumber: 1 };
          onCommand('LOAD_SAMPLE', {
            ...slot,
            sampleId: sampleId.trim(),
            barcode: sampleId.trim(),
            tests: ['GLU', 'CREA', 'ALT'],
          });
          setSampleId('');
        }}>
          Load by ID
        </BTN>
      </div>
    </div>
  );
}
