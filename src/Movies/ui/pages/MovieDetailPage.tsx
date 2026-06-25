import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/Common'

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>()

  return (
    <PlaceholderPage
      title="Movie Detail"
      subtitle={`Movie ID: ${movieId ?? 'unknown'}`}
    />
  )
}