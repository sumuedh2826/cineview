import { useOutletContext } from 'react-router-dom'
import type { TvShowOutletContext } from '@/TVShows/core/types/tv.schemas'

export function TVShowDetailPage() {
  const { show } = useOutletContext<TvShowOutletContext>()

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Overview</h2>
      <p className="text-sm leading-relaxed text-gray-300">{show.overview}</p>
      <p className="text-sm text-gray-500">
        Select a season from the sidebar to view episodes.
      </p>
    </section>
  )
}