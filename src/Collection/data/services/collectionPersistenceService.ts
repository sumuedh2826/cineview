import {
    COLLECTION_STORAGE_PREFIX,
    COLLECTION_VERSION,
    LEGACY_WATCHLIST_STORAGE_PREFIX,
  } from '../../core/constants/collection.constants'
  import {
    CollectionDataSchema,
    WatchlistStorageSchema,
    type CollectionData,
  } from '../../core/types/collection.schemas'
  
  function emptyCollection(): CollectionData {
    return {
      version: COLLECTION_VERSION,
      watchlist: [],
      lists: [],
      episodeProgress: {},
    }
  }
  
  export function getCollectionStorageKey(username: string): string {
    return `${COLLECTION_STORAGE_PREFIX}${username}`
  }
  
  function getLegacyWatchlistKey(username: string): string {
    return `${LEGACY_WATCHLIST_STORAGE_PREFIX}${username}`
  }
  
  function migrateLegacyWatchlist(username: string): CollectionData {
    try {
      const raw = localStorage.getItem(getLegacyWatchlistKey(username))
      if (!raw) return emptyCollection()
  
      const parsed: unknown = JSON.parse(raw)
      const legacy = WatchlistStorageSchema.safeParse(parsed)
      if (!legacy.success) return emptyCollection()
  
      localStorage.removeItem(getLegacyWatchlistKey(username))
      return {
        version: COLLECTION_VERSION,
        watchlist: legacy.data,
        lists: [],
        episodeProgress: {},
      }
    } catch {
      return emptyCollection()
    }
  }
  
  export function loadCollectionData(username: string): CollectionData {
    try {
      const raw = localStorage.getItem(getCollectionStorageKey(username))
      if (!raw) return migrateLegacyWatchlist(username)
  
      const parsed: unknown = JSON.parse(raw)
      const result = CollectionDataSchema.safeParse(parsed)
  
      if (!result.success) {
        localStorage.removeItem(getCollectionStorageKey(username))
        return migrateLegacyWatchlist(username)
      }
  
      return result.data
    } catch {
      localStorage.removeItem(getCollectionStorageKey(username))
      return emptyCollection()
    }
  }
  
  export function saveCollectionData(username: string, data: CollectionData): void {
    const validated = CollectionDataSchema.parse(data)
    localStorage.setItem(getCollectionStorageKey(username), JSON.stringify(validated))
  }
  
  export function clearCollectionStorage(username: string): void {
    localStorage.removeItem(getCollectionStorageKey(username))
    localStorage.removeItem(getLegacyWatchlistKey(username))
  }