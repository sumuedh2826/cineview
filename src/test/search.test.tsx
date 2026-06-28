import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchPage } from '@/Search/ui/pages/SearchPage'

vi.mock('@/Search/data/services/searchService', () => ({
  searchMulti: vi.fn(),
}))

import { searchMulti } from '@/Search/data/services/searchService'

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders grouped search results', async () => {
    vi.mocked(searchMulti).mockResolvedValue({
      page: 1,
      total_pages: 1,
      total_results: 2,
      results: [
        {
          id: 1,
          media_type: 'movie',
          title: 'Search Movie',
          poster_path: null,
          vote_average: 8,
        },
        {
          id: 2,
          media_type: 'tv',
          name: 'Search Show',
          poster_path: null,
          vote_average: 7,
        },
      ],
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByRole('searchbox'), 'dune')

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    expect(screen.getByRole('heading', { name: 'TV Shows' })).toBeInTheDocument()
    expect(screen.getByText('Search Movie')).toBeInTheDocument()
    expect(screen.getByText('Search Show')).toBeInTheDocument()
  })

  it('keeps the input empty and clears results when the query is deleted', async () => {
    vi.mocked(searchMulti).mockResolvedValue({
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [
        {
          id: 1,
          media_type: 'movie',
          title: 'Search Movie',
          poster_path: null,
          vote_average: 8,
        },
      ],
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/search']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const searchbox = screen.getByRole('searchbox')

    await user.type(searchbox, 'dune')

    await waitFor(
      () => {
        expect(screen.getByText('Search Movie')).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    await user.clear(searchbox)

    expect(searchbox).toHaveValue('')
    expect(screen.queryByText('Search Movie')).not.toBeInTheDocument()
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument()
  })
})