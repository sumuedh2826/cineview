import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/Common'
import { getPosterUrl } from '@/Common/core/utils/tmdbImage'
import { watchlistStore } from '@/Collection'
import {
  WATCHLIST_NOTE_MAX_LENGTH,
  WATCHLIST_STATUS_LABELS,
} from '@/Collection/core/constants/watchlist.constants'
import type { WatchlistEntry, WatchlistStatus } from '@/Collection/core/types/watchlist.schemas'

const STATUS_OPTIONS: WatchlistStatus[] = ['want_to_watch', 'watching', 'completed']

interface WatchlistItemCardProps {
  entry: WatchlistEntry
}

export const WatchlistItemCard = observer(function WatchlistItemCard({
  entry,
}: WatchlistItemCardProps) {
  const [noteExpanded, setNoteExpanded] = useState(false)
  const [draftNote, setDraftNote] = useState(entry.note ?? '')

  const poster = getPosterUrl(entry.posterPath)
  const detailPath =
    entry.mediaType === 'movie'
      ? ROUTES.MOVIE_DETAIL.replace(':movieId', String(entry.mediaId))
      : ROUTES.TV_SHOW.replace(':showId', String(entry.mediaId))

  function handleSaveNote() {
    watchlistStore.updateNote(entry.id, draftNote)
    setNoteExpanded(false)
  }

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      <div className="flex gap-4">
        <Link to={detailPath} className="shrink-0">
          <div className="h-36 w-24 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            {poster ? (
              <img src={poster} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">
                No poster
              </div>
            )}
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400">
                {entry.mediaType === 'movie' ? 'Movie' : 'TV Show'}
              </p>
              <Link
                to={detailPath}
                className="text-lg font-semibold text-gray-900 hover:text-purple-600 dark:text-white dark:hover:text-purple-300"
              >
                {entry.title}
              </Link>
              {entry.rating != null && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  ★ {entry.rating.toFixed(1)}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => watchlistStore.remove(entry.id)}
              className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-red-300"
            >
              Remove
            </button>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Status</span>
            <select
              value={entry.status}
              onChange={(event) =>
                watchlistStore.updateStatus(entry.id, event.target.value as WatchlistStatus)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-purple-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {WATCHLIST_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <div>
            <button
              type="button"
              onClick={() => {
                setDraftNote(entry.note ?? '')
                setNoteExpanded((current) => !current)
              }}
              className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
            >
              {noteExpanded ? 'Hide note' : entry.note ? 'Edit note' : 'Add note'}
            </button>

            {!noteExpanded && entry.note ? (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{entry.note}</p>
            ) : null}

            {noteExpanded ? (
              <div className="mt-2 space-y-2">
                <textarea
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  maxLength={WATCHLIST_NOTE_MAX_LENGTH}
                  rows={3}
                  placeholder="Add a personal note..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-purple-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {draftNote.length}/{WATCHLIST_NOTE_MAX_LENGTH}
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500"
                  >
                    Save note
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
})