import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, ROUTES } from '@/Common'
import { collectionStore } from '@/Collection'
import { CreateListModal } from '../components/CreateListModal'

export const ListsPage = observer(function ListsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Lists</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Organize movies and TV shows into custom collections.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
        >
          Create List
        </button>
      </div>

      {collectionStore.lists.length === 0 ? (
        <EmptyState
          title="No lists yet"
          message="Create your first list to organize movies and TV shows."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {collectionStore.lists.map((list) => (
            <Link
              key={list.id}
              to={ROUTES.LIST_DETAIL.replace(':listId', list.id)}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-purple-500 dark:border-gray-800 dark:bg-gray-900/60"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{list.name}</h2>
              {list.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {list.description}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-gray-500">
                {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
              </p>
            </Link>
          ))}
        </div>
      )}

      <CreateListModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
})