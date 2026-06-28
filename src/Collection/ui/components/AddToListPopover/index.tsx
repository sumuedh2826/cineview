import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/Common'
import { collectionStore } from '@/Collection'
import type { MediaSnapshot } from '@/Collection/core/types/collection.schemas'

interface AddToListPopoverProps extends MediaSnapshot {
  variant?: 'icon' | 'detail'
}

export const AddToListPopover = observer(function AddToListPopover({
  mediaId,
  mediaType,
  title,
  posterPath,
  rating,
  variant = 'detail',
}: AddToListPopoverProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const snapshot: MediaSnapshot = {
    mediaId,
    mediaType,
    title,
    posterPath,
    rating: rating ?? null,
  }

  function handleToggle(listId: string) {
    collectionStore.toggleMediaInList(listId, snapshot)
  }

  const triggerClass =
    variant === 'icon'
      ? 'rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white transition hover:bg-purple-600'
      : 'rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 transition hover:border-purple-500 dark:border-gray-600 dark:text-white'

  const panelPositionClass =
    variant === 'icon'
      ? 'right-0 top-full mt-1.5'
      : 'left-0 bottom-full mb-2'

  return (
    <div
      ref={containerRef}
      className={variant === 'icon' ? 'relative' : 'relative inline-block'}
    >
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setOpen((current) => !current)
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={triggerClass}
      >
        {variant === 'icon' ? '☰' : 'Add to List'}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={`Add ${title} to list`}
          className={[
            'absolute z-30 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:w-80',
            panelPositionClass,
          ].join(' ')}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Your Lists
            </p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Select one or more lists for this title.
            </p>
          </div>

          <div className="p-2">
            {collectionStore.lists.length === 0 ? (
              <div className="space-y-3 px-2 py-3 text-sm text-gray-600 dark:text-gray-400">
                <p>No lists yet.</p>
                <Link
                  to={ROUTES.LISTS}
                  className="inline-flex font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
                  onClick={() => setOpen(false)}
                >
                  Create a list
                </Link>
              </div>
            ) : (
              <ul className="max-h-64 space-y-1 overflow-y-auto overscroll-contain">
                {collectionStore.lists.map((list) => {
                  const checked = collectionStore.isMediaInList(list.id, mediaId, mediaType)

                  return (
                    <li key={list.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition hover:bg-gray-100 dark:hover:bg-gray-800">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggle(list.id)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-950"
                        />
                        <span className="min-w-0 flex-1 break-words text-sm leading-snug text-gray-900 dark:text-gray-100">
                          {list.name}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
})