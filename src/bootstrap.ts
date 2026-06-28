import { authStore } from '@/Auth'
import { watchlistStore } from '@/Collection'
import { preferencesStore } from '@/Preferences'

export function bootstrapApplication(): void {
  preferencesStore.initialize()
  authStore.restoreSession()
  watchlistStore.initialize()
}