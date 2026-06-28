import { useEffect, useState } from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import {
  EmptyState,
  getBackdropUrl,
  LoadingSpinner,
  SectionError,
  TmdbApiError,
} from '@/Common'
import { ROUTES } from '@/Common/constants/Routes.constants'
import type { TvDetail, TvShowOutletContext } from '@/TVShows/core/types/tv.schemas'
import { getTvShowDetails } from '@/TVShows/data/services/tvShowService'
import { WatchlistButton } from '@/Collection/ui/components/WatchlistButton'
interface TvShowLayoutFetcherProps {
  showId: number
  onRetry: () => void
}

function TvShowLayoutFetcher({ showId, onRetry }: TvShowLayoutFetcherProps) {
  const [show, setShow] = useState<TvDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void getTvShowDetails(showId)
      .then((details) => {
        if (!cancelled) {
          setShow(details)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          if (e instanceof TmdbApiError && e.status === 404) {
            setNotFound(true)
          } else {
            setError(e instanceof Error ? e.message : 'Failed to load TV show')
          }
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [showId])

  if (loading) {
    return <LoadingSpinner label="Loading TV show..." />
  }

  if (notFound) {
    return (
      <EmptyState
        title="TV show not found"
        message="This show does not exist or was removed."
      />
    )
  }

  if (error || !show) {
    return (
      <SectionError message={error ?? 'Failed to load'} onRetry={onRetry} />
    )
  }

  const backdrop = getBackdropUrl(show.backdrop_path)
  const seasons = show.seasons.filter((s) => s.season_number > 0)
  const outletContext: TvShowOutletContext = { show }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-gray-800">
        {backdrop ? (
          <img src={backdrop} alt="" className="h-56 w-full object-cover" />
        ) : (
          <div className="h-56 bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        <div className="absolute bottom-0 p-6">
          <h1 className="text-3xl font-bold text-white">{show.name}</h1>
          <p className="mt-2 text-sm text-gray-300">
            {show.first_air_date?.slice(0, 4)} · ★ {show.vote_average.toFixed(1)} ·{' '}
            {show.number_of_seasons} seasons
          </p>
          <p className="mt-1 text-sm text-purple-300">
            {show.genres.map((g) => g.name).join(', ')}
          </p>
          <div className="mt-4">
            <WatchlistButton
              mediaId={show.id}
              mediaType="tv"
              title={show.name}
              posterPath={show.poster_path}
              rating={show.vote_average}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Seasons
          </h2>
          <nav className="space-y-2">
            {seasons.map((season) => {
              const seasonPath = `${ROUTES.TV_SHOW.replace(':showId', String(show.id))}/season/${season.season_number}`

              return (
                <NavLink
                  key={season.id}
                  to={seasonPath}
                  className={({ isActive }) =>
                    [
                      'block rounded-lg px-4 py-2 text-sm transition',
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-800 text-gray-300 hover:border-purple-500',
                    ].join(' ')
                  }
                >
                  {season.name}
                  <span className="mt-0.5 block text-xs opacity-70">
                    {season.episode_count} episodes
                  </span>
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  )
}

export function TVShowLayoutPage() {
  const { showId } = useParams<{ showId: string }>()
  const id = Number(showId)
  const [retryToken, setRetryToken] = useState(0)

  if (!Number.isFinite(id)) {
    return (
      <EmptyState
        title="TV show not found"
        message="This show does not exist or was removed."
      />
    )
  }

  return (
    <TvShowLayoutFetcher
      key={`${id}-${retryToken}`}
      showId={id}
      onRetry={() => setRetryToken((token) => token + 1)}
    />
  )
}