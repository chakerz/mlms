interface ReferenceRangeProps {
  low: number | null
  high: number | null
  unit: string | null
}

export function ReferenceRange({ low, high, unit }: ReferenceRangeProps) {
  if (low === null && high === null) {
    return <span className="text-muted-foreground text-xs">—</span>
  }

  const range =
    low !== null && high !== null
      ? `${low} – ${high}`
      : low !== null
        ? `≥ ${low}`
        : `≤ ${high}`

  return (
    <span className="text-xs text-muted-foreground">
      {range}
      {unit && <span className="ms-1">{unit}</span>}
    </span>
  )
}
