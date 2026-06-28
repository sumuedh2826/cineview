import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/Common/constants/Routes.constants'
import { getBackdropUrl } from '@/Common/core/utils/tmdbImage'
import type { MovieSummary } from '@/Movies/core/types/movie.schemas'

export function HeroBanner({ movie }: { movie: MovieSummary }) {
  const { t } = useTranslation('movies')
  const bg = getBackdropUrl(movie.backdrop_path ?? movie.poster_path)
  const year = movie.release_date?.slice(0, 4)

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-800">
      {bg ? (
        <img src={bg} alt="" className="h-72 w-full object-cover sm:h-96" />
      ) : (
        <div className="h-72 bg-gray-900 sm:h-96" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">{movie.title}</h1>
          <p className="mt-3 text-sm text-gray-300">
            {year ? `${year} · ` : ''}
            {t('hero.rating', { value: movie.vote_average.toFixed(1) })}
          </p>
          {movie.overview && (
            <p className="mt-4 line-clamp-3 text-sm text-gray-300">{movie.overview}</p>
          )}
          <Link
            to={ROUTES.MOVIE_DETAIL.replace(':movieId', String(movie.id))}
            className="mt-6 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm text-white"
          >
            {t('hero.viewDetails')}
          </Link>
        </div>
      </div>
    </section>
  )
}