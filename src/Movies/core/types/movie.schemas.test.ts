import { describe, expect, it } from 'vitest'
import { MovieSummarySchema } from './movie.schemas'

describe('movie.schemas', () => {
  it('parses movie summary', () => {
    const r = MovieSummarySchema.parse({
      id: 1, title: 'Dune', poster_path: null, vote_average: 8,
    })
    expect(r.title).toBe('Dune')
  })
})