import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { preferencesStore } from '@/Preferences'
import { tmdbRequest, TmdbApiError } from './tmdbClient'

const Schema = z.object({ id: z.number(), title: z.string() })

describe('tmdbClient', () => {
  beforeEach(() => {
    localStorage.clear()
    preferencesStore.resetForTests()
    preferencesStore.initialize()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('parses valid response', async () => {
    vi.stubEnv('VITE_TMDB_BASE_URL', 'https://api.themoviedb.org/3')
    vi.stubEnv('VITE_TMDB_API_KEY', 'key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, title: 'Test' }),
    }))
    await expect(tmdbRequest('/movie/1', Schema)).resolves.toEqual({ id: 1, title: 'Test' })
  })

  it('includes language and region query params', async () => {
    vi.stubEnv('VITE_TMDB_BASE_URL', 'https://api.themoviedb.org/3')
    vi.stubEnv('VITE_TMDB_API_KEY', 'key')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, title: 'Test' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await tmdbRequest('/movie/1', Schema)

    const url = String(fetchMock.mock.calls[0][0])
    expect(url).toContain('language=en-US')
    expect(url).toContain('region=US')
  })

  it('throws on HTTP error', async () => {
    vi.stubEnv('VITE_TMDB_BASE_URL', 'https://api.themoviedb.org/3')
    vi.stubEnv('VITE_TMDB_API_KEY', 'key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' }))
    await expect(tmdbRequest('/movie/1', Schema)).rejects.toBeInstanceOf(TmdbApiError)
  })
})