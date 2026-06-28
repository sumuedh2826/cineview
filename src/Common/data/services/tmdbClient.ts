import type { ZodType } from 'zod'
import { preferencesStore } from '@/Preferences'

export class TmdbApiError extends Error {
  readonly status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'TmdbApiError'
    this.status = status
  }
}

export async function tmdbRequest<T>(
  path: string,
  schema: ZodType<T>,
  options: { params?: Record<string, string | number | boolean | undefined> } = {},
): Promise<T> {
  const baseUrl = import.meta.env.VITE_TMDB_BASE_URL
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  if (!baseUrl || !apiKey) {
    throw new TmdbApiError('TMDB not configured. Set VITE_TMDB_BASE_URL and VITE_TMDB_API_KEY.')
  }

  const url = new URL(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('language', preferencesStore.tmdbLanguage)
  url.searchParams.set('region', preferencesStore.region)

  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }

  const res = await fetch(url.toString())
  if (!res.ok) throw new TmdbApiError(`TMDB failed: ${res.status}`, res.status)

  const json: unknown = await res.json()
  try {
    return schema.parse(json)
  } catch (e) {
    throw new TmdbApiError(
      e instanceof Error ? `Validation failed: ${e.message}` : 'Validation failed',
    )
  }
}