function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toDate(value: string | Date): Date {
  return typeof value === 'string' ? new Date(value) : value
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '–'
  const d = toDate(value)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '–'
  const d = toDate(value)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
