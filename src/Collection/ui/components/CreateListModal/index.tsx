import { useState } from 'react'
import { collectionStore } from '@/Collection'
import {
  LIST_DESCRIPTION_MAX_LENGTH,
  LIST_NAME_MAX_LENGTH,
} from '@/Collection/core/constants/collection.constants'
import { CreateListInputSchema } from '@/Collection/core/types/collection.schemas'

interface CreateListModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'create' | 'rename'
  listId?: string
  initialName?: string
  initialDescription?: string
  onSuccess?: (listId: string) => void
}

type CreateListModalFormProps = Omit<CreateListModalProps, 'isOpen'>

function CreateListModalForm({
  onClose,
  mode = 'create',
  listId,
  initialName = '',
  initialDescription = '',
  onSuccess,
}: CreateListModalFormProps) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    const parsed = CreateListInputSchema.safeParse({
      name,
      description: description.trim() ? description.trim() : undefined,
    })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid list details')
      return
    }

    if (mode === 'rename') {
      if (!listId) {
        setError('List not found')
        return
      }
      collectionStore.renameList(listId, parsed.data)
      onSuccess?.(listId)
      onClose()
      return
    }

    const createdId = collectionStore.createList(parsed.data)
    if (!createdId) {
      setError('Unable to create list')
      return
    }

    onSuccess?.(createdId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="list-modal-title"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 id="list-modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
          {mode === 'rename' ? 'Rename List' : 'Create List'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label htmlFor="list-name" className="block space-y-1 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Name</span>
            <input
              id="list-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={LIST_NAME_MAX_LENGTH}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-purple-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
            <span className="text-xs text-gray-500">
              {name.length}/{LIST_NAME_MAX_LENGTH}
            </span>
          </label>

          <label htmlFor="list-description" className="block space-y-1 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Description (optional)
            </span>
            <textarea
              id="list-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={LIST_DESCRIPTION_MAX_LENGTH}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none ring-purple-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
            <span className="text-xs text-gray-500">
              {description.length}/{LIST_DESCRIPTION_MAX_LENGTH}
            </span>
          </label>

          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
            >
              {mode === 'rename' ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function CreateListModal({
  isOpen,
  mode = 'create',
  listId,
  ...formProps
}: CreateListModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <CreateListModalForm
      key={`${mode}-${listId ?? 'new'}`}
      mode={mode}
      listId={listId}
      {...formProps}
    />
  )
}