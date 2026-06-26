import { ROUTES } from './Routes.constants'

export const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.HOME, end: true },
  { label: 'Watchlist', path: ROUTES.WATCHLIST, end: false },
  { label: 'Lists', path: ROUTES.LISTS, end: false },
  { label: 'Settings', path: ROUTES.SETTINGS, end: false },
] as const