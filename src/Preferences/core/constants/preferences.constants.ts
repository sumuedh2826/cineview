import type { Language, Region } from '../types/preferences.types'

export const PREFERENCES_STORAGE_KEY = 'cineview_preferences'

export const DEFAULT_LANGUAGE: Language = 'en'
export const DEFAULT_REGION: Region = 'US'

export const SUPPORTED_LANGUAGES = ['en', 'es'] as const
export const SUPPORTED_REGIONS = ['US', 'GB', 'ES'] as const

export const TMDB_LANGUAGE_MAP: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
}