import { makeAutoObservable } from 'mobx'
import i18n from '@/i18n'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_REGION,
  TMDB_LANGUAGE_MAP,
} from '../../core/constants/preferences.constants'
import type { Language, Region, Theme } from '../../core/types/preferences.types'
import {
  clearStoredPreferences,
  getStoredPreferences,
  setStoredPreferences,
} from '../services/preferencesPersistenceService'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  if (typeof window.matchMedia !== 'function') return 'dark'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeToDocument(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export class PreferencesStore {
  theme: Theme = 'dark'
  language: Language = DEFAULT_LANGUAGE
  region: Region = DEFAULT_REGION
  isInitialized = false

  constructor() {
    makeAutoObservable(this)
  }

  get tmdbLanguage(): string {
    return TMDB_LANGUAGE_MAP[this.language]
  }

  initialize(): void {
    const stored = getStoredPreferences()

    this.theme = stored?.theme ?? getSystemTheme()
    this.language = stored?.language ?? DEFAULT_LANGUAGE
    this.region = stored?.region ?? DEFAULT_REGION

    applyThemeToDocument(this.theme)
    void i18n.changeLanguage(this.language)

    this.isInitialized = true
  }

  setTheme(theme: Theme): void {
    this.theme = theme
    applyThemeToDocument(theme)
    this.persist()
  }

  setLanguage(language: Language): void {
    this.language = language
    void i18n.changeLanguage(language)
    this.persist()
  }

  setRegion(region: Region): void {
    this.region = region
    this.persist()
  }

  resetForTests(): void {
    clearStoredPreferences()
    this.theme = 'dark'
    this.language = DEFAULT_LANGUAGE
    this.region = DEFAULT_REGION
    this.isInitialized = false
    applyThemeToDocument(this.theme)
    void i18n.changeLanguage(this.language)
  }

  private persist(): void {
    setStoredPreferences({
      theme: this.theme,
      language: this.language,
      region: this.region,
    })
  }
}

export const preferencesStore = new PreferencesStore()