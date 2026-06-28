import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { authStore } from '@/Auth'
import { collectionStore } from '@/Collection'
import { ROUTES } from '@/Common'
import { LanguageSelector } from '../components/LanguageSelector'
import { RegionSelector } from '../components/RegionSelector'
import { ThemeSelector } from '../components/ThemeSelector'

export const SettingsPage = observer(function SettingsPage() {
  const { t } = useTranslation('preferences')
  const navigate = useNavigate()

  function handleLogout() {
    authStore.logout()
    collectionStore.clearSession()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-400">{t('subtitle')}</p>
      </div>

      <div className="space-y-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
        <ThemeSelector />
        <LanguageSelector variant="settings" />
        <RegionSelector />
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-red-500 hover:text-white"
      >
        {t('logout')}
      </button>
    </div>
  )
})