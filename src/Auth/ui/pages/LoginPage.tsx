import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/Common'
import { collectionStore } from '@/Collection'
import type { LoginFormErrors, LoginFormValues } from '../../core/types/auth.types'
import { validateLoginForm } from '../../core/utils/validateLoginForm'
import { authStore } from '../../data/stores/AuthStore'
import { LoginForm } from '../components/LoginForm'
import { SessionRestoringPlaceholder } from '../components/SessionRestoringPlaceholder'

export const LoginPage = observer(function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({})
  const [authError, setAuthError] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (authStore.isHydrating) {
    return <SessionRestoringPlaceholder />
  }

  function handleSubmit(values: LoginFormValues) {
    setAuthError(undefined)

    const validation = validateLoginForm(values)
    setFieldErrors(validation.errors)

    if (!validation.isValid) {
      return
    }

    setIsSubmitting(true)

    const result = authStore.login(values.username, values.password)

    if (!result.success) {
      setAuthError(result.error)
      setIsSubmitting(false)
      return
    }

    collectionStore.initialize()

    const redirectTo =
      (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname ?? ROUTES.HOME

    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6 py-12">
      <LoginForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        authError={authError}
        fieldErrors={fieldErrors}
      />
    </div>
  )
})