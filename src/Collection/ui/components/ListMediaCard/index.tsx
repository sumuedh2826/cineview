import { Link } from 'react-router-dom'
import { ROUTES } from '@/Common'
import { getPosterUrl } from '@/Common/core/utils/tmdbImage'
import { collectionStore } from '@/Collection'
import type { ListItem } from '@/Collection/core/types/collection.schemas'

interface ListMediaCardProps {
  listId: string
  item: ListItem
}

export function ListMediaCard({ listId, item }: ListMediaCardProps) {
  const poster = getPosterUrl(item.posterPath)
  const detailPath =
    item.mediaType === 'movie'
      ? ROUTES.MOVIE_DETAIL.replace(':movieId', String(item.mediaId))
      : ROUTES.TV_SHOW.replace(':showId', String(item.mediaId))

  return (
    <article className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/60">
      <Link to={detailPath} className="shrink-0">
        <div className="h-24 w-16 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          {poster ? (
            <img src={poster} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-500">
              No poster
            </div>
          )}
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400">
            {item.mediaType === 'movie' ? 'Movie' : 'TV Show'}
          </p>
          <Link
            to={detailPath}
            className="font-semibold text-gray-900 hover:text-purple-600 dark:text-white dark:hover:text-purple-300"
          >
            {item.title}
          </Link>
          {item.rating != null ? (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              ★ {item.rating.toFixed(1)}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() =>
            collectionStore.toggleMediaInList(listId, {
              mediaId: item.mediaId,
              mediaType: item.mediaType,
              title: item.title,
              posterPath: item.posterPath,
              rating: item.rating ?? null,
            })
          }
          className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:text-red-300"
        >
          Remove
        </button>
      </div>
    </article>
  )
}