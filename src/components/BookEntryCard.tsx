import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { RatingWidget } from './RatingWidget'
import { ReviewInput } from './ReviewInput'
import { CoverImage } from './CoverImage'
import { CoverUploadButton } from './CoverUploadButton'

type Status = 'want_to_read' | 'currently_reading' | 'read'

interface Shelf {
  _id: Id<'shelves'>
  name: string
}

interface Props {
  entryId: Id<'book_entries'>
  title: string
  author: string
  status: Status
  shelfId: Id<'shelves'> | undefined
  shelves: Shelf[]
  rating: number | undefined
  review: string | undefined
  coverStorageId: Id<'_storage'> | undefined
  apiCoverUrl: string | undefined
}

export function BookEntryCard({ entryId, title, author, status, shelfId, shelves, rating, review, coverStorageId, apiCoverUrl }: Props) {
  const removeBook = useMutation(api.bookEntries.removeBook)
  const updateStatus = useMutation(api.bookEntries.updateStatus)
  const assignToShelf = useMutation(api.bookEntries.assignToShelf)
  const removeCoverImage = useMutation(api.bookEntries.removeCoverImage)

  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <div className="flex flex-col items-center gap-1">
        <CoverImage coverStorageId={coverStorageId} apiCoverUrl={apiCoverUrl} alt={title} />
        <CoverUploadButton
          entryId={entryId}
          hasCover={coverStorageId !== undefined}
          onRemove={() => removeCoverImage({ entryId })}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{title}</p>
            <p className="truncate text-sm text-muted-foreground">{author}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Select
              value={shelfId ?? 'none'}
              onValueChange={(val) =>
                assignToShelf({
                  entryId,
                  shelfId: val === 'none' ? undefined : (val as Id<'shelves'>),
                })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="No shelf" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No shelf</SelectItem>
                {shelves.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(val) => updateStatus({ entryId, status: val as Status })}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="want_to_read">Want to read</SelectItem>
                <SelectItem value="currently_reading">Currently reading</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeBook({ entryId })}
              aria-label="Remove book"
            >
              ✕
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RatingWidget entryId={entryId} rating={rating} />
          <ReviewInput entryId={entryId} review={review} />
        </div>
      </div>
    </div>
  )
}
