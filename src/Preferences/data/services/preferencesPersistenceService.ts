import { PREFERENCES_STORAGE_KEY } from '../../core/constants/preferences.constants'
import type { StoredPreferences } from '../../core/types/preferences.types'

export function getStoredPreferences(): StoredPreferences | null {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const { theme, language, region } = parsed as Partial<StoredPreferences>
    if (theme !== 'light' && theme !== 'dark') return null
    if (language !== 'en' && language !== 'es') return null
    if (region !== 'US' && region !== 'GB' && region !== 'ES') return null

    return { theme, language, region }
  } catch {
    return null
  }
}

export function setStoredPreferences(preferences: StoredPreferences): void {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
}

export function clearStoredPreferences(): void {
  localStorage.removeItem(PREFERENCES_STORAGE_KEY)
}