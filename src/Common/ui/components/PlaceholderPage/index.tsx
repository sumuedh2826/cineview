import { useLocation } from 'react-router-dom'

export interface PlaceholderPageProps {
  title: string
  subtitle?: string
}

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  const { pathname } = useLocation()

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-purple-400">
        Milestone 1 Placeholder
      </p>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {subtitle ? (
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>
      ) : null}
      <p className="mt-6 font-mono text-sm text-gray-500">
        Route: <span className="text-purple-600 dark:text-purple-300">{pathname}</span>
      </p>
    </main>
  )
}