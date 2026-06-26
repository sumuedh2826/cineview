import { Link } from 'react-router-dom'
import { ROUTES } from '@/Common/constants/Routes.constants'
import { getPosterUrl, getProfileUrl } from '@/Common/core/utils/tmdbImage'
import type { SearchResult } from '@/Search/core/types/search.schemas'

export function SearchResultCard({ result }: { result: SearchResult }) {
  if (result.media_type === 'movie') {
    const poster = getPosterUrl(result.poster_path)
    const year = result.release_date?.slice(0, 4)

    return (
      <Link
        to={ROUTES.MOVIE_DETAIL.replace(':movieId', String(result.id))}
        className="flex gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition hover:border-purple-500/50"
      >
        <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-800">
          {poster ? (
            <img src={poster} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase text-purple-400">Movie</p>
          <h3 className="font-medium text-white">{result.title}</h3>
          <p className="text-sm text-gray-400">
            {year ?? '—'}
            {result.vote_average !== undefined ? ` · ★ ${result.vote_average.toFixed(1)}` : ''}
          </p>
        </div>
      </Link>
    )
  }

  if (result.media_type === 'tv') {
    const poster = getPosterUrl(result.poster_path)
    const year = result.first_air_date?.slice(0, 4)

    return (
      <Link
        to={ROUTES.TV_SHOW.replace(':showId', String(result.id))}
        className="flex gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition hover:border-purple-500/50"
      >
        <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-800">
          {poster ? (
            <img src={poster} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <p className="text-xs uppercase text-purple-400">TV Show</p>
          <h3 className="font-medium text-white">{result.name}</h3>
          <p className="text-sm text-gray-400">
            {year ?? '—'}
            {result.vote_average !== undefined ? ` · ★ ${result.vote_average.toFixed(1)}` : ''}
          </p>
        </div>
      </Link>
    )
  }

  const profile = getProfileUrl(result.profile_path)

  return (
    <article className="flex gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-800">
        {profile ? (
          <img src={profile} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div>
        <p className="text-xs uppercase text-purple-400">Person</p>
        <h3 className="font-medium text-white">{result.name}</h3>
        <p className="text-sm text-gray-400">{result.known_for_department ?? '—'}</p>
      </div>
    </article>
  )
}