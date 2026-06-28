import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  AsyncSection,
  EmptyState,
  getBackdropUrl,
  getPosterUrl,
  LoadingSpinner,
  SectionError,
  TrailerModal,
  TmdbApiError,
} from '@/Common'
import type { MovieDetail } from '@/Movies/core/types/movie.schemas'
import {
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getRecommendedMovies,
  getSimilarMovies,
} from '@/Movies/data/services/movieService'
import { CastCarousel } from '@/Movies/ui/components/CastCarousel'
import { ContentRow } from '@/Movies/ui/components/ContentRow'
import { WatchlistButton } from '@/Collection/ui/components/WatchlistButton'
interface MovieDetailFetcherProps {
  movieId: number
  onRetry: () => void
}

function MovieDetailFetcher({ movieId, onRetry }: MovieDetailFetcherProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    let cancelled = false

    void Promise.all([getMovieDetails(movieId), getMovieVideos(movieId)])
      .then(([details, videos]) => {
        if (cancelled) {
          return
        }

        setMovie(details)

        const trailer = videos.results.find(
          (video) => video.site === 'YouTube' && video.type === 'Trailer',
        )
        setTrailerKey(trailer?.key ?? null)
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled) {
          return
        }

        if (e instanceof TmdbApiError && e.status === 404) {
          setNotFound(true)
        } else {
          setError(e instanceof Error ? e.message : 'Failed to load movie')
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [movieId])

  if (loading) {
    return <LoadingSpinner label="Loading movie..." />
  }

  if (notFound) {
    return (
      <EmptyState
        title="Movie not found"
        message="This movie does not exist or was removed."
      />
    )
  }

  if (error || !movie) {
    return (
      <SectionError message={error ?? 'Failed to load'} onRetry={onRetry} />
    )
  }

  const poster = getPosterUrl(movie.poster_path)
  const backdrop = getBackdropUrl(movie.backdrop_path)

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <section className="relative overflow-hidden rounded-2xl border border-gray-800">
        {backdrop && <img src={backdrop} alt="" className="h-64 w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        <div className="relative flex gap-6 p-6">
          {poster && <img src={poster} alt={movie.title} className="w-40 rounded-xl" />}
          <div>
            <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
            {movie.tagline && <p className="mt-1 italic text-gray-400">{movie.tagline}</p>}
            <p className="mt-2 text-sm text-gray-300">
              {movie.release_date?.slice(0, 4)} · {movie.runtime ?? '?'}m · ★{' '}
              {movie.vote_average.toFixed(1)}
            </p>
            <p className="mt-1 text-sm text-purple-300">
              {movie.genres.map((genre) => genre.name).join(', ')}
            </p>
            <p className="mt-4 text-sm text-gray-300">{movie.overview}</p>
            <div className="mt-4 flex gap-3">
              {trailerKey ? (
                <button
                  type="button"
                  onClick={() => setShowTrailer(true)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white"
                >
                  Watch Trailer
                </button>
              ) : (
                <p className="self-center text-sm text-gray-500">No trailer available</p>
              )}
              <WatchlistButton
                mediaId={movie.id}
                mediaType="movie"
                title={movie.title}
                posterPath={movie.poster_path}
                rating={movie.vote_average}
              />
            </div>
          </div>
        </div>
      </section>

      <AsyncSection
        title="Top Cast"
        cacheKey={`cast-${movieId}`}
        load={() => getMovieCredits(movieId)}
        isEmpty={(data) => !data.cast.length}
        render={(data) => <CastCarousel cast={data.cast.slice(0, 12)} />}
      />
      <AsyncSection
        title="Similar Movies"
        cacheKey={`similar-${movieId}`}
        load={() => getSimilarMovies(movieId)}
        isEmpty={(data) => !data.results.length}
        render={(data) => <ContentRow movies={data.results} />}
      />
      <AsyncSection
        title="Recommended"
        cacheKey={`recommended-${movieId}`}
        load={() => getRecommendedMovies(movieId)}
        isEmpty={(data) => !data.results.length}
        render={(data) => <ContentRow movies={data.results} />}
      />

      {showTrailer && trailerKey && (
        <TrailerModal
          youtubeKey={trailerKey}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  )
}

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>()
  const id = Number(movieId)
  const [retryToken, setRetryToken] = useState(0)

  if (!Number.isFinite(id)) {
    return (
      <EmptyState
        title="Movie not found"
        message="This movie does not exist or was removed."
      />
    )
  }

  return (
    <MovieDetailFetcher
      key={`${id}-${retryToken}`}
      movieId={id}
      onRetry={() => setRetryToken((token) => token + 1)}
    />
  )
}