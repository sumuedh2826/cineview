interface RecentSearchesProps {
    searches: string[]
    onSelect: (query: string) => void
    onClear: () => void
  }
  
  export function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
    if (searches.length === 0) {
      return null
    }
  
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Recent Searches
          </h2>
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Clear History
          </button>
        </div>
  
        <div className="flex flex-wrap gap-2">
          {searches.map((query) => (
            <button
              key={query}
              type="button"
              onClick={() => onSelect(query)}
              className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-purple-500 hover:text-white"
            >
              {query}
            </button>
          ))}
        </div>
      </section>
    )
  }