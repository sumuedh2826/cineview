import { getProfileUrl } from '@/Common/core/utils/tmdbImage'
import type { CastMember } from '@/Movies/core/types/movie.schemas'

export function CastCarousel({ cast }: { cast: CastMember[] }) {
  if (!cast.length) return null
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {cast.map((m) => (
        <article key={m.id} className="w-28 shrink-0 text-center">
          <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-gray-800">
            {getProfileUrl(m.profile_path) ? (
              <img src={getProfileUrl(m.profile_path)!} alt={m.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-500">N/A</div>
            )}
          </div>
          <p className="mt-2 text-sm text-white">{m.name}</p>
          <p className="text-xs text-gray-400">{m.character}</p>
        </article>
      ))}
    </div>
  )
}