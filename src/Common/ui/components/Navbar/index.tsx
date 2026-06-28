import { observer } from 'mobx-react-lite'
import { useEffect, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { authStore } from '@/Auth'
import { NAV_ITEMS, ROUTES } from '@/Common'
import { LanguageSelector } from '@/Preferences/ui/components/LanguageSelector'

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

export const Navbar = observer(function Navbar() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const isSearchPage = location.pathname === ROUTES.SEARCH

  const [localQuery, setLocalQuery] = useState('')

  useEffect(() => {
    if (!isSearchPage) {
      setLocalQuery('')
    }
  }, [isSearchPage])

  const searchValue = isSearchPage ? (searchParams.get('q') ?? '') : localQuery

  function handleSearchChange(value: string) {
    if (isSearchPage) {
      if (value) {
        setSearchParams({ q: value }, { replace: true })
      } else {
        setSearchParams({}, { replace: true })
      }
      return
    }

    setLocalQuery(value)
  }

  function handleLogout() {
    authStore.logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }

    const trimmed = searchValue.trim()
    if (!trimmed) {
      return
    }

    if (isSearchPage) {
      return
    }

    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header className="border-b border-gray-800 bg-[#0f0f14]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <NavLink
          to={ROUTES.HOME}
          className="text-xl font-bold text-white hover:text-purple-300"
        >
          {t('appName')}
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                [
                  'text-sm font-medium transition',
                  isActive
                    ? 'text-white underline decoration-purple-500 decoration-2 underline-offset-8'
                    : 'text-gray-400 hover:text-white',
                ].join(' ')
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <input
            type="search"
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t('search.placeholder')}
            aria-label={t('search.ariaLabel')}
            className="hidden w-56 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300 placeholder:text-gray-500 md:block"
          />

          <LanguageSelector variant="compact" />

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white"
            aria-label={t('user')}
            title={authStore.session?.username ?? t('user')}
          >
            {authStore.session ? getInitials(authStore.session.username) : 'U'}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-gray-300 hover:text-white"
          >
            {t('actions.logout')}
          </button>
        </div>
      </div>
    </header>
  )
})