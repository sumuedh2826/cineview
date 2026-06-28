import { Link } from 'react-router-dom'
import { ROUTES } from '@/Common/constants/Routes.constants'
import { getPosterUrl } from '@/Common/core/utils/tmdbImage'
import { AddToListPopover } from '@/Collection/ui/components/AddToListPopover'
import { WatchlistButton } from '@/Collection/ui/components/WatchlistButton'
import type { MovieSummary } from '@/Movies/core/types/movie.schemas'

export function MovieCard({ movie }: { movie: MovieSummary }) {
  const poster = getPosterUrl(movie.poster_path)
  const year = movie.release_date?.slice(0, 4)

  return (
    <article className="relative w-40 shrink-0 sm:w-44">
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        <WatchlistButton
          variant="icon"
          mediaId={movie.id}
          mediaType="movie"
          title={movie.title}
          posterPath={movie.poster_path}
          rating={movie.vote_average}
        />
        <AddToListPopover
          variant="icon"
          mediaId={movie.id}
          mediaType="movie"
          title={movie.title}
          posterPath={movie.poster_path}
          rating={movie.vote_average}
        />
      </div>
      <Link
        to={ROUTES.MOVIE_DETAIL.replace(':movieId', String(movie.id))}
        className="block overflow-hidden rounded-xl border border-gray-800 bg-gray-900"
      >
        <div className="aspect-[2/3] bg-gray-800">
          {poster ? (
            <img
              src={poster}
              alt={movie.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-500">
              No poster
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium text-white">{movie.title}</h3>
          <p className="mt-1 text-xs text-gray-400">
            {year ? `${year} · ` : ''}
            {movie.vote_average.toFixed(1)}
          </p>
        </div>
      </Link>
    </article>
  )
}