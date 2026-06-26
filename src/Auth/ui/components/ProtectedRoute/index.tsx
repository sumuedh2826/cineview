import { observer } from 'mobx-react-lite'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/Common'
import { authStore } from '../../../data/stores/AuthStore'
import { SessionRestoringPlaceholder } from '../SessionRestoringPlaceholder'

export const ProtectedRoute = observer(function ProtectedRoute() {
  const location = useLocation()

  if (authStore.isHydrating) {
    return <SessionRestoringPlaceholder />
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
})