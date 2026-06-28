import { beforeEach, describe, expect, it } from 'vitest'
import { authStore } from '@/Auth'
import { AUTH_STORAGE_KEY } from '@/Auth/core/constants/Auth.constants'
import { collectionStore } from './CollectionStore'

function restoreAuthenticatedCollection(): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ username: 'admin' }))
  authStore.restoreSession()
  collectionStore.initialize()
}

describe('CollectionStore', () => {
  beforeEach(() => {
    localStorage.clear()
    authStore.resetForTests()
    collectionStore.resetForTests()
    restoreAuthenticatedCollection()
  })

  it('adds and removes watchlist entries', () => {
    collectionStore.add({
      mediaId: 1,
      mediaType: 'movie',
      title: 'Movie',
      posterPath: null,
    })

    expect(collectionStore.totalCount).toBe(1)
    expect(collectionStore.isInWatchlist(1, 'movie')).toBe(true)

    const entry = collectionStore.getEntry(1, 'movie')
    expect(entry).toBeDefined()
    collectionStore.remove(entry!.id)

    expect(collectionStore.totalCount).toBe(0)
  })

  it('removes episode progress when removing a TV watchlist entry', () => {
    collectionStore.add({
      mediaId: 99,
      mediaType: 'tv',
      title: 'Show',
      posterPath: null,
    })

    collectionStore.toggleEpisode(99, 1001)
    expect(collectionStore.getWatchedEpisodeCount(99)).toBe(1)

    const entry = collectionStore.getEntry(99, 'tv')
    collectionStore.remove(entry!.id)

    expect(collectionStore.getWatchedEpisodeCount(99)).toBe(0)
  })

  it('does not remove list items when removing watchlist entry', () => {
    const listId = collectionStore.createList({ name: 'Favorites' })
    expect(listId).toBeTruthy()

    collectionStore.toggleMediaInList(listId!, {
      mediaId: 5,
      mediaType: 'movie',
      title: 'Listed Movie',
      posterPath: null,
    })

    collectionStore.add({
      mediaId: 5,
      mediaType: 'movie',
      title: 'Listed Movie',
      posterPath: null,
    })

    const entry = collectionStore.getEntry(5, 'movie')
    collectionStore.remove(entry!.id)

    expect(collectionStore.isInWatchlist(5, 'movie')).toBe(false)
    expect(collectionStore.isMediaInList(listId!, 5, 'movie')).toBe(true)
  })

  it('creates, renames, and deletes custom lists', () => {
    const listId = collectionStore.createList({ name: 'Sci-Fi', description: 'Space' })
    expect(listId).toBeTruthy()
    expect(collectionStore.lists).toHaveLength(1)

    collectionStore.renameList(listId!, { name: 'Science Fiction' })
    expect(collectionStore.getList(listId!)?.name).toBe('Science Fiction')

    collectionStore.deleteList(listId!)
    expect(collectionStore.lists).toHaveLength(0)
  })

  it('tracks season and show episode progress from watched ids', () => {
    collectionStore.toggleEpisode(42, 1)
    collectionStore.toggleEpisode(42, 2)
    collectionStore.markAllEpisodes(42, [3, 4])

    expect(collectionStore.getSeasonProgress(42, [1, 2, 3])).toEqual({
      watched: 3,
      total: 3,
    })

    expect(collectionStore.getWatchedEpisodeCount(42)).toBe(4)

    collectionStore.unmarkAllEpisodes(42, [3, 4])
    expect(collectionStore.getWatchedEpisodeCount(42)).toBe(2)
  })

  it('persists data per user', () => {
    collectionStore.add({
      mediaId: 7,
      mediaType: 'movie',
      title: 'Persisted',
      posterPath: null,
    })

    collectionStore.clearSession()
    restoreAuthenticatedCollection()

    expect(collectionStore.isInWatchlist(7, 'movie')).toBe(true)
  })
})