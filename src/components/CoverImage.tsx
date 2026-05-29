import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { CoverViewer } from './CoverViewer'

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

  return <CoverViewer src={src} alt={alt} />
}
