import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import { authStore } from '@/Auth'
import { AUTH_STORAGE_KEY } from '@/Auth/core/constants/Auth.constants'
import { bootstrapApplication } from '@/bootstrap'
import { collectionStore } from '@/Collection'
import { preferencesStore } from '@/Preferences'

interface RenderWithProvidersOptions extends RenderOptions {
  route?: string
  routerProps?: MemoryRouterProps
  authenticated?: boolean
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = '/',
    routerProps,
    authenticated = false,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  authStore.resetForTests()
  preferencesStore.resetForTests()
  collectionStore.resetForTests()
  localStorage.clear()

  if (authenticated) {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ username: 'admin' }),
    )
  }

  bootstrapApplication()

  return render(
    <MemoryRouter initialEntries={[route]} {...routerProps}>
      {ui}
    </MemoryRouter>,
    renderOptions,
  )
}