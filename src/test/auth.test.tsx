import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AUTH_STORAGE_KEY } from '@/Auth/core/constants/Auth.constants'
import { AppRoutes } from '@/router'
import { renderWithProviders } from './testUtils'

describe('Milestone 2 authentication', () => {
  it('redirects unauthenticated users to login', async () => {
    renderWithProviders(<AppRoutes />, { route: '/watchlist' })

    expect(
      await screen.findByRole('heading', { name: 'Welcome Back' }),
    ).toBeInTheDocument()
  })

  it('logs in with valid credentials', async () => {
    const user = userEvent.setup()

    renderWithProviders(<AppRoutes />, { route: '/login' })

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'admin')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
    })

    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toContain('admin')
  })

  it('shows error for invalid credentials', async () => {
    const user = userEvent.setup()

    renderWithProviders(<AppRoutes />, { route: '/login' })

    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(
      await screen.findByText('Invalid username or password.'),
    ).toBeInTheDocument()
  })

  it('shows validation errors for short fields', async () => {
    const user = userEvent.setup()

    renderWithProviders(<AppRoutes />, { route: '/login' })

    await user.type(screen.getByLabelText('Username'), 'ab')
    await user.type(screen.getByLabelText('Password'), '1234')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(
      screen.getByText('Username must be at least 3 characters.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Password must be at least 5 characters.'),
    ).toBeInTheDocument()
  })

  it('redirects back to originally requested page after login', async () => {
    const user = userEvent.setup()

    renderWithProviders(<AppRoutes />, { route: '/settings' })

    await user.type(await screen.findByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'admin')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Settings' }),
      ).toBeInTheDocument()
    })
  })

  it('redirects authenticated users away from login', async () => {
    renderWithProviders(<AppRoutes />, {
      route: '/login',
      authenticated: true,
    })

    expect(
      await screen.findByRole('heading', { name: 'Home' }),
    ).toBeInTheDocument()
  })

  it('logs out and returns to login', async () => {
    const user = userEvent.setup()

    renderWithProviders(<AppRoutes />, {
      route: '/',
      authenticated: true,
    })

    await user.click(screen.getByRole('button', { name: 'Logout' }))

    expect(
      await screen.findByRole('heading', { name: 'Welcome Back' }),
    ).toBeInTheDocument()
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('highlights the active navigation link', async () => {
    renderWithProviders(<AppRoutes />, {
      route: '/watchlist',
      authenticated: true,
    })

    const watchlistLink = await screen.findByRole('link', { name: 'Watchlist' })
    expect(watchlistLink.className).toContain('underline')
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()

    renderWithProviders(<AppRoutes />, { route: '/login' })

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Show password' }))
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})