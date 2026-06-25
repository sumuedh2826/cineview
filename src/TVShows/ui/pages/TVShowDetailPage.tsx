import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/Common'

export function TVShowDetailPage() {
  const { showId } = useParams<{ showId: string }>()

  return (
    <PlaceholderPage
      title="TV Show Detail"
      subtitle={`Show ID: ${showId ?? 'unknown'} — show metadata section`}
    />
  )
}