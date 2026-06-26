import { observer } from 'mobx-react-lite'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/Common'
import { authStore } from '../../../data/stores/AuthStore'
import { SessionRestoringPlaceholder } from '../SessionRestoringPlaceholder'

export const GuestRoute = observer(function GuestRoute() {
  const location = useLocation()

  if (authStore.isHydrating) {
    return <SessionRestoringPlaceholder />
  }

  if (authStore.isAuthenticated) {
    const redirectTo =
      (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname ?? ROUTES.HOME

    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
})