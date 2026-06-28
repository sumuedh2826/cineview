import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import { initTestI18n } from '@/i18n/test'

initTestI18n('en')

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

const emptyPaginated = {
  page: 1,
  total_pages: 0,
  total_results: 0,
  results: [] as never[],
}

vi.mock('@/Movies/data/services/movieService', () => ({
  getTrendingMovies: vi.fn().mockResolvedValue({
    page: 1,
    total_pages: 1,
    total_results: 1,
    results: [
      {
        id: 1,
        title: 'Test Movie',
        poster_path: null,
        backdrop_path: null,
        vote_average: 8,
        overview: 'Test overview',
      },
    ],
  }),
  getPopularMovies: vi.fn().mockResolvedValue(emptyPaginated),
  getTopRatedMovies: vi.fn().mockResolvedValue(emptyPaginated),
  getUpcomingMovies: vi.fn().mockResolvedValue(emptyPaginated),
  discoverMoviesByGenre: vi.fn().mockResolvedValue(emptyPaginated),
  getMovieDetails: vi.fn(),
  getMovieVideos: vi.fn().mockResolvedValue({ results: [] }),
  getMovieCredits: vi.fn().mockResolvedValue({ cast: [] }),
  getSimilarMovies: vi.fn().mockResolvedValue(emptyPaginated),
  getRecommendedMovies: vi.fn().mockResolvedValue(emptyPaginated),
}))