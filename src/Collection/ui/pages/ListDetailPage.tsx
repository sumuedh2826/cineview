import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '@/Common'

export function ListDetailPage() {
  const { listId } = useParams<{ listId: string }>()

  return (
    <PlaceholderPage
      title="List Detail"
      subtitle={`List ID: ${listId ?? 'unknown'}`}
    />
  )
}