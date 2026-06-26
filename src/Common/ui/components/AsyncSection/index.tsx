import { useEffect, useState, type ReactNode } from 'react'
import { EmptyState } from '../EmptyState'
import { LoadingSpinner } from '../LoadingSpinner'
import { SectionError } from '../SectionError'

interface AsyncSectionProps<T> {
  title: string
  load: () => Promise<T>
  /** Use when `load` is an inline arrow function (identity changes each render) */
  cacheKey?: string | number
  render: (data: T) => ReactNode
  isEmpty?: (data: T) => boolean
  emptyTitle?: string
  emptyMessage?: string
}

interface AsyncSectionFetcherProps<T> {
  load: () => Promise<T>
  render: (data: T) => ReactNode
  isEmpty?: (data: T) => boolean
  emptyTitle: string
  emptyMessage?: string
  onRetry: () => void
}

function AsyncSectionFetcher<T>({
  load,
  render,
  isEmpty,
  emptyTitle,
  emptyMessage,
  onRetry,
}: AsyncSectionFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void load()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setError(null)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load')
          setData(null)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [load])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <SectionError message={error} onRetry={onRetry} />
  }

  if (data && isEmpty?.(data)) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  if (data) {
    return <>{render(data)}</>
  }

  return null
}

export function AsyncSection<T>({
  title,
  load,
  cacheKey,
  render,
  isEmpty,
  emptyTitle = 'Nothing to show',
  emptyMessage,
}: AsyncSectionProps<T>) {
  const [retryToken, setRetryToken] = useState(0)
  const [prevCacheKey, setPrevCacheKey] = useState(cacheKey)
  const [loadToken, setLoadToken] = useState(0)

  if (cacheKey !== undefined && cacheKey !== prevCacheKey) {
    setPrevCacheKey(cacheKey)
    setLoadToken((token) => token + 1)
  }

  const fetcherKey =
    cacheKey !== undefined
      ? `${cacheKey}-${loadToken}-${retryToken}`
      : `${loadToken}-${retryToken}`

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <AsyncSectionFetcher
        key={fetcherKey}
        load={load}
        render={render}
        isEmpty={isEmpty}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        onRetry={() => setRetryToken((token) => token + 1)}
      />
    </section>
  )
}