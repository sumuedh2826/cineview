import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { PREFERENCES_STORAGE_KEY } from '../../core/constants/preferences.constants'
import { preferencesStore } from './PreferencesStore'

describe('PreferencesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    preferencesStore.resetForTests()
  })

  it('initializes with defaults', () => {
    preferencesStore.initialize()
    expect(preferencesStore.language).toBe('en')
    expect(preferencesStore.region).toBe('US')
    expect(preferencesStore.isInitialized).toBe(true)
  })

  it('persists theme and language changes', () => {
    preferencesStore.initialize()
    preferencesStore.setTheme('light')
    preferencesStore.setLanguage('es')

    expect(preferencesStore.theme).toBe('light')
    expect(preferencesStore.language).toBe('es')
    expect(i18n.language).toBe('es')

    const stored = JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY)!)
    expect(stored.theme).toBe('light')
    expect(stored.language).toBe('es')
  })

  it('restores stored preferences', () => {
    localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({ theme: 'light', language: 'es', region: 'GB' }),
    )

    preferencesStore.initialize()
    expect(preferencesStore.theme).toBe('light')
    expect(preferencesStore.language).toBe('es')
    expect(preferencesStore.region).toBe('GB')
  })
})