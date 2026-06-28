export type Theme = 'light' | 'dark'
export type Language = 'en' | 'es'
export type Region = 'US' | 'GB' | 'ES'

export interface StoredPreferences {
  theme: Theme
  language: Language
  region: Region
}