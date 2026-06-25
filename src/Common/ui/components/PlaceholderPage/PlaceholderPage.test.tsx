import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { PlaceholderPage } from './index'

describe('PlaceholderPage', () => {
  it('renders title, subtitle, and route identifier', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <PlaceholderPage title="Search" subtitle="Find movies and shows" />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument()
    expect(screen.getByText('Find movies and shows')).toBeInTheDocument()
    expect(screen.getByText('/search')).toBeInTheDocument()
  })
})