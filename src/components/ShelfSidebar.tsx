import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface Props {
  selectedShelfId: Id<'shelves'> | null
  onSelectShelf: (id: Id<'shelves'> | null) => void
}

export function ShelfSidebar({ selectedShelfId, onSelectShelf }: Props) {
  const shelves = useQuery(api.shelves.getMyShelves) ?? []
  const createShelf = useMutation(api.shelves.createShelf)
  const renameShelf = useMutation(api.shelves.renameShelf)
  const deleteShelf = useMutation(api.shelves.deleteShelf)

  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<Id<'shelves'> | null>(null)
  const [editName, setEditName] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    await createShelf({ name: newName })
    setNewName('')
  }

  function startEdit(id: Id<'shelves'>, name: string) {
    setEditingId(id)
    setEditName(name)
  }

  async function commitRename(id: Id<'shelves'>) {
    if (editName.trim()) await renameShelf({ shelfId: id, name: editName })
    setEditingId(null)
  }

  async function handleDelete(id: Id<'shelves'>) {
    if (selectedShelfId === id) onSelectShelf(null)
    await deleteShelf({ shelfId: id })
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-3 font-semibold">Shelves</h2>

      <div className="mb-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedShelfId === null ? 'default' : 'outline'}
          onClick={() => onSelectShelf(null)}
        >
          All
        </Button>
        {shelves.map((shelf) => (
          <div key={shelf._id} className="flex items-center gap-1">
            {editingId === shelf._id ? (
              <Input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => commitRename(shelf._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename(shelf._id)
                  if (e.key === 'Escape') setEditingId(null)
                }}
                className="h-7 w-28 text-sm"
              />
            ) : (
              <>
                <Button
                  size="sm"
                  variant={selectedShelfId === shelf._id ? 'default' : 'outline'}
                  onClick={() =>
                    onSelectShelf(selectedShelfId === shelf._id ? null : shelf._id)
                  }
                >
                  {shelf.name}
                </Button>
                <button
                  onClick={() => startEdit(shelf._id, shelf.name)}
                  className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                  aria-label="Rename shelf"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(shelf._id)}
                  className="cursor-pointer text-xs text-muted-foreground hover:text-destructive"
                  aria-label="Delete shelf"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New shelf name…"
          className="h-7 text-sm"
        />
        <Button size="sm" type="submit" disabled={!newName.trim()}>
          Add
        </Button>
      </form>
    </div>
  )
}
