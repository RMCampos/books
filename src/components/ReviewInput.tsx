import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface Props {
  entryId: Id<'book_entries'>
  review: string | undefined
}

export function ReviewInput({ entryId, review }: Props) {
  const [draft, setDraft] = useState(review ?? '')
  const [editing, setEditing] = useState(false)
  const setReview = useMutation(api.bookEntries.setReview)

  function handleBlur() {
    const trimmed = draft.trim()
    if (trimmed !== (review ?? '')) {
      setReview({ entryId, review: trimmed || undefined })
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        placeholder="Write a review…"
        rows={3}
        className="w-full resize-none rounded border bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      />
    )
  }

  return (
    <button
      onClick={() => { setDraft(review ?? ''); setEditing(true) }}
      className="cursor-pointer text-left text-sm text-muted-foreground hover:text-foreground"
    >
      {review ? review : 'Add a review…'}
    </button>
  )
}
