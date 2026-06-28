import i18n from './index'

export function initTestI18n(language: 'en' | 'es' = 'en'): void {
  void i18n.changeLanguage(language)
}