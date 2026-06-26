import { useEffect } from 'react'
import { authStore } from '@/Auth'
import { AppRoutes } from './router'

function App() {
  useEffect(() => {
    authStore.restoreSession()
  }, [])

  return <AppRoutes />
}

export default App