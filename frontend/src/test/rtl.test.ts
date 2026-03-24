import { describe, it, expect, beforeEach } from 'vitest'
import { applyDirection } from '@/i18n/rtl'

/**
 * RTL Tests – verifies that Arabic (ar) sets RTL direction
 * and French (fr) sets LTR direction on the document.
 */
describe('applyDirection (RTL / LTR)', () => {
  beforeEach(() => {
    document.documentElement.dir = ''
    document.documentElement.lang = ''
    document.body.dir = ''
  })

  it('sets dir="rtl" and lang="ar" for Arabic', () => {
    applyDirection('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
    expect(document.body.dir).toBe('rtl')
  })

  it('sets dir="ltr" and lang="fr" for French', () => {
    applyDirection('fr')
    expect(document.documentElement.dir).toBe('ltr')
    expect(document.documentElement.lang).toBe('fr')
    expect(document.body.dir).toBe('ltr')
  })

  it('returns the applied direction', () => {
    expect(applyDirection('ar')).toBe('rtl')
    expect(applyDirection('fr')).toBe('ltr')
  })
})
