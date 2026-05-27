import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface Props {
  entryId: Id<'book_entries'>
  hasCover: boolean
  onRemove: () => void
}

export function CoverUploadButton({ entryId, hasCover, onRemove }: Props) {
  const [uploading, setUploading] = useState(false)
  const generateUploadUrl = useMutation(api.bookEntries.generateUploadUrl)
  const setCoverImage = useMutation(api.bookEntries.setCoverImage)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      const { storageId } = (await res.json()) as { storageId: Id<'_storage'> }
      await setCoverImage({ entryId, storageId })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 text-xs">
      <label
        className={`cursor-pointer text-muted-foreground hover:text-foreground ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        {uploading ? 'Uploading…' : hasCover ? 'Change' : 'Upload cover'}
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      {hasCover && !uploading && (
        <button
          onClick={onRemove}
          className="cursor-pointer text-muted-foreground hover:text-destructive"
        >
          Remove
        </button>
      )}
    </div>
  )
}
