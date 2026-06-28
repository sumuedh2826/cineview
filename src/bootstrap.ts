import { authStore } from '@/Auth'
import { collectionStore } from '@/Collection'
import { preferencesStore } from '@/Preferences'

export function bootstrapApplication(): void {
  preferencesStore.initialize()
  authStore.restoreSession()
  collectionStore.initialize()
}