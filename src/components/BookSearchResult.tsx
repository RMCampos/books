import { Button } from './ui/button'
import { CoverViewer } from './CoverViewer'

export type SearchResult = {
  googleBooksId: string
  title: string
  author: string
  description: string | null
  coverUrl: string | null
  isbn: string | null
}

interface Props {
  result: SearchResult
  alreadyInWishlist: boolean
  onAdd: (result: SearchResult) => void
  isAdding: boolean
}

export function BookSearchResult({ result, alreadyInWishlist, onAdd, isAdding }: Props) {
  return (
    <div className="flex gap-3 rounded-lg border p-3">
      <CoverViewer
        src={result.coverUrl}
        alt={result.title}
        className="h-20 w-14 rounded object-cover"
        placeholderClassName="h-20 w-14 shrink-0 rounded bg-muted"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
        <div>
          <p className="font-medium leading-tight">{result.title}</p>
          <p className="text-sm text-muted-foreground">{result.author}</p>
          {result.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {result.description}
            </p>
          )}
        </div>
        <div>
          <Button
            size="sm"
            variant={alreadyInWishlist ? 'outline' : 'default'}
            disabled={alreadyInWishlist || isAdding}
            onClick={() => onAdd(result)}
          >
            {alreadyInWishlist ? 'Already in wishlist' : isAdding ? 'Adding…' : 'Add to wishlist'}
          </Button>
        </div>
      </div>
    </div>
  )
}
