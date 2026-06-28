import { makeAutoObservable } from 'mobx'
import { authStore } from '@/Auth'
import { WATCHLIST_DEFAULT_STATUS } from '../../core/constants/collection.constants'
import {
  AddWatchlistInputSchema,
  CreateListInputSchema,
  MediaSnapshotSchema,
  RenameListInputSchema,
  WatchlistNoteInputSchema,
  WatchlistStatusSchema,
  type AddWatchlistInput,
  type CollectionData,
  type CustomList,
  type MediaSnapshot,
  type MediaType,
  type WatchlistEntry,
  type WatchlistStatus,
} from '../../core/types/collection.schemas'
import {
  clearCollectionStorage,
  loadCollectionData,
  saveCollectionData,
} from '../services/collectionPersistenceService'

function emptyData(): CollectionData {
  return { version: 1, watchlist: [], lists: [], episodeProgress: {} }
}

export class CollectionStore {
  private activeUsername: string | null = null
  private data: CollectionData = emptyData()
  isInitialized = false

  constructor() {
    makeAutoObservable(this)
  }

  get entries(): WatchlistEntry[] {
    return this.data.watchlist
  }

  get lists(): CustomList[] {
    return this.data.lists
  }

  get totalCount(): number {
    return this.data.watchlist.length
  }

  get wantToWatchCount(): number {
    return this.data.watchlist.filter((e) => e.status === 'want_to_watch').length
  }

  get watchingCount(): number {
    return this.data.watchlist.filter((e) => e.status === 'watching').length
  }

  get completedCount(): number {
    return this.data.watchlist.filter((e) => e.status === 'completed').length
  }

  initialize(): void {
    const username = authStore.session?.username ?? null
    this.activeUsername = username

    if (!username) {
      this.data = emptyData()
      this.isInitialized = true
      return
    }

    this.data = loadCollectionData(username)
    this.isInitialized = true
  }

  clearSession(): void {
    this.data = emptyData()
    this.activeUsername = null
    this.isInitialized = false
  }

  resetForTests(): void {
    if (this.activeUsername) clearCollectionStorage(this.activeUsername)
    this.data = emptyData()
    this.activeUsername = null
    this.isInitialized = false
  }

  isInWatchlist(mediaId: number, mediaType: MediaType): boolean {
    return this.data.watchlist.some(
      (e) => e.mediaId === mediaId && e.mediaType === mediaType,
    )
  }

  getEntry(mediaId: number, mediaType: MediaType): WatchlistEntry | undefined {
    return this.data.watchlist.find(
      (e) => e.mediaId === mediaId && e.mediaType === mediaType,
    )
  }

  hasNote(mediaId: number, mediaType: MediaType): boolean {
    const entry = this.getEntry(mediaId, mediaType)
    return Boolean(entry?.note?.trim())
  }

  add(input: AddWatchlistInput): void {
    if (!this.activeUsername) return
    const parsed = AddWatchlistInputSchema.parse(input)
    if (this.isInWatchlist(parsed.mediaId, parsed.mediaType)) return

    const now = new Date().toISOString()
    const entry: WatchlistEntry = {
      id: crypto.randomUUID(),
      ...parsed,
      rating: parsed.rating ?? null,
      status: WATCHLIST_DEFAULT_STATUS,
      createdAt: now,
      updatedAt: now,
    }

    this.data = {
      ...this.data,
      watchlist: [entry, ...this.data.watchlist],
    }
    this.persist()
  }

  remove(entryId: string): void {
    if (!this.activeUsername) return
    const entry = this.data.watchlist.find((e) => e.id === entryId)
    if (!entry) return

    const nextProgress = { ...this.data.episodeProgress }
    if (entry.mediaType === 'tv') {
      delete nextProgress[String(entry.mediaId)]
    }

    this.data = {
      ...this.data,
      watchlist: this.data.watchlist.filter((e) => e.id !== entryId),
      episodeProgress: nextProgress,
    }
    this.persist()
  }

  toggle(input: AddWatchlistInput): void {
    const parsed = AddWatchlistInputSchema.parse(input)
    const existing = this.getEntry(parsed.mediaId, parsed.mediaType)
    if (existing) {
      this.remove(existing.id)
      return
    }
    this.add(parsed)
  }

  updateStatus(entryId: string, status: WatchlistStatus): void {
    if (!this.activeUsername) return
    const parsedStatus = WatchlistStatusSchema.parse(status)
    this.data = {
      ...this.data,
      watchlist: this.data.watchlist.map((entry) =>
        entry.id === entryId
          ? { ...entry, status: parsedStatus, updatedAt: new Date().toISOString() }
          : entry,
      ),
    }
    this.persist()
  }

  updateNote(entryId: string, note: string): void {
    if (!this.activeUsername) return
    const trimmed = note.trim()
    WatchlistNoteInputSchema.parse(trimmed)
    const parsedNote = trimmed ? trimmed : undefined

    this.data = {
      ...this.data,
      watchlist: this.data.watchlist.map((entry) =>
        entry.id === entryId
          ? { ...entry, note: parsedNote, updatedAt: new Date().toISOString() }
          : entry,
      ),
    }
    this.persist()
  }

