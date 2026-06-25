import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/Common'

export function SeasonDetailPage() {
  const { showId, seasonNumber } = useParams<{
    showId: string
    seasonNumber: string
  }>()

  return (
    <PlaceholderPage
      title="Season Detail"
      subtitle={`Show ID: ${showId ?? 'unknown'} · Season: ${seasonNumber ?? 'unknown'}`}
    />
  )
}