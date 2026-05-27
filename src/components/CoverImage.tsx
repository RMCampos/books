import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface Props {
  coverStorageId: Id<'_storage'> | undefined
  apiCoverUrl: string | undefined
  alt: string
}

export function CoverImage({ coverStorageId, apiCoverUrl, alt }: Props) {
  const storageUrl = useQuery(
    api.bookEntries.getCoverUrl,
    coverStorageId !== undefined ? { storageId: coverStorageId } : 'skip',
  )

  const src = coverStorageId !== undefined ? (storageUrl ?? undefined) : apiCoverUrl

  if (!src) {
    return (
      <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded bg-muted text-2xl text-muted-foreground/40">
        📚
      </div>
    )
  }

  return <img src={src} alt={alt} className="h-24 w-16 shrink-0 rounded object-cover" />
}
