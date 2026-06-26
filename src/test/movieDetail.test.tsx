import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MovieDetailPage } from '@/Movies/ui/pages/MovieDetailPage'
import { TmdbApiError } from '@/Common/data/services/tmdbClient'

vi.mock('@/Movies/data/services/movieService', () => ({
  getMovieDetails: vi.fn(),
  getMovieVideos: vi.fn().mockResolvedValue({ results: [] }),
  getMovieCredits: vi.fn().mockResolvedValue({ cast: [] }),
  getSimilarMovies: vi.fn().mockResolvedValue({ page: 1, total_pages: 0, total_results: 0, results: [] }),
  getRecommendedMovies: vi.fn().mockResolvedValue({ page: 1, total_pages: 0, total_results: 0, results: [] }),
}))

import {
  getMovieDetails,
} from '@/Movies/data/services/movieService'

describe('MovieDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders movie metadata', async () => {
    vi.mocked(getMovieDetails).mockResolvedValue({
      id: 1,
      title: 'Detail Movie',
      overview: 'Overview text',
      poster_path: null,
      backdrop_path: null,
      vote_average: 8,
      release_date: '2024-01-01',
      runtime: 120,
      genres: [{ id: 1, name: 'Sci-Fi' }],
    })

    render(
      <MemoryRouter initialEntries={['/movies/1']}>
        <Routes>
          <Route path="/movies/:movieId" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Detail Movie' })).toBeInTheDocument()
    expect(screen.getByText('Overview text')).toBeInTheDocument()
  })

  it('shows inline not found for invalid id', async () => {
    vi.mocked(getMovieDetails).mockRejectedValue(new TmdbApiError('Not found', 404))

    render(
      <MemoryRouter initialEntries={['/movies/999']}>
        <Routes>
          <Route path="/movies/:movieId" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Movie not found')).toBeInTheDocument()
  })
})