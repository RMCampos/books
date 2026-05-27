import { useState } from 'react'
import { useAction, useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { BookSearchResult, type SearchResult } from './BookSearchResult'

export function BookSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  const searchBooks = useAction(api.books.searchBooks)
  const addBook = useMutation(api.bookEntries.addBook)
  const wishlist = useQuery(api.bookEntries.getMyWishlist)

  const wishlistGoogleIds = new Set(
    (wishlist ?? []).map((e) => e.book?.googleBooksId).filter(Boolean),
  )

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setIsSearching(true)
    setSearchError(null)
    try {
      const found = await searchBooks({ query })
      setResults(found as SearchResult[])
    } catch (err) {
      console.error('searchBooks failed:', err)
      setSearchError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSearching(false)
    }
  }

  async function handleAdd(result: SearchResult) {
    setAddingId(result.googleBooksId)
    try {
      await addBook({
        title: result.title,
        author: result.author,
        googleBooksId: result.googleBooksId,
        coverUrl: result.coverUrl ?? undefined,
        isbn: result.isbn ?? undefined,
        description: result.description ?? undefined,
      })
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 font-semibold">Search for a book</h2>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!e.target.value) {
              setResults(null)
              setSearchError(null)
            }
          }}
          placeholder="Title or author…"
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching || !query.trim()}>
          {isSearching ? 'Searching…' : 'Search'}
        </Button>
      </form>

      {searchError && (
        <p className="mt-3 text-sm text-destructive">{searchError}</p>
      )}

      {results !== null && (
        <div className="mt-4 flex flex-col gap-2">
          {results.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No results found.</p>
          ) : (
            results.map((result) => (
              <BookSearchResult
                key={result.googleBooksId}
                result={result}
                alreadyInWishlist={wishlistGoogleIds.has(result.googleBooksId)}
                onAdd={handleAdd}
                isAdding={addingId === result.googleBooksId}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
