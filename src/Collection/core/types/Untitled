import { z } from 'zod'
import { WATCHLIST_NOTE_MAX_LENGTH } from '../constants/watchlist.constants'

export const WatchlistMediaTypeSchema = z.enum(['movie', 'tv'])
export const WatchlistStatusSchema = z.enum(['want_to_watch', 'watching', 'completed'])

export const WatchlistEntrySchema = z.object({
  id: z.string().uuid(),
  mediaId: z.number().int().positive(),
  mediaType: WatchlistMediaTypeSchema,
  title: z.string().min(1),
  posterPath: z.string().nullable(),
  rating: z.number().nullable().optional(),
  status: WatchlistStatusSchema,
  note: z.string().max(WATCHLIST_NOTE_MAX_LENGTH).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const WatchlistStorageSchema = z.array(WatchlistEntrySchema)

export type WatchlistMediaType = z.infer<typeof WatchlistMediaTypeSchema>
export type WatchlistStatus = z.infer<typeof WatchlistStatusSchema>
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>

export const AddWatchlistInputSchema = z.object({
  mediaId: z.number().int().positive(),
  mediaType: WatchlistMediaTypeSchema,
  title: z.string().min(1),
  posterPath: z.string().nullable(),
  rating: z.number().nullable().optional(),
})

export type AddWatchlistInput = z.infer<typeof AddWatchlistInputSchema>

export const WatchlistNoteInputSchema = z
  .string()
  .max(WATCHLIST_NOTE_MAX_LENGTH)
  .optional()