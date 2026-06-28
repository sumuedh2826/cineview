import { beforeEach, describe, expect, it } from 'vitest'
import { authStore } from '@/Auth'
import { collectionStore } from '@/Collection'
import { preferencesStore } from '@/Preferences'
import { bootstrapApplication } from './bootstrap'

describe('bootstrapApplication', () => {
  beforeEach(() => {
    localStorage.clear()
    authStore.resetForTests()
    preferencesStore.resetForTests()
    collectionStore.resetForTests()
  })

  it('initializes preferences, auth, and collection', () => {
    bootstrapApplication()
    expect(preferencesStore.isInitialized).toBe(true)
    expect(authStore.isHydrating).toBe(false)
    expect(collectionStore.isInitialized).toBe(true)
  })
})