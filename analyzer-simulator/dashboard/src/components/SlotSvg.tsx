import React from 'react';
import { SlotState, SlotStatus } from '../types';

const SLOT_COLORS: Record<SlotStatus, string> = {
  EMPTY: '#1e293b',
  LOADED: '#475569',
  SCANNING: '#ca8a04',
  WAITING: '#b45309',
  PROCESSING: '#c2410c',
  DONE: '#15803d',
  ERROR: '#b91c1c',
  SENDING: '#0e7490',
};

const CIRCUMFERENCE = 2 * Math.PI * 20;

export function SlotSvg({ slot, onClick }: { slot: SlotState; onClick?: () => void }) {
  const color = SLOT_COLORS[slot.status];

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <title>
        {slot.status === 'EMPTY' ? `Slot ${slot.slotNumber} — Empty` :
          `Slot ${slot.slotNumber}\n${slot.sampleId}\nTests: ${slot.tests.join(', ')}\nStatus: ${slot.status}\nProgress: ${slot.progress}%`}
      </title>
      {/* Outer track */}
      <circle cx="28" cy="28" r="22" fill="none" stroke="#1e293b" strokeWidth="3" />
      {/* Progress ring */}
      {slot.status === 'PROCESSING' && (
        <circle
          cx="28" cy="28" r="22"
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 22}`}
          strokeDashoffset={`${2 * Math.PI * 22 * (1 - slot.progress / 100)}`}
          transform="rotate(-90 28 28)"
          style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        />
      )}
      {/* Inner circle */}
      <circle cx="28" cy="28" r="18" fill={color} />
      {/* Slot number */}
      <text x="28" y="32" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
        {slot.slotNumber}
      </text>
      {/* Status icon */}
      {slot.status === 'DONE' && (
        <text x="28" y="22" textAnchor="middle" fontSize="10" fill="#4ade80">&#x2713;</text>
      )}
      {slot.status === 'ERROR' && (
        <text x="28" y="22" textAnchor="middle" fontSize="10" fill="#fca5a5">&#x2717;</text>
      )}
      {slot.status === 'SCANNING' && (
        <text x="28" y="22" textAnchor="middle" fontSize="9" fill="#fde68a">&#x2299;</text>
      )}
      {slot.status === 'SENDING' && (
        <text x="28" y="22" textAnchor="middle" fontSize="9" fill="#67e8f9">&#x2192;</text>
      )}
      {slot.status === 'WAITING' && (
        <text x="28" y="22" textAnchor="middle" fontSize="9" fill="#fde68a">&#x23F3;</text>
      )}
    </svg>
  );
}
