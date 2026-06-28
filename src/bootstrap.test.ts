import { beforeEach, describe, expect, it } from 'vitest'
import { authStore } from '@/Auth'
import { watchlistStore } from '@/Collection'
import { preferencesStore } from '@/Preferences'
import { bootstrapApplication } from './bootstrap'

describe('bootstrapApplication', () => {
  beforeEach(() => {
    localStorage.clear()
    authStore.resetForTests()
    preferencesStore.resetForTests()
    watchlistStore.resetForTests()
  })

  it('initializes preferences, auth, and watchlist', () => {
    bootstrapApplication()
    expect(preferencesStore.isInitialized).toBe(true)
    expect(authStore.isHydrating).toBe(false)
    expect(watchlistStore.isInitialized).toBe(true)
  })
})