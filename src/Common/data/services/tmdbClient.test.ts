import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { tmdbRequest, TmdbApiError } from './tmdbClient'

const Schema = z.object({ id: z.number(), title: z.string() })

describe('tmdbClient', () => {
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

  it('throws on HTTP error', async () => {
    vi.stubEnv('VITE_TMDB_BASE_URL', 'https://api.themoviedb.org/3')
    vi.stubEnv('VITE_TMDB_API_KEY', 'key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' }))
    await expect(tmdbRequest('/movie/1', Schema)).rejects.toBeInstanceOf(TmdbApiError)
  })
})