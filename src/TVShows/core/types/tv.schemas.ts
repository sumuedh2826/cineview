import { z } from 'zod'

export const TvGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const TvSeasonSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  season_number: z.number(),
  episode_count: z.number(),
  poster_path: z.string().nullable().optional(),
})

export const TvDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  first_air_date: z.string(),
  genres: z.array(TvGenreSchema),
  number_of_seasons: z.number(),
  seasons: z.array(TvSeasonSummarySchema),
})

export const EpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  episode_number: z.number(),
  season_number: z.number(),
  still_path: z.string().nullable(),
  air_date: z.string().optional(),
  runtime: z.number().nullable().optional(),
})

export const SeasonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  season_number: z.number(),
  episodes: z.array(EpisodeSchema),
})

export type TvDetail = z.infer<typeof TvDetailSchema>
export type TvSeasonSummary = z.infer<typeof TvSeasonSummarySchema>
export type Episode = z.infer<typeof EpisodeSchema>
export type SeasonDetail = z.infer<typeof SeasonDetailSchema>

export interface TvShowOutletContext {
  show: TvDetail
}