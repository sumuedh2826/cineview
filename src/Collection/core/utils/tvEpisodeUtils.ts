import type { TvSeasonSummary } from '@/TVShows/core/types/tv.schemas'

export function getTotalEpisodeCount(seasons: TvSeasonSummary[]): number {
  return seasons
    .filter((season) => season.season_number > 0)
    .reduce((total, season) => total + season.episode_count, 0)
}