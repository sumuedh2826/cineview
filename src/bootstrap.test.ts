import { beforeEach, describe, expect, it } from 'vitest'
import { authStore } from '@/Auth'
import { preferencesStore } from '@/Preferences'
import { bootstrapApplication } from './bootstrap'

describe('bootstrapApplication', () => {
  beforeEach(() => {
    localStorage.clear()
    authStore.resetForTests()
    preferencesStore.resetForTests()
  })

  it('initializes preferences and auth', () => {
    bootstrapApplication()
    expect(preferencesStore.isInitialized).toBe(true)
    expect(authStore.isHydrating).toBe(false)
  })
})