import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './locales/en/common.json'
import enMovies from './locales/en/movies.json'
import enPreferences from './locales/en/preferences.json'
import esCommon from './locales/es/common.json'
import esMovies from './locales/es/movies.json'
import esPreferences from './locales/es/preferences.json'

export const defaultNS = 'common'

export const resources = {
  en: {
    common: enCommon,
    movies: enMovies,
    preferences: enPreferences,
  },
  es: {
    common: esCommon,
    movies: esMovies,
    preferences: esPreferences,
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'es'],
  defaultNS,
  ns: ['common', 'movies', 'preferences'],
  interpolation: { escapeValue: false },
  returnNull: false,
})

export default i18n