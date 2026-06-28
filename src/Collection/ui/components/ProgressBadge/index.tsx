interface ProgressBadgeProps {
    watched: number
    total: number
  }
  
  export function ProgressBadge({ watched, total }: ProgressBadgeProps) {
    if (total <= 0) {
      return null
    }
  
    const percent = Math.round((watched / total) * 100)
  
    return (
      <span className="inline-flex items-center rounded-full bg-purple-600/20 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-200">
        {watched}/{total} episodes · {percent}%
      </span>
    )
  }