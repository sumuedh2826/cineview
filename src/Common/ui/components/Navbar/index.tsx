import { observer } from 'mobx-react-lite'
import { NavLink, useNavigate } from 'react-router-dom'
import { authStore } from '@/Auth'
import { NAV_ITEMS, ROUTES } from '@/Common'

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

export const Navbar = observer(function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    authStore.logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <header className="border-b border-gray-800 bg-[#0f0f14]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <NavLink
          to={ROUTES.HOME}
          className="text-xl font-bold text-white hover:text-purple-300"
        >
          CineView
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <input
            type="search"
            readOnly
            placeholder="Search movies, shows..."
            aria-label="Search movies and shows"
            className="hidden w-56 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300 placeholder:text-gray-500 md:block"
          />

          <button
            type="button"
            disabled
            aria-label="Language switcher"
            className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400"
          >
            EN
          </button>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white"
            aria-label="User avatar"
            title={authStore.session?.username ?? 'User'}
          >
            {authStore.session ? getInitials(authStore.session.username) : 'U'}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-gray-300 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
})