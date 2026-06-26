import { z } from 'zod'

export const GenreSchema = z.object({ id: z.number(), name: z.string() })
export const MovieSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable().optional(),
  vote_average: z.number(),
  release_date: z.string().optional(),
  overview: z.string().optional(),
})
export const PaginatedMoviesSchema = z.object({
  page: z.number(),
  results: z.array(MovieSummarySchema),
  total_pages: z.number(),
  total_results: z.number(),
})
export const MovieDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  release_date: z.string(),
  runtime: z.number().nullable(),
  tagline: z.string().nullable().optional(),
  genres: z.array(GenreSchema),
})
export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
})
export const MovieCreditsSchema = z.object({ cast: z.array(CastMemberSchema) })
export const VideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  site: z.string(),
  type: z.string(),
  name: z.string(),
})
export const MovieVideosSchema = z.object({ results: z.array(VideoSchema) })

export type MovieSummary = z.infer<typeof MovieSummarySchema>
export type PaginatedMovies = z.infer<typeof PaginatedMoviesSchema>
export type MovieDetail = z.infer<typeof MovieDetailSchema>
export type CastMember = z.infer<typeof CastMemberSchema>
export type Video = z.infer<typeof VideoSchema>