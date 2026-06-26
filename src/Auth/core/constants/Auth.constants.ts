export const AUTH_STORAGE_KEY = 'cineview_auth_session'

export const VALID_USERNAME = 'admin'
export const VALID_PASSWORD = 'admin'

export const MIN_USERNAME_LENGTH = 3
export const MIN_PASSWORD_LENGTH = 5

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password.',
  USERNAME_REQUIRED: 'Username is required.',
  USERNAME_TOO_SHORT: `Username must be at least ${MIN_USERNAME_LENGTH} characters.`,
  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_TOO_SHORT: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
} as const