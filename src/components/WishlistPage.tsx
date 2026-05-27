import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { AddBookForm } from './AddBookForm'
import { BookEntryCard } from './BookEntryCard'

export function WishlistPage() {
  const entries = useQuery(api.bookEntries.getMyWishlist)

  return (
    <div className="mt-8 flex flex-col gap-4">
      <AddBookForm />
      {entries === undefined ? (
        <p className="text-center text-muted-foreground">Loading…</p>
      ) : entries.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          Your wishlist is empty — add a book above.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <BookEntryCard
              key={entry._id}
              entryId={entry._id}
              title={entry.book?.title ?? '(unknown)'}
              author={entry.book?.author ?? '(unknown)'}
              status={entry.status}
            />
          ))}
        </div>
      )}
    </div>
  )
}
