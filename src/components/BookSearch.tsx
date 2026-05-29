import { useState } from 'react'
import { useAction, useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { InfoIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { BookSearchResult, type SearchResult } from './BookSearchResult'

const SEARCH_OPERATORS = [
  { op: 'isbn:', example: 'isbn:9780743273565', desc: 'Search by ISBN-10 or ISBN-13' },
  { op: 'intitle:', example: 'intitle:gatsby', desc: 'Match words in the title' },
  { op: 'inauthor:', example: 'inauthor:fitzgerald', desc: 'Match words in the author name' },
  { op: 'inpublisher:', example: 'inpublisher:scribner', desc: 'Match by publisher' },
  { op: 'subject:', example: 'subject:fiction', desc: 'Filter by subject or genre' },
]

const LANGUAGE_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Brazilian', value: 'pt' },
  { label: 'Spanish', value: 'es' },
  { label: 'German', value: 'de' },
  { label: 'French', value: 'fr' },
]

export function BookSearch() {
  const [query, setQuery] = useState('')
  const [lang, setLang] = useState('default')
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
      const found = await searchBooks({ query, ...(lang !== 'default' ? { langRestrict: lang } : {}) })
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
        <div className="relative flex flex-1 items-center">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (!e.target.value) {
                setResults(null)
                setSearchError(null)
              }
            }}
            placeholder="Title, author, isbn:…"
            className="flex-1 pr-8"
          />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search tips"
              >
                <InfoIcon className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <p className="mb-2 text-sm font-medium">Search operators</p>
              <ul className="flex flex-col gap-2">
                {SEARCH_OPERATORS.map(({ op, example, desc }) => (
                  <li key={op} className="flex flex-col gap-0.5">
                    <code className="text-xs font-semibold text-foreground">{example}</code>
                    <span className="text-xs text-muted-foreground">{desc}</span>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
