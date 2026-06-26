import {
    TMDB_BACKDROP_SIZE,
    TMDB_IMAGE_BASE_URL,
    TMDB_POSTER_SIZE,
    TMDB_PROFILE_SIZE,
    TMDB_STILL_SIZE,
  } from '../constants/tmdb.constants'
  
  function buildUrl(path: string | null | undefined, size: string): string | null {
    if (!path) return null
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }
  
  export const getPosterUrl = (path: string | null | undefined, size = TMDB_POSTER_SIZE) =>
    buildUrl(path, size)
  
  export const getBackdropUrl = (path: string | null | undefined, size = TMDB_BACKDROP_SIZE) =>
    buildUrl(path, size)
  
  export const getProfileUrl = (path: string | null | undefined, size = TMDB_PROFILE_SIZE) =>
    buildUrl(path, size)
  
  export const getStillUrl = (path: string | null | undefined, size = TMDB_STILL_SIZE) =>
    buildUrl(path, size)