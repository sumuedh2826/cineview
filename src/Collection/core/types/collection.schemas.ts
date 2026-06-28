import { z } from 'zod'
import {
  COLLECTION_VERSION,
  LIST_DESCRIPTION_MAX_LENGTH,
  LIST_NAME_MAX_LENGTH,
  WATCHLIST_NOTE_MAX_LENGTH,
} from '../constants/collection.constants'

export const MediaTypeSchema = z.enum(['movie', 'tv'])
export const WatchlistStatusSchema = z.enum(['want_to_watch', 'watching', 'completed'])

export const MediaSnapshotSchema = z.object({
  mediaId: z.number().int().positive(),
  mediaType: MediaTypeSchema,
  title: z.string().min(1),
  posterPath: z.string().nullable(),
  rating: z.number().nullable().optional(),
})

export const WatchlistEntrySchema = z.object({
  id: z.string().uuid(),
  mediaId: z.number().int().positive(),
  mediaType: MediaTypeSchema,
  title: z.string().min(1),
  posterPath: z.string().nullable(),
  rating: z.number().nullable().optional(),
  status: WatchlistStatusSchema,
  note: z.string().max(WATCHLIST_NOTE_MAX_LENGTH).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const WatchlistStorageSchema = z.array(WatchlistEntrySchema)

export const ListItemSchema = MediaSnapshotSchema.extend({
  addedAt: z.string(),
})

export const CustomListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(LIST_NAME_MAX_LENGTH),
  description: z.string().max(LIST_DESCRIPTION_MAX_LENGTH).optional(),
  items: z.array(ListItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const EpisodeProgressSchema = z.object({
  watchedEpisodeIds: z.array(z.number().int().positive()),
})

export const CollectionDataSchema = z.object({
  version: z.literal(COLLECTION_VERSION),
  watchlist: z.array(WatchlistEntrySchema),
  lists: z.array(CustomListSchema),
  episodeProgress: z.record(z.string(), EpisodeProgressSchema),
})

export type MediaType = z.infer<typeof MediaTypeSchema>
export type WatchlistStatus = z.infer<typeof WatchlistStatusSchema>
export type MediaSnapshot = z.infer<typeof MediaSnapshotSchema>
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>
export type ListItem = z.infer<typeof ListItemSchema>
export type CustomList = z.infer<typeof CustomListSchema>
export type EpisodeProgress = z.infer<typeof EpisodeProgressSchema>
export type CollectionData = z.infer<typeof CollectionDataSchema>

export const AddWatchlistInputSchema = MediaSnapshotSchema
export type AddWatchlistInput = z.infer<typeof AddWatchlistInputSchema>

export const WatchlistNoteInputSchema = z
  .string()
  .max(WATCHLIST_NOTE_MAX_LENGTH)

export const CreateListInputSchema = z.object({
  name: z.string().trim().min(1).max(LIST_NAME_MAX_LENGTH),
  description: z.string().max(LIST_DESCRIPTION_MAX_LENGTH).optional(),
})

export const RenameListInputSchema = CreateListInputSchema