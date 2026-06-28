import { makeAutoObservable } from 'mobx'
import { authStore } from '@/Auth'
import { WATCHLIST_DEFAULT_STATUS } from '../../core/constants/watchlist.constants'
import {
  AddWatchlistInputSchema,
  WatchlistNoteInputSchema,
  WatchlistStatusSchema,
  type AddWatchlistInput,
  type WatchlistEntry,
  type WatchlistMediaType,
  type WatchlistStatus,
} from '../../core/types/watchlist.schemas'
import {
  clearWatchlistStorage,
  loadWatchlistEntries,
  saveWatchlistEntries,
} from '../services/watchlistPersistenceService'

export class WatchlistStore {
  entries: WatchlistEntry[] = []
  private activeUsername: string | null = null
  isInitialized = false

  constructor() {
    makeAutoObservable(this)
  }

  get totalCount(): number {
    return this.entries.length
  }

  get wantToWatchCount(): number {
    return this.entries.filter((entry) => entry.status === 'want_to_watch').length
  }

  get watchingCount(): number {
    return this.entries.filter((entry) => entry.status === 'watching').length
  }

  get completedCount(): number {
    return this.entries.filter((entry) => entry.status === 'completed').length
  }

  initialize(): void {
    const username = authStore.session?.username ?? null
    this.activeUsername = username

    if (!username) {
      this.entries = []
      this.isInitialized = true
      return
    }

    this.entries = loadWatchlistEntries(username)
    this.isInitialized = true
  }

  isInWatchlist(mediaId: number, mediaType: WatchlistMediaType): boolean {
    return this.entries.some(
      (entry) => entry.mediaId === mediaId && entry.mediaType === mediaType,
    )
  }

  getEntry(mediaId: number, mediaType: WatchlistMediaType): WatchlistEntry | undefined {
    return this.entries.find(
      (entry) => entry.mediaId === mediaId && entry.mediaType === mediaType,
    )
  }

  add(input: AddWatchlistInput): void {
    if (!this.activeUsername) return

    const parsed = AddWatchlistInputSchema.parse(input)
    if (this.isInWatchlist(parsed.mediaId, parsed.mediaType)) return

    const now = new Date().toISOString()
    const entry: WatchlistEntry = {
      id: crypto.randomUUID(),
      mediaId: parsed.mediaId,
      mediaType: parsed.mediaType,
      title: parsed.title,
      posterPath: parsed.posterPath,
      rating: parsed.rating ?? null,
      status: WATCHLIST_DEFAULT_STATUS,
      createdAt: now,
      updatedAt: now,
    }

    this.entries = [entry, ...this.entries]
    this.persist()
  }

  remove(entryId: string): void {
    if (!this.activeUsername) return

    this.entries = this.entries.filter((entry) => entry.id !== entryId)
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
    const index = this.entries.findIndex((entry) => entry.id === entryId)
    if (index === -1) return

    this.entries[index] = {
      ...this.entries[index],
      status: parsedStatus,
      updatedAt: new Date().toISOString(),
    }
    this.entries = [...this.entries]
    this.persist()
  }

  updateNote(entryId: string, note: string): void {
    if (!this.activeUsername) return

    const parsedNote = WatchlistNoteInputSchema.parse(note.trim() ? note.trim() : undefined)
    const index = this.entries.findIndex((entry) => entry.id === entryId)
    if (index === -1) return

    this.entries[index] = {
      ...this.entries[index],
      note: parsedNote,
      updatedAt: new Date().toISOString(),
    }
    this.entries = [...this.entries]
    this.persist()
  }

  clear(): void {
    if (!this.activeUsername) return

    this.entries = []
    clearWatchlistStorage(this.activeUsername)
  }

  clearSession(): void {
    this.entries = []
    this.activeUsername = null
    this.isInitialized = false
  }

  resetForTests(): void {
    if (this.activeUsername) {
      clearWatchlistStorage(this.activeUsername)
    }
    this.entries = []
    this.activeUsername = null
    this.isInitialized = false
  }

  private persist(): void {
    if (!this.activeUsername) return
    saveWatchlistEntries(this.activeUsername, this.entries)
  }
}

export const watchlistStore = new WatchlistStore()