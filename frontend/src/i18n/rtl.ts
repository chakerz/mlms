export function applyDirection(language: 'fr' | 'ar') {
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = language
  document.documentElement.dir = dir
  document.body.dir = dir
  return dir
}
