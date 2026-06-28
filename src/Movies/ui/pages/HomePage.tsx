import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('movies')
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
          setError(e instanceof Error ? e.message : t('home.heroLoadFailed'))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [t])

  if (loading) {
    return <LoadingSpinner label={t('home.heroLoading')} />
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
  const { t } = useTranslation('movies')
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
          <AsyncSection
            title={t('home.trendingToday')}
            load={getTrendingMovies}
            isEmpty={(data) => !data.results.length}
            render={(data) => <ContentRow movies={data.results} />}
          />
          <AsyncSection
            title={t('home.popularMovies')}
            load={getPopularMovies}
            isEmpty={(data) => !data.results.length}
            render={(data) => <ContentRow movies={data.results} />}
          />
          <AsyncSection
            title={t('home.topRated')}
            load={getTopRatedMovies}
            isEmpty={(data) => !data.results.length}
            render={(data) => <ContentRow movies={data.results} />}
          />
          <AsyncSection
            title={t('home.upcoming')}
            load={getUpcomingMovies}
            isEmpty={(data) => !data.results.length}
            render={(data) => <ContentRow movies={data.results} />}
          />
        </>
      ) : (
        <AsyncSection
          title={t('home.filteredResults')}
          cacheKey={genreId}
          load={() => discoverMoviesByGenre(genreId)}
          isEmpty={(data) => !data.results.length}
          emptyTitle={t('home.noMoviesFound')}
          render={(data) => <ContentRow movies={data.results} />}
        />
      )}
    </div>
  )
}