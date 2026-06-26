import { tmdbRequest } from '@/Common/data/services/tmdbClient'
import { SearchMultiResponseSchema } from '@/Search/core/types/search.schemas'

export function searchMulti(query: string) {
  return tmdbRequest('/search/multi', SearchMultiResponseSchema, {
    params: {
      query,
      include_adult: false,
    },
  })
}