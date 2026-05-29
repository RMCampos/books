const GOOGLE_BOOKS_HOST = 'books.google.com'

export function isGoogleBooksCoverUrl(url: string): boolean {
  try {
    return new URL(url).hostname === GOOGLE_BOOKS_HOST
  } catch {
    return false
  }
}

export function toHighResCoverUrl(url: string, width = 800): string {
  if (!isGoogleBooksCoverUrl(url)) return url
  const u = new URL(url)
  u.searchParams.delete('zoom')
  u.searchParams.delete('edge')
  u.searchParams.set('fife', `w${width}`)
  return u.toString()
}
