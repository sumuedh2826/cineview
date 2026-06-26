import type { MovieSummary } from '@/Movies/core/types/movie.schemas'
import { MovieCard } from '../MovieCard'

export function ContentRow({ movies }: { movies: MovieSummary[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
    </div>
  )
}