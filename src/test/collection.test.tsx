import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { bootstrapApplication } from '@/bootstrap'
import { authStore } from '@/Auth'
import { AUTH_STORAGE_KEY } from '@/Auth/core/constants/Auth.constants'
import { collectionStore } from '@/Collection'
import { ListsPage } from '@/Collection/ui/pages/ListsPage'
import { preferencesStore } from '@/Preferences'

describe('ListsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    authStore.resetForTests()
    preferencesStore.resetForTests()
    collectionStore.resetForTests()
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ username: 'admin' }))
    bootstrapApplication()
  })

  it('renders empty state and creates a list', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ListsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('No lists yet')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create List' }))
    await user.type(screen.getByLabelText(/name/i), 'My Sci-Fi')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(screen.getByText('My Sci-Fi')).toBeInTheDocument()
    expect(collectionStore.lists).toHaveLength(1)
  })
})