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

type Status = 'want_to_read' | 'currently_reading' | 'read'

interface Props {
  entryId: Id<'book_entries'>
  title: string
  author: string
  status: Status
}


export function BookEntryCard({ entryId, title, author, status }: Props) {
  const removeBook = useMutation(api.bookEntries.removeBook)
  const updateStatus = useMutation(api.bookEntries.updateStatus)

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{author}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Select
          value={status}
          onValueChange={(val) =>
            updateStatus({ entryId, status: val as Status })
          }
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
  )
}
