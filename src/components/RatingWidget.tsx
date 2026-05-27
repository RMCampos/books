import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface Props {
  entryId: Id<'book_entries'>
  rating: number | undefined
}

export function RatingWidget({ entryId, rating }: Props) {
  const setRating = useMutation(api.bookEntries.setRating)

  function handleClick(star: number) {
    // Clicking the current rating clears it
    setRating({ entryId, rating: star === rating ? undefined : star })
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          className={`cursor-pointer text-lg leading-none transition-transform hover:scale-110 ${
            star <= (rating ?? 0) ? 'text-amber-400' : 'text-muted-foreground/30'
          }`}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
