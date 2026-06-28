import { WATCHLIST_STORAGE_PREFIX } from '../../core/constants/watchlist.constants'
import { WatchlistStorageSchema, type WatchlistEntry } from '../../core/types/watchlist.schemas'

export function getWatchlistStorageKey(username: string): string {
  return `${WATCHLIST_STORAGE_PREFIX}${username}`
}

export function loadWatchlistEntries(username: string): WatchlistEntry[] {
  try {
    const raw = localStorage.getItem(getWatchlistStorageKey(username))
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    const result = WatchlistStorageSchema.safeParse(parsed)

    if (!result.success) {
      localStorage.removeItem(getWatchlistStorageKey(username))
      return []
    }

    return result.data
  } catch {
    localStorage.removeItem(getWatchlistStorageKey(username))
    return []
  }
}

export function saveWatchlistEntries(username: string, entries: WatchlistEntry[]): void {
  const validated = WatchlistStorageSchema.parse(entries)
  localStorage.setItem(getWatchlistStorageKey(username), JSON.stringify(validated))
}

export function clearWatchlistStorage(username: string): void {
  localStorage.removeItem(getWatchlistStorageKey(username))
}