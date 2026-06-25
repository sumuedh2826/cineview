import { Outlet, useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/Common'

export function TVShowLayoutPage() {
  const { showId } = useParams<{ showId: string }>()

  return (
    <div>
      <PlaceholderPage
        title="TV Show"
        subtitle={`Show ID: ${showId ?? 'unknown'} — layout shell (nested routes below)`}
      />
      <div className="border-t border-gray-200 px-6 pb-12 dark:border-gray-800">
        <Outlet />
      </div>
    </div>
  )
}