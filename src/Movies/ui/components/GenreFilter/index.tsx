import { HOME_GENRES } from '@/Movies/core/constants/genre.constants'

export function GenreFilter({
  selectedGenreId,
  onChange,
}: {
  selectedGenreId: number | null
  onChange: (id: number | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {HOME_GENRES.map((g) => {
        const active = g.id === null ? selectedGenreId === null : selectedGenreId === g.id
        return (
          <button key={g.label} type="button" onClick={() => onChange(g.id)}
            className={`rounded-full px-4 py-2 text-sm ${active ? 'bg-purple-600 text-white' : 'border border-gray-700 text-gray-300'}`}>
            {g.label}
          </button>
        )
      })}
    </div>
  )
}