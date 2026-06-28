import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { preferencesStore } from '@/Preferences'
import { SUPPORTED_LANGUAGES } from '@/Preferences/core/constants/preferences.constants'
import type { Language } from '@/Preferences/core/types/preferences.types'

interface LanguageSelectorProps {
  variant?: 'compact' | 'settings'
}

export const LanguageSelector = observer(function LanguageSelector({
  variant = 'settings',
}: LanguageSelectorProps) {
  const namespace = variant === 'compact' ? 'common' : 'preferences'
  const { t } = useTranslation(namespace)

  return (
    <div className={variant === 'settings' ? 'space-y-2' : undefined}>
      {variant === 'settings' ? (
        <p className="text-sm font-medium text-gray-300">{t('language.label')}</p>
      ) : null}

      <div
        className={variant === 'compact' ? 'flex items-center gap-1' : 'flex flex-wrap gap-2'}
        role="group"
        aria-label={variant === 'compact' ? t('language.switch') : undefined}
      >
        {SUPPORTED_LANGUAGES.map((language: Language) => {
          const active = preferencesStore.language === language
          const label =
            variant === 'compact'
              ? t(`language.${language}`)
              : t(`language.${language}`)

          return (
            <button
              key={language}
              type="button"
              onClick={() => preferencesStore.setLanguage(language)}
              aria-pressed={active}
              className={[
                'rounded-lg text-sm transition',
                variant === 'compact' ? 'rounded-full border px-3 py-1 text-xs' : 'px-4 py-2',
                active
                  ? 'border-purple-500 bg-purple-600 text-white'
                  : 'border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
})