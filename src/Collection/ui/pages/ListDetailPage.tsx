import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { EmptyState, ROUTES } from '@/Common'
import { collectionStore } from '@/Collection'
import { CreateListModal } from '../components/CreateListModal'
import { ListMediaCard } from '../components/ListMediaCard'

export const ListDetailPage = observer(function ListDetailPage() {
  const { listId = '' } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const [renameOpen, setRenameOpen] = useState(false)

  const isValidUuid = z.string().uuid().safeParse(listId).success
  const list = isValidUuid ? collectionStore.getList(listId) : undefined

  if (!isValidUuid || !list) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <EmptyState
          title="List not found"
          message="This list does not exist or may have been deleted."
        />
        <div className="mt-4">
          <Link to={ROUTES.LISTS} className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Back to My Lists
          </Link>
        </div>
      </div>
    )
  }

  function handleDelete() {
    const confirmed = window.confirm(`Delete "${list!.name}"? This cannot be undone.`)
    if (!confirmed) return
    collectionStore.deleteList(list!.id)
    navigate(ROUTES.LISTS)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to={ROUTES.LISTS}
            className="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400"
          >
            ← Back to My Lists
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{list.name}</h1>
          {list.description ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{list.description}</p>
          ) : null}
          <p className="mt-2 text-xs text-gray-500">
            {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRenameOpen(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 dark:border-red-800 dark:text-red-300"
          >
            Delete List
          </button>
        </div>
      </div>

      {list.items.length === 0 ? (
        <EmptyState
          title="This list is empty"
          message="Use Add to List on movie or TV show pages to add items here."
        />
      ) : (
        <div className="space-y-4">
          {list.items.map((item) => (
            <ListMediaCard
              key={`${item.mediaType}-${item.mediaId}`}
              listId={list.id}
              item={item}
            />
          ))}
        </div>
      )}

      <CreateListModal
        isOpen={renameOpen}
        onClose={() => setRenameOpen(false)}
        mode="rename"
        listId={list.id}
        initialName={list.name}
        initialDescription={list.description ?? ''}
      />
    </div>
  )
})