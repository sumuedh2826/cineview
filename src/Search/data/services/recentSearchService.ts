import {
    MAX_RECENT_SEARCHES,
    RECENT_SEARCHES_KEY,
  } from '@/Search/core/constants/search.constants'
  
  export function getRecentSearches(): string[] {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (!raw) return []
  
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
  
      return parsed.filter((item): item is string => typeof item === 'string')
    } catch {
      return []
    }
  }
  
  export function addRecentSearch(query: string): string[] {
    const trimmed = query.trim()
    if (!trimmed) return getRecentSearches()
  
    const updated = [
      trimmed,
      ...getRecentSearches().filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase(),
      ),
    ].slice(0, MAX_RECENT_SEARCHES)
  
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    return updated
  }
  
  export function clearRecentSearches(): void {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }