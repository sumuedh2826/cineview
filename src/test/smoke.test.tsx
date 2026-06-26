import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authStore } from '@/Auth'
import { AUTH_STORAGE_KEY } from '@/Auth/core/constants/Auth.constants'
import App from '@/App'
import { AppRoutes } from '@/router'

vi.mock('@/Movies/data/services/movieService', () => ({
  getTrendingMovies: vi.fn().mockResolvedValue({
    page: 1,
    total_pages: 1,
    total_results: 1,
    results: [{ id: 1, title: 'Smoke Movie', poster_path: null, vote_average: 8 }],
  }),
  getPopularMovies: vi.fn().mockResolvedValue({ page: 1, total_pages: 0, total_results: 0, results: [] }),
  getTopRatedMovies: vi.fn().mockResolvedValue({ page: 1, total_pages: 0, total_results: 0, results: [] }),
  getUpcomingMovies: vi.fn().mockResolvedValue({ page: 1, total_pages: 0, total_results: 0, results: [] }),
  discoverMoviesByGenre: vi.fn(),
}))

describe('Milestone 1 smoke tests', () => {
  beforeEach(() => {
    authStore.resetForTests()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('App renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    expect(document.body).toBeTruthy()
  })

  it('home route renders when authenticated', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ username: 'admin' }),
    )

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { name: 'Trending Today' }),
    ).toBeInTheDocument()
  })

  it('404 route renders NotFoundPage', () => {
    authStore.restoreSession()

    render(
      <MemoryRouter initialEntries={['/invalid-path']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: '404 — Page Not Found' }),
    ).toBeInTheDocument()
  })
})