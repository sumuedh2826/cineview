import { tmdbRequest } from '@/Common/data/services/tmdbClient'
import { SeasonDetailSchema, TvDetailSchema } from '@/TVShows/core/types/tv.schemas'

export function getTvShowDetails(showId: number) {
  return tmdbRequest(`/tv/${showId}`, TvDetailSchema)
}

export function getSeasonDetails(showId: number, seasonNumber: number) {
  return tmdbRequest(`/tv/${showId}/season/${seasonNumber}`, SeasonDetailSchema)
}