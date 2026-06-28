import { ROUTES } from './Routes.constants'

export const NAV_ITEMS = [
  { labelKey: 'nav.home', path: ROUTES.HOME, end: true },
  { labelKey: 'nav.watchlist', path: ROUTES.WATCHLIST, end: false },
  { labelKey: 'nav.lists', path: ROUTES.LISTS, end: false },
  { labelKey: 'nav.settings', path: ROUTES.SETTINGS, end: false },
] as const