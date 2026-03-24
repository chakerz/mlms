export function normalizeLanguage(input?: string | null): 'fr' | 'ar' {
  if (!input) return 'fr'
  const n = input.toLowerCase()
  if (n === 'ar') return 'ar'
  if (n === 'fr') return 'fr'
  return 'fr'
}
