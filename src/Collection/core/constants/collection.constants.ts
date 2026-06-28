export const COLLECTION_STORAGE_PREFIX = 'cineview_collection_v1_'
export const LEGACY_WATCHLIST_STORAGE_PREFIX = 'cineview_watchlist_'

export const COLLECTION_VERSION = 1

export const WATCHLIST_NOTE_MAX_LENGTH = 300
export const WATCHLIST_NOTE_WARNING_AT = 280

export const LIST_NAME_MAX_LENGTH = 60
export const LIST_DESCRIPTION_MAX_LENGTH = 200

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