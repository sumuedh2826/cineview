import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { EmptyState } from '@/Common'
import { collectionStore } from '@/Collection'
import { WATCHLIST_SORT_OPTIONS } from '@/Collection/core/constants/collection.constants'
import type { WatchlistEntry, WatchlistStatus } from '@/Collection/core/types/collection.schemas'
import { WatchlistItemCard } from '../components/WatchlistItemCard'

type WatchlistFilter = 'all' | WatchlistStatus
type WatchlistSort = keyof typeof WATCHLIST_SORT_OPTIONS

const FILTER_TABS: { id: WatchlistFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'want_to_watch', label: 'Want to Watch' },
  { id: 'watching', label: 'Watching' },
  { id: 'completed', label: 'Completed' },
]

function getFilterCount(filter: WatchlistFilter): number {
  if (filter === 'all') return collectionStore.totalCount
  if (filter === 'want_to_watch') return collectionStore.wantToWatchCount
  if (filter === 'watching') return collectionStore.watchingCount
  return collectionStore.completedCount
}

function sortEntries(entries: WatchlistEntry[], sort: WatchlistSort): WatchlistEntry[] {
  const copy = [...entries]

  if (sort === 'recently_added') {
    return copy.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  if (sort === 'rating') {
    return copy.sort((a, b) => {
      const ratingA = a.rating ?? -1
      const ratingB = b.rating ?? -1
      return ratingB - ratingA
    })
  }

  return copy.sort((a, b) => a.title.localeCompare(b.title))
}

export const WatchlistPage = observer(function WatchlistPage() {
  const [activeFilter, setActiveFilter] = useState<WatchlistFilter>('all')
  const [sortBy, setSortBy] = useState<WatchlistSort>('recently_added')
  const base =
    activeFilter === 'all'
      ? collectionStore.entries
      : collectionStore.entries.filter((entry) => entry.status === activeFilter)

  const filteredEntries = sortEntries(base, sortBy)

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Watchlist</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Track movies and TV shows you want to watch.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const active = activeFilter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={[
                'rounded-full px-4 py-2 text-sm transition',
                active
                  ? 'bg-purple-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:border-purple-500 dark:border-gray-700 dark:text-gray-300',
              ].join(' ')}
            >
              {tab.label} ({getFilterCount(tab.id)})
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="watchlist-sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by
        </label>
        <select
          id="watchlist-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as WatchlistSort)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-purple-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
        >
          {Object.entries(WATCHLIST_SORT_OPTIONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <EmptyState
          title="Your watchlist is empty"
          message="Add movies or TV shows from cards, detail pages, or search results."
        />
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <WatchlistItemCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
})