import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { EmptyState, getStillUrl, LoadingSpinner, SectionError } from '@/Common'
import { collectionStore } from '@/Collection'
import { ProgressBadge } from '@/Collection/ui/components/ProgressBadge'
import type { Episode, SeasonDetail, TvShowOutletContext } from '@/TVShows/core/types/tv.schemas'
import { getSeasonDetails } from '@/TVShows/data/services/tvShowService'

interface SeasonDetailFetcherProps {
  showId: number
  seasonNum: number
  onRetry: () => void
}

const SeasonDetailFetcher = observer(function SeasonDetailFetcher({
  showId,
  seasonNum,
  onRetry,
}: SeasonDetailFetcherProps) {
  const [season, setSeason] = useState<SeasonDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void getSeasonDetails(showId, seasonNum)
      .then((details) => {
        if (!cancelled) {
          setSeason(details)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load season')
          setSeason(null)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [showId, seasonNum])

  if (loading) {
    return <LoadingSpinner label="Loading episodes..." />
  }

  if (error) {
    return <SectionError message={error} onRetry={onRetry} />
  }

  if (!season || season.episodes.length === 0) {
    return <EmptyState title="No episodes" message="This season has no episodes yet." />
  }

  const episodeIds = season.episodes.map((episode) => episode.id)
  const seasonProgress = collectionStore.getSeasonProgress(showId, episodeIds)

  function toggleEpisode(episode: Episode) {
    collectionStore.toggleEpisode(showId, episode.id)
  }

  function handleMarkAll() {
    collectionStore.markAllEpisodes(showId, episodeIds)
  }

  function handleUnmarkAll() {
    collectionStore.unmarkAllEpisodes(showId, episodeIds)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">{season.name}</h2>
          <div className="mt-2">
            <ProgressBadge watched={seasonProgress.watched} total={seasonProgress.total} />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMarkAll}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:border-purple-500"
          >
            Mark All
          </button>
          <button
            type="button"
            onClick={handleUnmarkAll}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:border-purple-500"
          >
            Unmark All
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {season.episodes.map((episode) => {
          const still = getStillUrl(episode.still_path)
          const isWatched = collectionStore.isEpisodeWatched(showId, episode.id)

          return (
            <li
              key={episode.id}
              className="flex gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-4"
            >
              <div className="h-20 w-36 shrink-0 overflow-hidden rounded-lg bg-gray-800">
                {still ? (
                  <img src={still} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-500">
                    EP {episode.episode_number}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-xs text-purple-400">Episode {episode.episode_number}</p>
                <h3 className="font-medium text-white">{episode.name}</h3>
                <p className="mt-1 text-xs text-gray-400">
                  {episode.air_date ?? 'TBA'}
                  {episode.runtime ? ` · ${episode.runtime}m` : ''}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-400">{episode.overview}</p>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={isWatched}
                  onChange={() => toggleEpisode(episode)}
                  aria-label={`Mark episode ${episode.episode_number} as watched`}
                />
                Watched
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
})

export function SeasonDetailPage() {
  const { show } = useOutletContext<TvShowOutletContext>()
  const { seasonNumber } = useParams<{ seasonNumber: string }>()
  const seasonNum = Number(seasonNumber)
  const [retryToken, setRetryToken] = useState(0)

  if (!Number.isFinite(seasonNum)) {
    return <SectionError message="Invalid season number" onRetry={() => {}} />
  }

  return (
    <SeasonDetailFetcher
      key={`${show.id}-${seasonNum}-${retryToken}`}
      showId={show.id}
      seasonNum={seasonNum}
      onRetry={() => setRetryToken((token) => token + 1)}
    />
  )
}