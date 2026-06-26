export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
    return (
      <div className="flex items-center justify-center gap-3 py-12 text-gray-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        <span className="text-sm">{label}</span>
      </div>
    )
  }