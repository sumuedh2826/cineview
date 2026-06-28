import { authStore } from '@/Auth'
import { preferencesStore } from '@/Preferences'

export function bootstrapApplication(): void {
  preferencesStore.initialize()
  authStore.restoreSession()
}