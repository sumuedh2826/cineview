import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { preferencesStore } from '@/Preferences'
import { SUPPORTED_REGIONS } from '@/Preferences/core/constants/preferences.constants'
import type { Region } from '@/Preferences/core/types/preferences.types'

export const RegionSelector = observer(function RegionSelector() {
  const { t } = useTranslation('preferences')

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-300">{t('region.label')}</p>
      <div className="flex flex-wrap gap-2">
        {SUPPORTED_REGIONS.map((region: Region) => {
          const active = preferencesStore.region === region
          return (
            <button
              key={region}
              type="button"
              onClick={() => preferencesStore.setRegion(region)}
              aria-pressed={active}
              className={[
                'rounded-lg px-4 py-2 text-sm transition',
                active
                  ? 'bg-purple-600 text-white'
                  : 'border border-gray-700 text-gray-300 hover:border-purple-500',
              ].join(' ')}
            >
              {t(`region.${region}`)}
            </button>
          )
        })}
      </div>
    </div>
  )
})