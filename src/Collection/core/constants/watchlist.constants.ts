export const WATCHLIST_STORAGE_PREFIX = 'cineview_watchlist_'

export const WATCHLIST_NOTE_MAX_LENGTH = 300

export const WATCHLIST_DEFAULT_STATUS = 'want_to_watch' as const

export const WATCHLIST_STATUS_LABELS = {
  want_to_watch: 'Want to Watch',
  watching: 'Watching',
  completed: 'Completed',
} as const

export const WATCHLIST_SORT_OPTIONS = {
  recently_added: 'Recently Added',
  rating: 'Rating',
  title: 'Title (A-Z)',
} as const