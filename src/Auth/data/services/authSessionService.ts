import { AUTH_STORAGE_KEY } from '../../core/constants/Auth.constants'
import type { AuthSession } from '../../core/types/auth.types'

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed: unknown = JSON.parse(raw)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'username' in parsed &&
      typeof parsed.username === 'string' &&
      parsed.username.length > 0
    ) {
      return { username: parsed.username }
    }

    return null
  } catch {
    return null
  }
}

export function setStoredSession(session: AuthSession): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}