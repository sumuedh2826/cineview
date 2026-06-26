export function EmptyState({ title, message }: { title: string; message?: string }) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 px-6 py-10 text-center">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {message && <p className="mt-2 text-sm text-gray-400">{message}</p>}
      </div>
    )
  }