import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { authStore } from '@/Auth'
import { AUTH_STORAGE_KEY } from '@/Auth/core/constants/Auth.constants'
import App from '@/App'
import { AppRoutes } from '@/router'

describe('Milestone 1 smoke tests', () => {
  beforeEach(() => {
    authStore.resetForTests()
    localStorage.clear()
  })

  it('App renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeTruthy()
  })

  it('home route renders placeholder when authenticated', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ username: 'admin' }),
    )

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Home' }),
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