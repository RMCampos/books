import { action } from './_generated/server'
import { v } from 'convex/values'

export const searchBooks = action({
  args: { query: v.string(), langRestrict: v.optional(v.string()) },
  handler: async (_ctx, { query, langRestrict }) => {
    if (!query.trim()) return []

    const key = process.env.GOOGLE_BOOKS_API_KEY
    if (!key) throw new Error('GOOGLE_BOOKS_API_KEY env var is not set in Convex')
    const params = new URLSearchParams({
      q: query,
      maxResults: '10',
      printType: 'books',
      key,
    })
    if (langRestrict) params.set('langRestrict', langRestrict)
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
    )
    const text = await res.text()
    if (!res.ok) {
      throw new Error(`Google Books API error ${res.status}: ${text}`)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = JSON.parse(text) as { items?: any[] }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.items ?? []).map((item: any) => ({
      googleBooksId: item.id as string,
      title: (item.volumeInfo.title ?? 'Unknown title') as string,
      author: ((item.volumeInfo.authors ?? ['Unknown author']) as string[]).join(', '),
      description: (item.volumeInfo.description ?? null) as string | null,
      coverUrl: item.volumeInfo.imageLinks?.thumbnail
        ? (item.volumeInfo.imageLinks.thumbnail as string).replace('http://', 'https://')
        : null,
      isbn:
        (
          (item.volumeInfo.industryIdentifiers as Array<{
            type: string
            identifier: string
          }> | undefined)?.find((id) => id.type === 'ISBN_13')?.identifier ?? null
        ),
    }))
  },
})
