import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState, LoadingSpinner, SectionError, useDebouncedValue } from '@/Common'
import { SEARCH_DEBOUNCE_MS } from '@/Search/core/constants/search.constants'
import type { SearchResult } from '@/Search/core/types/search.schemas'
import { searchMulti } from '@/Search/data/services/searchService'
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from '@/Search/data/services/recentSearchService'
import { RecentSearches } from '@/Search/ui/components/RecentSearches'
import { SearchResultCard } from '@/Search/ui/components/SearchResultCard'

interface SearchResultsProps {
  query: string
  onComplete: (query: string) => void
}

function SearchResults({ query, onComplete }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const requestQuery = query

    void searchMulti(requestQuery)
      .then((response) => {
        if (!cancelled) {
          setResults(response.results)
          setLoading(false)
          onComplete(requestQuery)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Search failed')
          setResults([])
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [query, onComplete])

  const movies = results.filter((result) => result.media_type === 'movie')
  const tvShows = results.filter((result) => result.media_type === 'tv')
  const people = results.filter((result) => result.media_type === 'person')

  if (loading) {
    return <LoadingSpinner label="Searching..." />
  }

  if (error) {
    return <SectionError message={error} title="Search failed" />
  }

  if (results.length === 0) {
    return <EmptyState title="No results" message="Try a different search term." />
  }

  return (
    <>
      {movies.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Movies</h2>
          <div className="space-y-3">
            {movies.map((result) => (
              <SearchResultCard key={`movie-${result.id}`} result={result} />
            ))}
          </div>
        </section>
      )}

      {tvShows.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">TV Shows</h2>
          <div className="space-y-3">
            {tvShows.map((result) => (
              <SearchResultCard key={`tv-${result.id}`} result={result} />
            ))}
          </div>
        </section>
      )}

      {people.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">People</h2>
          <div className="space-y-3">
            {people.map((result) => (
              <SearchResultCard key={`person-${result.id}`} result={result} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches)

  const debouncedQuery = useDebouncedValue(urlQuery, SEARCH_DEBOUNCE_MS)
  const activeQuery = urlQuery.trim() === '' ? '' : debouncedQuery.trim()

  const handleInputChange = useCallback(
    (value: string) => {
      if (value.trim()) {
        setSearchParams({ q: value }, { replace: true })
        return
      }

      setSearchParams({}, { replace: true })
    },
    [setSearchParams],
  )

  const handleSearchComplete = useCallback((completedQuery: string) => {
    setRecentSearches(addRecentSearch(completedQuery))
  }, [])

  const handleRecentSelect = useCallback(
    (selectedQuery: string) => {
      setSearchParams({ q: selectedQuery }, { replace: true })
    },
    [setSearchParams],
  )

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Search</h1>
        <p className="mt-2 text-sm text-gray-400">
          Find movies, TV shows, and people.
        </p>
      </div>

      <input
        type="search"
        value={urlQuery}
        onChange={(event) => handleInputChange(event.target.value)}
        placeholder="Search movies, TV shows, people..."
        aria-label="Search"
        className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none ring-purple-500 focus:ring-2"
      />

      <RecentSearches
        searches={recentSearches}
        onSelect={handleRecentSelect}
        onClear={() => {
          clearRecentSearches()
          setRecentSearches([])
        }}
      />

      {activeQuery ? (
        <SearchResults
          key={activeQuery}
          query={activeQuery}
          onComplete={handleSearchComplete}
        />
      ) : null}
    </div>
  )
}