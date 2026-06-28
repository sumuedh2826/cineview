import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { bootstrapApplication } from '@/bootstrap'
import { authStore } from '@/Auth'
import { AUTH_STORAGE_KEY } from '@/Auth/core/constants/Auth.constants'
import { watchlistStore } from '@/Collection'
import { WatchlistPage } from '@/Collection/ui/pages/WatchlistPage'
import { preferencesStore } from '@/Preferences'

describe('WatchlistPage', () => {
  beforeEach(() => {
    localStorage.clear()
    authStore.resetForTests()
    preferencesStore.resetForTests()
    watchlistStore.resetForTests()
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ username: 'admin' }))
    bootstrapApplication()
  })

  it('renders empty state when no items exist', () => {
    render(
      <MemoryRouter>
        <WatchlistPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Your watchlist is empty')).toBeInTheDocument()
  })

  it('renders saved watchlist items', async () => {
    watchlistStore.add({
      mediaId: 10,
      mediaType: 'movie',
      title: 'Saved Movie',
      posterPath: null,
      rating: 9,
    })

    render(
      <MemoryRouter>
        <WatchlistPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Saved Movie')).toBeInTheDocument()
    expect(screen.getByText('All (1)')).toBeInTheDocument()
  })

  it('filters by status tab', async () => {
    const user = userEvent.setup()

    watchlistStore.add({
      mediaId: 11,
      mediaType: 'movie',
      title: 'Want Movie',
      posterPath: null,
    })

    render(
      <MemoryRouter>
        <WatchlistPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Watching (0)' }))
    expect(screen.getByText('Your watchlist is empty')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Want to Watch (1)' }))
    expect(screen.getByText('Want Movie')).toBeInTheDocument()
  })
})