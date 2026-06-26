import { makeAutoObservable } from 'mobx'
import { AUTH_ERROR_MESSAGES } from '../../core/constants/Auth.constants'
import type { AuthSession, LoginResult } from '../../core/types/auth.types'
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from '../services/authSessionService'
import { verifyCredentials } from '../services/credentialService'

export class AuthStore {
  session: AuthSession | null = null
  isHydrating = true

  constructor() {
    makeAutoObservable(this)
  }

  get isAuthenticated(): boolean {
    return this.session !== null
  }

  restoreSession(): void {
    this.session = getStoredSession()
    this.isHydrating = false
  }

  login(username: string, password: string): LoginResult {
    const trimmedUsername = username.trim()

    if (!verifyCredentials(trimmedUsername, password)) {
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      }
    }

    const nextSession: AuthSession = { username: trimmedUsername }
    setStoredSession(nextSession)
    this.session = nextSession

    return { success: true }
  }

  logout(): void {
    clearStoredSession()
    this.session = null
  }

  resetForTests(): void {
    clearStoredSession()
    this.session = null
    this.isHydrating = false
  }
}

export const authStore = new AuthStore()