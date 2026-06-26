import {
  AUTH_ERROR_MESSAGES,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from '../constants/Auth.constants'
import type { LoginFormValues, LoginValidationResult } from '../types/auth.types'

export function validateLoginForm(
  values: LoginFormValues,
): LoginValidationResult {
  const errors: LoginValidationResult['errors'] = {}
  const username = values.username.trim()

  if (!username) {
    errors.username = AUTH_ERROR_MESSAGES.USERNAME_REQUIRED
  } else if (username.length < MIN_USERNAME_LENGTH) {
    errors.username = AUTH_ERROR_MESSAGES.USERNAME_TOO_SHORT
  }

  if (!values.password) {
    errors.password = AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = AUTH_ERROR_MESSAGES.PASSWORD_TOO_SHORT
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}