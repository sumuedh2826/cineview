import { beforeEach, describe, expect, it } from 'vitest'
import { authStore } from '@/Auth'
import { AUTH_STORAGE_KEY } from '@/Auth/core/constants/Auth.constants'
import { getWatchlistStorageKey } from '../services/watchlistPersistenceService'
import { watchlistStore } from './WatchlistStore'

describe('WatchlistStore', () => {
  beforeEach(() => {
    localStorage.clear()
    authStore.resetForTests()
    watchlistStore.resetForTests()
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ username: 'admin' }))
    authStore.restoreSession()
    watchlistStore.initialize()
  })

  it('adds, toggles, and removes entries for the active user', () => {
    watchlistStore.add({
      mediaId: 1,
      mediaType: 'movie',
      title: 'Test Movie',
      posterPath: null,
      rating: 8,
    })

    expect(watchlistStore.totalCount).toBe(1)
    expect(watchlistStore.isInWatchlist(1, 'movie')).toBe(true)

    watchlistStore.toggle({
      mediaId: 1,
      mediaType: 'movie',
      title: 'Test Movie',
      posterPath: null,
      rating: 8,
    })

    expect(watchlistStore.totalCount).toBe(0)
  })

  it('persists per username', () => {
    watchlistStore.add({
      mediaId: 2,
      mediaType: 'tv',
      title: 'Test Show',
      posterPath: '/poster.jpg',
      rating: 7.5,
    })

    const stored = JSON.parse(localStorage.getItem(getWatchlistStorageKey('admin'))!)
    expect(stored).toHaveLength(1)
    expect(stored[0].title).toBe('Test Show')
  })

  it('updates status and note', () => {
    watchlistStore.add({
      mediaId: 3,
      mediaType: 'movie',
      title: 'Note Movie',
      posterPath: null,
    })

    const entry = watchlistStore.getEntry(3, 'movie')!
    watchlistStore.updateStatus(entry.id, 'watching')
    watchlistStore.updateNote(entry.id, 'Great pick')

    expect(watchlistStore.getEntry(3, 'movie')?.status).toBe('watching')
    expect(watchlistStore.getEntry(3, 'movie')?.note).toBe('Great pick')
  })
})