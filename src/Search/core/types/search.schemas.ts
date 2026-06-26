import { z } from 'zod'

export const SearchMovieResultSchema = z.object({
  id: z.number(),
  media_type: z.literal('movie'),
  title: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string().optional(),
  vote_average: z.number().optional(),
})

export const SearchTvResultSchema = z.object({
  id: z.number(),
  media_type: z.literal('tv'),
  name: z.string(),
  poster_path: z.string().nullable(),
  first_air_date: z.string().optional(),
  vote_average: z.number().optional(),
})

export const SearchPersonResultSchema = z.object({
  id: z.number(),
  media_type: z.literal('person'),
  name: z.string(),
  profile_path: z.string().nullable(),
  known_for_department: z.string().optional(),
})

export const SearchResultSchema = z.discriminatedUnion('media_type', [
  SearchMovieResultSchema,
  SearchTvResultSchema,
  SearchPersonResultSchema,
])

export const SearchMultiResponseSchema = z.object({
  page: z.number(),
  results: z.array(SearchResultSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

export type SearchMovieResult = z.infer<typeof SearchMovieResultSchema>
export type SearchTvResult = z.infer<typeof SearchTvResultSchema>
export type SearchPersonResult = z.infer<typeof SearchPersonResultSchema>
export type SearchResult = z.infer<typeof SearchResultSchema>
export type SearchMultiResponse = z.infer<typeof SearchMultiResponseSchema>