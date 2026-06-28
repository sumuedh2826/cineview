import { useTranslation } from 'react-i18next'
import { HOME_GENRES } from '@/Movies/core/constants/genre.constants'

export function GenreFilter({
  selectedGenreId,
  onChange,
}: {
  selectedGenreId: number | null
  onChange: (id: number | null) => void
}) {
  const { t } = useTranslation('movies')

  return (
    <div className="flex flex-wrap gap-2">
      {HOME_GENRES.map((genre) => {
        const active =
          genre.id === null ? selectedGenreId === null : selectedGenreId === genre.id

        return (
          <button
            key={genre.labelKey}
            type="button"
            onClick={() => onChange(genre.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              active ? 'bg-purple-600 text-white' : 'border border-gray-700 text-gray-300'
            }`}
          >
            {t(genre.labelKey)}
          </button>
        )
      })}
    </div>
  )
}