  clearNote(entryId: string): void {
    this.updateNote(entryId, '')
  }

  clearWatchlist(): void {
    if (!this.activeUsername) return
    this.data = { ...this.data, watchlist: [], episodeProgress: {} }
    this.persist()
  }

  getList(listId: string): CustomList | undefined {
    return this.data.lists.find((list) => list.id === listId)
  }

  isMediaInList(listId: string, mediaId: number, mediaType: MediaType): boolean {
    const list = this.getList(listId)
    if (!list) return false
    return list.items.some(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    )
  }

  createList(input: { name: string; description?: string }): string | null {
    if (!this.activeUsername) return null
    const parsed = CreateListInputSchema.parse(input)
    const now = new Date().toISOString()
    const list: CustomList = {
      id: crypto.randomUUID(),
      name: parsed.name,
      description: parsed.description,
      items: [],
      createdAt: now,
      updatedAt: now,
    }
    this.data = { ...this.data, lists: [list, ...this.data.lists] }
    this.persist()
    return list.id
  }

  renameList(listId: string, input: { name: string; description?: string }): void {
    if (!this.activeUsername) return
    const parsed = RenameListInputSchema.parse(input)
    this.data = {
      ...this.data,
      lists: this.data.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              name: parsed.name,
              description: parsed.description,
              updatedAt: new Date().toISOString(),
            }
          : list,
      ),
    }
    this.persist()
  }

  deleteList(listId: string): void {
    if (!this.activeUsername) return
    this.data = {
      ...this.data,
      lists: this.data.lists.filter((list) => list.id !== listId),
    }
    this.persist()
  }

  toggleMediaInList(listId: string, snapshot: MediaSnapshot): void {
    if (!this.activeUsername) return
    const parsed = MediaSnapshotSchema.parse(snapshot)
    const list = this.getList(listId)
    if (!list) return

    const exists = list.items.some(
      (item) => item.mediaId === parsed.mediaId && item.mediaType === parsed.mediaType,
    )

    const items = exists
      ? list.items.filter(
          (item) =>
            !(item.mediaId === parsed.mediaId && item.mediaType === parsed.mediaType),
        )
      : [
          { ...parsed, rating: parsed.rating ?? null, addedAt: new Date().toISOString() },
          ...list.items,
        ]

    this.data = {
      ...this.data,
      lists: this.data.lists.map((l) =>
        l.id === listId ? { ...l, items, updatedAt: new Date().toISOString() } : l,
      ),
    }
    this.persist()
  }

  getWatchedEpisodeIds(showId: number): number[] {
    return this.data.episodeProgress[String(showId)]?.watchedEpisodeIds ?? []
  }

  getWatchedEpisodeCount(showId: number): number {
    return this.getWatchedEpisodeIds(showId).length
  }

  isEpisodeWatched(showId: number, episodeId: number): boolean {
    return this.getWatchedEpisodeIds(showId).includes(episodeId)
  }

  toggleEpisode(showId: number, episodeId: number): void {
    if (!this.activeUsername) return
    const key = String(showId)
    const current = this.data.episodeProgress[key] ?? { watchedEpisodeIds: [] }
    const watched = new Set(current.watchedEpisodeIds)
    if (watched.has(episodeId)) watched.delete(episodeId)
    else watched.add(episodeId)

    this.data = {
      ...this.data,
      episodeProgress: {
        ...this.data.episodeProgress,
        [key]: { watchedEpisodeIds: [...watched] },
      },
    }
    this.persist()
  }

  markAllEpisodes(showId: number, episodeIds: number[]): void {
    if (!this.activeUsername) return
    const key = String(showId)
    const current = this.data.episodeProgress[key] ?? { watchedEpisodeIds: [] }
    const watched = new Set([...current.watchedEpisodeIds, ...episodeIds])
    this.data = {
      ...this.data,
      episodeProgress: {
        ...this.data.episodeProgress,
        [key]: { watchedEpisodeIds: [...watched] },
      },
    }
    this.persist()
  }

  unmarkAllEpisodes(showId: number, episodeIds: number[]): void {
    if (!this.activeUsername) return
    const key = String(showId)
    const current = this.data.episodeProgress[key] ?? { watchedEpisodeIds: [] }
    const remove = new Set(episodeIds)
    const watched = current.watchedEpisodeIds.filter((id) => !remove.has(id))
    this.data = {
      ...this.data,
      episodeProgress: {
        ...this.data.episodeProgress,
        [key]: { watchedEpisodeIds: watched },
      },
    }
    this.persist()
  }

  getSeasonProgress(showId: number, episodeIds: number[]): { watched: number; total: number } {
    const watchedSet = new Set(this.getWatchedEpisodeIds(showId))
    const watched = episodeIds.filter((id) => watchedSet.has(id)).length
    return { watched, total: episodeIds.length }
  }

  private persist(): void {
    if (!this.activeUsername) return
    saveCollectionData(this.activeUsername, this.data)
  }
}

export const collectionStore = new CollectionStore()