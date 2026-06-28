import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { preferencesStore } from '@/Preferences'
import type { Theme } from '@/Preferences/core/types/preferences.types'

const THEMES: Theme[] = ['light', 'dark']

export const ThemeSelector = observer(function ThemeSelector() {
  const { t } = useTranslation('preferences')

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-300">{t('theme.label')}</p>
      <div className="flex flex-wrap gap-2">
        {THEMES.map((theme) => {
          const active = preferencesStore.theme === theme
          return (
            <button
              key={theme}
              type="button"
              onClick={() => preferencesStore.setTheme(theme)}
              aria-pressed={active}
              className={[
                'rounded-lg px-4 py-2 text-sm transition',
                active
                  ? 'bg-purple-600 text-white'
                  : 'border border-gray-700 text-gray-300 hover:border-purple-500',
              ].join(' ')}
            >
              {t(`theme.${theme}`)}
            </button>
          )
        })}
      </div>
    </div>
  )
})