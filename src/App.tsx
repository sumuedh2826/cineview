import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { authStore } from '@/Auth'
import { AppRoutes } from './router'

function App() {
  useEffect(() => {
    authStore.restoreSession()
  }, [])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App