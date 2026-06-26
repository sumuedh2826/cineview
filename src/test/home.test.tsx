import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from '@/Movies/ui/pages/HomePage'

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
  getPopularMovies: vi.fn().mockResolvedValue({ page: 1, total_pages: 0, total_results: 0, results: [] }),
  getTopRatedMovies: vi.fn().mockResolvedValue({ page: 1, total_pages: 0, total_results: 0, results: [] }),
  getUpcomingMovies: vi.fn().mockResolvedValue({ page: 1, total_pages: 0, total_results: 0, results: [] }),
  discoverMoviesByGenre: vi.fn(),
}))

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero and trending section', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Test Movie' }),
    ).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Trending Today' })).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 3, name: 'Test Movie' }),
    ).toBeInTheDocument()
  })
})