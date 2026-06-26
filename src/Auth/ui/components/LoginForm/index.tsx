import { useState, type FormEvent } from 'react'
import type { LoginFormValues } from '../../../core/types/auth.types'

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void
  isSubmitting?: boolean
  authError?: string
  fieldErrors?: {
    username?: string
    password?: string
  }
}

export function LoginForm({
  onSubmit,
  isSubmitting = false,
  authError,
  fieldErrors = {},
}: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ username, password })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md space-y-5 rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl"
    >
      <div className="text-center">
        <p className="text-2xl font-bold text-purple-400">CineView</p>
        <h1 className="mt-4 text-2xl font-semibold text-white">Welcome Back</h1>
        <p className="mt-1 text-sm text-gray-400">Sign in to your account.</p>
      </div>

      {authError ? (
        <p
          role="alert"
          className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300"
        >
          {authError}
        </p>
      ) : null}

      <div>
        <label htmlFor="username" className="mb-2 block text-sm text-gray-300">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none ring-purple-500 focus:ring-2"
          placeholder="Enter username"
        />
        {fieldErrors.username ? (
          <p className="mt-2 text-sm text-red-400">{fieldErrors.username}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-gray-300">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 pr-12 text-white outline-none ring-purple-500 focus:ring-2"
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {fieldErrors.password ? (
          <p className="mt-2 text-sm text-red-400">{fieldErrors.password}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Sign In
      </button>
    </form>
  )
}