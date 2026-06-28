import { observer } from 'mobx-react-lite'
import { collectionStore } from '@/Collection'
import type { AddWatchlistInput } from '@/Collection/core/types/collection.schemas'

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
  const inWatchlist = collectionStore.isInWatchlist(mediaId, mediaType)
  const hasNote = inWatchlist && collectionStore.hasNote(mediaId, mediaType)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    collectionStore.toggle({
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
          'relative rounded-full px-2 py-1 text-xs font-semibold transition',
          inWatchlist
            ? 'bg-purple-600 text-white'
            : 'bg-black/60 text-white hover:bg-purple-600',
        ].join(' ')}
      >
        {inWatchlist ? '✓' : '+'}
        {hasNote ? (
          <span
            className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-400"
            title="Has note"
            aria-hidden
          />
        ) : null}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={inWatchlist}
      className={[
        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition',
        inWatchlist
          ? 'border border-purple-500 bg-purple-600/20 text-purple-700 dark:text-purple-200'
          : 'border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-white',
      ].join(' ')}
    >
      {inWatchlist ? 'Remove from Watchlist' : '+ Watchlist'}
      {hasNote ? (
        <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-200">
          Note
        </span>
      ) : null}
    </button>
  )
})