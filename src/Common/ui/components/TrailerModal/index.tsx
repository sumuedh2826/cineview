import { useEffect } from 'react'
import { YOUTUBE_EMBED_BASE_URL } from '@/Common/core/constants/tmdb.constants'

interface TrailerModalProps {
  youtubeKey: string
  title: string
  onClose: () => void
}

export function TrailerModal({ youtubeKey, title, onClose }: TrailerModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-4xl rounded-xl bg-black"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} trailer`}
      >
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
          <h2 className="text-sm text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-300 hover:text-white"
          >
            Close
          </button>
        </div>
        <iframe
          title={`${title} trailer`}
          src={`${YOUTUBE_EMBED_BASE_URL}/${youtubeKey}?autoplay=1`}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}