export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  SEARCH: '/search',
  MOVIE_DETAIL: '/movies/:movieId',
  TV_SHOW: '/tv/:showId',
  TV_SEASON: 'season/:seasonNumber',
  WATCHLIST: '/watchlist',
  LISTS: '/lists',
  LIST_DETAIL: '/lists/:listId',
  SETTINGS: '/settings',
} as const