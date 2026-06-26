export function SectionError({
    message,
    onRetry,
    title = 'Something went wrong',
  }: {
    message: string
    onRetry?: () => void
    title?: string
  }) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-6 py-8 text-center">
        <h3 className="text-lg font-semibold text-red-300">{title}</h3>
        <p className="mt-2 text-sm text-gray-400">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white">
            Retry
          </button>
        )}
      </div>
    )
  }