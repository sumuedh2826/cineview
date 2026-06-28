import { observer } from 'mobx-react-lite'
import { watchlistStore } from '@/Collection'
import type {
  AddWatchlistInput
} from '@/Collection/core/types/watchlist.schemas'

interface WatchlistButtonProps extends AddWatchlistInput {
  variant?: 'icon' | 'detail'
}

export const WatchlistButton = observer(function WatchlistButton({
  mediaId,
  mediaType,
  title,
  posterPath,
  rating,
  variant = 'detail',
}: WatchlistButtonProps) {
  const inWatchlist = watchlistStore.isInWatchlist(mediaId, mediaType)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    watchlistStore.toggle({
      mediaId,
      mediaType,
      title,
      posterPath,
      rating: rating ?? null,
    })
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
        aria-pressed={inWatchlist}
        className={[
          'absolute right-2 top-2 z-10 rounded-full px-2 py-1 text-xs font-semibold transition',
          inWatchlist
            ? 'bg-purple-600 text-white'
            : 'bg-black/60 text-white hover:bg-purple-600',
        ].join(' ')}
      >
        {inWatchlist ? '✓' : '+'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={inWatchlist}
      className={[
        'rounded-lg px-4 py-2 text-sm transition',
        inWatchlist
          ? 'border border-purple-500 bg-purple-600/20 text-purple-700 dark:text-purple-200'
          : 'border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-white',
      ].join(' ')}
    >
      {inWatchlist ? 'Remove from Watchlist' : '+ Watchlist'}
    </button>
  )
})