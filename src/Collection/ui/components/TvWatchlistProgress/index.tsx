import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { collectionStore } from '@/Collection'
import { getTotalEpisodeCount } from '@/Collection/core/utils/tvEpisodeUtils'
import { getTvShowDetails } from '@/TVShows/data/services/tvShowService'
import { ProgressBadge } from '../ProgressBadge'

interface TvWatchlistProgressProps {
  showId: number
}

export const TvWatchlistProgress = observer(function TvWatchlistProgress({
  showId,
}: TvWatchlistProgressProps) {
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    void getTvShowDetails(showId)
      .then((show) => {
        if (!cancelled) {
          setTotal(getTotalEpisodeCount(show.seasons))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTotal(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [showId])

  const watched = collectionStore.getWatchedEpisodeCount(showId)

  if (total === null || total === 0) {
    return null
  }

  return <ProgressBadge watched={watched} total={total} />
})