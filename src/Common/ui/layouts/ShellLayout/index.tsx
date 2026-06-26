import { Outlet } from 'react-router-dom'
import { Navbar } from '../../components/Navbar'

export function ShellLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <Outlet />
    </div>
  )
}