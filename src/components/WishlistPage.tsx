import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { AddBookForm } from './AddBookForm'
import { BookEntryCard } from './BookEntryCard'
import { BookSearch } from './BookSearch'
import { ShelfSidebar } from './ShelfSidebar'

export function WishlistPage() {
  const [selectedShelfId, setSelectedShelfId] = useState<Id<'shelves'> | null>(null)

  const entries = useQuery(api.bookEntries.getMyWishlist)
  const shelves = useQuery(api.shelves.getMyShelves) ?? []

  // Client-side filtering — fine at this scale; prefer server-side query args at high volume
  const visibleEntries = entries === undefined
    ? undefined
    : selectedShelfId === null
      ? entries
      : entries.filter((e) => e.shelfId === selectedShelfId)

  return (
    <div className="mt-8 flex flex-col gap-4">
      <BookSearch />
      <AddBookForm />
      <ShelfSidebar
        selectedShelfId={selectedShelfId}
        onSelectShelf={setSelectedShelfId}
      />
      {visibleEntries === undefined ? (
        <p className="text-center text-muted-foreground">Loading…</p>
      ) : visibleEntries.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          {selectedShelfId ? 'No books on this shelf.' : 'Your wishlist is empty — add a book above.'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleEntries.map((entry) => (
            <BookEntryCard
              key={entry._id}
              entryId={entry._id}
              title={entry.book?.title ?? '(unknown)'}
              author={entry.book?.author ?? '(unknown)'}
              status={entry.status}
              shelfId={entry.shelfId}
              shelves={shelves}
              rating={entry.rating}
              review={entry.review}
            />
          ))}
        </div>
      )}
    </div>
  )
}
