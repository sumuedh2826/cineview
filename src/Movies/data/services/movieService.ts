import { tmdbRequest } from '@/Common/data/services/tmdbClient'
import {
  MovieCreditsSchema,
  MovieDetailSchema,
  MovieVideosSchema,
  PaginatedMoviesSchema,
} from '@/Movies/core/types/movie.schemas'

export const getTrendingMovies = () => tmdbRequest('/trending/movie/day', PaginatedMoviesSchema)
export const getPopularMovies = () => tmdbRequest('/movie/popular', PaginatedMoviesSchema)
export const getTopRatedMovies = () => tmdbRequest('/movie/top_rated', PaginatedMoviesSchema)
export const getUpcomingMovies = () => tmdbRequest('/movie/upcoming', PaginatedMoviesSchema)
export const discoverMoviesByGenre = (genreId: number) =>
  tmdbRequest('/discover/movie', PaginatedMoviesSchema, {
    params: { with_genres: genreId, sort_by: 'popularity.desc' },
  })
export const getMovieDetails = (id: number) => tmdbRequest(`/movie/${id}`, MovieDetailSchema)
export const getMovieCredits = (id: number) => tmdbRequest(`/movie/${id}/credits`, MovieCreditsSchema)
export const getMovieVideos = (id: number) => tmdbRequest(`/movie/${id}/videos`, MovieVideosSchema)
export const getSimilarMovies = (id: number) => tmdbRequest(`/movie/${id}/similar`, PaginatedMoviesSchema)
export const getRecommendedMovies = (id: number) =>
  tmdbRequest(`/movie/${id}/recommendations`, PaginatedMoviesSchema)