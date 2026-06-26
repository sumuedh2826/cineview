export interface AuthSession {
  username: string
}

export interface LoginFormValues {
  username: string
  password: string
}

export interface LoginFormErrors {
  username?: string
  password?: string
}

export interface LoginValidationResult {
  isValid: boolean
  errors: LoginFormErrors
}

export type LoginResult =
  | { success: true }
  | { success: false; error: string }