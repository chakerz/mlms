export function getDirection(language: 'fr' | 'ar'): 'ltr' | 'rtl' {
  return language === 'ar' ? 'rtl' : 'ltr'
}
