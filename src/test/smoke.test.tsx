import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '@/App'
import { AppRoutes } from '@/router'

describe('Milestone 1 smoke tests', () => {
  it('App renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeTruthy()
  })

  it('home route renders placeholder', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument()
  })

  it('404 route renders NotFoundPage', () => {
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