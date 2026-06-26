import { useEffect, useState } from 'react'
import { AsyncSection, LoadingSpinner, SectionError } from '@/Common'
import type { MovieSummary } from '@/Movies/core/types/movie.schemas'
import {
  discoverMoviesByGenre,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from '@/Movies/data/services/movieService'
import { ContentRow } from '@/Movies/ui/components/ContentRow'
import { GenreFilter } from '@/Movies/ui/components/GenreFilter'
import { HeroBanner } from '@/Movies/ui/components/HeroBanner'

interface HomeHeroProps {
  onRetry: () => void
}

function HomeHero({ onRetry }: HomeHeroProps) {
  const [hero, setHero] = useState<MovieSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void getTrendingMovies()
      .then((data) => {
        if (!cancelled) {
          setHero(data.results[0] ?? null)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load hero')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <LoadingSpinner label="Loading featured title..." />
  }

  if (error) {
    return <SectionError message={error} onRetry={onRetry} />
  }

  if (!hero) {
    return null
  }

  return <HeroBanner movie={hero} />
}

export function HomePage() {
  const [genreId, setGenreId] = useState<number | null>(null)
  const [heroRetryToken, setHeroRetryToken] = useState(0)

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <HomeHero
        key={heroRetryToken}
        onRetry={() => setHeroRetryToken((token) => token + 1)}
      />

      <GenreFilter selectedGenreId={genreId} onChange={setGenreId} />

      {genreId === null ? (
        <>
          <AsyncSection title="Trending Today" load={getTrendingMovies} isEmpty={(d) => !d.results.length} render={(d) => <ContentRow movies={d.results} />} />
          <AsyncSection title="Popular Movies" load={getPopularMovies} isEmpty={(d) => !d.results.length} render={(d) => <ContentRow movies={d.results} />} />
          <AsyncSection title="Top Rated" load={getTopRatedMovies} isEmpty={(d) => !d.results.length} render={(d) => <ContentRow movies={d.results} />} />
          <AsyncSection title="Upcoming" load={getUpcomingMovies} isEmpty={(d) => !d.results.length} render={(d) => <ContentRow movies={d.results} />} />
        </>
      ) : (
        <AsyncSection
          title="Filtered Results"
          cacheKey={genreId}
          load={() => discoverMoviesByGenre(genreId)}
          isEmpty={(d) => !d.results.length}
          emptyTitle="No movies found"
          render={(d) => <ContentRow movies={d.results} />}
        />
      )}
    </div>
  )
}